# Stealth mode (default)

Al-Jin stays invisible unless you choose otherwise.

| Behaviour | Default | Turn it on |
|---|---|---|
| Shows "online" | ❌ off | `.presence online on` |
| Marks statuses as seen | ❌ off | `.lurk on` |
| Reacts to statuses | ❌ off | `.lurk react on` |
| Blue ticks on chats (read receipts) | ❌ off | `.presence reads on` |
| Auto typing / recording indicator | ❌ off | `.presence typing on` / `.presence recording on` |
| Saves statuses silently (no "seen" is sent) | ✅ on | `.lurk download off` to stop |
| Group auto-react | ❌ off | `.areact on` (per group) |

## How "offline" is kept

After connecting, and every 25 seconds, the bot tells WhatsApp it is unavailable. If you enable `.presence online on` it sends "available" instead.

## Updating from an older version

On the first start, an older `lurk.json` that had auto-view or auto-react on is switched off once. Turn them back on with `.lurk on` and `.lurk react on`; your choice is kept from then on.

## Honest limits

- WhatsApp decides what contacts see. If you open WhatsApp on your own phone, that phone shows you online.
- Commands you send to the bot are normal messages, and the bot's replies are visible to the people in that chat.

[← All docs](./README.md)
