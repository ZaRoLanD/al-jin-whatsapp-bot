// config.js — Al-Jin per-session config
// CONFIG looks like one plain object, but every session gets its own copy
// (owner number, overrides from state/config.json). See core/context.js.
import fs from 'fs';
import { statePath, inState } from './core/paths.js';
import { currentSession } from './core/context.js';

const BASE = {
  owner: "",
  codename: "𝐀𝐥-𝐉𝐢𝐧",
  botName: "𝐀𝐥-𝐉𝐢𝐧",
  version: "2.3.0",
  timezone: "Asia/Karachi",
  memoryTTL: 24 * 60 * 60 * 1000,
  vaultDir: "vault",
  vaultMaxMB: 200,
  reconnectDelay: 3000,
  repoUrl: "https://github.com/themalik-g/al-jin-whatsapp-bot",
  stalk: { maxEventsPerJid: 500 },
  weather: { stormThreshold: 50 },
  media: { maxImages: 10, maxCouplePairs: 5, maxDownloadMB: 100 },
};

const CFG_KEY = Symbol('config');

function readJson(p, fallback) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {}
  return fallback;
}

function loadSessionConfig() {
  const ownerJson = readJson(inState('owner.json'), null);
  const overrides = readJson(inState('config.json'), {}) || {};
  const owner = (ownerJson?.owner || overrides.owner || "").replace(/\D/g, "");
  return { ...BASE, ...overrides, owner };
}

function live() {
  const s = currentSession();
  let c = s.bag.get(CFG_KEY);
  if (!c) { c = loadSessionConfig(); s.bag.set(CFG_KEY, c); }
  return c;
}

export const CONFIG = new Proxy({}, {
  get: (_t, p) => live()[p],
  set: (_t, p, v) => { live()[p] = v; return true; },
  has: (_t, p) => p in live(),
  deleteProperty: (_t, p) => delete live()[p],
  ownKeys: () => Reflect.ownKeys(live()),
  getOwnPropertyDescriptor: (_t, p) => {
    const d = Reflect.getOwnPropertyDescriptor(live(), p);
    if (d) d.configurable = true;
    return d;
  },
});

export function saveSessionConfig(patch = {}) {
  statePath(); // ensure state dir exists
  const target = inState('config.json');
  const current = readJson(target, {}) || {};
  const merged = { ...current, ...patch };
  fs.writeFileSync(target, JSON.stringify(merged, null, 2));
  Object.assign(CONFIG, patch);
  return CONFIG;
}
