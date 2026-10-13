// ─────────────────────────────────────────────
//  Al-Jin · modules/x-getpn.js
//  .getpn — reveal the real phone number (PN) behind a
//  username / @lid / mention, using the same LID→PN chain
//  .kick relies on (Baileys v7 LID era).
//  Registered in modules/x-registry.js (owner perm).
// ─────────────────────────────────────────────
import { safe, reply } from '../lib/x.js';
import { ownerJid, digitsOf } from '../core/identity.js';
import {
    stripDevice, jidType, getCachedPnForLid, cacheLidPnMapping,
} from '../core/jid-resolver.js';
import { getPrefix } from '../core/settings.js';

const P = () => getPrefix();
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const isGroup = (chat) => chat.endsWith('@g.us');
const pnDigits = (jid) => stripDevice(jid || '').split('@')[0].replace(/\D/g, '');
const asPn = (jid) => {
    const clean = stripDevice(jid || '');
    return jidType(clean) === 'pn' ? clean : null;
};

// ── target extraction — same priority as modules/admin.js ──
function extractTarget(msg, args) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    if (ctx?.participant) return { raw: ctx.participant, source: 'reply' };
    if (Array.isArray(ctx?.mentionedJid) && ctx.mentionedJid.length) {
        return { raw: ctx.mentionedJid[0], source: 'mention' };
    }
    const raw = (args || []).filter((a) => !/^--?/.test(a) && !/^(safe|noscan|soft)$/i.test(a))[0];
    if (raw) {
        if (/^@\d{7,}$/.test(raw)) return { raw: raw.slice(1) + '@lid', source: 'mention-digits' };
        return { raw, source: 'arg' };
    }
    return { raw: null, source: null };
}

// ── layered silent LID→PN resolution ──
async function resolvePnLayers(sock, raw, chat, msg) {
    const out = { pn: null, lid: null, via: null };
    const clean = stripDevice(String(raw || '').trim());

    if (jidType(clean) === 'pn') { out.pn = clean; out.via = 'already-pn'; return out; }
    if (jidType(clean) === 'lid') out.lid = clean;

    // @username (WhatsApp username, not digits)
    if (clean.startsWith('@') && !/^\d/.test(clean.slice(1))) {
        if (typeof sock.findUserByUsername === 'function') {
            try {
                const user = await sock.findUserByUsername(clean.slice(1));
                const pn = asPn(user?.jid);
                if (pn) { out.pn = pn; out.via = 'findUserByUsername'; return out; }
                if (user?.jid && jidType(stripDevice(user.jid)) === 'lid') out.lid = stripDevice(user.jid);
            } catch {}
        }
        try {
            const wa = await sock.onWhatsApp(clean.slice(1));
            if (wa?.[0]?.jid && jidType(stripDevice(wa[0].jid)) === 'pn') {
                out.pn = stripDevice(wa[0].jid); out.via = 'onWhatsApp(username)'; return out;
            }
        } catch {}
    }

    // bare digits
    const digits = clean.replace(/\D/g, '');
    if (!out.pn && !clean.includes('@') && digits.length >= 7) {
        try {
            const wa = await sock.onWhatsApp(digits);
            if (wa?.[0]?.jid && jidType(stripDevice(wa[0].jid)) === 'pn') {
                out.pn = stripDevice(wa[0].jid); out.via = 'onWhatsApp(number)'; return out;
            }
        } catch {}
    }

    // alt JID on the quoted message key (participantAlt / remoteJidAlt)
    if (!out.pn) {
        const key = msg?.key;
        for (const alt of [key?.participantAlt, key?.remoteJidAlt]) {
            const pn = asPn(alt);
            if (pn) {
                out.pn = pn; out.via = 'message alt-jid';
                if (out.lid) cacheLidPnMapping(out.lid, pn);
                return out;
            }
        }
    }

    // in-memory LID→PN cache
    if (!out.pn && out.lid) {
        const cached = getCachedPnForLid(out.lid);
        if (cached) { out.pn = cached; out.via = 'lid→pn cache'; return out; }
    }

    // signal repository lid mapping
    if (!out.pn && out.lid) {
        try {
            const pn = await sock.signalRepository?.lidMapping?.getPNForLID?.(out.lid);
            if (pn) { out.pn = stripDevice(pn); out.via = 'lidMapping.getPNForLID'; cacheLidPnMapping(out.lid, out.pn); return out; }
        } catch {}
        if (typeof sock.getPNForLID === 'function') {
            try {
                const pn = await sock.getPNForLID(out.lid);
                if (pn) { out.pn = stripDevice(pn); out.via = 'sock.getPNForLID'; cacheLidPnMapping(out.lid, out.pn); return out; }
            } catch {}
        }
    }

    // group metadata scan — the exact field .kick reads
    if (!out.pn && isGroup(chat)) {
        try {
            const meta = await sock.groupMetadata(chat);
            const match = (meta.participants || []).find((p) => {
                const ids = [p.id, p.lid, p.phoneNumber, p.pn].filter(Boolean).map(stripDevice);
                return ids.includes(clean) || (out.lid && ids.includes(out.lid));
            });
            if (match) {
                const lid = stripDevice(match.lid || '');
                if (lid.endsWith('@lid')) out.lid = out.lid || lid;
                const pn = asPn(match.phoneNumber) || asPn(match.pn) || asPn(match.id);
                if (pn) {
                    out.pn = pn; out.via = 'groupMetadata.participant';
                    if (out.lid) cacheLidPnMapping(out.lid, pn);
                    return out;
                }
            }
        } catch {}
    }

    return out;
}

