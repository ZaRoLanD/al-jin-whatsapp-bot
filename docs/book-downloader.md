# Book downloader

A dedicated engine for finding and sending free, legally available books inside WhatsApp.

[← Back to the README](../README.md) · [All docs](./README.md)

## Command

| Command | Description |
|---|---|
| `.book <query>` | Search and download verified free books (Project Gutenberg and Archive.org) |

## How it works

1. Send `.book <title or author>`.
2. The bot lists matching books. How the list appears (numbered text, poll or buttons) follows `.replymode`.
3. Pick one; the file is downloaded within your `.dlcap` limit, sent to the chat, and removed from the server.

Only freely available books are offered. Copyright rules differ by country; you are responsible for how you use the bot.

See also: [movie and series engine](./whatsapp-movie-series-downloader.md) · [settings and download limits](./settings-and-keys.md)
