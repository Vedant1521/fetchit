# Getting Started with fetchit

Welcome! This guide walks you through installing fetchit, running it for the
first time, and downloading your first video. No prior terminal experience
needed — we'll go step by step.

---

## What is fetchit?

fetchit is a terminal tool that downloads videos from YouTube, X (Twitter),
Instagram, Threads, TikTok, and 2,000+ other sites. You paste a link, pick
a quality (like 1080p or audio-only mp3), and fetchit saves the file to your
computer. No browser tabs, no popups, no sketchy download buttons.

It runs in your terminal (the command line), takes over the full screen
while it works, and hands control back when it's done.

---

## Step 1: Install

Pick the method that fits you.

### Quick install (no Node.js needed)

**macOS / Linux:**

```sh
curl -fsSL https://fetchit-beta.vercel.app/install.sh | sh
```

**Windows (PowerShell):**

```powershell
powershell -c "irm https://fetchit-beta.vercel.app/install.ps1 | iex"
```

The script downloads a standalone binary, puts it in `~/.fetchit/bin/`, and
adds it to your PATH. Restart your terminal, then run `fetchit`.

### Via npm (requires Node 18+)

```sh
npm install -g @vedant1521/fetchit
```

Or try it once without installing:

```sh
npx @vedant1521/fetchit
```

### What happens next

Either way, fetchit handles the rest — it downloads the yt-dlp engine on
first run and bundles ffmpeg automatically. You don't need to install
Python or anything else. See the [full install guide](./install.md) for
building from source and platform-specific notes.

---

## Step 2: Your first download

Open your terminal and run:

```sh
fetchit https://youtu.be/dQw4w9WgXcQ
```

Here's what happens:

1. **fetchit takes over your terminal.** The screen switches to a
   full-screen, centered interface. Don't worry — your terminal goes back
   to normal when fetchit finishes or you quit.

2. **It fetches video info.** You'll see a "fetching video info…" message.
   On the very first run, it also downloads the yt-dlp binary (one-time,
   ~30 seconds).

3. **You pick a format.** A list appears with resolutions (1080p, 720p,
   360p, etc.) and an audio-only mp3 option. Each shows an estimated file
   size so you know what you're getting. Use the **up and down arrow keys**
   to move, and press **Enter** to pick one.

4. **It downloads.** A progress bar fills up. When it's done, fetchit
   prints the file path (like `~/Downloads/My Video.mp4`) and exits.

5. **Your terminal comes back.** The full-screen interface closes and you
   see the path to your downloaded file.

That's a download. You just fetched a video.

---

## Step 3: Run it without a url

You don't have to paste the url when you launch. Just run:

```sh
fetchit
```

You'll get a prompt where you can type or paste a link. Even better — if
you already have a video link copied to your clipboard, fetchit notices and
shows a hint: "link in your clipboard — [Tab] to paste it." Press **Tab**
to drop it in, then **Enter** to go.

---

## Where do files go?

By default, downloads save to your **Downloads** folder:

- **Windows:** `C:\Users\<you>\Downloads`
- **macOS / Linux:** `~/Downloads`

You can change this with the `-o` flag:

```sh
fetchit --best https://youtu.be/… -o ~/Videos
```

See [Scriptable Mode](./scriptable-mode.md) for more on flags.

---

## What's next?

- [Interactive Mode](./interactive-mode.md) — every keyboard shortcut, mouse
  click, and theme option
- [Scriptable Mode](./scriptable-mode.md) — download without the picker,
  for scripts and automation
- [Playlists](./playlists.md) — download whole playlists or pick specific
  videos from them
- [Troubleshooting](./troubleshooting.md) — fix common errors

---

## Quick reference

| What you want | Command |
| --- | --- |
| Download a video (pick quality interactively) | `fetchit <url>` |
| Best quality, no picker | `fetchit --best <url>` |
| Audio-only mp3 | `fetchit --mp3 <url>` |
| Specific resolution, no picker | `fetchit <url> 1080p` |
| Save to a custom folder | `fetchit <url> -o ~/Videos` |
| Prompt for a url | `fetchit` |
| Show help | `fetchit --help` |
| Show version | `fetchit --version` |

---

Questions or hit a snag? Check [Troubleshooting](./troubleshooting.md).
