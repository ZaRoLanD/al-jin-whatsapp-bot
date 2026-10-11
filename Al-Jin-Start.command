#!/usr/bin/env bash
# Al-Jin · macOS double-click starter. Runs aljin.sh in this folder.
cd "$(dirname "$0")" || exit 1
[ -f aljin.sh ] || curl -fsSL -o aljin.sh https://raw.githubusercontent.com/themalik-g/al-jin-whatsapp-bot/main/aljin.sh
bash aljin.sh