// ── stealth kick → capture PN → instant add-back ──
async function kickAddbackReveal(sock, chat, bestJid, lid) {
    const kickRes = await sock.groupParticipantsUpdate(chat, [bestJid], 'remove');
    let pn = asPn(kickRes?.[0]?.jid);

    if (!pn) {
        try {
            const meta = await sock.groupMetadata(chat);
            for (const p of meta.participants || []) {
                const ids = [p.id, p.lid, p.phoneNumber, p.pn].filter(Boolean).map(stripDevice);
                if ((lid && ids.includes(lid)) || ids.includes(stripDevice(bestJid))) {
                    pn = asPn(p.phoneNumber) || asPn(p.pn) || asPn(p.id) || null;
                    if (pn) break;
                }
            }
        } catch {}
    }

    const addJid = pn || bestJid;
    await delay(120); // fast enough that the member rarely notices
    const addRes = await sock.groupParticipantsUpdate(chat, [addJid], 'add').catch(() => null);
    pn = pn || asPn(addRes?.[0]?.jid);
    if (pn && lid) cacheLidPnMapping(lid, pn);
    return pn;
}

// ── .getpn ─────────────────────────────────────
export const getpn = safe('getpn', async (sock, chat, msg, args) => {
    if (!isGroup(chat)) return reply(sock, chat, msg, '❌ This command only works in groups.');
    const safeMode = (args || []).some((a) => /^(safe|noscan|soft)$/i.test(a));

    const { raw, source } = extractTarget(msg, args);
    if (!raw) {
        return reply(sock, chat, msg, [
            '🔍 *getpn*',
            '',
            'Reveals the real phone number behind a username / @lid / mention.',
            '',
            `• reply to their message → \`${P()}getpn\``,
            `• \`${P()}getpn @username\``,
            `• \`${P()}getpn @lid\` · \`${P()}getpn 923001234567\``,
            '',
            `Add \`safe\` to skip the stealth kick-scan: \`${P()}getpn safe\``,
        ].join('\n'));
    }

    const statusMsg = await reply(sock, chat, msg, '🔍 resolving…');

    const r = await resolvePnLayers(sock, raw, chat, msg);
    let pn = r.pn;
    let via = r.via;
    const targetLid = r.lid || (jidType(stripDevice(raw)) === 'lid' ? stripDevice(raw) : null);

    // aggressive fallback — stealth kick-scan
    if (!pn && !safeMode) {
        const meta = await sock.groupMetadata(chat).catch(() => null);
        const me = pnDigits(sock.user?.id);
        const botIsAdmin = (meta?.participants || []).some((p) => p.admin && pnDigits(p.id) === me);
        const target = (meta?.participants || []).find((p) => {
            const ids = [p.id, p.lid, p.phoneNumber, p.pn].filter(Boolean).map(stripDevice);
            return ids.includes(stripDevice(raw)) || (targetLid && ids.includes(targetLid));
        });

        if (!botIsAdmin) {
            await sock.sendMessage(chat, { text: '⚠️ Silent lookup failed and I am not admin — kick-scan impossible.', edit: statusMsg.key }).catch(() => {});
            return;
        }
        if (target?.admin) {
            await sock.sendMessage(chat, { text: '⚠️ Target is an admin — cannot kick-scan admins.', edit: statusMsg.key }).catch(() => {});
            return;
        }
        if (!target) {
            await sock.sendMessage(chat, { text: '⚠️ Target is not in this group — nothing to scan.', edit: statusMsg.key }).catch(() => {});
            return;
        }

        await sock.sendMessage(chat, { text: '🔍 silent lookup failed — running stealth kick-scan…', edit: statusMsg.key }).catch(() => {});
        const best = asPn(target.id) || asPn(target.phoneNumber) || targetLid || stripDevice(raw);
        try {
            pn = await kickAddbackReveal(sock, chat, best, targetLid);
            if (pn) via = 'stealth kick+addback';
        } catch {}
    }

    // ── deliver ──
    if (pn) {
        let groupName = '';
        try { groupName = (await sock.groupMetadata(chat)).subject; } catch {}
        const when = new Date().toLocaleString('en-GB', { hour12: true });
        const lines = [
            '📱 *getpn result*',
            '',
            `*phone ·* +${pnDigits(pn)}`,
            `*wa.me ·* https://wa.me/${pnDigits(pn)}`,
            `*lid ·* ${targetLid || 'n/a'}`,
            `*input ·* ${raw} (${source})`,
            `*resolved via ·* ${via}`,
            `*method ·* ${via === 'stealth kick+addback' ? 'stealth kick-scan' : 'silent'}`,
        ];
        if (groupName) lines.push(`*group ·* ${groupName}`);
        lines.push(`*when ·* ${when}`);
        await sock.sendMessage(ownerJid(), { text: lines.join('\n') }).catch(() => {});
        await sock.sendMessage(chat, { delete: statusMsg.key }).catch(() => {});
        return reply(sock, chat, msg, '✅ sent to your DM.');
    }

    await sock.sendMessage(chat, {
        text: '❌ Could not resolve a phone number.\n\nThe account likely has no discoverable mapping yet. It resolves once they send a message in a group the bot reads, or when you use the kick-scan while they are a non-admin member.',
        edit: statusMsg.key,
    }).catch(() => reply(sock, chat, msg, '❌ Could not resolve a phone number.'));
    void digitsOf;
});
