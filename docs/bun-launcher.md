# Bun support (experimental)

Run Al-Jin on [Bun](https://bun.sh), the fast modern JavaScript runtime. Node.js and npm are not required.

[← Back to the README](../README.md) · [All docs](./README.md) · [Deployment guide](./whatsapp-bot-deployment.md)

## On a Bun server or panel: upload `index.js` and start

Exactly like on Node.js:

1. Upload `index.js` (set `BOT_NUMBER` in it if the panel is non-interactive).
2. Start it with `bun index.js` (on a panel, set that as the startup command).
3. Copy the pairing code from the console and link it in WhatsApp.

`index.js` detects Bun and runs the dependency install, the bot process, the YouTube JS runtime and `.update` on Bun. It fetches the rest of the bot the same way as on Node.

## Launcher: install Bun and start in one command

### Use it

Linux, macOS and VPS servers:

```bash
curl -fsSL -o aljin-bun.sh https://raw.githubusercontent.com/themalik-g/al-jin-whatsapp-bot/main/aljin-bun.sh && bash aljin-bun.sh
```

1. If Bun is missing, the script installs it for you (official installer, no sudo, into `~/.bun`; `unzip` and `curl` must exist).
2. It downloads `index.js` and asks for your number once. **On a non-interactive panel**, give the number instead: `ALJIN_NUMBER=923001234567 bash aljin-bun.sh`, or edit `BOT_NUMBER` in `index.js`.
3. Copy the pairing code and link it: WhatsApp → **Linked devices → Link a device → Link with phone number instead**.
4. To start again later, run the same command; the saved session resumes with no new code. The script restarts the bot if it stops.

Windows: run it inside WSL, or use the normal `Al-Jin-Start.bat`.

### How the launcher works

The launcher is for machines without Bun. Plain `index.js` on Bun needs none of this, but older `index.js` copies need the helpers: it starts the bot with the command `node` and installs packages with `npm`. The launcher creates two small private helpers in `./runtime/bin` (nothing global is changed) that point both to Bun. The bot's resource flags are accepted by Bun, so the same `index.js` runs unchanged. After `bun install`, the launcher runs `bun pm trust --all` so packages that fetch their own binaries (FFmpeg, yt-dlp) can finish their setup, which Bun otherwise blocks.

## Status

Experimental. The default launchers (Node.js) remain the recommended and fully tested path. If the Bun launcher fails three times in a row it stops and tells you to use `bash aljin.sh`. Please report problems to **@insaf.pk** on WhatsApp ([support](./support.md)) or in GitHub issues.
