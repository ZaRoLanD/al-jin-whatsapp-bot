# Manual install

Only needed if the one-click start does not work for you.

[← Back to the README](../README.md) · [All docs](./README.md)

---

## Steps

Most people should use [One-Click Start](./one-click-deploy.md). Use this section only if the one-click file does not work on your machine, or if you are a developer.

**Requirements:** Node.js 20+ (22 LTS recommended), `git`, a WhatsApp account to link, and optionally PM2 for 24/7 uptime.

```bash
git clone https://github.com/themalik-g/al-jin-whatsapp-bot.git
cd al-jin-whatsapp-bot
npm install
npm start
```

On first run Al-Jin prints an 8-character pairing code. Enter it in WhatsApp → **Linked Devices → Link with phone number instead**. Then send `.menu` to see every command.

Short version for a server: put `index.js` in an empty folder, write your number in the `BOT_NUMBER` line, run `node index.js`, enter the pairing code, then `pm2 start index.js --name al-jin`. Full guide for VPS, Termux, Docker, Heroku and Koyeb: [Deployment Guide](./whatsapp-bot-deployment.md).

To restart after a reboot (manual install): `cd al-jin-whatsapp-bot && npm start` (or `pm2 resurrect` / `pm2 restart al-jin` if you use PM2). The saved WhatsApp login is reused, so no new code is needed.

To add another number from inside WhatsApp, send `.addsession <phone_number>`.
