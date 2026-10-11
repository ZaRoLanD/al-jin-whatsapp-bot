// ---------------------------------------------
//  Al-Jin · modules/x-anim.js
//  Edit-in-place text animations (owner only).
//    .anim            list them      .anim stop   cancel the one running here
//    .anim <name>  or  .<name>
//  moon tmoon stupid fire hypno ding solarsystem fleaveme snake
//  quickheal (scan) macoc (boot) hand theart hart loading jio (signal)
//
//  Safe by design: one animation per chat, a hard cap on edits, and a
//  minimum gap between edits so WhatsApp never sees an edit flood.
// ---------------------------------------------
import { safe, reply, prefix } from '../lib/x.js';

const MAX_EDITS = 48;
const MIN_GAP_MS = 700;
const running = new Map();   // chat -> { stop }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const range = (n) => Array.from({ length: n }, (_, i) => i);
const grid = (h, w, cell) => range(h).map((y) => range(w).map((x) => cell(x, y)).join('')).join('\n');
const bar = (pct, len = 12) => `${'▓'.repeat(Math.round((pct / 100) * len))}${'░'.repeat(len - Math.round((pct / 100) * len))}`;

const PHASES = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
const HANDS = ['👉', '☝️', '👆', '🖕', '👇', '✌️', '🤞', '🖖', '🤘', '🤙', '🖐️', '👌'];
const HEARTS = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💘', '💝'];
const RING5 = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4], [0, 3], [0, 2], [0, 1]];
const SNAKE5 = range(5).flatMap((y) => (y % 2 ? range(5).reverse() : range(5)).map((x) => [x, y]));
const ARROWS = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
const ARROW_AT = [[1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0]];

// name -> { intro, gap (ms), frames: () => string[] }
const ANIMS = {
    moon: { intro: 'Moon…🌕', gap: 700, frames: () => range(24).map((i) => grid(5, 5, (_x, y) => PHASES[(i + (y % 2) * 4) % 8])) },
    tmoon: { intro: 'Moon cycle…🌕', gap: 800, frames: () => range(24).map((i) => PHASES[i % 8]) },
    stupid: {
        intro: 'Detecting brain… 🧠', gap: 700,
        frames: () => [...range(11).map((k) => `YOUR BRAIN ➡️ 🧠\n\n🧠${' '.repeat(10 - k)}<(^_^ <)${' '.repeat(k)}🗑`), 'Brain deleted ✅ 🗑'],
    },
    fire: {
        intro: 'Locking target… 🎯', gap: 700,
        frames: () => [...range(9).map((k) => `(•_•)︻デ═一${'-'.repeat(k)}>${' '.repeat(8 - k)}🎯`), '(•_•)︻デ═一 💥 Target destroyed'],
    },
    hypno: {
        intro: 'Look closely… 🌀', gap: 700,
        frames: () => range(14).map((s) => grid(7, 7, (x, y) => ((Math.max(Math.abs(x - 3), Math.abs(y - 3)) + s) % 2 ? '⬜' : '⬛'))),
    },
    ding: {
        intro: 'Ding…', gap: 700,
        frames: () => {
            const path = [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4], [1, 3], [2, 2], [1, 1]];
            return range(24).map((i) => { const [y, x] = path[i % path.length]; return grid(3, 5, (cx, cy) => (cx === x && cy === y ? '🔴' : '⬜')); });
        },
    },
    solarsystem: {
        intro: 'Solar system…🪐', gap: 800,
        frames: () => range(32).map((i) => {
            const sun = RING5[i % 16], moon = RING5[(i + 8) % 16];
            return grid(5, 5, (x, y) => (x === sun[0] && y === sun[1] ? '☀️' : x === moon[0] && y === moon[1] ? '🌕' : x === 2 && y === 2 ? '🌎' : '◼️'));
        }),
    },
    fleaveme: {
        intro: 'Leave me alone…', gap: 700,
        frames: () => {
            const shown = (n) => grid(3, 3, (x, y) => { const k = ARROW_AT.findIndex(([ax, ay]) => ax === x && ay === y); return k >= 0 ? (k < n ? ARROWS[k] : '⬛') : '🔄'; });
            return [...range(9).map(shown), ...range(8).map((i) => shown(7 - i))];
        },
    },
    snake: {
        intro: 'Snake…🐍', gap: 700,
        frames: () => range(29).map((i) => grid(5, 5, (x, y) => { const k = SNAKE5.findIndex(([sx, sy]) => sx === x && sy === y); return k <= i && k > i - 5 ? '◻️' : '◼️'; })),
    },
    quickheal: {
        intro: 'Starting security scan…', gap: 1100,
        frames: () => [...range(11).map((i) => `\`Security checkup\n\nLicense: Premium\nValid until: 31/12/2099\n\nScanning files… ${i * 10}%\n${bar(i * 10, 24)}\``), '`✅ Scan complete\n\nNo threats found.\nYour device is protected.`'],
    },
    macoc: {
        intro: 'Processing…', gap: 900,
        frames: () => ['`Connecting to the server…`', '`Starting login…`', ...range(11).map((i) => `\`Loading Al-Jin… ${i * 10}%\n${bar(i * 10, 24)}\``), '`✅ Al-Jin is alive and ready.`'],
    },
    hand: { intro: '👈', gap: 800, frames: () => range(36).map((i) => HANDS[i % HANDS.length]) },
    theart: { intro: '💓', gap: 700, frames: () => range(27).map((i) => HEARTS[i % HEARTS.length]) },
    hart: { intro: '❤️🖤', gap: 900, frames: () => [...range(23).map((i) => (i % 2 ? '❤️' : '🖤')), '❤️'] },
    loading: {
        intro: '`Loading…`', gap: 700,
        frames: () => [...range(11).map((i) => `\`Loading ${'▰'.repeat(i)}${'▱'.repeat(10 - i)} ${i * 10}%\``), '`✅ Done`'],
    },
    jio: {
        intro: '`Connecting to the network…`', gap: 900,
        frames: () => [...range(8).map((i) => `\`${['▁', '▂', '▃', '▄', '▅', '▆', '▇'].map((b, k) => (k < i ? b : '░')).join(' ')}\``), '`✅ Connected — full signal`'],
    },
};

