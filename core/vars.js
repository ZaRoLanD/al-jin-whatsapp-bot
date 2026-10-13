// ─────────────────────────────────────────────
// Al-Jin · core/vars.js
// Persistent per-session variable store (cached).
// ─────────────────────────────────────────────
import fs from 'node:fs';
import { inState, statePath } from './paths.js';
import { sessionLocal } from './context.js';

const VARS_FILE = () => inState('vars.json');

// One variable store per session. Values are NOT copied into process.env any more: in a shared
// process that would let one session's API key leak into another session.
const S = sessionLocal(() => ({ cache: null }));

export function loadVars() {
    const st = S();
    if (st.cache) return st.cache;
    try {
        const file = VARS_FILE();
        st.cache = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf-8')) || {}) : {};
    } catch (e) {
        try { console.error('[vars] loadVars error:', e.message); } catch {}
        st.cache = {};
    }
    return st.cache;
}

function saveVars(data) {
    try {
        const file = VARS_FILE();
        statePath();
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        S().cache = data;
    } catch (e) {
        try { console.error('[vars] saveVars error:', e.message); } catch {}
    }
}

export function getVar(key) {
    if (!key) return null;
    const store = loadVars();
    if (Object.prototype.hasOwnProperty.call(store, key)) return store[key];
    return process.env[key] || null;
}

export function setVar(key, value) {
    if (!key) return false;
    const store = loadVars();
    store[key] = value;
    saveVars(store);
    return true;
}

export function delVar(key) {
    if (!key) return false;
    const store = loadVars();
    if (Object.prototype.hasOwnProperty.call(store, key)) {
        delete store[key];
        saveVars(store);
        return true;
    }
    return false;
}

export function getAllVars() {
    return loadVars();
}
