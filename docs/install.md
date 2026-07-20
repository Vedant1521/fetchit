# Install Guide

fetchit can be installed in several ways. Pick the one that fits your setup.

## Quick comparison

| Method | Requires | Binary size | Best for |
|--------|----------|-------------|----------|
| curl/sh one-liner | Nothing | ~50 MB | Most users |
| npm install | Node.js 18+ | ~93 KB (npm package) | Node.js developers |
| npx | Node.js 18+ | ~93 KB (cached) | Trying once |
| Build from source | Node.js 18+ + git | ~50 MB (binary) | Contributors |

---

## One-liner (recommended for most users)

No Node.js, no npm, no manual setup. The installer detects your OS and
architecture, downloads a pre-built standalone binary, and adds it to your
PATH.

**macOS / Linux:**

```sh
curl -fsSL https://fetchit-beta.vercel.app/install.sh | sh
```

**Windows (PowerShell):**

```powershell
powershell -c "irm https://fetchit-beta.vercel.app/install.ps1 | iex"
```

After install, restart your terminal (or run `source ~/.zshrc`) and type
`fetchit` to start.

### What the script does

1. Checks for Node.js 18+. If found, installs via npm (simpler).
2. Otherwise downloads the standalone binary from the latest GitHub Release.
3. Places it in `~/.fetchit/bin/fetchit`.
4. Adds `~/.fetchit/bin/` to your PATH in `.zshrc`, `.bashrc`, or
   `.config/fish/config.fish`.
5. Downloads the yt-dlp engine to `~/.fetchit/bin/` so the first run is
   fast.

---

## Install via npm

If you have Node.js 18 or newer:

```sh
npm install -g @vedant1521/fetchit
```

Or try it once without installing:

```sh
npx @vedant1521/fetchit
```

The npm package is small (~93 KB). fetchit downloads yt-dlp and finds
ffmpeg automatically on first run.

---

## Build the standalone binary from source

Useful for contributors or users who prefer to build from source.

### Prerequisites

- Node.js 18+ (for building)
- Git

### Steps

```sh
git clone https://github.com/Vedant1521/fetchit.git
cd fetchit
npm install
npm run build
```

### Generate a standalone binary (Bun compile)

Requires [Bun](https://bun.sh) installed.

```sh
npm install
bun scripts/build-binary.js
```

The output binary is at `dist/fetchit` (or `dist/fetchit.exe` on Windows).
Move it anywhere on your PATH.

The binary bundles the Bun runtime plus all dependencies into a single file
(~100 MB). No runtime installation needed.

---

## Platform-specific notes

### Windows

- The standalone binary is a single `.exe` (~50 MB). No DLLs needed.
- The curl installer uses PowerShell's `Invoke-WebRequest` (`irm`).
- If you get a SmartScreen warning, click "More info" then "Run anyway."
  This will go away once the binary is code-signed in a future release.
- For Node.js installs, Windows Defender may briefly slow the first run
  while it scans the yt-dlp binary. This is a one-time delay.

### macOS

- The standalone binary is not notarized. On first run, you may need to
  right-click the file in Finder and select "Open" to bypass Gatekeeper.
  Or run `xattr -d com.apple.quarantine ~/.fetchit/bin/fetchit`.
- The `install.sh` script adds `~/.fetchit/bin/` to your `.zshrc`.

### Linux

- The standalone binary is statically linked. Works on most glibc-based
  distros (Ubuntu, Debian, Fedora, Arch).
- The `install.sh` script adds `~/.fetchit/bin/` to your `.bashrc`.

---

## Uninstalling

```sh
# Remove the binary
rm -rf ~/.fetchit

# Remove the PATH line from ~/.zshrc, ~/.bashrc, or ~/.config/fish/config.fish

# If installed via npm
npm uninstall -g @vedant1521/fetchit
```
