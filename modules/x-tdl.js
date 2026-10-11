// ---------------------------------------------
//  Al-Jin · modules/x-tdl.js
//  .tdl — pull files from Telegram into WhatsApp (owner only, your own account).
//
//    .tdl <t.me message link> [more links]   download and send the files
//    .tdl <words>                            search your exported chats by file name
//    .tdl dd 1,3,5                           download results from the last search
//    .tdl export                             index the chats in TDL_CHATS (comma separated ids)
//    .tdl login [qr|desktop]                 sign in to Telegram (follow the bot's terminal)
//    .tdl update                             download / refresh the `tdl` program
//
//  Uses the open-source `tdl` program (github.com/iyear/tdl). Nothing is
//  installed with npm: Al-Jin finds `tdl` on PATH, in TDL_PATH, or downloads
//  the single binary into its data folder. Search is built in (no extra library).
// ---------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { safe, reply, usage, prefix, bytesToSize } from '../lib/x.js';
import { downloadToFile } from '../lib/net.js';
import { inData } from '../core/paths.js';
import { getKey } from '../core/keys.js';
import { getMaxDownloadBytes } from '../core/limits.js';

const IS_WIN = process.platform === 'win32';
const HARD_CAP = 100 * 1024 * 1024;
const JOB_TIMEOUT = 15 * 60 * 1000;
const LOGIN_TIMEOUT = 5 * 60 * 1000;
const MAX_RESULTS = 30;
const dir = (...p) => { const d = inData('tdl', ...p); fs.mkdirSync(path.dirname(d), { recursive: true }); return d; };
const setting = (n) => process.env[n] || getKey(n) || '';

let busy = false;                 // one Telegram job at a time (keeps CPU / RAM low)
let lastResults = [];             // [{ chatId, id, file, size }]

// ── locating / installing the tdl program ─────────────────────────────
const binPath = () => dir('bin', IS_WIN ? 'tdl.exe' : 'tdl');

function run(cmd, args, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
        execFile(cmd, args, { timeout: timeoutMs, maxBuffer: 2 * 1024 * 1024 }, (err, out, errOut) => (err ? reject(new Error(String(errOut || err.message).trim())) : resolve(String(out))));
    });
}

async function findTdl() {
    for (const c of [setting('TDL_PATH'), binPath(), 'tdl'].filter(Boolean)) {
        try { await run(c, ['version'], 8000); return c; } catch { /* try next */ }
    }
    return null;
}

function assetName() {
    const os_ = process.platform === 'android' ? 'linux' : process.platform;
    const arch = process.arch;
    if (os_ === 'linux') return arch === 'x64' ? 'tdl_Linux_64bit.tar.gz' : arch === 'arm64' ? 'tdl_Linux_arm64.tar.gz' : null;
    if (os_ === 'darwin') return arch === 'arm64' ? 'tdl_MacOS_arm64.tar.gz' : 'tdl_MacOS_64bit.tar.gz';
    if (os_ === 'win32') return arch === 'x64' ? 'tdl_Windows_64bit.zip' : null;
    return null;
}

async function installTdl() {
    const asset = assetName();
    if (!asset) throw new Error(`no tdl build for ${process.platform}/${process.arch} — install it yourself and set TDL_PATH`);
    const target = binPath();
    const archive = dir('bin', asset);
    await downloadToFile(`https://github.com/iyear/tdl/releases/latest/download/${asset}`, archive, 80 * 1024 * 1024);
    try {
        await run('tar', ['-xf', archive, '-C', path.dirname(target)], 120000);
        if (!fs.existsSync(target)) throw new Error('tdl was not found inside the download');
        if (!IS_WIN) fs.chmodSync(target, 0o755);
    } finally { fs.rmSync(archive, { force: true }); }
    return target;
}

async function needTdl() {
    const found = await findTdl();
    if (found) return found;
    return installTdl();          // first use: fetch the binary automatically
}

