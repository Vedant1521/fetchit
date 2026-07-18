# Interactive Mode

This guide covers everything you can do in fetchit's full-screen interface —
keyboard shortcuts, mouse clicks, themes, clipboard detection, and url
history. If you're running `fetchit` or `fetchit <url>` without `--best` or
`--mp3`, you're in interactive mode.

---

## The interface at a glance

When you launch fetchit, it takes over your terminal with a centered,
full-screen layout:

```
        ██████╗ ██████╗ ███████╗██████╗ ██╗  ██╗██╗████████╗
        ██╔══██╗██╔══██╗██╔════╝██╔════╝██║  ██║██║╚══██╔══╝
        ██████╔╝██████╔╝█████╗  ██║     ███████║██║   ██║
        ██╔═══╝ ██╔══██╗██╔══╝  ██║     ██╔══██║██║   ██║
        ██║     ██║  ██║███████╗╚██████╗██║  ██║██║   ██║
        ╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝

            grab any video. paste. fetch. done.
       one tool. every site. your terminal. — 2000+ supported

      ╭─ Paste a link ───────────────────────────╮
      │ ❯ https://youtube.com/watch?v=…          │
      ╰──────────────────────────────────── fetchit

         [Enter] fetchit  ·  [Ctrl+C] quit  ·  [Ctrl+T] theme:auto
```

The footer at the bottom always shows the keys you can press right now.
It changes depending on what phase you're in.

---

## The phases

fetchit moves through these phases each time you use it:

### 1. Input — paste a url

Type or paste a link, then press **[Enter]**. If fetchit sees a url in your
clipboard, it tells you and offers to paste it with **[Tab]**.

If you type something that isn't a url, you'll see:
```
not a valid url — paste a full link, e.g. https://youtu.be/…
```
Just try again.

### 2. Probing — fetching video info

fetchit contacts the site and reads what formats are available. You'll see
a spinner with a status message like "fetching video info…". On the first
run ever, it also downloads the yt-dlp binary here.

Press **[Esc]** to cancel and go back to the input.

### 3. Picking — choose a format

A list of resolutions appears (1080p, 720p, 360p, …) plus an audio-only
mp3 option. Each row shows an estimated file size — this is the real size
computed from the video's metadata, so you know what you're getting before
you commit.

- **[↑] / [↓]** — move the highlight
- **[Enter]** — download the highlighted format
- **[Esc]** — go back to the input

The list is capped at 8 resolutions to keep things tidy. The highest
quality is at the top.

### 4. Downloading — the progress bar

A progress bar fills as the file comes down. The header shows the video
title and the format you picked. For playlists, it also shows which item
is downloading (like `item 3/12`).

- **[Esc]** — cancel the download (partial files are cleaned up)
- **[Ctrl+C]** — quit fetchit entirely

When the download finishes, you move to the Done phase.

### 5. Done — your file is ready

You'll see `✓ fetched!` and the path where your file was saved. The
terminal also prints the path after fetchit exits, so you can copy it.

- **[Enter]** — fetchit another video
- **[Esc]** — back to the input
- **[Ctrl+C]** — quit

### 6. Error — something went wrong

If the download fails (bad url, site changed, network issue), you'll see
the error message in red.

- **[Enter]** — try again
- **[Esc]** — back to the input
- **[Ctrl+C]** — quit

---

## Keyboard shortcuts

### Global keys (work in every phase)

| Key | What it does |
| --- | --- |
| `[Ctrl+C]` | Quit fetchit entirely |
| `[Ctrl+T]` | Cycle theme: auto → light → dark → auto |

### Phase-specific keys

