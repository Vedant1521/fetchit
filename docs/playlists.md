# Playlists & Multi-Video Downloads

fetchit can download entire playlists, multi-post Threads, and any url that
yt-dlp recognizes as more than one video. This guide covers how it works in
both interactive and scriptable mode.

---

## How fetchit detects playlists

When you give fetchit a url, it does a fast probe first
(`--flat-playlist`). This lists all the videos in the playlist without
downloading any of them. If the url has more than one video, fetchit knows
it's a playlist and shows you the picker.

If the url is a single video, fetchit skips the playlist step entirely and
goes straight to the format picker — you won't see anything different from
a normal download.

You don't need to pass any flag. Playlist detection is automatic.

---

## Interactive mode: the playlist picker

When fetchit detects a playlist, you'll see a checklist:

```
  ╭─ Playlist · 12 ────────────────────────────────────────╮
  │ ❯ ☒ Video Title One · 3:42 · CreatorName                │
  │   ☒ Video Title Two · 10:15 · CreatorName                │
  │   ☒ Video Title Three · 5:30 · CreatorName               │
  │   ☒ Video Title Four · 2:18 · CreatorName                │
  │   ☒ Video Title Five · 7:45 · CreatorName                │
  │                                                          │
  │  [↑/↓] move · [Space] toggle · [Enter] fetchit · [Esc] back │
  ╰──────────────────────────────────────────────────────────╯
```

### All videos are selected by default

Every video starts with a checked box `☒`. This means **all of them will
download** if you just press `[Enter]`. You don't have to do anything to
download the whole playlist.

### Deselect videos you don't want

If you want to skip a few:

1. Use **[↑] / [↓]** to move the highlight to a video
2. Press **[Space]** to toggle it off (the `☒` becomes `☐`)
3. Press **[Space]** again to turn it back on

Only the videos that stay `☒` will download.

### Confirm and pick a format

Press **[Enter]** to confirm your selection. fetchit then probes the first
selected video to see what resolutions are available, and shows you the
format picker (just like a single-video download).

The quality you pick applies to **every selected video**. So if you pick
1080p, all selected videos download at 1080p.

### The header tells you what's happening

The format picker shows the **playlist title** (not the first video's
title) and a count:

```
My Awesome Playlist
▸ YouTube · 7 videos to download
```

This makes it clear you're downloading multiple videos, not just the one
whose formats are being shown.

### Press [Esc] to go back

At the playlist picker, **[Esc]** takes you back to the url input. At the
format picker (after confirming), **[Esc]** also goes back to the input.

---

## Interactive mode: downloading

During the download, the header shows which item is currently downloading:

```
item 3/7 · My Awesome Playlist · 1080p
████████████████░░░░░░░░░░  60%
```

The progress bar resets between items — that's normal. `item 3/7` means
fetchit is on the third of seven selected videos.

### Cancelling a playlist download

Press **[Esc]** to cancel. fetchit kills the current download and cleans up
any partial files. Already-completed videos stay in your Downloads folder.

---

## Scriptable mode: playlists

In scriptable mode (`--best`, `--mp3`, or direct quality), playlists are
detected automatically and **all videos are downloaded** — there's no
interactive picker to deselect from.

```sh
fetchit --best https://www.youtube.com/playlist?list=PL…
fetchit --mp3 https://www.youtube.com/playlist?list=PL…
fetchit https://www.youtube.com/playlist?list=PL… 720p
```

Output shows the count and the folder:
```
..........................|.............|..........|
✓ fetched 12 files → ~/Downloads/My Playlist/
```

To download only specific videos from a playlist in a script, you'd need to
call fetchit once per video url (not the playlist url). Interactive mode
is the way to pick specific items.

---

## Where the files go

Playlist downloads save into a **subfolder named after the playlist**:

```
~/Downloads/
  My Awesome Playlist/
    01-First Video Title.mp4
    02-Second Video Title.mp4
    03-Third Video Title.mp4
    ...
```

Files are numbered with a zero-padded index (`01`, `02`, …) so they sort
correctly in your file browser. The numbering follows the original
playlist order.

With `-o`, the subfolder goes inside your chosen directory:

```sh
fetchit --best https://…/playlist -o ~/Videos
# → ~/Videos/My Awesome Playlist/01-….mp4
```

---

## What kinds of urls are playlists?

| Source | Url pattern | Detected as |
| --- | --- | --- |
| YouTube | `youtube.com/playlist?list=…` | Playlist |
| YouTube | `youtu.be/…` (single video) | Single video |
| Threads | A multi-post thread url | Playlist |
| Instagram | A multi-post carousel | Playlist |
| Any site | A url yt-dlp sees as having >1 entry | Playlist |

When in doubt, just paste the url. fetchit figures it out.

---

## Parallel downloads (3 at a time)

Playlist items download **3 at a time** instead of one-by-one. This cuts
the total time roughly 3x — a 12-video playlist at 1080p that took ~30
minutes sequentially finishes in ~10 minutes.

### Interactive mode

During the download, the header shows how many items are done:
```
3/12 done · My Playlist · 1080p
```

Below it, one progress bar per active download:
```
item 2  80%  400 KB/s
████████░░
item 5  50%  300 KB/s
█████░░░░░
item 8  20%  150 KB/s
██░░░░░░░░
```

When one item finishes, the next pending one starts automatically. Press
`[Esc]` to cancel — all in-flight downloads are aborted and partial files
cleaned up.

### Scriptable mode

Same parallelism — `fetchit --best <playlist-url>` downloads 3 items at a
time. The dot progress output shows all three streams interleaved:
```
.........|....|..||..........|....|
✓ fetched 12 files → ~/Downloads/My Playlist/
```

### YouTube is auto-sequential

YouTube aggressively throttles parallel downloads — when one client opens
multiple video streams at the same time, YouTube rate-limits all of them so
hard that 3 parallel can end up **slower** than 1-at-a-time sequential.

fetchit detects YouTube urls automatically and downloads playlist items
**one at a time** (full speed per item) unless you override it. Other sites
(Instagram, TikTok, Vimeo, etc.) don't throttle, so the default 3-concurrent
speedup works there.

### Overriding with `--concurrency`

Force a specific concurrency level (scriptable mode only):

```sh
fetchit --best --concurrency 5 https://youtube.com/playlist?list=…   # force 5 parallel on YouTube
fetchit --best --concurrency 1 https://vimeo.com/…                   # force sequential on Vimeo
```

`--concurrency` accepts any positive integer. Values above ~8 risk getting
blocked by site anti-abuse systems. The default (no flag) is 3 for non-YouTube
and 1 for YouTube.

---

## Tips

- **Start with a small playlist** to test (3-5 videos). Big playlists take
  a while and produce a lot of output in scriptable mode.
- **The format picker probes only the first video.** If the playlist has
  videos with different available resolutions, fetchit picks the quality
  based on the first one. Most playlists have uniform formats, but if the
  first video is unusual, you might want to deselect it.
- **Audio-only works for playlists too.** Pick the `audio only · mp3`
  option (or `--mp3` / `mp3` in scriptable mode) and every selected video
  gets extracted as mp3.
- **Cancel is safe.** Pressing `[Esc]` during a playlist download cleans up
  the in-progress file but keeps already-downloaded videos.

---

## What's next?

- [Interactive Mode](./interactive-mode.md) — keyboard and mouse reference
- [Scriptable Mode](./scriptable-mode.md) — automation and scripting
- [Troubleshooting](./troubleshooting.md) — fix common errors
