<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img src="assets/logo-light.svg" alt="fetchit" width="520">
  </picture>

  <h3>grab any video. paste. fetch. done.</h3>

  <p>one tool. every site. your terminal. — 2000+ supported</p>

  <p>
    <a href="https://www.npmjs.com/package/@vedant1521/fetchit"><img src="https://img.shields.io/npm/v/@vedant1521/fetchit?style=flat-square&logo=npm&label=npm" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@vedant1521/fetchit"><img src="https://img.shields.io/npm/dt/@vedant1521/fetchit?style=flat-square&logo=npm" alt="npm downloads"></a>
    <a href="https://github.com/Vedant1521/fetchit/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license"></a>
    <img src="https://img.shields.io/badge/node-%E2%89%A518-green?style=flat-square&logo=node.js&logoColor=white" alt="node">
    <img src="https://img.shields.io/badge/platforms-win%20%7C%20mac%20%7C%20linux-lightgrey?style=flat-square" alt="platforms">
    <img src="https://img.shields.io/badge/built%20with-Ink%20%2B%20React-ff69b4?style=flat-square" alt="built with">
  </p>
</div>

---

Download videos from **YouTube, X/Twitter, Instagram, Threads, TikTok** and
1,800+ other sites — right from your terminal. Paste a url, pick a
resolution (or audio-only mp3), done. No popups, no fake download buttons,
no sketchy redirects.

<div align="center">
  <img src="assets/home.jpg" alt="fetchit home screen — paste a link and hit fetchit" width="90%">
</div>

## ✨ Features

- **one command, every site** — a single `fetchit <url>` covers anything
  yt-dlp understands (2,000+ extractors). YouTube, X, Instagram, Threads,
  TikTok, Vimeo, Twitch, Reddit, Facebook and more are recognized by host
  and labeled in the UI.
- **pick a resolution, see the size first** — the format list shows each
  option with an estimated file size computed from the real format
  metadata, so you know whether 1080p is a 50 MB or a 500 MB download
  before you hit enter. Resolutions are capped at 8 entries to keep the
  picker tidy.
- **audio-only mp3** — extract the audio track at best quality
  (`--audio-quality 0`) with one option, no extra flags.
- **honest sizes** — the format_id you sized the label from is the
  exact one downloaded, so the label never lies. If a cached media url
  has expired and yt-dlp re-extracts, a height-bounded fallback selector
  keeps the download from escaping your cap (no surprise 4K pulls).
- **full-screen TUI** — takes over the terminal, centers everything,
  and restores your scrollback on exit. Resizes live with the window.
- **mouse + keyboard** — click the fetchit button, the format list, the
  footer hints, or the logo (takes you home). Or drive it entirely from
  the keyboard with readline-style editing.
- **three themes** — `auto` follows your terminal's own colors (light
  or dark), or force `light` / `dark`. Cycle live with `^t`.
- **clipboard-aware** — launch bare and fetchit notices when your
  clipboard already holds a link; `⇥` pastes it, `↵` fetches it.
- **url history** — last 50 links are recalled with `↑` / `↓` and
  stored at `~/.config/fetchit/history.json`.
- **zero Python, zero manual setup** — the standalone yt-dlp binary is
  fetched on first run; ffmpeg is found on your PATH with a bundled
  fallback. Nothing else to install.

## 📺 Supported platforms

Fetchit labels the source automatically from the url host. Anything not
listed below still works — it just shows as the bare hostname.

| Host | Label |
| --- | --- |
| `youtube.com`, `youtu.be`, `music.youtube.com` | YouTube |
| `x.com`, `twitter.com` | X / Twitter |
| `instagram.com` | Instagram |
| `threads.net`, `threads.com` | Threads |
| `tiktok.com` | TikTok |
| `vimeo.com` | Vimeo |
| `twitch.tv` | Twitch |
| `reddit.com` | Reddit |
| `facebook.com`, `fb.watch` | Facebook |
| _…and 1,800+ more via yt-dlp_ | _your hostname_ |

## Install

```sh
npm install -g @vedant1521/fetchit
```

Or try it without installing anything:

```sh
npx @vedant1521/fetchit
```

Requires Node 18+. Everything else (yt-dlp, ffmpeg) is fetched or bundled
automatically.

## Usage

```sh
$ fetchit https://youtu.be/dQw4w9WgXcQ    # straight to the format picker
$ fetchit                                 # prompts for a url
$ fetchit --theme light                   # force the light palette
```

