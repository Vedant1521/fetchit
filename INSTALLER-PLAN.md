# Standalone Binary + curl Installer — Implementation Plan

## Why

Currently fetchit requires Node.js 18+. The target audience (people who want to
download a video) often does not have Node.js. A standalone binary removes that
barrier and triples the addressable audience.

## Phase 1 — Shell Installer (ship this week)

A `curl fetchit.sh | sh` script that works today, no binary build required.

### How it works

```
curl -fsSL https://fetchit.sh | sh
```

The script:
1. Detects OS (linux/macos/windows)
2. Checks if Node.js 18+ exists
   - If yes: runs `npm install -g @vedant1521/fetchit`
   - If no: prints a one-line install guide for the platform
     (Windows: winget install OpenJS.NodeJS.LTS, macOS: brew install node,
      Linux: apt install nodejs or nvm)
3. Also downloads the yt-dlp binary to `~/.fetchit/bin/` so first-run setup
   is skipped — user can run `fetchit` immediately after install

### Files to create

- `install.sh` — POSIX shell script (works on macOS + Linux)
- `install.ps1` — PowerShell script for Windows
- DNS/hosting for `fetchit.sh` → redirect to raw script on GitHub, or
  serve from GitHub Pages

### Delivery

Landing page at fetchit.sh (even a one-page site) with the curl command.
The script lives at `https://raw.githubusercontent.com/Vedant1521/fetchit/main/install.sh`.

---

## Phase 2 — Standalone Binary (next 1-2 weeks)

Bundle fetchit into a single binary that needs no runtime.

### Option A: Node SEA (Single Executable Application) — preferred

Node 20.11+ has built-in SEA support. It creates a binary by concatenating the
Node.js runtime with a prepared blob of the bundled code.

**Steps:**

1. Build the ESM bundle as usual (`tsup` → `dist/cli.js`)
2. Create a `sea-config.json`:
   ```json
   {
     "main": "dist/cli.js",
     "output": "dist/sea.blob",
     "disableExperimentalSEAWarning": true
   }
   ```
3. Generate the blob:
   ```
   node --experimental-sea-config sea-config.json
   ```
4. Copy the Node.js binary as a base:
   ```
   cp $(which node) dist/fetchit
   ```
5. Inject the blob into the binary:
   ```
   npx postject dist/fetchit NODE_SEA_BLOB dist/sea.blob \
     --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
   ```
6. Sign the binary (macOS codesign, Windows signtool)

**Result:** A single `fetchit` binary for each platform.

**Caveats:**
- SEA is experimental (but stable enough for CLI tools)
- Ink's dynamic rendering may have issues with the frozen snapshot — needs
  testing
- The binary includes the full Node.js runtime (~40-60 MB per platform)
- Must build on each target platform (or cross-compile via CI matrix)

### Option B: Bun `--compile` — simpler, experimental

Bun can compile a TypeScript entry point into a standalone binary:

```
bun build --compile --target=binary src/cli.tsx --outfile dist/fetchit
```

**Pros:** One command, no config, smaller binaries (~30 MB), works cross-platform
**Cons:** Replaces Node.js runtime with Bun's JS engine — Ink/React behavior
  may differ. Lock-in to Bun as build dependency.

### Option C: pkg (Vercel) — legacy, well-known

```
npm install -g pkg
pkg dist/cli.js --targets node18-win-x64,node18-macos-x64,node18-linux-x64
```

**Pros:** Battle-tested, many CLI tools use it, cross-compile from one machine
**Cons:** Known issues with ESM (fetchit uses `"type": "module"`). Poor
  Ink/React support in frozen snapshots.

### Recommendation

Start with **Node SEA** for the official build. It uses the same runtime fetchit
already targets, so behavior is identical. Use GitHub Actions matrix builds
(ubuntu-latest, macos-latest, windows-latest) to generate all three platform
binaries.

Fall back to **Bun compile** if SEA has issues with Ink's async rendering.

---

## Phase 3 — Package Managers (week 3+)

Once the standalone binary exists, submit to:

| Manager | How | Effort |
|---------|-----|--------|
| **Homebrew** | Create a formula in `Vedant1521/homebrew-fetchit` tap, then submit to `homebrew-core` | Medium |
| **Scoop** | Add a bucket or submit to `main` bucket | Low |
| **winget** | PR to `microsoft/winget-pkgs` with manifest | Low |
| **npm** | Already done | Done |

Each package manager installation is a new vector for `fetchit` to appear in
search results and `brew install` / `winget install` suggestions.

---

## Phase 4 — CI/CD Automation

### GitHub Actions workflow: Build + Release

```yaml
# .github/workflows/release.yml
on:
  push:
    tags: v*

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: {node-version: 22}
      - run: npm ci
      - run: npm run build
      - run: npm test

      # SEA binary generation
      - run: node --experimental-sea-config sea-config.json
      - run: cp "$(which node)" dist/fetchit
      - run: npx postject dist/fetchit NODE_SEA_BLOB dist/sea.blob ...

      # Upload per-platform binary
      - uses: actions/upload-artifact@v4
        with:
          name: fetchit-${{ matrix.os }}
          path: dist/fetchit*

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - download all platform binaries
      - create GitHub Release with changelog + binary attachments
```

Then the `install.sh` script downloads the right binary from the latest
GitHub Release based on `uname -s` and `uname -m`.

---

## Architecture Diagram

```
User runs:
  curl https://fetchit.sh | sh

install.sh:
  ├─ Detect OS + arch
  ├─ Check for Node.js
  │   ├─ Yes → npm install -g @vedant1521/fetchit
  │   └─ No  → download standalone binary from GitHub Releases
  ├─ Download yt-dlp to ~/.fetchit/bin/
  ├─ Add fetchit to PATH (shell rc file)
  └─ Print ✓ ready

Standalone binary (SEA):
  ├─ Contains: Node.js runtime + bundled cli.js
  ├─ On first run: downloads yt-dlp to ~/.fetchit/bin/
  ├─ On every run: uses yt-dlp, ffmpeg
  └─ Behavior identical to npm-installed version
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| SEA binary is 40-60 MB | Acceptable for CLI tools (yt-dlp is ~30 MB alone). Compress with UPX if needed |
| Ink rendering breaks in frozen snapshot | Fall back to Bun compile. Test thoroughly in CI |
| Windows code signing | Use Azure Key Vault + `signtool` in CI, or accept SmartScreen warnings initially |
| macOS notarization | Use `gon` tool in CI or distribute unsigned (users can right-click → open) |
| ES modules + SEA compatibility | Keep build config as ESM. Test against Node 22 |
| SEA still experimental | Pin to Node 22 LTS. By the time Node 18 is EOL, SEA will be stable |

---

## First Step (can ship today)

Create `install.sh` that works with npm. Even without a standalone binary,
this helps users who have Node.js but don't know npm:

```sh
#!/bin/sh
# fetchit installer — https://fetchit.sh
set -eu

has_command() { command -v "$1" >/dev/null 2>&1; }

if has_command node && [ "$(node --version | cut -d. -f1 | tr -d v)" -ge 18 ]; then
  echo "✓ Node.js $(node --version) found"
  npm install -g @vedant1521/fetchit
  echo "✓ fetchit installed — run 'fetchit' to start"
else
  echo "fetchit needs Node.js 18+"
  case "$(uname -s)" in
    Darwin) echo "  brew install node" ;;
    Linux)  echo "  apt install nodejs  or  https://nodejs.org" ;;
    *)      echo "  https://nodejs.org" ;;
  esac
fi
```

This alone makes `curl https://fetchit.sh | sh` work and gives a clear path
for users without Node.js.
