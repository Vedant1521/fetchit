# Troubleshooting

Common problems and how to fix them. If your issue isn't here, check the
[GitHub issues](https://github.com/Vedant1521/fetchit/issues) or open a
new one.

---

## "Could not download yt-dlp (status)"

**What it means:** fetchit couldn't download the yt-dlp binary on first
run. Usually a network issue.

**Fix:**
1. Check your internet connection
2. Make sure you can reach github.com (fetchit downloads from GitHub
   releases)
3. If you're behind a proxy or firewall, it may be blocking the download
4. If you already have yt-dlp installed on your system, fetchit uses that
   instead — so installing yt-dlp separately is a workaround

---

## "yt-dlp exited with code 1" or a yt-dlp error

**What it means:** yt-dlp ran but couldn't download the video. Common
reasons:

### The site changed its layout

yt-dlp breaks when sites (especially YouTube) update their player. The fix
is almost always to **update yt-dlp**.

**If you're using the auto-fetched binary** (fetchit downloaded it for
you):

```sh
yt-dlp -U
```

Run this in your terminal. It updates the binary at `~/.fetchit/bin/yt-dlp`
(or `yt-dlp.exe` on Windows). Then try fetchit again.

**If you have yt-dlp installed system-wide**, update it through your
package manager (pip, brew, etc.):
```sh
pip install -U yt-dlp
# or
brew upgrade yt-dlp
```

### The url is private or geo-blocked

