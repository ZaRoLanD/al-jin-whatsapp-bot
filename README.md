<a name="top"></a>

<div align="center">

<img src="assets/banner.svg" width="100%" alt="Al-Jin WhatsApp Bot: self-hosted, open-source WhatsApp Multi-Device bot with Baileys v7, free AI and 300+ commands"/>

<a href="https://github.com/themalik-g/al-jin-whatsapp-bot">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=2800&pause=900&color=00F0FF&background=0B1026FF&center=true&vCenter=true&width=720&height=54&lines=%3E+boot+aljin+--stealth+--ai;300%2B+commands.+Zero+subscriptions.+100%25+local.;Ghost+%7C+Peek+%7C+Lurk+%7C+Status+Saver;Downloaders+%7C+Stickers+%7C+Group+Admin+%7C+Free+AI;Pair+with+a+code.+No+QR.+No+cloud." alt="Animated feature ticker"/>
</a>

<br/>

<img src="assets/aj-jin-whatsapp-bot.gif" alt="Al-Jin WhatsApp bot hero animation: a hooded cyber guardian with a glowing staff floating beside the WhatsApp logo in a galaxy of circuit lines" width="480"/>

<br/><br/>

[![Read the User Manual](https://img.shields.io/badge/Read_the-User_Manual-00f0ff?style=for-the-badge&logo=readme&logoColor=white&labelColor=1b2140)](#user-manual)
[![Documentation](https://img.shields.io/badge/Browse-Documentation-a78bfa?style=for-the-badge&logo=gitbook&logoColor=white&labelColor=1b2140)](docs/README.md)
[![Support](https://img.shields.io/badge/Get-Support-25d366?style=for-the-badge&logo=whatsapp&logoColor=white&labelColor=1b2140)](docs/support.md)

<br/>

[![Version](https://img.shields.io/badge/version-2.3.0-00f0ff?style=for-the-badge&labelColor=1b2140)](https://github.com/themalik-g/al-jin-whatsapp-bot/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-00ff88?style=for-the-badge&labelColor=1b2140)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-20%2B-3c873a?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=1b2140)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-v7-25d366?style=for-the-badge&logo=whatsapp&logoColor=white&labelColor=1b2140)](https://github.com/WhiskeySockets/Baileys)
[![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Gemini%20%7C%20Puter-8e75b2?style=for-the-badge&logo=googlegemini&logoColor=white&labelColor=1b2140)](docs/settings-and-keys.md)

[![Stars](https://img.shields.io/github/stars/themalik-g/al-jin-whatsapp-bot?style=flat-square&logo=github&labelColor=1b2140&color=ffd700)](https://github.com/themalik-g/al-jin-whatsapp-bot/stargazers)
[![Forks](https://img.shields.io/github/forks/themalik-g/al-jin-whatsapp-bot?style=flat-square&logo=github&labelColor=1b2140&color=00f0ff)](https://github.com/themalik-g/al-jin-whatsapp-bot/network/members)
[![Issues](https://img.shields.io/github/issues/themalik-g/al-jin-whatsapp-bot?style=flat-square&labelColor=1b2140&color=ff6b6b)](https://github.com/themalik-g/al-jin-whatsapp-bot/issues)
[![Last Commit](https://img.shields.io/github/last-commit/themalik-g/al-jin-whatsapp-bot?style=flat-square&labelColor=1b2140&color=a78bfa)](https://github.com/themalik-g/al-jin-whatsapp-bot/commits)
[![Repo Size](https://img.shields.io/github/repo-size/themalik-g/al-jin-whatsapp-bot?style=flat-square&labelColor=1b2140&color=00ff88)](https://github.com/themalik-g/al-jin-whatsapp-bot)
[![Watchers](https://img.shields.io/github/watchers/themalik-g/al-jin-whatsapp-bot?style=flat-square&logo=github&labelColor=1b2140&color=0e75b6)](https://github.com/themalik-g/al-jin-whatsapp-bot/watchers)
[![Page views](https://hits.sh/github.com/themalik-g/al-jin-whatsapp-bot.svg?style=flat-square&label=views&color=0e75b6&labelColor=1b2140)](https://hits.sh/github.com/themalik-g/al-jin-whatsapp-bot/)

<br/>

**[Quick Start](#quick-start)** &nbsp;•&nbsp;
**[Features](#features)** &nbsp;•&nbsp;
**[Structure](#project-structure)** &nbsp;•&nbsp;
**[Configuration](#configuration)** &nbsp;•&nbsp;
**[Deploy](#deployment)** &nbsp;•&nbsp;
**[Commands](#commands)** &nbsp;•&nbsp;
**[Manual](#user-manual)** &nbsp;•&nbsp;
**[Docs](#documentation)** &nbsp;•&nbsp;
**[FAQ](#faq)**

</div>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## About

**Al-Jin** is a free, open-source, **self-hosted WhatsApp Multi-Device bot** for Node.js 20+, built on [Baileys v7](https://github.com/WhiskeySockets/Baileys). It links to your account through **Linked Devices** with an 8-character pairing code (no QR scan), runs on your own machine or server, and ships with **300+ commands**: media downloaders, free AI chat, stickers, group moderation, message recovery, movies, Islamic tools, and more.

<div align="center">

![Commands](https://img.shields.io/badge/commands-300%2B-00f0ff?style=flat-square&labelColor=1b2140)
![Modules](https://img.shields.io/badge/modules-79-a78bfa?style=flat-square&labelColor=1b2140)
![Helpers](https://img.shields.io/badge/lib%20helpers-43-00ff88?style=flat-square&labelColor=1b2140)
![Tests](https://img.shields.io/badge/test%20files-19-ffd700?style=flat-square&labelColor=1b2140)
![Platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20Docker-0e75b6?style=flat-square&labelColor=1b2140)

</div>

> [!IMPORTANT]
> Al-Jin is an unofficial project and is not affiliated with or endorsed by WhatsApp or Meta. Automating a personal account can violate WhatsApp's Terms of Service and may lead to restrictions. Use it on accounts you can afford to risk, and only with the consent of the people you chat with.

<div align="center">

| 🛡️ Ghost | 👁️ Peek | 📸 Lurk | 🤖 Free AI |
|:---:|:---:|:---:|:---:|
| Recover deleted and edited messages | Keep view-once media you receive | Watch and save statuses silently | Chat with AI, no key needed |

| ⬇️ Downloaders | 🎭 Stickers | 👥 Group Tools | 🎬 Movies |
|:---:|:---:|:---:|:---:|
| YouTube, IG, TikTok, FB, X and more | Create and convert | Moderation and protection | Search and download |

</div>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="quick-start"></a>
## Quick Start

Pick your platform. Every launcher installs what it needs and starts the bot for you. No prior Node.js, npm or git install is required.

<table align="center">
<tr><td align="center" width="130"><b>🪟 Windows</b></td><td>Download <code>Al-Jin-Start.bat</code> and double-click it</td></tr>
<tr><td align="center"><b>🍎 macOS</b></td><td>Double-click <code>Al-Jin-Start.command</code></td></tr>
<tr><td align="center"><b>🐧 Linux</b></td><td><code>bash aljin.sh</code></td></tr>
<tr><td align="center"><b>📱 Android</b></td><td>See the <a href="#termux-android">Termux guide</a> below</td></tr>
<tr><td align="center"><b>🐳 Docker</b></td><td>See <a href="#deployment">Deployment</a></td></tr>
</table>

**First run in five steps**

<br/>

<div align="center">
  <img src="assets/setup-flow.svg" alt="Animated first-run flow: run launcher, enter number, get pairing code, link device, send .menu" width="420"/>
</div>

<br/>

<div align="center">
  <img src="assets/terminal.svg" alt="Animated terminal showing Al-Jin booting and replying to .menu" width="100%"/>
</div>

<br/>

> [!TIP]
> Use your number in international format without `+` or spaces, for example `923001234567`. You can also pass it directly: `node index.js --phone=923001234567`.

Full walkthroughs with screenshots-free, step-by-step wording: [One-click start](docs/one-click-deploy.md) · [Manual install](docs/manual-install.md).

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="user-manual"></a>
## User Manual

New to Al-Jin? Read the official manual first. It walks through setup, pairing and every command group in plain language.

<div align="center">

| 📖 Read online | 📲 Get it in WhatsApp | 📚 Browse the guides |
|:---:|:---:|:---:|
| [**Open the PDF manual**](https://github.com/themalik-g/wraith_manual/blob/main/wraith_manual.pdf) | Send **`.usermanual`** to the bot and it replies with `Al-Jin_Manual.pdf` | [**docs/**](docs/README.md): install, stealth, keys, troubleshooting |

</div>

> [!TIP]
> Already linked? Send `.menu` for the command list or `.usermanual` for the full PDF, right inside WhatsApp.

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="features"></a>
## Features

<details open>
<summary><b>🕶️ Stealth Mode (default)</b></summary>

<br/>

Out of the box the bot stays quiet. Each of these is **off** until you switch it on:

| Behaviour | Default | Turn it on |
|---|:---:|---|
| Shows "online" | off | `.presence online on` |
| Marks statuses as seen | off | `.lurk on` |
| Reacts to statuses | off | `.lurk react on` |
| Read receipts (blue ticks) | off | `.presence reads on` |
| Typing or recording indicator | off | `.presence typing on` / `.presence recording on` |
| Saves statuses silently | **on** | `.lurk download off` to stop |

WhatsApp decides what contacts finally see. If you open WhatsApp on your own phone, that phone shows you online. Details: [docs/stealth.md](docs/stealth.md).

</details>

<details>
<summary><b>🛡️ Ghost: Anti-Delete and Anti-Edit</b></summary>

<br/>

- Shows what a sender removed or changed
- Handles text, images, video, documents and voice notes
- Commands: `.ghost on|off` and `.ghost edit on|off`

</details>

<details>
<summary><b>👁️ Peek: View-Once Saver</b></summary>

<br/>

- Stores view-once photos and videos you receive so you can open them again
- `.peek`, `.peek auto` (forward automatically), `.peek watch`, `.peek dest`
- Everything is saved locally on your own device

</details>

<details>
<summary><b>📸 Lurk: Status Watcher</b></summary>

<br/>

- Watch contacts' statuses without sending "seen" (unless you enable it)
- Silent download to the owner's chat
- `.lurk`, `.lurk react`, `.lurk download`, `.lurk emoji`

</details>

<details>
<summary><b>⬇️ Universal Downloader</b></summary>

<br/>

| Source | Commands |
|---|---|
| YouTube | `.yt` `.yta` `.ytv` `.play` `.video` `.mp3` |
| Instagram, TikTok, Facebook | `.ig` `.tiktok` `.fb` |
| X (Twitter), Pinterest, Threads, Reddit | `.twitter` `.pinterest` `.threads` `.reddit` |
| Anything else | `.dl` |
| GitHub repos, MediaFire | `.gitdl` `.mfdl` |

Owner-only `.dlcap` controls the size and quality limit (default 500 MB, 480p).

</details>

<details>
<summary><b>🤖 AI, Speech and Documents</b></summary>

<br/>

- **Free AI chat**: `.jin`, `.bot`, plus `.gemini`, `.scholar` and `.gpt` `.claude` `.grok` `.deepseek` `.kimi` with optional keys
- **Speech and subtitles**: `.subtitle` (`.st`), `.trb`, `.trt` using Whisper large-v3
- **Documents**: `.ppt` (PowerPoint maker), `.pdf`, `.ocr`, `.tts`, `.qr`, `.barcode`
- **AI images**: `.photo`, `.imagine`

The bot runs without any key. Keys only make features faster: see [Configuration](#configuration).

</details>

<details>
<summary><b>👥 Group Management</b></summary>

<br/>

- **Admin**: `.kick` `.add` `.promote` `.demote` `.open` `.close` `.tagall` `.hidetag` `.welcome` `.goodbye`
- **Protection**: `.antilink` `.antispam` `.antisticker` `.antiword` `.antibot` `.antipromote` `.antidemote` `.gshield` `.warn`
- **Tools**: `.poll` `.vote` `.kickall` `.approveall` `.inactive` `.gclone`
- **Monitoring**: `.activity` `.chatstats` `.schedule`

</details>

<details>
<summary><b>🎭 Stickers, Media and Fun</b></summary>

<br/>

- `.sticker` `.toimg` `.tovid` `.take` `.stickercrop` `.circle` `.attp` `.meme`
- Audio and video: `.tomp3` `.vn` `.trim` `.compress` `.speed` `.8d` `.bassboost`
- 50+ text effects via `.textmaker`, plus games like `.tictactoe` `.hangman` `.trivia`

</details>

<details>
<summary><b>🎬 Movies, Islamic Tools and Utilities</b></summary>

<br/>

- **Movies and series**: `.movie` `.series` `.continue` `.movieinfo`
- **Islamic tools**: `.prayertimes` `.quran` `.bukhari` `.muslim`
- **Utilities**: `.translate` `.weather` `.currency` `.crypto` `.wiki` `.speedtest` `.calc`

</details>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## Architecture

How a WhatsApp message travels through the bot:

<br/>

<div align="center">
  <img src="assets/architecture.svg" alt="Animated architecture: WhatsApp servers, Baileys v7, command router, feature modules, free AI APIs, FFmpeg and local instances storage" width="460"/>
</div>

<br/>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,js,docker,linux,git,github,bash&theme=dark" alt="Tech stack icons"/>

![Baileys](https://img.shields.io/badge/Baileys%20v7-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)
![yt-dlp](https://img.shields.io/badge/yt--dlp-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Tesseract](https://img.shields.io/badge/Tesseract.js-3C873A?style=for-the-badge)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

</div>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="project-structure"></a>
## Project Structure

Built from the actual repository layout (79 command modules, 43 library files, 19 test files). The tree below plays automatically; green dots mark the files to start with.

```mermaid
flowchart TB
    subgraph ENTRY["Entry points"]
        IDX["index.js<br/>launcher + pairing"]
        STR["start.js<br/>per-session worker"]
        RTR["router.js<br/>command router"]
        CFG["config.js"]
    end

    subgraph CORE["core/ - runtime"]
        C1["bootstrap-env, paths, vars"]
        C2["identity, jid-resolver"]
        C3["limiter, limits, vault"]
        C4["settings, status-store, session-repair"]
    end

    subgraph MODS["modules/ - 79 command modules"]
        M1["Stealth<br/>ghost, peek, lurk, presence"]
        M2["Downloads<br/>download, social, fb, igplus"]
        M3["Groups<br/>group, admin, x-group, x-guard"]
        M4["AI and docs<br/>gemini, jin, ppt, x-subtitle"]
        M5["Media and fun<br/>stickers, textmaker, fun, x-music"]
        M6["Utility and owner<br/>utility, tools, owner, schedule"]
    end

    subgraph LIB["lib/ - 43 helpers"]
        L1["ytdlp, ffmpeg-resolver, video-converter"]
        L2["llm, ai, stt, subtitle-*"]
        L3["ppt/, moviebox, ia-movies, net"]
    end

    subgraph DATA["Runtime data - git-ignored"]
        D1[("instances/<br/>WhatsApp session")]
        D2[("state/<br/>json state")]
        D3[("vault/<br/>temp media")]
    end

    subgraph TOOLS["Tooling and docs"]
        T1["scripts/ and patches/<br/>Baileys patch"]
        T2["test/ - 19 tests"]
        T3["docs/ - guides"]
        T4["fonts/ - sticker fonts"]
    end

    IDX --> STR
    CFG --> STR
    STR --> RTR
    STR --- CORE
    RTR --> MODS
    MODS --> LIB
    CORE --> DATA
    MODS --> DATA
    T1 -.-> STR

    classDef entry fill:#0f0c29,stroke:#00f0ff,color:#e8f6ff
    classDef grp fill:#14183a,stroke:#a78bfa,color:#e8f6ff
    class IDX,STR,RTR,CFG entry
    class M1,M2,M3,M4,M5,M6,C1,C2,C3,C4,L1,L2,L3,T1,T2,T3,T4 grp
```

<br/>

<div align="center">
  <img src="assets/file-tree.svg" alt="Animated file tree of the Al-Jin repository showing launchers, start.js, router.js, core, modules, lib, docs, tests and deployment files" width="560"/>
</div>

<br/>

<details>
<summary><b>📋 Copy-friendly text tree</b></summary>

<br/>

```text
al-jin-whatsapp-bot/
├── index.js                 # Launcher: asks for your number, pairs, supervises start.js
├── start.js                 # Per-session worker: Baileys socket, events, scheduler
├── router.js                # Command router (cold commands load lazily)
├── config.js                # Owner number, codename, reconnect settings
├── noaction.js              # No-action helpers
├── dp.mjs                   # Profile picture tool
├── core/                    # Runtime: env, identity, JID resolver, limiter, vault, settings
├── modules/                 # 79 command modules (ghost, peek, lurk, download, group, ppt ...)
├── lib/                     # 43 helpers (yt-dlp, FFmpeg, LLM, subtitles, movies, ppt/ ...)
├── scripts/                 # apply-baileys-patch.js (runs on postinstall)
├── patches/                 # Baileys rc14 decrypt fix
├── state/                   # Small JSON state (ghost ledger, lurk, peek, owner)
├── fonts/                   # Fonts for stickers and text effects
├── test/                    # 19 test files
├── docs/                    # Guides, command reference, troubleshooting
├── Al-Jin-Start.bat         # Windows launcher
├── Al-Jin-Start.command     # macOS launcher
├── aljin.sh                 # Linux / macOS / Termux installer
├── Dockerfile               # Node 20 image, session volume at /app/instances
├── Procfile                 # worker: node index.js
├── ecosystem.config.cjs     # PM2 production config
├── .env.example             # Launcher variables
├── keys.env.example         # Optional API keys
├── llms.txt                 # Machine-readable project summary
└── package.json
```

</details>

> [!CAUTION]
> `instances/` holds your WhatsApp login, and `.env` / `keys.env` hold your keys. They are git-ignored; never commit, upload or share them (including inside zip files).

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="configuration"></a>
## Configuration

**Al-Jin works with zero configuration.** You only provide your WhatsApp number, once.

```bash
# Option 1: type it when the launcher asks (Windows, macOS, Linux, Termux)
# Option 2: pass it on the command line
node index.js --phone=923001234567
# Option 3: set BOT_NUMBER = '923001234567' at the top of index.js
```

Digits only, with the country code. `index.js` reads the number from `BOT_NUMBER` or `--phone=` only.

### Optional API keys

Set them from WhatsApp as owner with `.setvar KEY value`, or put them in `keys.env` (copy `keys.env.example`).

| Key | Unlocks |
|---|---|
| `GROQ_API_KEY` | Fast AI chat and Whisper speech-to-text (`.bot` `.jin` `.trb` `.trt` `.subtitle`) |
| `GEMINI_API_KEY` | `.gemini` `.scholar`, `.ppt` outlines, subtitle translation |
| `PUTER_TOKEN` | `.gpt` `.claude` `.grok` `.deepseek` `.kimi` |
| `OPENAI_API_KEY` `OPENROUTER_API_KEY` | Extra AI and speech providers |
| `BRIA_API_KEY` `HF_TOKEN` | Image providers |
| `IG_SESSIONID` | Owner-only Instagram+ commands (use a spare account) |
| `TELEGRAM_BOT_TOKEN` | `.tg` (free from @BotFather) |

Get a free Gemini key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and a free Groq key at [console.groq.com](https://console.groq.com). More: [Settings and keys](docs/settings-and-keys.md) · [Configuration](docs/whatsapp-bot-configuration.md).

Set `WRAITH_DEBUG=1` (or `AL_JIN_DEBUG=1`) for verbose logs.

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="deployment"></a>
## Deployment

**Requirements:** Node.js 20 or newer (`node -v`). FFmpeg is bundled through `ffmpeg-static`.

> [!NOTE]
> The WhatsApp session lives in the `instances/` folder. On any host that wipes its disk on restart, mount a persistent volume there or the bot will be logged out each time.

### VPS or local machine with PM2 (recommended)

```bash
git clone https://github.com/themalik-g/al-jin-whatsapp-bot.git
cd al-jin-whatsapp-bot
npm install
node index.js --phone=923001234567   # first run: pair, then stop with Ctrl+C
npm install -g pm2
npm run pm2:start     # start with auto-restart
npm run pm2:logs      # follow logs
npm run pm2:restart   # restart
```

### Docker

```bash
docker build -t al-jin .

# first run: pair with your number
docker run -d --name al-jin --restart unless-stopped \
  -v "$(pwd)/instances:/app/instances" \
  al-jin node index.js --phone=923001234567

# later runs: the saved session is reused
docker run -d --name al-jin --restart unless-stopped \
  -v "$(pwd)/instances:/app/instances" al-jin
```

Mounting `instances/` keeps you logged in across restarts. Docker Compose, Koyeb, Render, Railway and Fly.io steps are in [docs/whatsapp-bot-deployment.md](docs/whatsapp-bot-deployment.md).

<a name="termux-android"></a>
### Termux (Android)

Install Termux from [F-Droid](https://f-droid.org/en/packages/com.termux/) (not the Play Store), then paste this one line:

```bash
pkg install -y curl && curl -fsSL -o aljin.sh https://raw.githubusercontent.com/themalik-g/al-jin-whatsapp-bot/main/aljin.sh && bash aljin.sh
```

To restart later, run `bash aljin.sh` again. No new code is needed.

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="commands"></a>
## Commands

Send `.menu` in any chat for the full list. The default prefix is `.` (change it with `.prefix`). In private mode only the owner can use the bot; in public mode everyone can use non-owner commands.

| Category | Examples |
|----------|----------|
| ⚙️ System | `.alive` `.ping` `.help` `.menu` `.usermanual` `.prefix` `.mode` `.settings` `.update` |
| 🕶️ Stealth | `.ghost` `.peek` `.lurk` `.presence` |
| ⬇️ Downloaders | `.dl` `.yt` `.play` `.ig` `.tiktok` `.fb` `.twitter` `.pinterest` |
| 🤖 AI | `.jin` `.bot` `.gemini` `.gpt` `.imagine` `.subtitle` |
| 🎭 Stickers | `.sticker` `.toimg` `.attp` `.circle` `.meme` |
| 🎞️ Audio and video | `.tomp3` `.trim` `.compress` `.speed` `.bassboost` |
| 📄 Documents | `.ppt` `.pdf` `.ocr` `.tts` `.qr` `.barcode` |
| 👥 Group admin | `.kick` `.add` `.promote` `.open` `.close` `.tagall` `.welcome` |
| 🛡️ Group protection | `.antilink` `.antispam` `.antibot` `.gshield` `.warn` |
| 📡 Monitoring | `.stalk` `.activity` `.chatstats` `.schedule` |
| 👑 Owner | `.setvar` `.setpp` `.addowner` `.ban` `.dlcap` `.fixkeys` |
| 🎬 Movies | `.movie` `.series` `.continue` `.movieinfo` |
| 🕌 Islamic | `.prayertimes` `.quran` `.bukhari` `.muslim` |
| 🎉 Fun and games | `.tictactoe` `.hangman` `.trivia` `.8ball` `.truth` `.dare` |
| 🧰 Utilities | `.translate` `.weather` `.currency` `.crypto` `.wiki` `.calc` |

Full reference: [Command categories](docs/command-categories.md) · [Command reference](docs/whatsapp-bot-commands.md).

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="documentation"></a>
## Documentation

| Topic | Guides |
|-------|--------|
| 📖 User manual | [PDF manual](https://github.com/themalik-g/wraith_manual/blob/main/wraith_manual.pdf) · send `.usermanual` to the bot |
| 🚀 Getting started | [One-click start](docs/one-click-deploy.md) · [Manual install](docs/manual-install.md) · [Deployment](docs/whatsapp-bot-deployment.md) |
| 🎮 Using the bot | [Commands](docs/whatsapp-bot-commands.md) · [Stealth](docs/stealth.md) · [Settings and keys](docs/settings-and-keys.md) · [Configuration](docs/whatsapp-bot-configuration.md) |
| 🎬 Features | [Subtitles](docs/subtitles.md) · [PowerPoint](docs/presentations.md) · [Movies and series](docs/whatsapp-movie-series-downloader.md) |
| 🔧 Help | [Troubleshooting](docs/whatsapp-bot-troubleshooting.md) · [FAQ](docs/faq.md) · [Support](docs/support.md) |
| 🏗️ Reference | [Architecture](docs/whatsapp-bot-architecture.md) · [JID system](docs/whatsapp-jid-system.md) · [Changelog](docs/changelog/README.md) |

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## Why Al-Jin

| | Al-Jin | Typical cloud bot | Other self-hosted bots |
|---|:---:|:---:|:---:|
| Price | Free | Monthly fee | Free |
| Data location | Your device | Provider's cloud | Your device |
| Anti-delete | Built in | Often paid | Varies |
| View-once saver | Built in | Rare | Varies |
| Free AI chat | Built in | Limited | Varies |
| One-click setup | Yes | n/a | Usually manual |
| Stealth by default | Yes | No | Varies |

Detailed comparison: [docs/al-jin-vs-other-whatsapp-bots.md](docs/al-jin-vs-other-whatsapp-bots.md).

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

<a name="faq"></a>
## FAQ

<details>
<summary><b>Is Al-Jin free?</b></summary>

<br/>

Yes. It is open source under the MIT License with no paid tiers. Optional services you connect yourself (such as an API key) follow their own pricing.

</details>

<details>
<summary><b>Is it safe? Can my number get banned?</b></summary>

<br/>

Your data stays on your own device. However, Al-Jin is an unofficial client, and WhatsApp can restrict accounts that use automation. Avoid bulk messaging or spam, and consider a secondary number.

</details>

<details>
<summary><b>Does it work with WhatsApp Business?</b></summary>

<br/>

Yes, through Linked Devices on both WhatsApp Messenger and WhatsApp Business.

</details>

<details>
<summary><b>Can I run more than one session?</b></summary>

<br/>

Yes. Owners can add sessions with `.addsession` and remove them with `.delsession`. Each session keeps its own data inside `instances/`.

</details>

<details>
<summary><b>Which Node.js version do I need?</b></summary>

<br/>

Node.js 20 or newer. Check with `node -v` and upgrade at [nodejs.org](https://nodejs.org). The one-click launchers do not need Node.js preinstalled.

</details>

<details>
<summary><b>The pairing code does not work. What now?</b></summary>

<br/>

Make sure the number is digits only with the country code, and enter the code under Linked Devices > Link with phone number within about five minutes. If it still fails, stop the bot, remove the old session folder inside `instances/`, and start again for a fresh code. More: [Troubleshooting](docs/whatsapp-bot-troubleshooting.md).

</details>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## Star History

<div align="center">

<a href="https://star-history.com/#themalik-g/al-jin-whatsapp-bot&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=themalik-g/al-jin-whatsapp-bot&type=Date&theme=dark"/>
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=themalik-g/al-jin-whatsapp-bot&type=Date"/>
    <img alt="Star history chart" src="https://api.star-history.com/svg?repos=themalik-g/al-jin-whatsapp-bot&type=Date" width="600"/>
  </picture>
</a>

</div>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

<a href="https://github.com/themalik-g/al-jin-whatsapp-bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=themalik-g/al-jin-whatsapp-bot" alt="Contributors"/>
</a>

**Support:** [open a bug report](https://github.com/themalik-g/al-jin-whatsapp-bot/issues/new?labels=bug) or [request a feature](https://github.com/themalik-g/al-jin-whatsapp-bot/issues/new?labels=enhancement). For direct help, message **@insaf.pk** on WhatsApp with a screenshot of the error.

<div align="center"><img src="assets/divider.svg" width="100%" alt=""/></div>

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 MALIK.

## Acknowledgments

[Baileys](https://github.com/WhiskeySockets/Baileys) • [yt-dlp](https://github.com/yt-dlp/yt-dlp) • [ytdlp-nodejs](https://github.com/depresio/ytdlp-nodejs) • [FFmpeg](https://ffmpeg.org/) • [Tesseract.js](https://github.com/naptha/tesseract.js) • [PptxGenJS](https://github.com/gitbrent/PptxGenJS)

<div align="center">

<img src="assets/footer.svg" width="100%" alt=""/>

**Built by [Malik Mehtab](https://github.com/themalik-g)** &nbsp;|&nbsp; [⬆ Back to top](#top)

</div>
