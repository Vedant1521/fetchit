import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "Playlists" }

export default function Playlists() {
  return (
    <Prose>
      <H1>Playlists &amp; Multi-Video Downloads</H1>
      <P>
        fetchit can download entire YouTube playlists, multi-post Threads threads, Instagram carousels, and any URL that yt-dlp recognises as containing more than one video. This guide covers every aspect of playlist handling — from detection and interactive selection to parallel downloading, output structure, and scripting.
      </P>

      <H2>How playlist detection works</H2>
      <P>
        When you pass a URL to fetchit, it does not assume it is a single video. Instead, it runs a two-phase detection process.
      </P>

      <H3>The probing phase</H3>
      <P>
        fetchit hands the URL to yt-dlp with the <Code>--dump-json</Code> flag and inspects the response. The key signal is whether yt-dlp returns an array of entries (a playlist) or a single entry (a standalone video). If the response contains a <Code>playlist_id</Code> and a non-empty <Code>entries</Code> array with more than one item, fetchit switches into playlist mode.
      </P>
      <P>
        The probe extracts the following playlist-level metadata:
      </P>
      <Ul>
        <Li><strong>Playlist title</strong> — used as the folder name for output</Li>
        <Li><strong>Playlist ID</strong> — internal identifier (e.g. <Code>PL...</Code> for YouTube)</Li>
        <Li><strong>Entry count</strong> — total number of videos in the playlist</Li>
        <Li><strong>Per-entry metadata</strong> — title, duration, thumbnail, and format availability for each video</Li>
        <Li><strong>Uploader</strong> — channel or creator name</Li>
      </Ul>
      <P>
        Probing a large playlist (100+ videos) can take several seconds because yt-dlp must fetch metadata for every entry. fetchit shows a spinner with a live count of entries discovered so you know progress is happening.
      </P>

      <H3>What triggers playlist mode</H3>
      <P>
        Playlist mode activates automatically for any URL that yt-dlp recognises as containing multiple videos. This includes:
      </P>
      <Table
        headers={["Source", "URL pattern", "Behaviour"]}
        rows={[
          ["YouTube playlist", "youtube.com/playlist?list=PL...", "Full playlist with all entries"],
          ["YouTube channel / user", "youtube.com/@ChannelName or youtube.com/c/...", "All uploads from the channel"],
          ["YouTube mix", "youtube.com/watch?v=...&list=RD...", "Auto-generated mix playlist"],
          ["Threads thread", "threads.net/@user/post/... (multi-image)", "All images/videos in the post"],
          ["Instagram carousel", "instagram.com/p/... (multi-media)", "All items in the carousel"],
          ["Bilibili series", "bilibili.com/...series...", "Series episodes"],
          ["Twitch collection", "twitch.tv/collections/...", "Collection of VODs"],
        ]}
      />
      <P>
        If the URL contains exactly one video, fetchit proceeds in single-video mode and the format picker appears as usual. There is no way to force playlist mode for a single-video URL, and no way to suppress playlist mode for a multi-video URL — detection is automatic.
      </P>

      <H3>What is NOT a playlist</H3>
      <P>
        The following URL types are intentionally treated as single videos even though they may appear in playlist-like contexts:
      </P>
      <Table
        headers={["URL type", "Reason"]}
        rows={[
          ["youtube.com/watch?v=... (single)", "Only one video ID — no playlist context"],
          ["youtu.be/...", "Short link always points to a single video"],
          ["youtube.com/shorts/...", "Shorts are standalone short-form videos"],
          ["instagram.com/reel/...", "Reels are single videos, not carousels"],
          ["tiktok.com/@user/video/...", "TikTok URLs are always single videos"],
          ["x.com/user/status/... (single media)", "Single-video tweets download as one file"],
          ["youtube.com/watch?v=...&list=...", "Treats only the specific video unless --playlist flag used"],
        ]}
      />
      <Note>
        If you pass a YouTube URL with both a video ID and a list parameter (<Code>youtube.com/watch?v=...&amp;list=...</Code>), fetchit fetches just that one video by default. To download the full playlist, extract the playlist URL alone (<Code>youtube.com/playlist?list=...</Code>).
      </Note>

      <H2>Interactive playlist mode</H2>
      <P>
        When a playlist is detected and you run fetchit without <Code>--best</Code> or other scriptable flags, you enter interactive playlist mode. This provides a full TUI experience for reviewing and selecting which items to download.
      </P>

      <H3>The checklist interface</H3>
      <P>
        After probing completes, fetchit displays a scrollable checklist of every video in the playlist. Each entry shows:
      </P>
      <Ul>
        <Li><strong>Index number</strong> — the video&apos;s position in the playlist (01, 02, 03...)</Li>
        <Li><strong>Title</strong> — the video title as reported by yt-dlp</Li>
        <Li><strong>Duration</strong> — length of the video in MM:SS or HH:MM:SS format</Li>
        <Li><strong>Checkbox</strong> — a <Code>[✓]</Code> or <Code>[ ]</Code> indicator showing selection state</Li>
      </Ul>
      <P>
        All videos are selected by default. The footer displays the total count and the number of currently selected items (e.g., <Code>15/20 selected</Code>).
      </P>

      <H4>Navigating the checklist</H4>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[↑] / [↓]", "Move selection highlight up/down"],
          ["[Space]", "Toggle selection of the highlighted item"],
          ["[A]", "Select all items"],
          ["[N]", "Deselect all items (none)"],
          ["[R]", "Invert selection (reverse current selection)"],
          ["[PageUp] / [PageDown]", "Scroll by one page"],
          ["[Home]", "Jump to the first item"],
          ["[End]", "Jump to the last item"],
          ["[Enter]", "Proceed to format selection with the current selection"],
          ["[Esc]", "Go back to the input screen"],
        ]}
      />
      <P>
        The selection is preserved as you scroll — you can selectively toggle individual videos on and off before committing. This is useful when a playlist contains 50 videos and you only want the 3 relevant ones.
      </P>

      <H3>Format selection for multiple videos</H3>
      <P>
        After confirming your selection with <Code>[Enter]</Code>, fetchit enters the format picker phase. Unlike single-video mode where you pick one format for one video, here you pick a single format that applies to <strong>every selected video</strong> in the batch.
      </P>
      <P>
        The format picker behaves identically to single-video mode — same metadata columns, same sorting, same keyboard shortcuts. However, there are a few important differences:
      </P>
      <Ul>
        <Li>The file size column shows the estimated size <strong>per video</strong>, not the total batch size</Li>
        <Li>Formats that are not available across all selected videos are flagged with a warning icon</Li>
        <Li>If a format is unavailable for a particular video, fetchit falls back to the next-best compatible format for that one video and prints a notice</Li>
        <Li>Chapter toggling and time range clipping apply to every video in the batch uniformly</Li>
      </Ul>
      <Note>
        Because the same format is applied to all videos, choose a resolution that is available on every item. For example, if most videos have 4K but one is capped at 1080p, selecting 4K will downgrade that one video to its best available format automatically.
      </Note>

      <H3>Batch download progress</H3>
      <P>
        Once you select a format, fetchit begins downloading all selected items. The download screen shows:
      </P>
      <Ul>
        <Li><strong>Overall progress bar</strong> — tracks how many videos are complete out of the total selected (e.g., <Code>3/10</Code>)</Li>
        <Li><strong>Current video progress bar</strong> — the per-video download indicator with speed, ETA, and percentage</Li>
        <Li><strong>Current video title</strong> — shown above the progress bar so you know which item is downloading</Li>
        <Li><strong>Elapsed time</strong> — total time since the batch started</Li>
        <Li><strong>Estimated time remaining</strong> — calculated from average download speed and remaining items</Li>
      </Ul>
      <P>
        When a video finishes, fetchit increments the completed count, logs the saved file path, and immediately starts the next item. There is no pause between downloads unless you press <Code>[Esc]</Code>.
      </P>

      <H4>Cancelling a batch</H4>
      <P>
        Press <Code>[Esc]</Code> once to cancel the <strong>current</strong> video download. The partially downloaded file is deleted and fetchit moves to the next video. Press <Code>[Esc]</Code> twice quickly to cancel the entire batch — remaining videos are skipped and you return to the format picker.
      </P>

      <H2>Scriptable playlist mode</H2>
      <P>
        For automation and non-interactive use, fetchit supports downloading playlists entirely from the command line. Every video in the playlist is downloaded automatically with no prompts.
      </P>

      <H3>Basic scriptable download</H3>
      <Pre>{`fetchit --best https://www.youtube.com/playlist?list=PL...
fetchit --mp3 https://www.youtube.com/playlist?list=PL...
fetchit https://www.youtube.com/playlist?list=PL... 1080p`}</Pre>
      <P>
        In scriptable mode, the checklist interface is skipped entirely. All videos are selected by default and the specified format is applied uniformly across all entries.
      </P>

      <H3>Downloading specific items by index</H3>
      <P>
        Use the <Code>--items</Code> flag to download only specific videos from the playlist. This accepts individual indices, comma-separated lists, and ranges.
      </P>
      <Pre>{`fetchit --best --items 1,3,5 https://youtube.com/playlist?list=PL...
fetchit --best --items 1-10 https://youtube.com/playlist?list=PL...
fetchit --best --items 1-5,8,11-15 https://youtube.com/playlist?list=PL...`}</Pre>
      <Table
        headers={["Syntax", "Meaning", "Example"]}
        rows={[
          ["N", "Single item at index N", "--items 5"],
          ["N,M,O", "Multiple specific items", "--items 2,7,9"],
          ["N-M", "Range from N to M inclusive", "--items 3-8"],
          ["N-M,P,Q-R", "Combination of ranges and singles", "--items 1-5,10,12-15"],
        ]}
      />

      <H3>Download latest N videos</H3>
      <P>
        Use <Code>--last</Code> to download only the most recent N videos from the playlist. This is useful for catching up on a channel without redownloading everything.
      </P>
      <Pre>{`fetchit --best --last 5 https://youtube.com/playlist?list=PL...
fetchit --best --last 10 https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        The <Code>--last</Code> flag selects the final N videos by playlist order, not by upload date. If the playlist is sorted chronologically (newest first), <Code>--last 5</Code> grabs the most recent 5 entries. Combined with <Code>--reverse</Code>, you can control which end of the playlist is targeted.
      </P>

      <H3>Reverse order</H3>
      <P>
        By default, videos download in playlist order (first to last). Pass <Code>--reverse</Code> to download from last to first.
      </P>
      <Pre>{`fetchit --best --reverse https://youtube.com/playlist?list=PL...
fetchit --best --items 1-10 --reverse https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        This is useful when you want the final video in a playlist to finish first — for example, if you are watching in release order but want to save the finale for last.
      </P>

      <H3>Combined with other flags</H3>
      <P>
        All scriptable-mode flags work with <Code>--items</Code>, <Code>--reverse</Code>, and <Code>--last</Code>:
      </P>
      <Pre>{`fetchit --mp3 --items 1-20 https://youtube.com/playlist?list=PL...
fetchit --chapters --last 3 https://youtube.com/playlist?list=PL...
fetchit --from 5:30 --to 10:15 --items 3,7 https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        When combining <Code>--from</Code>/<Code>--to</Code> time ranges with a playlist, the time range is applied to <strong>every</strong> selected video. Each video is clipped to the same start and end times.
      </P>

      <H2>Output directory structure</H2>
      <P>
        Playlist downloads use a different output layout than single-video downloads. Instead of saving individual files directly to the output directory, fetchit groups them into a subfolder named after the playlist.
      </P>

      <H3>Default structure</H3>
      <Pre>{`~/Downloads/
  My Cool Playlist/
    01 - First Video.mp4
    02 - Second Video.mp4
    03 - Third Video.mp4
    ...`}</Pre>

      <H3>Playlist folder naming convention</H3>
      <P>
        The folder name is derived from the playlist title returned by yt-dlp, sanitised to remove characters that are invalid on your filesystem:
      </P>
      <Ul>
        <Li>Characters <Code>\ / : * ? " &lt; &gt; |</Code> are replaced with underscores or removed</Li>
        <Li>Leading and trailing whitespace is trimmed</Li>
        <Li>If the title is empty or contains only invalid characters, the playlist ID is used as a fallback</Li>
        <Li>Truncated to 200 characters to avoid <Code>ENAMETOOLONG</Code> errors on Windows</Li>
      </Ul>

      <H3>File naming within playlists</H3>
      <P>
        Individual files follow a numbered prefix convention to preserve playlist ordering:
      </P>
      <Pre>{`{index:02d} - {title} [{id}].{ext}`}</Pre>
      <P>
        The <Code>{'{index:02d}'}</Code> portion is the video&apos;s position in the playlist, zero-padded to at least 2 digits. This ensures alphabetical sorting matches playlist order. For playlists with 100+ items, the padding expands to 3 digits (<Code>001</Code>).
      </P>
      <Table
        headers={["Playlist size", "Index format", "Example"]}
        rows={[
          ["1-99 items", "{index:02d}", "01 - ..."],
          ["100-999 items", "{index:03d}", "042 - ..."],
          ["1000+ items", "{index:04d}", "1003 - ..."],
        ]}
      />

      <H3>Custom output directory</H3>
      <P>
        Override the parent directory with the <Code>-o</Code> flag. The playlist subfolder is still created inside the specified path:
      </P>
      <Pre>{`fetchit --best -o ~/Videos/Playlists https://youtube.com/playlist?list=PL...`}</Pre>
      <P>Produces:</P>
      <Pre>{`~/Videos/Playlists/My Cool Playlist/
  01 - First Video.mp4
  02 - Second Video.mp4`}</Pre>

      <H3>Skip the playlist folder</H3>
      <P>
        If you prefer all files to land flat in a single directory without playlist grouping, use the <Code>--flat</Code> flag:
      </P>
      <Pre>{`fetchit --best --flat https://youtube.com/playlist?list=PL...`}</Pre>
      <P>Files are named with the playlist title and index prefix directly:</P>
      <Pre>{`~/Downloads/My Cool Playlist - 01 - First Video.mp4
~/Downloads/My Cool Playlist - 02 - Second Video.mp4`}</Pre>

      <H2>Custom output templates</H2>
      <P>
        For full control over file naming, use the <Code>--output-template</Code> flag. This accepts yt-dlp-style output template variables.
      </P>

      <H3>Available template variables</H3>
      <Table
        headers={["Variable", "Description", "Example value"]}
        rows={[
          ["%(playlist_title)s", "Title of the playlist", "My Cool Playlist"],
          ["%(playlist_id)s", "Playlist ID", "PL12345ABCDE"],
          ["%(playlist_index)s", "Index within the playlist", "3"],
          ["%(playlist_autonumber)s", "Auto-incrementing number across all playlists", "5"],
          ["%(title)s", "Video title", "First Video"],
          ["%(id)s", "Video ID", "abc123def45"],
          ["%(uploader)s", "Channel or creator name", "Channel Name"],
          ["%(duration)s", "Duration in seconds", "245"],
          ["%(ext)s", "File extension", "mp4"],
          ["%(resolution)s", "Video resolution", "1920x1080"],
        ]}
      />

      <H3>Template examples</H3>
      <Pre>{`# Default template
fetchit --best --output-template "%(playlist_index)02d - %(title)s [%(id)s].%(ext)s" https://...

# Include uploader
fetchit --best --output-template "%(uploader)s - %(title)s.%(ext)s" https://...

# Full path template
fetchit --best --output-template "%(playlist_title)s/%(playlist_index)02d - %(title)s.%(ext)s" https://...

# Custom folder with channel
fetchit --best --output-template "YouTube/%(uploader)s/%(playlist_title)s/%(title)s.%(ext)s" https://...`}</Pre>
      <P>
        When using a template that includes <Code>%(playlist_title)s</Code> in a path component, the same sanitisation rules apply as for the default folder naming. If the template omits <Code>%(playlist_index)s</Code>, files are still named with the index prefix to preserve order.
      </P>

      <H2>Concurrency and parallel downloads</H2>
      <P>
        fetchit downloads playlist items concurrently to maximise throughput. By default, up to 3 videos download simultaneously.
      </P>

      <H3>Why parallel?</H3>
      <P>
        Sequential downloading (one video at a time) underutilises your network connection, especially for short videos where the overhead of probing and negotiation dominates. Parallel downloads keep the pipeline full and reduce total batch time significantly.
      </P>

      <H3>Default behaviour</H3>
      <P>
        The default concurrency is 3 concurrent downloads. This strikes a balance between speed and reliability on most consumer internet connections. Each download runs in its own yt-dlp process with independent progress tracking.
      </P>

      <H3>Tuning concurrency</H3>
      <Pre>{`fetchit --best --concurrency 5 https://youtube.com/playlist?list=PL...
fetchit --best --concurrency 1 https://youtube.com/playlist?list=PL...   # sequential`}</Pre>
      <Table
        headers={["Concurrency", "Use case"]}
        rows={[
          ["1", "Sequential — minimum bandwidth usage, polite to the server"],
          ["3", "Default — balanced throughput for typical home connections"],
          ["5", "Aggressive — fast on high-bandwidth connections (>100 Mbps)"],
          ["10+", "Maximum speed — only if you have a very fast connection and the server allows it"],
        ]}
      />

      <H3>YouTube throttling</H3>
      <P>
        YouTube intentionally throttles parallel connections to the same stream. When you download multiple videos from the same YouTube playlist simultaneously, each video comes from a different CDN edge server, so the throttling is per-stream rather than global. However, YouTube may still rate-limit your IP if you open too many concurrent connections.
      </P>
      <P>
        In practice, concurrency values above 5 rarely improve total download time on YouTube. If you see individual download speeds dropping as concurrency increases, you have hit YouTube&apos;s per-IP limit. Reduce <Code>--concurrency</Code> or use a VPN to distribute across different IPs.
      </P>
      <Blockquote>
        For non-YouTube sources (Threads, Instagram, direct video hosts), higher concurrency values are often more effective because these platforms do not enforce the same per-IP limits. Experiment with <Code>--concurrency 8</Code> or higher for these sources.
      </Blockquote>

      <H3>Monitoring concurrent downloads</H3>
      <P>
        In interactive mode, fetchit shows separate progress bars for each active download, stacked vertically. Each bar includes the video title, percentage, speed, and ETA. Completed bars collapse into a summary line. In scriptable mode, the output is line-based with each download completing on its own line.
      </P>

      <H2>Metadata embedding in batch</H2>
      <P>
        When downloading playlists, fetchit embeds additional metadata into each file to help media organisers identify the content.
      </P>

      <H3>What gets embedded</H3>
      <Table
        headers={["Metadata field", "Source", "Example"]}
        rows={[
          ["Playlist title", "yt-dlp playlist metadata", "My Cool Playlist"],
          ["Track number", "Playlist index", "3/20"],
          ["Track total", "Total playlist size", "20"],
          ["Video title", "Per-video metadata", "First Video"],
          ["Uploader", "Channel / creator name", "Channel Name"],
          ["Upload date", "Video publish date", "2025-12-01"],
          ["Description", "Video description (truncated)", "In this video we..."],
        ]}
      />
      <P>
        This metadata is written as standard MP4/MKV tags, which media servers like Plex, Jellyfin, and Emby can read. For audio files, iTunes-style metadata tags are used so playlists appear correctly in music library applications.
      </P>

      <H3>Enabling chapter embedding</H3>
      <P>
        Add the <Code>--chapters</Code> flag to embed chapter markers in every downloaded video:
      </P>
      <Pre>{`fetchit --best --chapters https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        Each video&apos;s chapters are embedded independently. This is useful for lecture playlists, podcast episodes, or any content with internal section markers.
      </P>

      <H2>Combining playlists with other flags</H2>
      <P>
        All of fetchit&apos;s single-video flags work with playlist downloads. Here are the most useful combinations:
      </P>

      <H3>Audio extraction</H3>
      <Pre>{`# Download entire playlist as MP3
fetchit --mp3 https://youtube.com/playlist?list=PL...

# Download first 10 as MP3
fetchit --mp3 --items 1-10 https://youtube.com/playlist?list=PL...

# Download last 5 as audio with chapters
fetchit --mp3 --chapters --last 5 https://youtube.com/playlist?list=PL...`}</Pre>

      <H3>Best quality batch</H3>
      <Pre>{`fetchit --best https://youtube.com/playlist?list=PL...
fetchit --best --concurrency 5 https://youtube.com/playlist?list=PL...
fetchit --best --reverse https://youtube.com/playlist?list=PL...`}</Pre>

      <H3>Time range clipping across a playlist</H3>
      <Pre>{`# Clip first 2 minutes of every video in the playlist
fetchit --to 2:00 https://youtube.com/playlist?list=PL...

# Clip specific section from each of the first 3 videos
fetchit --from 1:00 --to 3:30 --items 1-3 https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        When using time ranges with playlists, the range is applied uniformly. You cannot specify different ranges for different items in a single command.
      </P>

      <H3>Chapters in batch</H3>
      <Pre>{`fetchit --best --chapters https://youtube.com/playlist?list=PL...
fetchit --mp3 --chapters --items 5-15 https://youtube.com/playlist?list=PL...`}</Pre>

      <Note>
        Flags like <Code>--best</Code> and <Code>--mp3</Code> are mutually exclusive. You cannot combine them in a single command. If you need some videos in MP3 and others as video, run two separate commands with <Code>--items</Code> targeting different indices.
      </Note>

      <H2>Supported playlist sources</H2>
      <P>
        fetchit inherits playlist support from yt-dlp, which recognises playlists on hundreds of sites. Here are the most commonly used sources:
      </P>

      <H3>YouTube</H3>
      <P>
        Full support for public playlists, unlisted playlists (if you have the link), channel upload feeds, mixes, and music playlists. Private playlists require passing browser cookies via <Code>--cookies-from-browser</Code>. YouTube rate-limits heavy playlist downloads — see the limitations section below.
      </P>

      <H3>Threads threads</H3>
      <P>
        Threads posts that contain multiple images or videos are treated as a playlist. Each media item is a separate entry. This is useful for saving entire photo dumps or multi-video threads at once.
      </P>

      <H3>Instagram carousels</H3>
      <P>
        Instagram posts with multiple images or videos (carousels) are detected as playlists. Each carousel item is a separate entry. This works for both feed posts and story highlights.
      </P>

      <H3>Other supported sources</H3>
      <Table
        headers={["Source", "Playlist type", "Notes"]}
        rows={[
          ["Bilibili", "Series / collection", "Episode series and user-created collections"],
          ["SoundCloud", "Sets / playlists", "Audio playlists, albums, and user sets"],
          ["Twitch", "Collections", "Curated collections of VODs"],
          ["Vimeo", "Albums / showcases", "Curated video albums and showcases"],
          ["Dailymotion", "Playlists", "User-created playlists and channel feeds"],
          ["Facebook", "Watch playlists", "Public video playlists from pages"],
        ]}
      />

      <H2>Limitations and known issues</H2>

      <H3>YouTube rate limiting</H3>
      <P>
        Downloading large playlists from YouTube triggers rate-limiting after 30-50 videos in a short period. YouTube displays a <Code>"Sign in to confirm you&apos;re not a bot"</Code> page. Mitigations:
      </P>
      <Ul>
        <Li>Use <Code>--cookies-from-browser firefox</Code> to pass authenticated cookies (Firefox strongly preferred on Windows — Chrome and Edge encrypt cookies)</Li>
        <Li>Reduce concurrency to 1 or 2 to appear less aggressive</Li>
        <Li>Add a delay between items — fetchit does not yet have a built-in delay flag, but you can wrap it in a shell loop with <Code>sleep</Code></Li>
        <Li>Use a VPN to distribute requests across different IPs for very large batch downloads</Li>
        <Li>If rate-limited, wait 24-48 hours for the flag to reset</Li>
      </Ul>

      <H3>Very large playlists</H3>
      <P>
        Playlists with more than 200 entries can be slow to probe because yt-dlp fetches metadata for every entry upfront. The probe time scales roughly linearly with the number of entries. For playlists exceeding 500 entries, consider:
      </P>
      <Ul>
        <Li>Using <Code>--last N</Code> to probe only the most recent N items</Li>
        <Li>Breaking the download into multiple commands with <Code>--items</Code> ranges</Li>
        <Li>Monitoring progress via the terminal output</Li>
      </Ul>

      <H3>Mixing formats across items</H3>
      <P>
        When a selected format is not available for some videos in the batch, fetchit falls back to the best available format for those items. This means you may get inconsistent quality across your downloaded playlist. The fallback is logged but not visually prominent in the TUI.
      </P>

      <H3>Memory usage</H3>
      <P>
        fetchit keeps all entry metadata in memory during a playlist download. For extremely large playlists (1000+ entries), memory usage can reach 100-200 MB. This is typically not an issue on modern machines but may be noticeable on low-memory systems.
      </P>

      <H3>Unicode and special characters</H3>
      <P>
        Some playlist and video titles contain emoji, CJK characters, or other Unicode that may not display correctly in all terminals. File names are sanitised for the filesystem, but the interactive checklist displays the raw title as reported by yt-dlp. If you see garbled characters, the source metadata contains encoding that your terminal does not support.
      </P>

      <H3>No progress for individual items in scriptable mode</H3>
      <P>
        In scriptable mode (<Code>--best</Code>, <Code>--mp3</Code>, etc.), fetchit outputs one line per completed video rather than showing real-time progress bars. The output includes the file path and file size after each item finishes. If you need per-video progress visibility, use interactive mode.
      </P>

      <H2>Real-world examples</H2>

      <H3>Download a music album playlist as MP3</H3>
      <Pre>{`fetchit --mp3 --concurrency 3 --chapters \\
  https://music.youtube.com/playlist?list=OLAK5uy_...`}</Pre>
      <P>
        This downloads an entire YouTube Music album, converts each track to MP3, embeds chapter markers, and saves them to <Code>~/Downloads/{'{Album Title}'}/</Code>.
      </P>

      <H3>Download specific lectures from a course playlist</H3>
      <Pre>{`fetchit --best --items 3,7,12-15 --concurrency 2 \\
  https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        Selects only lectures 3, 7, and 12 through 15 from a large course playlist, downloading them at best quality with 2 concurrent streams.
      </P>

      <H3>Save a Threads photo dump</H3>
      <Pre>{`fetchit --best --flat --output-template "%(playlist_index)02d - %(title)s.%(ext)s" \\
  https://www.threads.net/@username/post/...`}</Pre>
      <P>
        Downloads all images and videos from a multi-media Threads post into a flat directory with numbered filenames.
      </P>

      <H3>Download the latest podcast episodes</H3>
      <Pre>{`fetchit --mp3 --last 5 --chapters --concurrency 1 \\
  https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        Grabs the 5 most recent episodes from a podcast playlist, extracting audio with chapters and downloading sequentially to avoid rate limits.
      </P>

      <H3>Convert an entire playlist to audio with custom output</H3>
      <Pre>{`fetchit --mp3 --output-template "%(uploader)s/%(playlist_title)s/%(playlist_index)02d - %(title)s.%(ext)s" \\
  -o "D:/Music" \\
  https://youtube.com/playlist?list=PL...`}</Pre>
      <P>Produces:</P>
      <Pre>{`D:/Music/Channel Name/My Playlist/01 - First Track.mp3
D:/Music/Channel Name/My Playlist/02 - Second Track.mp3`}</Pre>

      <H3>Download in reverse order for chronological viewing</H3>
      <Pre>{`fetchit --best --reverse --concurrency 1 \\
  https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        Downloads the playlist from last to first, one at a time. Useful when a playlist is sorted newest-first but you want to watch in chronological (oldest-first) order and download the file you will watch next.
      </P>

      <H3>Quick check for how many videos are in a playlist</H3>
      <P>
        Use the <Code>--dry-run</Code> flag to see what would be downloaded without actually downloading anything:
      </P>
      <Pre>{`fetchit --best --dry-run https://youtube.com/playlist?list=PL...
fetchit --best --items 1-5 --dry-run https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        This prints the playlist title, total entry count, and a list of all video titles and indices that would be downloaded. No files are written.
      </P>

      <H2>See also</H2>
      <Ul>
        <Li><Link href="/docs/interactive-mode">Interactive Mode</Link> — keyboard and mouse reference for the TUI</Li>
        <Li><Link href="/docs/scriptable-mode">Scriptable Mode</Link> — command-line flags and automation guide</Li>
        <Li><Link href="/docs/troubleshooting">Troubleshooting</Link> — common issues and solutions for all download types</Li>
      </Ul>
    </Prose>
  )
}
