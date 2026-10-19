// ─────────────────────────────────────────────
// Al-Jin · lib/ffmpeg-resolver.js
// Resolves system ffmpeg/ffprobe with fallback to static packages
//
// Light/admin-safe: the ffmpeg-static / ffprobe-static packages are loaded
// LAZILY (await import in try/catch), so a trimmed install (AL_JIN_ADMIN /
// AL_JIN_LIGHT, which drops them) no longer crashes the runtime at boot.
// Synchronous pass: system binaries if present, otherwise the bare command
// name — ffmpegPath / ffprobePath are ALWAYS truthy, exactly like before.
// Asynchronous pass: upgrades the paths once the optional static packages
// settle (system absent + static available) and refreshes the data/bin
// symlinks. Behavior for a full install is unchanged.
// ─────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function works(bin) {
  try {
    const r = spawnSync(bin, ['-version'], { timeout: 4000 });
    return r.status === 0;
  } catch { return false; }
}

// Turn a bare command name ("ffmpeg") into an absolute path so it can be
// symlinked into data/bin and handed to yt-dlp via --ffmpeg-location.
function whichAbs(name) {
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which';
    const r = spawnSync(cmd, [name], { timeout: 3000, encoding: 'utf8' });
    if (r.status === 0) {
      const first = String(r.stdout || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)[0];
      if (first && fs.existsSync(first)) return fs.realpathSync(first);
    }
  } catch {}
  return null;
}

function prepareFfmpegDir() {
  const DATA_ROOT = process.env.WRAITH_DATA_DIR || process.cwd();
  const binDir = path.resolve(DATA_ROOT, 'data', 'bin');
  fs.mkdirSync(binDir, { recursive: true });

  const ffmpegBin = path.join(binDir, 'ffmpeg');
  const ffprobeBin = path.join(binDir, 'ffprobe');

  const setupBinary = (targetPath, destPath) => {
    if (!targetPath || !path.isAbsolute(targetPath)) return;
    try { fs.rmSync(destPath, { force: true }); } catch {}
    try {
      fs.symlinkSync(targetPath, destPath);
    } catch {
      try { fs.copyFileSync(targetPath, destPath); fs.chmodSync(destPath, 0o755); } catch {}
    }
  };

  setupBinary(ffmpegPath, ffmpegBin);
  setupBinary(ffprobePath, ffprobeBin);

  // Prepend binDir to PATH environment variable if not already present
  if (process.env.PATH) {
    if (!process.env.PATH.includes(binDir)) {
      process.env.PATH = `${binDir}${path.delimiter}${process.env.PATH}`;
    }
  } else {
    process.env.PATH = binDir;
  }

  return binDir;
}

// 1. Synchronous pass — system binaries only, no package import → can never
//    crash a trimmed install. Falls back to the bare command name (always
//    truthy), the same value the old code returned when nothing was usable.
export let ffmpegPath = whichAbs('ffmpeg') || 'ffmpeg';
export let ffprobePath = whichAbs('ffprobe') || 'ffprobe';
export let ffmpegDir = prepareFfmpegDir();

// 2. Asynchronous pass — add the static packages (optional) and finalize.
//    Live ESM bindings propagate the upgraded values to importers.
(async () => {
  let ffmpegStatic = null;
  let ffprobeStatic = null;
  try { ({ default: ffmpegStatic } = await import('ffmpeg-static')); } catch {}
  try { ({ default: ffprobeStatic } = await import('ffprobe-static')); } catch {}

  const finalize = (name, current, staticPath) => {
    // system binary already found synchronously → nothing to do
    if (current !== name) return current;
    // no static package at all (trimmed install) → keep the bare name silently;
    // the calling command will report the real failure if it is ever used
    if (!staticPath) return current;
    if (fs.existsSync(staticPath) && works(staticPath)) return staticPath;
    console.error(`[ffmpeg-resolver] ${name} NOT FOUND. Install it (apt install ffmpeg) or run: npm rebuild ${name}-static`);
    return staticPath || name;
  };

  ffmpegPath = finalize('ffmpeg', ffmpegPath, ffmpegStatic);
  ffprobePath = finalize('ffprobe', ffprobePath, ffprobeStatic?.path || ffprobeStatic);

  ffmpegDir = prepareFfmpegDir();
})();
