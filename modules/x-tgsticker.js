// ---------------------------------------------
//  Al-Jin · modules/x-tgsticker.js
//  .tg <t.me/addstickers/pack> [count]
//  Copies a Telegram sticker pack into WhatsApp stickers (static + video).
//  Needs a free Telegram bot token:  talk to @BotFather → /newbot, then
//     .setvar TELEGRAM_BOT_TOKEN <token>
//  Animated (.tgs) stickers are skipped — they need a Lottie renderer.
// ---------------------------------------------
import fs from 'node:fs';
import { safe, reply, usage, prefix, clamp, withTmp, ffmpeg } from '../lib/x.js';
import { httpGetJson, fetchBuffer } from '../lib/net.js';
import { withStickerExif } from '../lib/webp-exif.js';
import { getKey } from '../core/keys.js';
import { CONFIG } from '../config.js';

const DEFAULT_COUNT = 20;
const MAX_COUNT = 50;
const GAP_MS = 700;
const PACK_URL = /(?:https?:\/\/)?(?:t|telegram)\.me\/addstickers\/([A-Za-z0-9_]+)/i;
const busy = new Set();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const token = () => process.env.TELEGRAM_BOT_TOKEN || getKey('TELEGRAM_BOT_TOKEN');

const api = (t, method, query) => httpGetJson(`https://api.telegram.org/bot${t}/${method}?${query}`, { timeout: 20000 });

/** Telegram video sticker (.webm) → animated WebP, 512 px box, max 8 s. */
function videoToWebp(buffer) {
    return withTmp(['.webm', '.webp'], async (input, output) => {
        fs.writeFileSync(input, buffer);
        await ffmpeg([
            '-i', input, '-t', '8',
            '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
            '-c:v', 'libwebp', '-loop', '0', '-an', '-q:v', '50', '-compression_level', '6', output,
        ], 90000);
        return fs.readFileSync(output);
    });
}

export const tg = safe('tg', async (sock, chat, msg, args) => {
    const help = ['🧩 *tg* — Telegram sticker packs', `Usage: \`${prefix()}tg https://t.me/addstickers/<pack> [how many]\``, `Example: \`${prefix()}tg https://t.me/addstickers/Porcientoreal 10\``];
    const raw = args[0] || '';
    const name = PACK_URL.exec(raw)?.[1] || (/^[A-Za-z0-9_]{3,}$/.test(raw) ? raw : null);
    if (!name) return usage(sock, chat, msg, help);

    const t = token();
    if (!t) {
        return usage(sock, chat, msg, [
            '🔑 *Telegram bot token needed* (free, one time)',
            '1. Open Telegram → @BotFather → /newbot',
            '2. Copy the token it gives you',
            `3. Send here: \`${prefix()}setvar TELEGRAM_BOT_TOKEN <token>\``,
        ]);
    }
    if (busy.has(chat)) return reply(sock, chat, msg, '⏳ A sticker pack is already being sent in this chat.');

    const want = clamp(parseInt(args[1], 10) || DEFAULT_COUNT, 1, MAX_COUNT);
    const set = await api(t, 'getStickerSet', `name=${encodeURIComponent(name)}`);
    if (!set?.ok || !set.result?.stickers?.length) throw new Error('pack not found (is it public?)');

    const stickers = set.result.stickers;
    const batch = stickers.slice(0, want);
    await reply(sock, chat, msg, `🧩 *${set.result.title || name}* — ${stickers.length} stickers\nSending ${batch.length}…`);

    busy.add(chat);
    let sent = 0, skipped = 0;
    try {
        for (const s of batch) {
            if (s.is_animated) { skipped++; continue; }
            try {
                const info = await api(t, 'getFile', `file_id=${encodeURIComponent(s.file_id)}`);
                const filePath = info?.result?.file_path;
                if (!filePath) throw new Error('no file path');
                const bytes = await fetchBuffer(`https://api.telegram.org/file/bot${t}/${filePath}`, { timeout: 20000, maxBytes: 3 * 1024 * 1024 });
                const webp = s.is_video ? await videoToWebp(bytes) : bytes;
                const sticker = withStickerExif(webp, {
                    packName: set.result.title || name,
                    author: CONFIG.botName || 'Al-Jin',
                    emojis: s.emoji ? [s.emoji] : [],
                });
                await sock.sendMessage(chat, { sticker });
                sent++;
                await sleep(GAP_MS);
            } catch (e) {
                skipped++;
                console.error('[x:tg] sticker failed:', e?.message);
            }
        }
    } finally {
        busy.delete(chat);
    }
    await reply(sock, chat, msg, `✅ Sent ${sent}/${batch.length} stickers${skipped ? ` (${skipped} skipped: animated or failed)` : ''}.`);
});
