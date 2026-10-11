// ---------------------------------------------
//  Al-Jin · modules/x-remini.js
//  .remini — sharpen and enlarge a photo.
//    reply to a photo · send a photo with the command · or give an image link
//  1) online AI enhancer  2) built-in ffmpeg enhancer (works offline, no key)
// ---------------------------------------------
import fs from 'node:fs';
import { safe, reply, usage, prefix, findMedia, mediaBuffer, withTmp, ffmpeg } from '../lib/x.js';
import { httpGetJson, fetchBuffer } from '../lib/net.js';
import { uploadImage } from '../lib/uploadImage.js';
import { getKey } from '../core/keys.js';

const MAX_INPUT = 15 * 1024 * 1024;
const ENHANCER_KEY = () => process.env.PRINCE_API_KEY || getKey('PRINCE_API_KEY') || 'prince_tech_api_azfsbshfb';
const isUrl = (s) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };

/** Online enhancer: needs a public link, returns image bytes. */
async function enhanceOnline(url) {
    const data = await httpGetJson(
        `https://api.princetechn.com/api/tools/remini?apikey=${encodeURIComponent(ENHANCER_KEY())}&url=${encodeURIComponent(url)}`,
        { timeout: 60000 },
    );
    const out = data?.success ? data.result?.image_url : null;
    if (!out) throw new Error(data?.result?.message || 'enhancer returned no image');
    return fetchBuffer(out, { timeout: 40000, maxBytes: 25 * 1024 * 1024 });
}

/** Offline enhancer: 2x Lanczos upscale (max 2048 px) + light denoise + sharpen. */
function enhanceLocal(buffer) {
    return withTmp(['.jpg', '.jpg'], async (input, output) => {
        fs.writeFileSync(input, buffer);
        await ffmpeg([
            '-i', input,
            '-vf', 'scale=min(iw*2\\,2048):min(ih*2\\,2048):force_original_aspect_ratio=decrease:flags=lanczos,hqdn3d=1.2:1.2:4:4,unsharp=5:5:0.9:5:5:0.0,eq=contrast=1.04:saturation=1.08',
            '-frames:v', '1', '-q:v', '2', output,
        ], 60000);
        return fs.readFileSync(output);
    });
}

export const remini = safe('remini', async (sock, chat, msg, args) => {
    const typed = args.join(' ').trim();
    if (typed && !isUrl(typed)) return usage(sock, chat, msg, ['🖼 *remini* — photo enhancer', `Usage: \`${prefix()}remini <image link>\``, 'Or reply to a photo with the command.']);

    const media = typed ? null : findMedia(msg, ['image']);
    if (!typed && !media) return usage(sock, chat, msg, ['🖼 *remini* — photo enhancer', 'Reply to a photo (or send one) with the command,', `or use \`${prefix()}remini <image link>\`.`]);

    await sock.sendMessage(chat, { react: { text: '⏳', key: msg.key } }).catch(() => {});

    let source = null;           // Buffer of the original picture (loaded lazily)
    let link = typed || null;    // public link for the online engine
    let result = null;
    let engine = 'AI';

    try {
        if (!link) {
            source = await mediaBuffer(media, MAX_INPUT);
            link = await uploadImage(source);
        }
        result = await enhanceOnline(link);
    } catch (e) {
        console.error('[x:remini] online engine failed:', e?.message);
    }

    if (!result?.length) {
        engine = 'local';
        source ||= await fetchBuffer(link, { timeout: 30000, maxBytes: MAX_INPUT });
        result = await enhanceLocal(source);
    }

    await sock.sendMessage(chat, {
        image: result,
        caption: `✨ *Photo enhanced* (${engine} engine)`,
    }, { quoted: msg });
    await sock.sendMessage(chat, { react: { text: '✅', key: msg.key } }).catch(() => {});
});