fetchit takes over the terminal (full-screen, centered — and restores your
scrollback on exit). Pick a format with `↑`/`↓` (or `j`/`k`, or number keys)
and hit enter. `esc` goes back, `^c` quits. Or just use the mouse — the
fetchit button, the format list and the footer hints are all clickable, and
clicking the logo takes you back home. Files are saved to `~/Downloads`,
and the file path is printed to your terminal when you're done.

<div align="center">
  <img src="assets/download-options.jpg" alt="fetchit format picker — resolutions with estimated file sizes, plus audio-only mp3" width="90%">
</div>

### Options

| Flag | Description |
| --- | --- |
| `[url]` | a video link to fetch immediately; skipped if omitted |
| `--theme <mode>` | start in `auto`, `light`, or `dark` for this run |
| `--theme=<mode>` | equals form, useful after the url |
| `-h`, `--help` | show help |
| `-v`, `--version` | show version |

## ⌨️ Keyboard reference

| Key | Action |
| --- | --- |
| `↵` | fetchit (from the url field or the format picker) |
| `↑` / `↓` | choose a format, or recall url history in the input |
| `esc` | back / cancel the current probe or download |
| `^c` | quit |
| `^t` | cycle theme: `auto` → `light` → `dark` → `auto` |
| `⇥` | paste a link detected in your clipboard |

The url field is a full readline-style editor:

| Key | Action |
| --- | --- |
| `^a` / `^e` | jump to start / end |
| `⌥←` / `⌥→` (or `⌥b` / `⌥f`) | jump back / forward one word |
| `⌥⌫` / `^w` | delete one word back |
| `^u` / `^k` | delete to start / end of line |
| `⇧←` / `⇧→` | extend the selection |
| `⌫` / `delete` | delete one char back / forward |

Pasting a full url into an empty field submits it automatically.

## 🖱️ Mouse

While fetchit is running, left-button presses are reported (your
terminal's native text selection needs a modifier key — option or shift).
Clickable regions: the **fetchit** button, every format row, each footer
hint, the theme control, and the **logo** (click to go home / cancel).

## 🎨 Themes

The default `auto` theme uses your terminal's own foreground and
background, so it follows light and dark terminal themes without guessing.
Press `^t` or click the theme control in the footer to cycle through
`auto`, `light`, and `dark` for the current session. Use `--theme auto`,
`--theme light`, or `--theme dark` to choose the starting theme for one
launch.

## How it works

- Powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp). On first run,
  fetchit downloads the standalone yt-dlp binary to `~/.fetchit/bin` —
  no Python required. If you already have yt-dlp installed, it uses yours.
- ffmpeg (needed for merging high-res streams and mp3 extraction) is found
  on your PATH, with `ffmpeg-static` as a bundled fallback.
- The probe step caches yt-dlp's `-J` metadata to a temp file so the
  download starts immediately via `--load-info-json` instead of
  re-extracting. If a cached media url has expired, fetchit transparently
  retries with a fresh extraction.
- The UI is [Ink](https://github.com/vadimdemedes/ink) — React for the
  terminal.

## 🛠️ Tech stack

| Layer | Choice |
| --- | --- |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict) |
| TUI framework | [Ink](https://github.com/vadimdemedes/ink) — React in the terminal |
| UI runtime | [React 19](https://react.dev/) |
| Download engine | [yt-dlp](https://github.com/yt-dlp/yt-dlp) (standalone binary, auto-fetched) |
| Media processing | [ffmpeg](https://ffmpeg.org/) via [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) fallback |
| Bundler | [tsup](https://tsup.etsy.com/) (esm, node18 target) |
| Test runner | Node's built-in `node:test` + `node:assert` |
| Package manager | npm |

## Development

```sh
npm install
npm run build        # bundle to dist/ with tsup
npm run dev          # rebuild on change
node dist/cli.js <url>
npm run typecheck    # tsc --noEmit
npm test             # tsx --test src/**/*.test.ts
```

To try it as a global command without publishing: `npm link`, then run
`fetchit` anywhere.

## Roadmap

- [ ] `--best` / `--mp3` flags to skip the picker (scriptable mode)
- [ ] `-o <dir>` to choose the output folder
- [ ] Playlist / thread-with-multiple-videos support
- [ ] Clipboard detection: launch bare and auto-suggest the url you copied
- [ ] Self-update for the bundled yt-dlp binary (`yt-dlp -U`)
- [x] Publish to npm (`npm i -g @vedant1521/fetchit` / `npx @vedant1521/fetchit`)
- [ ] `curl fetchit.sh | sh` installer

## A note on fair use

fetchit is a personal-archiving tool. Downloading content may violate a
platform's terms of service — only download what you have the right to
keep, and be excellent to creators.

## License

[MIT](LICENSE) © Vedant Gupta
