// ─────────────────────────────────────────────
//  Al-Jin · core/context.js
//  Multi-session core: ONE Node process hosts every WhatsApp session.
//
//  Shared by all sessions (loaded once → low RAM): the code, libraries, download /
//  ffmpeg queues, API-provider cooldowns, the CPU/RAM governor.
//  Separate per session: login keys, settings, history, caches, timers.
//
//  How it works: whatever code runs for a session runs inside runInSession(session, fn).
//  AsyncLocalStorage carries that session through awaits and timers, so existing code that
//  calls inState() / CONFIG / getVar() automatically reads the right session's data.
// ─────────────────────────────────────────────
import { AsyncLocalStorage } from 'node:async_hooks';

const als = new AsyncLocalStorage();
const registry = new Map();        // id → session
let ambientSession = null;         // used only by code running outside any session (tests, global timers)

export function createSession(id, dataDir) {
  return {
    id,
    dataDir,
    bag: new Map(),                // per-session containers created by perSession()/sessionLocal()
    sock: null,
    destroyed: false,
    disposers: new Set(),          // cleanup callbacks run when the session is removed
    timers: new Set(),             // intervals started by this session (see installTimerTracking)
    startedAt: Date.now(),
  };
}

export function registerSession(session) { registry.set(session.id, session); return session; }
export function unregisterSession(id) { registry.delete(id); }
export function getSession(id) { return registry.get(id) || null; }
export function allSessions() { return [...registry.values()]; }

function ambient() {
  if (!ambientSession) {
    ambientSession = createSession(
      process.env.WRAITH_SESSION_ID || 'main',
      process.env.WRAITH_DATA_DIR || process.cwd(),
    );
  }
  return ambientSession;
}

/** The session the running code belongs to (never null). */
export function currentSession() { return als.getStore() || ambient(); }
/** The session only if we are really inside one (null for global timers / startup code). */
export function activeSession() { return als.getStore() || null; }
export function currentSessionId() { return currentSession().id; }

export function runInSession(session, fn) { return als.run(session, fn); }
/** Runs fn outside every session (the shared "main" data folder is used). */
export function runOutsideSession(fn) { return als.exit(fn); }
/** Same as runInSession but for event handlers: returns a function bound to the session. */
export function bindToSession(session, fn) {
  return (...args) => als.run(session, () => fn(...args));
}

/** Runs fn once for every live session (each inside its own context). Errors never escape. */
export async function forEachSession(fn) {
  for (const s of allSessions()) {
    if (s.destroyed) continue;
    try { await als.run(s, () => fn(s)); } catch (e) { try { console.error(`[session:${s.id}]`, e?.message); } catch {} }
  }
}

/** Register cleanup that runs when this session is stopped or deleted. */
export function onSessionDispose(fn, session = currentSession()) {
  session.disposers.add(fn);
  return () => session.disposers.delete(fn);
}

// ── per-session state containers ─────────────────────────────────────────────
function slot(key, factory) {
  const s = currentSession();
  let v = s.bag.get(key);
  if (v === undefined) { v = factory(); s.bag.set(key, v); }
  return v;
}

/**
 * Drop-in replacement for a module-level Map / Set / plain object:
 *     const ledger = perSession(() => new Map());
 * Every session transparently gets its own instance; all existing code keeps working.
 */
export function perSession(factory) {
  const key = Symbol('perSession');
  const real = () => slot(key, factory);
  return new Proxy({}, {
    get(_t, prop) {
      const r = real();
      const v = Reflect.get(r, prop, r);
      return typeof v === 'function' ? v.bind(r) : v;
    },
    set(_t, prop, value) { const r = real(); return Reflect.set(r, prop, value, r); },
    has(_t, prop) { return prop in real(); },
    deleteProperty(_t, prop) { return Reflect.deleteProperty(real(), prop); },
    ownKeys() { return Reflect.ownKeys(real()); },
    getOwnPropertyDescriptor(_t, prop) {
      const d = Reflect.getOwnPropertyDescriptor(real(), prop);
      if (d) d.configurable = true;
      return d;
    },
    defineProperty(_t, prop, desc) { return Reflect.defineProperty(real(), prop, desc); },
  });
}

/**
 * For module state that gets re-assigned (let x = null …): keep it in one holder object.
 *     const S = sessionLocal(() => ({ cache: null, timer: null }));
 *     S().cache = …
 */
export function sessionLocal(factory) {
  const key = Symbol('sessionLocal');
  return () => slot(key, factory);
}

// ── flush-on-exit ────────────────────────────────────────────────────────────
// Modules keep debounced JSON caches. They register a flusher once; it is run for every
// session on shutdown / restart / session removal (replaces the old per-process SIGINT hooks).
const flushers = new Set();
export function registerFlusher(fn) { flushers.add(fn); return () => flushers.delete(fn); }

export async function flushSession(session) {
  for (const fn of flushers) {
    try { await als.run(session, () => fn()); } catch (e) { try { console.error(`[flush:${session.id}]`, e?.message); } catch {} }
  }
}
export async function flushAllSessions() {
  for (const s of allSessions()) await flushSession(s);
}

// ── timer tracking ───────────────────────────────────────────────────────────
// Every setInterval started while a session is active is remembered, so removing the session
// stops all of them (schedulers, tickers, pollers) without each module needing cleanup code.
let timersTracked = false;
export function installTimerTracking() {
  if (timersTracked) return;
  timersTracked = true;
  const realSet = globalThis.setInterval;
  const realClear = globalThis.clearInterval;
  globalThis.setInterval = function (fn, ms, ...rest) {
    const s = als.getStore();
    if (s?.destroyed) return realSet(() => {}, 2 ** 30).unref();   // dead session: never run
    const t = realSet(fn, ms, ...rest);
    if (s && t && typeof t === 'object') (s.timers ||= new Set()).add(t);
    return t;
  };
  globalThis.clearInterval = function (t) {
    try { als.getStore()?.timers?.delete(t); } catch {}
    return realClear(t);
  };
}

/** Stops everything that belongs to a session (timers registered through onSessionDispose, caches). */
export async function disposeSession(session) {
  session.destroyed = true;
  for (const t of session.timers || []) { try { clearInterval(t); } catch {} }
  session.timers = new Set();
  for (const fn of [...session.disposers]) {
    try { await fn(); } catch (e) { try { console.error(`[dispose:${session.id}]`, e?.message); } catch {} }
  }
  session.disposers.clear();
  session.bag.clear();
  session.sock = null;
}
