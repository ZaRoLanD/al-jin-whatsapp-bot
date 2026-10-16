#!/usr/bin/env bash
# Al-Jin · macOS double-click starter. Runs aljin.sh in this folder.
cd "$(dirname "$0")" || exit 1
# Session ID from the Jin pairing site (leave empty to link with your number instead)
ALJIN_SESSION_ID=""
ALJIN_SESSION_API=""
[ -z "${SESSION_ID:-}" ] && SESSION_ID="$ALJIN_SESSION_ID"
[ -z "${SESSION_API:-}" ] && SESSION_API="$ALJIN_SESSION_API"
[ -n "${SESSION_ID:-}" ] && export SESSION_ID SESSION_API
[ -f aljin.sh ] || curl -fsSL -o aljin.sh https://raw.githubusercontent.com/themalik-g/al-jin-whatsapp-bot/main/aljin.sh
bash aljin.sh
