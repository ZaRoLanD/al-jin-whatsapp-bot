# Settings, free API keys and reply modes

Everything is optional. The bot works out of the box.

[← Back to the README](../README.md) · [All docs](./README.md)

---

## Free API keys (optional)

Al-Jin works without keys, and every feature that uses an online service has a fallback. Adding free keys makes AI and speech features faster. Set them from WhatsApp (owner only):

```
.setvar GROQ_API_KEY <key>        # console.groq.com — free AI + Whisper large-v3 speech-to-text (most accurate)
.setvar GROQ_STT_MODEL <model>    # optional: default whisper-large-v3, backup whisper-large-v3-turbo
.setvar GEMINI_API_KEY <key>      # aistudio.google.com/apikey — AI, PPT outlines, subtitles
.setvar PUTER_TOKEN <token>       # needed only for .gpt .claude .grok .deepseek .kimi
.setvar IG_SESSIONID <cookie>     # only for the owner-only Instagram+ commands (use a spare account)
```

See the [Configuration Guide](./whatsapp-bot-configuration.md) for everything else.

## Download limits (`.dlcap`)

One owner command controls every download:

| Command | Effect |
|---|---|
| `.dlcap` | Show current limits |
| `.dlcap 800` / `.dlcap 1gb` | Maximum size of one download (up to 2000 MB) |
| `.dlcap quality 720` | Maximum video height (144–2160) |
| `.dlcap reset` | Back to the default (500 MB, 480p) |

Files above the document threshold are sent as documents, which WhatsApp handles more reliably for large videos.

## Reply modes: text, poll, buttons

Commands that ask you to choose something (movie results, book lists, menus) can answer in three ways. The owner switches with `.replymode`:

- `.replymode text` — numbered list, reply with the number (default, works everywhere)
- `.replymode poll` — a poll; every ticked option runs and the poll is deleted when its time is up
- `.replymode buttons` — native WhatsApp buttons (some clients show "Waiting for this message")

## Plugin settings (v2.3.0)

| Key | Used by | Needed? |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | `.tg` | Yes, free from @BotFather |
| `PRINCE_API_KEY` | `.remini` | No (shared key built in, offline enhancer as fallback) |
| `TDL_CHATS` | `.tdl` search | Only for search: chat ids, comma separated |
| `TDL_PATH` | `.tdl` | No: only if `tdl` is installed somewhere unusual |

Set any of them from WhatsApp with `.setvar KEY value`, or put them in `keys.env`.