// ── running tdl ───────────────────────────────────────────────────────
function runTdl(bin, args, { timeoutMs = JOB_TIMEOUT, inherit = false } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(bin, args, { stdio: inherit ? ['ignore', 'inherit', 'inherit'] : ['ignore', 'pipe', 'pipe'] });
        let tail = '';
        const keep = (d) => { tail = (tail + d).slice(-600); };
        child.stdout?.on('data', keep);
        child.stderr?.on('data', keep);
        const timer = setTimeout(() => { child.kill(); reject(new Error('timed out')); }, timeoutMs);
        child.on('error', (e) => { clearTimeout(timer); reject(e); });
        child.on('close', (code) => {
            clearTimeout(timer);
            code === 0 ? resolve() : reject(new Error(tail.trim().split('\n').pop() || `tdl exited with code ${code}`));
        });
    });
}

// ── sending what was downloaded ───────────────────────────────────────
const KINDS = {
    video: ['mp4', 'mkv', 'mov', 'webm', 'm4v', 'avi'],
    image: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    audio: ['mp3', 'm4a', 'ogg', 'wav', 'flac', 'aac'],
};
const kindOf = (file) => { const e = path.extname(file).slice(1).toLowerCase(); return Object.keys(KINDS).find((k) => KINDS[k].includes(e)) || 'document'; };
const MIME = { pdf: 'application/pdf', zip: 'application/zip', apk: 'application/vnd.android.package-archive', epub: 'application/epub+zip', txt: 'text/plain' };

async function sendFolder(sock, chat, msg, folder) {
    const cap = Math.min(getMaxDownloadBytes(), HARD_CAP);
    const files = fs.readdirSync(folder).filter((f) => fs.statSync(path.join(folder, f)).isFile());
    if (!files.length) return reply(sock, chat, msg, '📭 Nothing was downloaded (no file in that message, or no access).');
    for (const f of files) {
        const full = path.join(folder, f);
        const size = fs.statSync(full).size;
        if (size > cap) { await reply(sock, chat, msg, `⚠️ Skipped *${f}* (${bytesToSize(size)} is over the ${bytesToSize(cap)} limit).`); continue; }
        const kind = kindOf(f);
        const ext = path.extname(f).slice(1).toLowerCase();
        const content = kind === 'document'
            ? { document: { url: full }, fileName: f, mimetype: MIME[ext] || 'application/octet-stream' }
            : { [kind]: { url: full }, ...(kind === 'audio' ? { mimetype: 'audio/mpeg' } : {}), caption: kind === 'audio' ? undefined : f };
        try { await sock.sendMessage(chat, content, { quoted: msg }); }
        catch (e) { await reply(sock, chat, msg, `❌ Could not send *${f}*: ${e?.message}`); }
    }
}

async function withJob(sock, chat, msg, fn) {
    if (busy) return reply(sock, chat, msg, '⏳ Another Telegram job is running. Try again in a moment.');
    busy = true;
    const folder = dir('jobs', `job_${Date.now()}`);
    fs.mkdirSync(folder, { recursive: true });
    try { await fn(folder); await sendFolder(sock, chat, msg, folder); }
    finally { busy = false; fs.rmSync(folder, { recursive: true, force: true }); }
}

const DL_ARGS = ['dl', '--skip-same', '--template', '{{ filenamify .FileName }}'];

// ── search over exported chats (no extra library) ─────────────────────
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const exportFile = (id) => dir('exports', `export_${id}.json`);
const chatIds = () => setting('TDL_CHATS').split(',').map((s) => s.trim()).filter(Boolean);

function searchExports(query) {
    const terms = norm(query).split(' ').filter(Boolean);
    const hits = [];
    for (const id of chatIds()) {
        let data;
        try { data = JSON.parse(fs.readFileSync(exportFile(id), 'utf8')); } catch { continue; }
        for (const m of data?.messages || []) {
            const file = m.file_name || m.file;
            if (!file) continue;
            const hay = norm(file);
            if (terms.every((t) => hay.includes(t))) hits.push({ chatId: id, id: m.id, file, size: m.file_size });
            if (hits.length >= MAX_RESULTS) return hits;
        }
    }
    return hits;
}

