// core/paths.js — single source of truth for per-session data locations.
// Resolves against the session the code is running for (see core/context.js).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { currentSession } from './context.js';

// A removed session must never recreate its folder (late timers, in-flight downloads…).
// Anything that still tries to write for it lands in this throw-away folder instead.
const VOID = path.join(os.tmpdir(), 'aljin-void');

export function dataDir() {
  const s = currentSession();
  if (s.destroyed) {
    fs.mkdirSync(VOID, { recursive: true });
    return VOID;
  }
  const d = path.resolve(s.dataDir || process.env.WRAITH_DATA_DIR || process.cwd());
  fs.mkdirSync(d, { recursive: true });
  return d;
}

function sub(name) {
  const p = path.join(dataDir(), name);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

export const sessionPath   = () => sub('session');
export const statePath     = () => sub('state');
export const vaultPathRoot = () => sub('vault');
export const storePath     = () => sub('data');
export const logsPath      = () => sub('logs');

export const inState = (...n) => path.join(statePath(), ...n);
export const inStore = (...n) => path.join(storePath(), ...n);
export const inData  = (...n) => path.join(storePath(), ...n);

/** Folder that holds ALL sessions (instances/). Shared code lives outside it. */
export const instancesRoot = () =>
  path.join(process.env.WRAITH_REPO_ROOT || process.cwd(), 'instances');