| Phase | Key | What it does |
| --- | --- | --- |
| Input | `[Enter]` | Start fetching the url |
| Input | `[Tab]` | Paste a url from your clipboard |
| Input | `[↑]` | Recall a url from history |
| Input | `[↓]` | Move forward through history |
| Input | `[U]` | Update the bundled yt-dlp binary |
| Probing | `[Esc]` | Cancel, go back to input |
| Picking | `[↑]` / `[↓]` | Move the highlight |
| Picking | `[Enter]` | Download the highlighted format |
| Picking | `[C]` | Toggle chapter embedding on/off |
| Picking | `[T]` | Edit a time range (download just a clip) |
| Picking | `[U]` | Update the bundled yt-dlp binary |
| Picking | `[Esc]` | Go back to input |
| Playlist | `[↑]` / `[↓]` | Move through the video list |
| Playlist | `[Space]` | Toggle a video on/off |
| Playlist | `[Enter]` | Confirm and proceed |
| Playlist | `[Esc]` | Go back to input |
| Downloading | `[Esc]` | Cancel the download |
| Done | `[Enter]` | Fetchit another video |
| Done | `[Esc]` | Back to input |
| Error | `[Enter]` | Try again |
| Error | `[Esc]` | Back to input |

---

## The url field is a full editor

When you're typing a url, you have readline-style editing keys (same as
your shell). These make fixing a long url painless:

| Key | What it does |
| --- | --- |
| `[Ctrl+A]` | Jump to the start of the line |
| `[Ctrl+E]` | Jump to the end of the line |
| `[Alt+←]` or `[Alt+B]` | Jump back one word |
| `[Alt+→]` or `[Alt+F]` | Jump forward one word |
| `[Alt+Backspace]` | Delete one word back |
| `[Ctrl+W]` | Delete one word back (alternative) |
| `[Ctrl+U]` | Delete from cursor to start of line |
| `[Ctrl+K]` | Delete from cursor to end of line |
| `[Shift+←]` / `[Shift+→]` | Select text |
| `[Backspace]` | Delete one character back |
| `[Delete]` | Delete one character forward |
| `[Esc]` | Clear the selection |

**Bonus:** if you paste a full url into an empty field, fetchit submits it
automatically — no need to press Enter.

---

## Mouse support

fetchit supports mouse clicks. While it's running, you can click:

- The **fetchit button** — starts the download (same as `[Enter]`)
- Any **format row** in the picker — downloads that format
- Any **footer hint** — triggers that action (click `[Ctrl+T]` to change
  theme, click `[Esc]` to go back, etc.)
- The **logo** — takes you home (back to the input, or cancels a probe)

Note: while fetchit is running, your terminal's normal text selection needs
a modifier key (Option or Shift). This is the trade-off for receiving
clicks at all.

---

## Themes

fetchit has three themes:

- **auto** (default) — uses your terminal's own colors. Works on both
  light and dark terminal backgrounds without guessing.
- **light** — a fixed light palette (dark text on a white background)
- **dark** — a fixed dark palette (light text on a dark background)

### Switch theme mid-session

Press **[Ctrl+T]** any time to cycle: auto → light → dark → auto. The
footer shows the current theme: `theme:auto`, `theme:light`, or
`theme:dark`.

You can also click the `[Ctrl+T]` hint in the footer with your mouse.

### Set the starting theme

Use `--theme` when you launch:

```sh
fetchit --theme dark
fetchit --theme light https://youtu.be/…
fetchit https://youtu.be/… --theme=light
```

The theme resets to `auto` on the next launch unless you pass `--theme`
again.

---

## Clipboard detection

When you launch fetchit without a url, it checks your clipboard. If you
already have a video link copied, fetchit tells you:

```
link in your clipboard — [Tab] to paste it
```

Press **[Tab]** to drop it into the url field, then **[Enter]** to go.

Once you've pasted (or if you typed a url that matches the clipboard),
you'll see:

```
from your clipboard — [Enter] to fetch it
```

Multi-line clipboard content is ignored (new URL() silently strips
newlines, so we reject it to be safe).

---

## Chapters & time ranges (in the picker)