// ── the command ───────────────────────────────────────────────────────
export const tdl = safe('tdl', async (sock, chat, msg, args) => {
    const p = prefix();
    const sub = (args[0] || '').toLowerCase();
    if (!args.length) {
        return usage(sock, chat, msg, [
            '📥 *tdl* — Telegram → WhatsApp',
            `\`${p}tdl <t.me link>\` download a message's files`,
            `\`${p}tdl <words>\` search exported chats`,
            `\`${p}tdl dd 1,2\` download search results`,
            `\`${p}tdl export\` index chats from TDL_CHATS`,
            `\`${p}tdl login [qr|desktop]\` · \`${p}tdl update\``,
        ]);
    }

    if (sub === 'update') {
        await reply(sock, chat, msg, '⬇️ Downloading the latest tdl…');
        const where = await installTdl();
        return reply(sock, chat, msg, `✅ tdl is ready: ${path.basename(where)}`);
    }

    if (sub === 'login') {
        const bin = await needTdl();
        const mode = (args[1] || 'qr').toLowerCase() === 'desktop' ? 'desktop' : 'qr';
        await reply(sock, chat, msg, `🔐 Login started (${mode}). Look at the *terminal/console where Al-Jin runs* and follow it. This waits up to 5 minutes.`);
        await runTdl(bin, ['login', '-T', mode], { timeoutMs: LOGIN_TIMEOUT, inherit: true });
        return reply(sock, chat, msg, '✅ Telegram login finished.');
    }

    if (sub === 'export') {
        const ids = chatIds();
        if (!ids.length) return reply(sock, chat, msg, `Set the chats first: \`${p}setvar TDL_CHATS 123456,-1001234567890\``);
        if (busy) return reply(sock, chat, msg, '⏳ Another Telegram job is running.');
        const bin = await needTdl();
        busy = true;
        let ok = 0;
        try {
            await reply(sock, chat, msg, `📦 Exporting ${ids.length} chat(s)… this can take a while.`);
            for (const id of ids) {
                try { await runTdl(bin, ['chat', 'export', '-c', id, '-o', exportFile(id)]); ok++; }
                catch (e) { console.error('[x:tdl] export failed', id, e?.message); }
            }
        } finally { busy = false; }
        return reply(sock, chat, msg, `✅ Exported ${ok}/${ids.length} chat(s). Now search with \`${p}tdl <words>\`.`);
    }

    if (sub === 'dd') {
        const picks = [...new Set(args.slice(1).join(',').split(/[,\s]+/).map(Number).filter((n) => n >= 1 && n <= lastResults.length))];
        if (!picks.length) return reply(sock, chat, msg, lastResults.length ? `Pick numbers from the last search, e.g. \`${p}tdl dd 1,2\`.` : 'Search first: `.tdl <words>`.');
        const bin = await needTdl();
        await reply(sock, chat, msg, `⬇️ Downloading ${picks.length} file(s)…`);
        return withJob(sock, chat, msg, async (folder) => {
            const byChat = new Map();
            for (const n of picks) { const r = lastResults[n - 1]; (byChat.get(r.chatId) || byChat.set(r.chatId, []).get(r.chatId)).push({ id: r.id, type: 'message', file: r.file }); }
            const selections = [];
            for (const [id, messages] of byChat) {
                const f = path.join(folder, `.select_${id}.json`);
                fs.writeFileSync(f, JSON.stringify({ id: Number(id), messages }));
                selections.push(f);
            }
            await runTdl(bin, [...DL_ARGS, '-d', folder, ...selections.flatMap((f) => ['-f', f])]);
            for (const f of selections) fs.rmSync(f, { force: true });
        });
    }

    const links = args.filter((a) => /^https?:\/\/(t|telegram)\.me\//i.test(a));
    if (links.length) {
        const bin = await needTdl();
        await reply(sock, chat, msg, `⬇️ Downloading from ${links.length} link(s)…`);
        return withJob(sock, chat, msg, (folder) => runTdl(bin, [...DL_ARGS, '-d', folder, ...links.flatMap((l) => ['-u', l])]));
    }

    // anything else = a search
    if (!chatIds().length) return reply(sock, chat, msg, `Search needs indexed chats. Set \`${p}setvar TDL_CHATS <ids>\`, then \`${p}tdl export\`.`);
    const results = searchExports(args.join(' '));
    lastResults = results;
    if (!results.length) return reply(sock, chat, msg, `🔎 No files match “${args.join(' ')}”. (Run \`${p}tdl export\` to refresh the index.)`);
    const lines = results.map((r, i) => `\`${i + 1}\` ${r.file}${r.size ? ` — ${bytesToSize(r.size)}` : ''}`);
    return reply(sock, chat, msg, `🔎 *${results.length} result(s)*\n_Download with ${p}tdl dd 1,2_\n\n${lines.join('\n')}`);
});
