# Al-Jin Lite and hosting options

Not every host can run the full bot. This page covers the lighter alternatives.

[← Back to the README](../README.md) · [All docs](./README.md) · [Deployment guide](./whatsapp-bot-deployment.md)

## Low-RAM tuning for the full bot

| Setting | Use |
|---|---|
| `.ramlimit 512 restart` | Cap RAM and restart if it stays over the limit |
| `.cpulimit` | Cap CPU use |
| `.dlcap 200mb` and `.dlcap quality 360` | Smaller downloads for small disks |
| `UV_THREADPOOL_SIZE=2`, `WRAITH_V8_POOL_SIZE=2` | Fewer threads on restricted panels |

Heavy jobs run one at a time and downloads are streamed to disk and deleted after sending. On small servers **disk space**, not RAM, is the usual limit; check it with `.disk`.

## Al-Jin Lite

[Al-Jin Lite](https://github.com/themalik-g/al-jin-lite) is a lighter edition for hosts with as little as **256 MB of RAM**, such as free plans on Katabump and similar services. Use it if you do not want to run your own server.

## Managed hosting

The developer can host a bot for you on request. This is offered as a courtesy for people who cannot buy a server because of payment-method or similar restrictions. It is not a commercial service. Message **@insaf.pk** on WhatsApp (see [support](./support.md)).
