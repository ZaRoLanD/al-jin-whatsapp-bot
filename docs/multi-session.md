# Multi-session runtime

All WhatsApp sessions run inside **one** Node.js process (`start.js`), started by `index.js`.

| Shared by every session (loaded once) | Separate per session (`instances/<id>/`) |
|---|---|
| code, libraries, Baileys version lookup | login keys (`session/`) |
| download / ffmpeg queues, yt-dlp, cookies | settings, variables / API keys, owner |
| CPU / RAM governor (`.cpulimit`, `.ramlimit`) | message history, anti-delete ledger, logs, vault |
| API-provider cooldowns | caches, timers, schedules, presence/stalk data |

## Memory

* The heap limit follows the container's memory (cgroup aware): 512 MB → 256 MB, 1 GB → 512 MB, 2 GB+ → 1 GB.
  Override with `WRAITH_MAX_OLD_SPACE_SIZE`.
* Retry store per session: 1200 messages / 12 h (`WRAITH_MSG_STORE_MAX`, `WRAITH_MSG_STORE_TTL_H`).
* Sessions start one after another (about 2.5 s apart) to avoid a RAM spike at boot.

## Commands

* `.addsession <number>` / `.setsession` — start another session inside the running process.
* `.delsession <id>` — stops the socket, logs the device out of WhatsApp, stops its timers, frees its memory
  and deletes `instances/<id>/`. It cannot restart or recreate the folder. `main` cannot be deleted.
* `.update`, `.restart`, `.fixkeys` restart the whole process (every session is saved first).

## Notes

* `process.env` is no longer filled with per-session variables, so one session's API key never reaches another.
* The YouTube cookie file and downloader binaries are shared and live in the `main` data folder.
