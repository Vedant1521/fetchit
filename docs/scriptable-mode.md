# Scriptable Mode

Scriptable mode lets you download videos without the interactive picker —
no full-screen terminal takeover, no arrow keys, no React. Just a one-line
command that probes, downloads, prints the file path, and exits. Built for
shell scripts, cron jobs, CI pipelines, and anywhere a human isn't pressing
keys.

---

## When to use scriptable mode

- You're writing a shell script that downloads a video
- You're running fetchit in CI (continuous integration)
- You want to pipe the output to another command
- You already know what quality you want
- You're downloading the same kind of thing repeatedly

If you want to browse formats and pick interactively, use [Interactive
Mode](./interactive-mode.md) instead.

---

## The three ways to skip the picker

### 1. `--best` — best quality

```sh
fetchit --best https://youtu.be/dQw4w9WgXcQ
```

Downloads the highest quality video available and exits. No picker, no
terminal takeover.

### 2. `--mp3` — audio only

```sh
fetchit --mp3 https://youtu.be/dQw4w9WgXcQ
```

Extracts the audio as mp3 at best quality (`--audio-quality 0`) and exits.
Great for grabbing podcasts, music, or audio from a talk.

### 3. Direct quality — pick a resolution

```sh
fetchit https://youtu.be/dQw4w9WgXcQ 1080p
fetchit https://youtu.be/dQw4w9WgXcQ 720p
fetchit https://youtu.be/dQw4w9WgXcQ 360p
fetchit https://youtu.be/dQw4w9WgXcQ mp3
fetchit https://youtu.be/dQw4w9WgXcQ audio
```

The quality goes as a **second positional argument** after the url. You can
use any resolution the video offers (144p, 240p, 360p, 480p, 720p, 1080p,
1440p, 2160p) or `mp3` / `audio` for audio-only.

If the video doesn't have the exact resolution you asked for, fetchit
errors out with:
```
fetchit: no format matching "1080p" — run without a quality to see the picker
```

---

## Embedding chapters

Pass `--chapters` to embed YouTube chapter markers into the output file.
Your video player will show them as jump points.

```sh
fetchit --chapters https://youtu.be/…              # best quality (default), embed chapters
fetchit --best --chapters https://youtu.be/…       # same as above — explicit
fetchit --mp3 --chapters https://youtu.be/…        # audio-only, embed chapters
fetchit https://youtu.be/… 1080p --chapters        # 1080p, embed chapters
```

`--chapters` alone triggers scriptable mode and downloads at **best quality**
— pair it with a quality (`1080p`, `720p`, `mp3`) or `--best`/`--mp3` to
choose something else.

Requires ffmpeg (fetchit bundles a fallback). Adds only a tiny amount of
metadata. The video must actually have chapters set by its creator —
`--chapters` on a chapter-less video just downloads normally with no effect.

#### Viewing chapters after download

Not every video player reads mp4 chapter metadata. **VLC** is the most
reliable — open the file, right-click → Playback → Chapter. Windows Media
Player does **not** support mp4 chapters; use VLC or mpv instead.