When you're at the format picker (after probing a video), two extra keys
let you customize the download:

### `[C]` — toggle chapter embedding

Press `[C]` to toggle chapter embedding on or off. When on, fetchit passes
`--embed-chapters` to yt-dlp, which writes YouTube's chapter markers into
the output file as metadata. Your video player will show them as jump
points (just like on YouTube).

A status line under the video title shows the current state:
```
chapters: on
```

Chapters require ffmpeg (fetchit bundles a fallback). They add a tiny
amount of metadata — no meaningful size increase.

#### Which players support chapters

Not every video player reads mp4 chapter metadata. Use one of these:

| Player | Where to find chapters |
| --- | --- |
| **VLC** (recommended) | Right-click the video → Playback → Chapter |
| **mpv** | Press `!` to list chapters |
| **macOS QuickTime** | View → Chapters |
| **MPC-HC** | Play → Chapters |

**Windows Media Player does not support mp4 chapters** — use VLC instead.

#### The video must have chapters on YouTube

`--embed-chapters` only embeds chapters the creator set on YouTube. If the
video has no chapter markers (no segments on the progress bar or in the
description on YouTube's website), `--chapters` has nothing to embed and
the file downloads normally with no effect.

To check before downloading:
```sh
yt-dlp --dump-json --no-playlist "URL" | jq '.chapters'
```
If it prints `null`, the video has no chapters. If it prints a list, you're
good.

### `[T]` — download a time range

Press `[T]` to enter a time range and download just a clip. An input
appears:
```
time range — start-end (e.g. 5:30-10:15), or empty to clear:
❯ 5:30-10:15
```

Type `start-end` using `MM:SS` or `HH:MM:SS` format, then press `[Enter]`.
Examples:
- `5:30-10:15` — from 5:30 to 10:15
- `1:00:00-1:30:00` — from 1h to 1h30m
- `5:30-` — from 5:30 to the end
- `-10:15` — from the start to 10:15
- (empty) — clear the range, download the full video

The status line shows the current range:
```
range: 0:05:30–0:10:15
```

Press `[Esc]` to cancel the time input without changing the range.

**Note:** time-range downloads use yt-dlp's `--download-sections` and need
a system ffmpeg. The bundled ffmpeg-static fallback may not support section
splitting on all platforms — install ffmpeg separately if you hit errors.

### Combining both

You can enable chapters and set a time range at the same time. The status
line shows both:
```
chapters: on · range: 0:05:30–0:10:15
```

Both apply to the download when you pick a format and press `[Enter]`.

---

## Updating yt-dlp from inside the TUI

yt-dlp updates frequently because video sites keep changing. If downloads
start failing, press `[U]` from any non-busy phase (input, picking,
playlist, done, or error) to update the bundled yt-dlp binary without
leaving fetchit.

You'll see an inline status:
```
⠼ updating yt-dlp 2026.07.04…
```

When it's done:
```
✓ yt-dlp updated to 2026.07.05
```

The update runs in the background — you can keep using fetchit while it
works. If you have a system yt-dlp install (on PATH), fetchit shows an
error telling you to update via your package manager instead.

You can also click the `[U] update` hint in the footer with your mouse.

---

## URL history

fetchit remembers the last 50 urls you've downloaded. The history lives at:

- **macOS / Linux:** `~/.config/fetchit/history.json`
- **Windows:** `C:\Users\<you>\.config\fetchit\history.json`

### Recall a past url

In the input phase, press **[↑]** to step back through your history. Each
press shows an older url. Press **[↓]** to move forward. When you find the
one you want, press **[Enter]**.

The history is newest-first and deduped — downloading the same url twice
moves it to the top, not added twice.

---

## What's next?

- [Scriptable Mode](./scriptable-mode.md) — skip the picker for scripts
- [Playlists](./playlists.md) — download multiple videos at once
- [Troubleshooting](./troubleshooting.md) — fix common errors