async function play(sock, chat, msg, name) {
    const def = ANIMS[name];
    if (running.has(chat)) return reply(sock, chat, msg, `⏳ An animation is already running here. Use \`${prefix()}anim stop\`.`);
    const state = { stop: false };
    running.set(chat, state);
    try {
        const sent = await sock.sendMessage(chat, { text: def.intro }, { quoted: msg });
        let edits = 0;
        for (const frame of def.frames()) {
            if (state.stop || edits >= MAX_EDITS) break;
            await sleep(Math.max(def.gap, MIN_GAP_MS));
            try { await sock.sendMessage(chat, { text: frame, edit: sent.key }); }
            catch (e) { console.error('[x:anim] edit stopped:', e?.message); break; }
            edits++;
        }
    } finally {
        running.delete(chat);
    }
}

const cmd = (name) => safe(name, (sock, chat, msg) => play(sock, chat, msg, name));

export const anim = safe('anim', async (sock, chat, msg, args) => {
    const pick = (args[0] || '').toLowerCase();
    const alias = { scan: 'quickheal', boot: 'macoc', signal: 'jio' };
    if (pick === 'stop') {
        const s = running.get(chat);
        if (s) s.stop = true;
        return reply(sock, chat, msg, s ? '🛑 Stopping the animation…' : 'Nothing is animating here.');
    }
    const name = alias[pick] || pick;
    if (ANIMS[name]) return play(sock, chat, msg, name);
    return reply(sock, chat, msg, `🎞 *Animations*\n${Object.keys(ANIMS).map((n) => `• ${prefix()}${n}`).join('\n')}\n\nUse \`${prefix()}anim <name>\` · \`${prefix()}anim stop\``);
});

export const moon = cmd('moon');
export const tmoon = cmd('tmoon');
export const stupid = cmd('stupid');
export const fire = cmd('fire');
export const hypno = cmd('hypno');
export const ding = cmd('ding');
export const solarsystem = cmd('solarsystem');
export const fleaveme = cmd('fleaveme');
export const snake = cmd('snake');
export const quickheal = cmd('quickheal');
export const macoc = cmd('macoc');
export const hand = cmd('hand');
export const theart = cmd('theart');
export const hart = cmd('hart');
export const loading = cmd('loading');
export const jio = cmd('jio');

export const ANIMATION_NAMES = Object.keys(ANIMS);
