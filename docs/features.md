# Features in detail

Everything the main README summarises, with commands. Send `.menu` in WhatsApp for the live list, or `.usermanual` for the PDF guide.

[← Back to the README](../README.md) · [All docs](./README.md) · [Full command reference](./whatsapp-bot-commands.md)

---

## Stealth mode (default)

Out of the box the bot stays quiet. Each of these is **off** until you switch it on:

| Behaviour | Default | Turn it on |
|---|:---:|---|
| Shows "online" | off | `.presence online on` |
| Marks statuses as seen | off | `.lurk on` |
| Reacts to statuses | off | `.lurk react on` |
| Read receipts (blue ticks) | off | `.presence reads on` |
| Typing or recording indicator | off | `.presence typing on` / `.presence recording on` |
| Saves statuses silently | **on** | `.lurk download off` to stop |

WhatsApp decides what contacts finally see. If you open WhatsApp on your own phone, that phone shows you online. More: [stealth.md](./stealth.md).

## Ghost: anti-delete and anti-edit

- Shows what a sender removed or changed
- Text, images, video, documents and voice notes
- `.ghost on|off` and `.ghost edit on|off`

## Peek: view-once saver

- Reply to a view-once photo or video and the bot sends the real media to the owner's DM
- `.peek` (reveal), `.peek auto on` (forward automatically), `.peek watch on` (catch quoted view-once replies), `.peek dest owner|same|both`
- Everything is stored locally on your own device

## Lurk: status watcher

- Watch statuses without sending "seen" (unless you enable it)
- Silent download to the owner's chat
- `.lurk`, `.lurk react`, `.lurk download`, `.lurk emoji`

## Profile pictures

`.getpp` fetches the full-size profile picture of a user or group (reply, number, or current chat). `.getpp owner` sends it to the owner's DM.

## Universal downloader

| Source | Commands |
|---|---|
| YouTube | `.yt` `.yta` `.ytv` `.play` `.video` `.mp3` |
| Instagram, TikTok, Facebook | `.ig` `.tiktok` `.fb` |
| X (Twitter), Pinterest, Threads, Reddit | `.twitter` `.pinterest` `.threads` `.reddit` |
| Anything else | `.dl` |
| GitHub repos, MediaFire | `.gitdl` `.mfdl` |

Several extraction engines are integrated (yt-dlp and `@postfetch/core` among them); when one fails the next is tried automatically. The owner-only `.dlcap` sets the size and quality limit (default 500 MB, 480p; see [settings](./settings-and-keys.md)).

## Movies and series

`.movie`, `.series`, `.continue`, `.movieinfo`. Seasons, episodes, paging and quality choice: [movie and series engine](./whatsapp-movie-series-downloader.md).

## Books

`.book <query>`: [book downloader](./book-downloader.md).

## Islamic tools

`.quran`, `.sora`, `.para`, `.islamsearch`, `.quransearch`, `.bukhari`, `.muslim`, `.prayertimes`: [Islamic tools](./islamic-tools.md).

## AI, speech and documents

- **Free AI chat**: `.jin`, `.bot`, plus `.gemini`, `.scholar` and `.gpt` `.claude` `.grok` `.deepseek` `.kimi` with optional keys
- **Speech and subtitles**: `.subtitle` (`.st`), `.trb`, `.trt` using Whisper large-v3
- **Documents**: `.ppt` (PowerPoint maker), `.pdf`, `.ocr`, `.tts`, `.qr`, `.barcode`
- **AI images**: `.photo`, `.imagine`

The bot runs without any key; keys only make features faster. See [settings and keys](./settings-and-keys.md).

## Scheduling

`.schedule <message> <target> dd,mm,yy hour minute am/pm`: text or media, to a private chat, group or channel (newsletter), by number, @username, JID or LID. Reply to any message to schedule it. `.schedule open|close` schedules group opening and closing. Syntax: [command reference](./whatsapp-bot-commands.md#-schedule--send-later).

## Group management

- **Admin**: `.kick` `.add` `.promote` `.demote` `.open` `.close` `.tagall` `.hidetag` `.welcome` `.goodbye`
- **Protection**: `.antilink` `.antispam` `.antisticker` `.antiword` `.antibot` `.antipromote` `.antidemote` `.gshield` `.warn`
- **Tools**: `.poll` `.vote` `.kickall` `.approveall` `.inactive` `.gclone`
- **Monitoring**: `.activity` `.chatstats` `.schedule`

## Multiple sessions

Run several WhatsApp numbers from one install: `.addsession <number>` and `.delsession`, or `node index.js --add`. Each session keeps its own data in `instances/`.

## Reply modes

Selection prompts (movie results, book lists, menus) can appear as a numbered text list, a poll or native buttons. Owner command: `.replymode text|poll|buttons`.

## Resource limits

| Command | Effect |
|---|---|
| `.ramlimit 512` | RAM ceiling in MB (`restart` option restarts the bot if it stays over) |
| `.cpulimit` | CPU ceiling |
| `.dlcap 800` / `.dlcap quality 480` | Maximum download size and video height |
| `.cpu` `.ram` `.rom` `.disk` | Live usage |

## Stickers, media and fun

- `.sticker` `.toimg` `.tovid` `.take` `.stickercrop` `.circle` `.attp` `.meme`
- `.tomp3` `.vn` `.trim` `.compress` `.speed` `.8d` `.bassboost`
- 50+ text effects via `.textmaker`; games such as `.tictactoe` `.hangman` `.trivia`

## Utilities

`.translate` `.weather` `.currency` `.crypto` `.wiki` `.speedtest` `.calc`