- Private videos need authentication (fetchit doesn't support this yet)
- Some videos are blocked in your region — try a VPN or a different url

### The url is invalid

Double-check the url. fetchit validates that it looks like a url, but it
can't know if the video actually exists until yt-dlp tries it.

---

## "no format matching '1080p'"

**What it means:** You asked for a specific resolution (like `1080p`) in
scriptable mode, but the video doesn't have that resolution.

**Fix:**
1. Run without a quality to see what's available:
   ```sh
   fetchit https://youtu.be/…
   ```
2. Pick one of the listed resolutions from the picker
3. Or use `--best` to get the highest available:
   ```sh
   fetchit --best https://youtu.be/…
   ```

---

## "unknown quality 'hd'"

**What it means:** You passed a quality fetchit doesn't recognize.

**Valid qualities are:**
- Resolutions: `144p`, `240p`, `360p`, `480p`, `720p`, `1080p`, `1440p`,
  `2160p`
- Audio: `mp3`, `audio`

`hd`, `4k`, `ultra`, `high`, `low`, etc. are not accepted — use the exact
resolution number.

---

## "--best and --mp3 can't be combined"

**What it means:** You passed both `--best` and `--mp3`. They're
mutually exclusive — `--best` downloads video, `--mp3` downloads audio.

**Fix:** Pick one:
```sh
fetchit --best https://youtu.be/…    # video
fetchit --mp3 https://youtu.be/…     # audio only
```

---

## "not a valid url — paste a full link"

**What it means:** What you typed doesn't look like a web url. fetchit
needs a full url starting with `http://` or `https://`.

**Fix:** Copy the full url from your browser's address bar, including the
`https://` part. Example:
```
✗ youtube.com/watch?v=abc
✓ https://youtube.com/watch?v=abc
```

---

## Downloads are slow

**Possible causes and fixes:**

1. **High quality = big files.** 1080p+ videos are large. Try a lower
   resolution if speed matters more than quality.

2. **yt-dlp is being rate-limited.** YouTube sometimes throttles
   downloads. This is a yt-dlp limitation, not a fetchit one.

3. **Your ffmpeg is slow or missing.** Merging video+audio needs ffmpeg.
   fetchit tries your system ffmpeg first, then falls back to a bundled
   one. If neither works, downloads that need merging will fail (see
   below).

---

## ffmpeg issues

fetchit needs ffmpeg to:
- Merge separate video and audio streams (most 720p+ YouTube videos)
- Extract mp3 audio

If ffmpeg is missing or broken, you might see merge errors or mp3
extraction failures.

**Check if ffmpeg is installed:**
```sh
ffmpeg -version
```

**Install ffmpeg if needed:**
- **macOS:** `brew install ffmpeg`
- **Linux (Ubuntu/Debian):** `sudo apt install ffmpeg`
- **Windows:** download from [ffmpeg.org](https://ffmpeg.org/download.html)
  or `winget install ffmpeg`

If you don't install ffmpeg, fetchit uses a bundled fallback
(`ffmpeg-static`). This works for most cases but may be slower or missing
on unusual platforms.

---

## The terminal looks weird after quitting

**What it means:** fetchit takes over the full screen using an alternate
terminal buffer. If it crashes or you kill it hard (`kill -9`), the
terminal might not restore properly.

**Fix:**
- Press `[Ctrl+C]` a couple times, then run `reset` (Linux/macOS) or close
  and reopen your terminal
- fetchit registers cleanup handlers for normal exits and crashes, so this
  should be rare

---

## Clipboard detection doesn't work

**What it means:** fetchit doesn't offer to paste a url from your
clipboard.

**Possible causes:**
1. **Not a TTY.** Clipboard detection only runs when stdout is a terminal
   (so it doesn't fire in scripts or pipes — that's correct behavior).
2. **Clipboard tool missing.** fetchit uses:
   - **macOS:** `pbpaste` (built-in)
   - **Windows:** PowerShell `Get-Clipboard` (built-in)
   - **Linux:** `wl-paste` (Wayland), `xclip`, or `xsel` (X11)

   On Linux, install one of these if you don't have it:
   ```sh
   sudo apt install xclip    # or xsel
   ```
3. **Clipboard has multi-line content.** fetchit ignores clipboard
   content with spaces or newlines (new URL() silently strips them, which
   would cause confusing errors).

---

## History isn't being saved

fetchit saves your last 50 urls to `~/.config/fetchit/history.json`. If
this isn't working:

1. Check the folder exists and is writable:
   ```sh
   ls ~/.config/fetchit/
   ```
2. If the file is corrupt, delete it — fetchit recreates it on the next
   download:
   ```sh
   rm ~/.config/fetchit/history.json
   ```
3. History is a nicety — if it can't be saved (permissions, disk full),
   fetchit silently moves on. It never blocks a download.

---

## Mouse clicks aren't working

**Possible causes:**
1. **Your terminal doesn't support mouse reporting.** fetchit uses
   SGR mouse mode (`?1006h`). Most modern terminals support it, but some
   don't.
2. **You're in a multiplexer.** tmux and screen sometimes intercept mouse
   events. Try running fetchit outside of them.
3. **Not a TTY.** Mouse only works when stdin is a terminal.

Mouse is a bonus feature — the keyboard always works. See [Interactive
Mode](./interactive-mode.md) for the full keyboard reference.

---

## No chapters visible in the downloaded video

**Two possible causes:**

### 1. The video has no chapters on YouTube

`--chapters` only embeds chapter markers the creator set. If the video has
no segments on the YouTube progress bar or in the description, there's
nothing to embed — the file downloads normally with no chapters.

**Check before downloading:**
```sh
yt-dlp --dump-json --no-playlist "URL" | jq '.chapters'
```
`null` = no chapters. A list = you're good.

### 2. Your video player doesn't support mp4 chapters

**Windows Media Player does not** read mp4 chapter metadata. Use one of
these instead:

| Player | Where to find chapters |
| --- | --- |
| **VLC** (recommended) | Right-click → Playback → Chapter |
| **mpv** | Press `!` |
| **macOS QuickTime** | View → Chapters |
| **MPC-HC** | Play → Chapters |

Install VLC if you don't have it: `winget install VideoLAN.VLC`.

---

## Updating fetchit

```sh
npm update -g @vedant1521/fetchit
```

Or install a specific version:
```sh
npm install -g @vedant1521/fetchit@latest
```

Check your version:
```sh
fetchit --version
```

---

## Updating yt-dlp (the download engine)

yt-dlp updates frequently (sometimes weekly) because sites keep changing.
If downloads start failing, **update yt-dlp first** — that fixes it 90%
of the time.

**If fetchit downloaded yt-dlp for you** (most users):
```sh
yt-dlp -U
```

**If you installed yt-dlp yourself:**
```sh
pip install -U yt-dlp
# or
brew upgrade yt-dlp
```

fetchit uses your system yt-dlp if you have one, otherwise the
auto-fetched one at `~/.fetchit/bin/yt-dlp`.

---

## Still stuck?

- [Open a GitHub issue](https://github.com/Vedant1521/fetchit/issues) —
  include the url, the command you ran, and the error message
- Check if someone already reported the same issue
- A fair-use reminder: only download what you have the right to keep

---

## What's next?

- [Getting Started](./getting-started.md) — basics if you're new
- [Interactive Mode](./interactive-mode.md) — keyboard and mouse reference
- [Scriptable Mode](./scriptable-mode.md) — automation and scripting
- [Playlists](./playlists.md) — multi-video downloads