See [Interactive Mode → Which players support chapters](./interactive-mode.md#which-players-support-chapters)
for the full list.

---

## Downloading a time range (clip)

Pass `--from` and/or `--to` to download just part of a video. Both accept
`MM:SS` or `HH:MM:SS` format. Like `--chapters`, either flag triggers
scriptable mode and defaults to **best quality** unless you pair it with a
quality or `--best`/`--mp3`.

```sh
fetchit --from 5:30 --to 10:15 https://youtu.be/…        # best quality, 5:30 to 10:15
fetchit --best --from 5:30 --to 10:15 https://youtu.be/…  # same as above — explicit
fetchit --from 1:00:00 https://youtu.be/…                # from 1h to the end
fetchit --to 0:30:00 https://youtu.be/…                  # from start to 30m
```

Combine with quality, `--chapters`, and `-o`:
```sh
fetchit https://youtu.be/… 1080p --from 5:30 --to 10:15 -o ~/Clips
fetchit --chapters --from 5:30 --to 10:15 https://youtu.be/…  # chapters + clip
```

**Note:** time-range downloads need a system ffmpeg. The bundled
ffmpeg-static fallback may not support section splitting on all platforms —
install ffmpeg separately if you see `ffmpeg exited with code …` errors.

---

## Combining with `-o` — custom output folder

By default, files save to `~/Downloads`. Use `-o` (or `--output`) to send
them anywhere:

```sh
fetchit --best https://youtu.be/… -o ~/Videos
fetchit --mp3 https://youtu.be/… --output ~/Music
fetchit https://youtu.be/… 1080p -o "C:\Users\me\Videos"
```

The `-o` flag works in both scriptable and interactive modes.

---

## Rules and validation

| Rule | Error you'll see |
| --- | --- |
| `--best` and `--mp3` together | `--best and --mp3 can't be combined — pick one` |
| `--best` with a direct quality | `--best/--mp3 can't be combined with a direct quality — pick one` |
| `--best` without a url | `scriptable mode needs a url` |
| `--mp3` without a url | `scriptable mode needs a url` |
| Unknown quality (like `hd`, `4k`) | `unknown quality "hd" — use a resolution like 1080p, or mp3/audio` |
| More than two positionals | `expected a url and optional quality (e.g. 1080p or mp3)` |

---

## What the output looks like

Scriptable mode prints pipe-friendly progress so you can see it's alive
without dumping terminal noise:

```
.............|
✓ fetched → C:\Users\me\Downloads\Rick Astley - Never Gonna Give You Up.mp4
```

- `.` — one per progress tick (a chunk downloaded)
- `|` — appears when yt-dlp is merging video+audio or extracting mp3
- `✓ fetched → <path>` — printed on success, followed by exit 0

For playlists, you'll see a longer stream of dots (one set per video):
```
..........................|.............|..........|
✓ fetched 3 files → C:\Users\me\Downloads\My Playlist/
```

---

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Download succeeded |
| `1` | An error occurred (bad url, network issue, unknown quality, etc.) |
| `130` | Cancelled with `[Ctrl+C]` (SIGINT) |

Use these in your scripts:

```sh
fetchit --best "$1" && echo "done" || echo "failed"
```

```sh
if fetchit --mp3 "$URL"; then
  echo "downloaded successfully"
else
  echo "download failed with exit code $?"
fi
```

---

## Using fetchit in scripts

### Download and open the file

```sh
FILE=$(fetchit --best https://youtu.be/… 2>&1 | grep '✓ fetched →' | cut -d'→' -f2 | xargs)
open "$FILE"   # macOS
# start "" "$FILE"   # Windows
# xdg-open "$FILE"   # Linux
```

### Download multiple videos in a loop

```sh
for url in \
  "https://youtu.be/video1" \
  "https://youtu.be/video2" \
  "https://youtu.be/video3"
do
  fetchit --best "$url" -o ~/Videos
done
```

### Cron job: download a daily podcast

```cron
0 6 * * * fetchit --mp3 https://youtu.be/daily-podcast-url -o ~/Podcasts
```

### Pipe-friendly output

Because scriptable mode only prints dots and a final line, you can
redirect stderr and capture just the result:

```sh
fetchit --best https://youtu.be/… 2>/dev/null
# .............|
# ✓ fetched → ~/Downloads/My Video.mp4
```

---

## Playlists in scriptable mode

Scriptable mode auto-detects playlists (same as interactive mode). When
you pass a playlist url, it downloads **every item** at the quality you
chose, into a named subfolder:

```sh
fetchit --best https://www.youtube.com/playlist?list=PL…
```

Output:
```
✓ fetched 12 files → ~/Downloads/My Playlist/
```

Files are numbered `01-Title.mp4`, `02-Title.mp4`, etc. For more on
playlists, see [Playlists](./playlists.md).

---

## What's next?

- [Playlists](./playlists.md) — how playlist detection and batch downloads work
- [Interactive Mode](./interactive-mode.md) — when you want the picker back
- [Troubleshooting](./troubleshooting.md) — fix errors and update yt-dlp
