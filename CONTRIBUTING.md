# Contributing

Thanks for considering contributing to fetchit. This document covers the practical stuff so you can jump in without guessing.

## Quick start

```sh
git clone https://github.com/Vedant1521/fetchit.git
cd fetchit
npm install
npm run build
npm test
node dist/cli.js
```

## Project structure

```
src/
  cli.tsx             # entry point — arg parsing, TUI bootstrap
  app.tsx             # main TUI component (all phases, state, key handlers)
  lib/
    ytdlp.ts          # download engine (probe, download, playlist, chapters)
    args.ts           # CLI arg parser
    clipboard.ts      # cross-platform clipboard (sync + async)
    platforms.ts      # site detection, URL validation
    history.ts        # URL history persistence
    format.ts         # formatting utilities
    click-map.ts      # frame capture for mouse hit-testing
    use-mouse-click.ts  # SGR mouse event hook
  components/
    text-input.tsx    # text input with history and paste detection
    multi-select.tsx  # checkbox list component
    logo.tsx          # animated ASCII logo
    fullscreen.tsx    # full-screen wrapper
  theme.ts            # auto/light/dark theme system
docs/                 # user-facing documentation
dist/                 # build output (gitignored)
assets/               # images, demo GIFs
```

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Build with tsup → `dist/cli.js` |
| `npm run build:binary` | Build standalone binary (requires Bun) → `dist/fetchit` |
| `npm run typecheck` | `tsc --noEmit` (strict mode) |
| `npm test` | Run all tests (`tsx --test src/**/*.test.ts`) |
| `node dist/cli.js <url>` | Run locally |

## Code conventions

- **No semicolons.** The codebase doesn't use them. Keep it consistent.
- **No commented-out code.** Delete it. Git history has the original.
- **No em dashes (—) in user-facing text.** Use commas, colons, or new sentences.
- **No AI-generated contributions.** PRs that look like ChatGPT output will be closed without review. Write your own code.
- **TypeScript strict mode.** No `any`, no `@ts-ignore`, no `as` casts unless absolutely necessary with a comment explaining why.
- **Test your changes.** `npm test` must pass. Add tests for new functionality.
- **Keep the bundle small.** `dist/cli.js` is ~93 KB. Think before adding dependencies.

## Pull request process

1. Open an issue first if it is a new feature or a non-trivial change. Bug fixes can go straight to a PR.
2. Fork the repo, create a branch from `main`.
3. Make your changes. Keep them focused — one PR should do one thing.
4. Run `npm run typecheck && npm test && npm run build`. All three must pass.
5. Push and open the PR. Write a clear description of what changed and why.

## Automated CI/CD

fetchit uses GitHub Actions for continuous integration and delivery. All workflow
files live in `.github/workflows/`.

### CI (Continuous Integration) — `.github/workflows/ci.yml`

**Triggered on:** every push to `main` and every pull request targeting `main`.

The workflow runs a single `check` job on an Ubuntu runner:

1. `npm ci` — installs dependencies from `package-lock.json` (exact versions)
2. `npm run typecheck` — TypeScript strict mode check (`tsc --noEmit`)
3. `npm test` — runs all tests via Node's built-in test runner
4. `npm run build` — bundles the project with tsup

**What it means for contributors:** When you open a pull request, GitHub
automatically runs these checks. A green checkmark ✅ means your changes are
safe to merge. A red ❌ means something failed — click "Details" on the PR to
see the logs.

You can also run the same checks locally before pushing:
```sh
npm run typecheck && npm test && npm run build
```

### CD (Continuous Delivery) — `.github/workflows/release.yml`

**Triggered on:** pushing a tag matching `v*` (e.g., `v0.5.0`).

This workflow has 3 jobs that run in sequence:

| Job | Runner | What it does |
|-----|--------|-------------|
| `check` | Ubuntu | Same as CI — typecheck, test, build. If this fails, the release is cancelled. |
| `build-binary` | Windows, macOS, Linux (in parallel) | Builds a standalone binary on each OS using `bun build --compile`. Each binary is uploaded as a temporary artifact. |
| `create-release` | Ubuntu | Downloads all 3 binaries, creates a GitHub Release page, attaches the binaries, and generates release notes automatically. |

The matrix strategy runs the build step on 3 OSes simultaneously using the
same `scripts/build-binary.js` script. Each runner produces one binary:

| OS | Runner | Output file |
|----|--------|------------|
| Windows | `windows-latest` | `fetchit-win-x64.exe` |
| macOS | `macos-latest` (Apple Silicon) | `fetchit-darwin-arm64` |
| Linux | `ubuntu-latest` | `fetchit-linux-x64` |

The entire workflow typically completes in ~2 minutes.

## Release process

Maintainers can publish a new release by pushing a version tag:

```sh
# 1. Ensure main is up to date and CI passes
git checkout main
git pull

# 2. Bump the version in package.json (semver)
#    Edit package.json and run `npm install` to sync package-lock.json

# 3. Commit and tag
git commit -am "v0.x.x"
git tag v0.x.x

# 4. Push — this triggers .github/workflows/release.yml
git push && git push origin v0.x.x
```

The workflow will:
1. Run typecheck, tests, and tsup build (`check` job)
2. Build standalone binaries for Windows, macOS (arm64), and Linux (`build-binary` job, matrix across 3 runners)
3. Create a GitHub Release with the binaries attached (`create-release` job)

The release binaries are published at:
`https://github.com/Vedant1521/fetchit/releases/latest/download/fetchit-<os>-<arch>`

The install scripts (`install.sh` / `install.ps1`) download from this URL automatically.

### Binary notes

- Built with `bun build --compile` — bundles Bun runtime + all deps (~100 MB)
- Windows: `fetchit-win-x64.exe`
- macOS (Apple Silicon): `fetchit-darwin-arm64` (Intel Macs can use Rosetta 2)
- Linux: `fetchit-linux-x64`

### npm publish

Standalone publish to npm (not automated):

```sh
npm run build
npm publish
```

The install scripts prefer npm if Node.js 18+ is detected, falling back to the standalone binary otherwise.

## What needs help

Check the issues tab or the roadmap in [README.md](./README.md#roadmap). In general:

- **Bug reports** with reproduction steps are very helpful
- **Test coverage** for components, error paths, and edge cases
- **Documentation** improvements, especially troubleshooting
- **Platform packages** (winget, homebrew, scoop) — package fetchit for system package managers

## Code of conduct

Be decent. Disagreement is fine, personal attacks are not. This is a small project run by one person — treat it and its users the way you would want someone to treat your project.

## Questions

Open a discussion or issue on GitHub. Please search first to see if someone already asked.
