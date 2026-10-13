#!/usr/bin/env bash
# ─────────────────────────────────────────────
#  Al-Jin · Bun launcher (EXPERIMENTAL) for Linux, macOS and VPS servers
#  Run it:   bash aljin-bun.sh          (from the folder where you saved it)
#  - Runs the whole bot on Bun (https://bun.sh) instead of Node.js.
#  - No sudo needed. If Bun is missing, the official installer puts it in ~/.bun.
#  - First run: asks your number once and shows the pairing code.
#  - Later runs: resumes the saved session. Restarts the bot if it stops. Ctrl+C to quit.
#  - Node.js is NOT required. Prefer the default launcher (aljin.sh) if anything misbehaves.
# ─────────────────────────────────────────────
cd "$(dirname "$0")" || exit 1
RAW="https://raw.githubusercontent.com/themalik-g/al-jin-whatsapp-bot/main/index.js"
say() { printf '\n\033[1;35m[Al-Jin·Bun]\033[0m %s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }
fetch() { # fetch URL OUTFILE
  if have curl; then curl -fsSL "$1" -o "$2"; elif have wget; then wget -q "$1" -O "$2"; else return 127; fi
}

# Standalone script in a busy folder (home, Downloads)? Work in its own "Al-Jin" folder.
if [ ! -f index.js ] && [ ! -f start.js ]; then mkdir -p Al-Jin && cd Al-Jin || exit 1; fi

# 1) Bun ─────────────────────────────────────
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_INSTALL/bin:$PATH"
if ! have bun; then
  have unzip || { say "'unzip' is needed to install Bun. Install it (for example: sudo apt install unzip) and run this again."; exit 1; }
  say "Installing Bun (one time, no sudo needed)…"
  have curl || { say "'curl' is missing. Install it and run this again."; exit 1; }
  curl -fsSL https://bun.sh/install | bash || { say "Bun install failed — check your internet, or see https://bun.sh"; exit 1; }
  export PATH="$BUN_INSTALL/bin:$PATH"
fi
have bun || { say "Bun is still not available. Install it from https://bun.sh and run this again."; exit 1; }
say "Using Bun $(bun --version)"

# 2) Make the launcher's helper calls use Bun too ──
# index.js starts the bot with the command "node" and installs packages with "npm".
# These two tiny private shims (inside ./runtime/bin, nothing global is touched)
# send both to Bun, so Node.js and npm are not needed.
mkdir -p runtime/bin
ln -sf "$(command -v bun)" runtime/bin/node
cat > runtime/bin/npm <<'SHIM'
#!/usr/bin/env bash
# npm shim: "npm install ..." -> bun install (production only), then allow the
# packages that download their own binaries (ffmpeg, yt-dlp) to run their setup.
case "$1" in
  install|i|ci)
    rm -f package-lock.json            # Bun writes its own bun.lock
    bun install --production || exit $?
    bun pm trust --all >/dev/null 2>&1 || true
    ;;
  *) exec bun "$@" ;;
esac
SHIM
chmod +x runtime/bin/npm
export PATH="$PWD/runtime/bin:$PATH"
export NODE_NO_WARNINGS=1

# 3) launcher ────────────────────────────────
if [ ! -f index.js ]; then
  say "Downloading the launcher (index.js)…"
  fetch "$RAW" index.js || { say "Download failed — check your internet."; exit 1; }
  [ -f package.json ] || echo '{"type":"module"}' > package.json
fi

# 4) number (asked once) ─────────────────────
# A linked session lives in instances/ (bot next to index.js) or wraith/instances/ (bot downloaded by the launcher).
linked() { [ -n "$(ls -A instances 2>/dev/null)" ] || [ -n "$(ls -A wraith/instances 2>/dev/null)" ]; }
NUMFILE=".aljin-number"
if [ ! -s "$NUMFILE" ] && ! linked; then
  if [ -t 0 ]; then
    while :; do
      read -r -p "Your WhatsApp number, digits only with country code (e.g. 923001234567): " N
      N="${N//[^0-9]/}"
      [ "${#N}" -ge 8 ] && [ "${#N}" -le 15 ] && { echo "$N" > "$NUMFILE"; break; }
      echo "That does not look right — try again."
    done
  else
    say "No keyboard available (non-interactive panel). Put your number in BOT_NUMBER inside index.js, or run: ALJIN_NUMBER=923001234567 bash aljin-bun.sh"
    N="${ALJIN_NUMBER//[^0-9]/}"
    [ -n "$N" ] && echo "$N" > "$NUMFILE"
  fi
fi

# 5) run + auto-restart ──────────────────────
FAILS=0
while :; do
  if linked || [ ! -s "$NUMFILE" ]; then ARGS=(); else ARGS=("--phone=$(cat "$NUMFILE")"); fi
  say "Starting Al-Jin on Bun… (Ctrl+C to stop)"
  START=$(date +%s)
  bun index.js "${ARGS[@]}"
  code=$?
  [ "$code" -eq 0 ] && { say "Stopped."; break; }
  if [ $(( $(date +%s) - START )) -lt 40 ]; then FAILS=$((FAILS+1)); else FAILS=0; fi
  if [ "$FAILS" -ge 3 ]; then
    say "Stopped: the bot failed 3 times in a row. Read the error above. Fall back to the default launcher with: bash aljin.sh. Need help? WhatsApp @insaf.pk (docs/support.md)"
    exit 1
  fi
  say "Bot exited (code $code) — restarting in 5 s…"; sleep 5
done
