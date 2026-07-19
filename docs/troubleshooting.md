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
is almost always to **update yt-dlp** — run `fetchit update` (or press
`[U]` inside the TUI):

```sh
fetchit update
```

This updates the bundled binary at `~/.fetchit/bin/yt-dlp`. If you have
yt-dlp installed system-wide, update it through your package manager:
```sh
pip install -U yt-dlp
# or
brew upgrade yt-dlp
# or
winget upgrade yt-dlp
```

### "Sign in to confirm you're not a bot"

YouTube increasingly requires authentication to download certain videos and
playlists. If you see this error, there are **three things that could be
going on** — try them in order:

#### 1. Your IP got temporarily flagged (most common)

YouTube rate-limits IPs that download a lot in a short time. If you
downloaded several videos today, YouTube may have flagged your IP. The fix
is simple:

- **Wait 24-48 hours** — the flag resets on its own
- **Use a VPN** — connect to any VPN server (different IP) and retry; this
  works immediately
- **Use a mobile hotspot** — connect your PC to your phone's hotspot for a
  different IP

You don't need cookies for this — just a different IP.

#### 2. The video requires sign-in (cookies)

Some videos genuinely require a logged-in YouTube account to download. Pass
your browser cookies so yt-dlp authenticates as you:

```sh
fetchit --cookies-from-browser firefox https://youtube.com/…
```

**From inside the TUI:** when you see the "sign in to confirm" error, press
`[B]` — a browser picker appears. Press `1` (chrome), `2` (firefox),
`3` (edge), `4` (brave), or `5` (safari) to retry with that browser's
cookies, without leaving fetchit.

**Requirements for cookies to work:**
- You must be **logged into YouTube in that browser** (go to youtube.com,
  sign in, then close the browser)
- The browser must be **fully closed** while downloading — Windows locks
  the cookie database while the browser is running

#### 3. Windows cookie encryption (Chrome and Edge)

**Chrome 127+ and Edge on Windows encrypt their cookie databases** with
DPAPI/App-Bound Encryption. yt-dlp can't decrypt them — even when the
browser is closed. You'll see errors like:
- `Could not copy Chrome cookie database`
- `Failed to decrypt with DPAPI`

**The fix:** use **Firefox** instead. Firefox doesn't encrypt its cookies on
Windows, so yt-dlp can read them reliably.

```sh
# install Firefox if you don't have it:
winget install Mozilla.Firefox
# then log into YouTube in Firefox, close Firefox, and run:
fetchit --cookies-from-browser firefox https://youtube.com/…
```

### "Requested format is not available"

**What it means:** YouTube accepted your cookies but returned a degraded
set of formats (no video/audio, just storyboard thumbnails). This happens
when YouTube's anti-bot system partially blocks you even with cookies.

**Fix:** try a VPN (different IP) or wait 24 hours for the block to reset.
This is a YouTube-side restriction, not a fetchit or yt-dlp bug.

### The url is private or geo-blocked

- Private videos need authentication — use `--cookies-from-browser` (above)
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

## "EPERM: operation not permitted, rename" (Windows)

**What it means:** Windows Defender or your antivirus is scanning the
freshly-downloaded `yt-dlp.exe` and holding a lock on it, blocking the
file rename. This usually happens on first run or after an update.

**Fix:**
1. Close any stuck processes:
   ```sh
   taskkill /f /im yt-dlp.exe
   taskkill /f /im ffmpeg.exe
   ```
2. Delete the leftover temp files:
   ```sh
   del "C:\Users\<you>\.fetchit\bin\*.download"
   del "C:\Users\<you>\.fetchit\bin\yt-dlp.exe"
   ```
3. Run fetchit again — it re-downloads the binary and retries the rename
   up to 5 times with delays to let the AV scan finish

fetchit has built-in retry logic for this, so it usually self-heals. If it
keeps happening, add `~/.fetchit/bin` to your antivirus exclusions.

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
4. **PowerShell cold-start (Windows).** PowerShell's first launch after
   boot can take 5-10 seconds. During this time you'll see
   `⌛ checking clipboard…` below the input. Once it completes, the hint
   appears automatically — just wait a few seconds. If you start typing
   before the check finishes, the hint won't show (but you already have
   the url). This is a one-time delay per PowerShell session; subsequent
   launches within the same session are faster.

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
fetchit update
```
This runs `yt-dlp -U` on the bundled binary at `~/.fetchit/bin/yt-dlp` and
prints the new version. One command, no hunting for files.

**From inside the TUI:** press `[U]` at any non-busy screen (input, picker,
playlist, done, error) to update without leaving fetchit. You'll see an
inline spinner and success message.

**If you installed yt-dlp yourself** (system install on your PATH):
```sh
pip install -U yt-dlp
# or
brew upgrade yt-dlp
# or
winget upgrade yt-dlp
```
fetchit detects system yt-dlp and tells you to update it this way — it
can't update a system install itself.

---

## YouTube downloads stopped working suddenly

**What it means:** Downloads worked earlier today but now fail with "sign
in to confirm you're not a bot" or "requested format is not available".

**This is almost always YouTube flagging your IP** — not a fetchit bug.
YouTube's anti-bot system rate-limits IPs that download multiple videos in
quick succession. It happens in waves and resets on its own.

**Fixes (in order of effectiveness):**

1. **Use a VPN** — connect to any VPN server (different IP) and retry.
   This works immediately. Free option: ProtonVPN.
2. **Use a mobile hotspot** — connect your PC to your phone's hotspot for
   a different IP. Free and instant.
3. **Wait 24-48 hours** — stop downloading from your home IP for a day and
   YouTube's flag resets automatically.
4. **Pass cookies** — `fetchit --cookies-from-browser firefox <url>` (see
   the "Sign in to confirm" section above for full instructions)

**To prevent it from happening again:**
- Don't download large playlists all at once on YouTube
- Space out downloads (wait a few minutes between videos)
- Use cookies for authenticated requests
- Keep yt-dlp updated (`fetchit update`)

**How to confirm it's your IP (not fetchit):**
```sh
# this probably fails (your IP is flagged):
fetchit https://www.youtube.com/watch?v=SOME_BOT_CHECKED_VIDEO 144p

# this probably works (YouTube doesn't bot-check this video):
fetchit https://youtu.be/dQw4w9WgXcQ 144p
```

If the second command works, fetchit is fine — your IP just needs a break.

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
