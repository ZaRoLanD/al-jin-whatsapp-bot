# FAQ

Short answers to the questions people ask most.

[← Back to the README](../README.md) · [All docs](./README.md)

---

## Questions

**I know nothing about computers. Can I really run this?**
Yes. On Windows, download `Al-Jin-Start.bat`, double-click it, type your number and enter the code in WhatsApp. See [One-Click Start](./one-click-deploy.md).

**Do I need to install Node.js, npm or git first?**
No. The one-click file sets up what is missing by itself, without administrator rights.

**I closed the window / my PC restarted. What now?**
Open the same file again (`Al-Jin-Start.bat` on Windows, `bash aljin.sh` on Termux, Linux and macOS). Your WhatsApp login is saved, so there is no new code.

**Does it need a QR code?**
No. It uses an 8-character pairing code.

**Can I run multiple WhatsApp numbers?**
Yes. Multi-session is built in (`.addsession`).

**Is it free?**
Yes. MIT-licensed and free to use, modify and distribute.

**How do I download movies on WhatsApp with a bot?**
Send `.movie <name>`, pick a result and a quality, and Al-Jin sends the video into the chat. For series use `.series <name> -s 2 -ep 5` or `-full`. The catalogue is Moviebox, with the Internet Archive as a public-domain fallback.

**Can it download a TV series season by season?**
Yes. `-s <season>` selects a season, `-ep <number>` an episode, and `-full` sends everything 3 episodes at a time (then `.continue`).

**Which speech-to-text model does it use?**
`.trb`, `.trt` and `.subtitle` use Groq `whisper-large-v3` (the most accurate free Whisper model), fall back to `whisper-large-v3-turbo` when rate-limited, and then to other providers. Change it with `.setvar GROQ_STT_MODEL <model>`.

**Does it have a free AI chatbot?**
Yes. `.jin` and `.bot` use free models with automatic fallbacks; API keys are optional.

**Can it make stickers from videos and GIFs?**
Yes. `.sticker` handles images, videos and GIFs; `.toimg` and `.tovid` convert stickers back.

**Is it safe?**
It uses the official multi-device protocol through Baileys, but any unofficial client carries some risk of account restrictions. Use it responsibly and avoid spam.

**Does it work on Android?**
Yes, through Termux, with one pasted line. See [One-Click Start](./one-click-deploy.md).

**Does it work on a small server?**
Yes. Heavy jobs run one at a time, downloads are streamed to disk and deleted after sending, and `.cpulimit` / `.ramlimit` cap resource use.

**Can my number get banned?**
Your data stays on your own device, but Al-Jin is an unofficial client and WhatsApp can restrict accounts that use automation. Avoid bulk messaging, and consider a secondary number.

**Does it work with WhatsApp Business?**
Yes, through Linked Devices on both WhatsApp Messenger and WhatsApp Business.

**Which Node.js version do I need?**
Node.js 20 or newer (`node -v` to check). The one-click launchers do not need Node.js preinstalled.

**The pairing code does not work. What now?**
Use digits only with the country code, and enter the code under Linked Devices > Link with phone number within about five minutes. If it still fails, stop the bot, remove the old session folder inside `instances/`, and start again for a fresh code. More: [Troubleshooting](./whatsapp-bot-troubleshooting.md).

**I only have 256 MB of RAM. Is there a smaller version?**
Yes: [Al-Jin Lite](./lite-and-hosting.md).

**Does it need the WhatsApp Business API?**
No. Al-Jin uses the standard WhatsApp multi-device protocol.
