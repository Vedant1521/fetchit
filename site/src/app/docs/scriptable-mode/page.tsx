import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "Scriptable Mode" }

export default function ScriptableMode() {
  return (
    <Prose>
      <H1>Scriptable Mode</H1>
      <P>
        Download videos without the interactive picker — no full-screen takeover, no arrow keys. Just a one-line command that probes, downloads, and exits. Scriptable mode is designed for automation, shell pipelines, cron jobs, and any scenario where you want fetchit to run without human interaction.
      </P>

      <H2>Overview: when to use scriptable mode vs interactive mode</H2>
      <P>
        fetchit offers two distinct modes of operation. The <Link href="/docs/interactive-mode">interactive mode</Link> provides a full-screen TUI with a URL input screen, format picker, live progress bars, and clipboard detection. It is ideal for ad-hoc downloads where you want to browse available formats, see file sizes, and make a selection visually. Scriptable mode, on the other hand, is a non-interactive mode that accepts all parameters as command-line flags and exits immediately after the download completes (or fails).
      </P>
      <P>Use <strong>scriptable mode</strong> when:</P>
      <Ul>
        <Li>Running fetchit from a shell script, cron job, or CI/CD pipeline</Li>
        <Li>Downloading many URLs in a loop without manual intervention</Li>
        <Li>Integrating fetchit with other tools via stdout/stderr parsing</Li>
        <Li>Running on a headless server or over SSH without a terminal TUI</Li>
        <Li>You already know exactly which quality or format you want</Li>
      </Ul>
      <P>Use <strong>interactive mode</strong> when:</P>
      <Ul>
        <Li>You want to browse available formats and compare file sizes before choosing</Li>
        <Li>You are unsure which resolution or codec is available for a given URL</Li>
        <Li>You want to preview thumbnails, see codec information, or quickly toggle chapters</Li>
        <Li>You prefer a visual keyboard-driven interface over memorising flags</Li>
      </Ul>
      <Blockquote>
        Scriptable mode is also triggered automatically when stdin is not a TTY (e.g. when piped into another command or run inside a Docker container). If fetchit detects it is running non-interactively, it behaves as if <Code>--best</Code> was passed.
      </Blockquote>

      <H2>Complete CLI reference</H2>
      <P>
        Every flag and option is listed below. Flags can appear before or after the URL. Short flags (single dash) and long flags (double dash) are interchangeable unless noted otherwise.
      </P>

      <H3>Positional arguments</H3>
      <Table
        headers={["Position", "Argument", "Required", "Description"]}
        rows={[
          ["1", "URL", "Yes (unless --help)", "The media URL to download. Supports all sites that yt-dlp handles: YouTube, Twitch, Twitter/X, Instagram, TikTok, Facebook, Vimeo, Reddit, SoundCloud, and thousands more."],
          ["2", "Quality", "No", "A specific quality string like <Code>1080p</Code>, <Code>720p</Code>, <Code>480p</Code>, <Code>360p</Code>, <Code>mp3</Code>, <Code>best</Code>, or a format ID. Overrides <Code>--best</Code> and <Code>--mp3</Code> if both are present."],
        ]}
      />

      <H3>Flags</H3>
      <Table
        headers={["Flag", "Alias", "Description"]}
        rows={[
          ["--best", "", "Download the best available quality automatically. Selects the highest resolution video with the best audio track. If the config has a preferred quality, that is respected."],
          ["--mp3", "", "Download audio only and convert to MP3. Fetches the best available audio stream (Opus or M4A) and transcodes it using the bundled FFmpeg."],
          ["--chapters", "", "Embed chapter markers into the output file. Chapters appear as named timestamps in VLC, MPV, macOS QuickTime, and other chapter-aware media players. Works on YouTube and other sites that expose chapter data."],
          ["--from", "", "Start time for clipping. Accepts <Code>MM:SS</Code> or <Code>HH:MM:SS</Code> format. Combined with <Code>--to</Code> to download a segment. Uses lossless stream copy — cuts at the nearest keyframe."],
          ["--to", "", "End time for clipping. Must be used with <Code>--from</Code>. If omitted, clipping runs from <Code>--from</Code> to the end of the video."],
          ["-o", "--output", "Output directory. Overrides the default download location. The directory is created automatically if it does not exist. Accepts both absolute and relative paths."],
          ["--concurrency", "", "Number of parallel downloads for playlists or multi-video URLs. Overrides the default of 3. Note that YouTube may rate-limit concurrent connections; values above 5 rarely improve throughput."],
          ["--theme", "", "Force a theme: <Code>dark</Code>, <Code>light</Code>, or <Code>auto</Code>. In scriptable mode this only affects the spinner and progress output. Defaults to <Code>auto</Code>."],
          ["--cookies-from-browser", "", "Extract cookies from a browser profile for authenticated downloads. Supported values: <Code>chrome</Code>, <Code>firefox</Code>, <Code>brave</Code>, <Code>edge</Code>, <Code>chromium</Code>, <Code>opera</Code>, <Code>vivaldi</Code>. Useful for downloading age-restricted or member-only content."],
          ["--help", "", "Print the full help menu and exit. Lists all flags with descriptions. Does not require a URL."],
          ["--version", "", "Print the installed fetchit version number and exit. Useful for verifying installation and reporting bugs."],
          ["--log-level", "", "Set log verbosity: <Code>debug</Code>, <Code>info</Code>, <Code>warn</Code>, <Code>error</Code>. Debug mode outputs the raw yt-dlp JSON and FFmpeg commands."],
          ["--format", "", "Pre-select a format by ID (e.g. <Code>--format 137+140</Code>). Skips the format picker entirely. Advanced users only."],
          ["--windowed", "", "Force windowed rendering mode. Disables full-screen and mouse capture. Useful in tmux splits or when running inside an IDE terminal panel."],
        ]}
      />

      <H3>Quick reference examples</H3>
      <Pre>{`fetchit --best https://youtu.be/dQw4w9WgXcQ
fetchit --mp3 https://youtu.be/dQw4w9WgXcQ
fetchit https://youtu.be/dQw4w9WgXcQ 1080p
fetchit --chapters --best https://youtu.be/dQw4w9WgXcQ
fetchit --from 1:30 --to 4:45 https://youtu.be/dQw4w9WgXcQ 720p
fetchit -o ~/Videos --best https://youtu.be/dQw4w9WgXcQ
fetchit --cookies-from-browser firefox --best https://patreon.com/posts/...
fetchit --concurrency 5 --best https://youtube.com/playlist?list=PL...
fetchit --help
fetchit --version`}</Pre>

      <H2>Quality specification</H2>
      <P>
        You can specify quality as a positional argument after the URL or via the <Code>--best</Code> and <Code>--mp3</Code> flags. Quality arguments are matched against the formats yt-dlp returns for the given URL.
      </P>

      <H3>Resolution values</H3>
      <P>Pass a resolution string like <Code>1080p</Code> as the second positional argument. fetchit matches it to the closest available stream.</P>
      <Table
        headers={["Value", "Target", "Fallback behaviour"]}
        rows={[
          ["2160p", "4K UHD (3840×2160)", "Next highest resolution available"],
          ["1440p", "Quad HD (2560×1440)", "Next highest resolution available"],
          ["1080p", "Full HD (1920×1080)", "Next highest resolution available"],
          ["720p", "HD (1280×720)", "Next highest resolution available"],
          ["480p", "SD (854×480)", "Next highest resolution available"],
          ["360p", "SD (640×360)", "Next highest resolution available"],
          ["240p", "Low (426×240)", "Next highest resolution available"],
          ["144p", "Lowest (256×144)", "No fallback — exact match only"],
        ]}
      />
      <Note>
        Resolution matching is approximate. If 1080p is not available but 1080p60 (60 FPS) is, fetchit selects that and prints a notice. If no close match is found, it falls back to the highest available resolution and warns on stderr.
      </Note>

      <H3>Shorthand flags</H3>
      <Table
        headers={["Flag", "Behaviour"]}
        rows={[
          ["--best", "Select the single best video+audio combination. Picks the highest resolution combined format if available; otherwise downloads the best video-only and best audio-only streams and muxes them."],
          ["--mp3", "Download the best audio stream and transcode to MP3. Output file has a .mp3 extension regardless of the source codec."],
        ]}
      />

      <H3>Audio quality</H3>
      <P>
        When you pass <Code>mp3</Code> as the quality argument or use <Code>--mp3</Code>, fetchit downloads the best available audio stream (typically Opus at 160 kbps or M4A at 128 kbps) and transcodes it to MP3 at 192 kbps CBR using the bundled FFmpeg. The transcode preserves as much quality as possible from the source; if the source is already MP3 at a lower bitrate, no upscaling is performed.
      </P>

      <H3>Format IDs (advanced)</H3>
      <P>
        If you know the exact yt-dlp format IDs, you can pass them directly. Use the interactive mode or <Code>--log-level debug</Code> to discover format IDs for a given URL.
      </P>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ 137+140   # 1080p video + AAC audio
fetchit https://youtu.be/dQw4w9WgXcQ 247+251   # 720p VP9 + Opus audio`}</Pre>

      <H2>Output path templates</H2>
      <P>
        fetchit uses a structured output naming scheme to keep your downloads organised. The default pattern is:
      </P>
      <Pre>{`{title} [{id}].{ext}`}</Pre>
      <P>
        For example: <Code>Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ].mp4</Code>. The video ID in square brackets guarantees uniqueness — two different videos with the same title never collide.
      </P>

      <H3>Custom output directory</H3>
      <P>
        Use the <Code>-o</Code> or <Code>--output</Code> flag to specify a download directory. The directory is created automatically if it does not exist:
      </P>
      <Pre>{`fetchit --best https://youtu.be/dQw4w9WgXcQ -o ~/Videos
fetchit --best https://youtu.be/dQw4w9WgXcQ -o "D:\\Media\\Downloads"
fetchit --best https://youtu.be/dQw4w9WgXcQ -o /mnt/nas/videos`}</Pre>

      <H3>Playlist output structure</H3>
      <P>
        When downloading playlists, fetchit creates a subfolder named after the playlist title and numbers each file sequentially:
      </P>
      <Pre>{`~/Downloads/My Awesome Playlist/
  01-First Video [abc123].mp4
  02-Second Video [def456].mp4
  03-Third Video [ghi789].mp4`}</Pre>

      <H3>Output template variables</H3>
      <P>
        fetchit supports yt-dlp's output template variables for advanced naming. These can be set via the <Code>--output-template</Code> config option or environment variable:
      </P>
      <Table
        headers={["Variable", "Description", "Example"]}
        rows={[
          ["<Code>{title}</Code>", "Video title (sanitized for filesystem)", "Rick Astley - Never Gonna Give You Up"],
          ["<Code>{id}</Code>", "Video ID from URL", "dQw4w9WgXcQ"],
          ["<Code>{ext}</Code>", "Output file extension", "mp4"],
          ["<Code>{uploader}</Code>", "Channel / uploader name", "Rick Astley"],
          ["<Code>{upload_date}</Code>", "Upload date in YYYYMMDD format", "20091025"],
          ["<Code>{duration}</Code>", "Duration in seconds", "212"],
          ["<Code>{playlist_index}</Code>", "Index within a playlist (zero-padded)", "01"],
          ["<Code>{playlist_title}</Code>", "Playlist name (playlist downloads only)", "My Mix"],
          ["<Code>{resolution}</Code>", "Actual downloaded resolution", "1920x1080"],
          ["<Code>{fps}</Code>", "Frames per second", "30"],
        ]}
      />
      <P>Custom templates are configured in the config file:</P>
      <Pre>{`{
  "output_template": "{uploader} - {title} [{id}].{ext}"
}`}</Pre>
      <P>
        This would produce: <Code>Rick Astley - Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ].mp4</Code>. Be careful with variable collisions.
      </P>

      <H2>Understanding exit codes</H2>
      <P>
        Every fetchit process exits with a numeric code that scripts can check to determine what happened. Always check the exit code in automated scripts (see <Link href="#error-handling-in-scripts">error handling in scripts</Link>).
      </P>
      <Table
        headers={["Code", "Meaning", "Typical cause"]}
        rows={[
          ["0", "Success", "Download completed normally. The output file exists at the reported path."],
          ["1", "Generic error", "An unspecified error occurred. Check stderr for details. This covers most failure modes: invalid URL, network timeout, disk full, etc."],
          ["2", "Parse / usage error", "The command-line arguments could not be parsed. For example, combining <Code>--best</Code> and <Code>--mp3</Code>, or passing an unrecognised flag."],
          ["3", "Probe failure", "fetchit could not extract metadata from the URL. The site may be down, the video may be private or geo-blocked, or yt-dlp may need an update."],
          ["4", "Format not available", "The requested quality (e.g. 1080p, mp3) is not available for this URL. Try again without a quality argument to see available formats."],
          ["5", "Download interrupted", "The download started but did not complete. Possible causes: network disconnection, server timeout, storage full, or file write permission denied."],
          ["6", "FFmpeg / muxing error", "The download succeeded but merging video and audio streams failed. This usually indicates a corrupt stream or an FFmpeg compatibility issue."],
          ["7", "Rate limited / blocked", "The remote server rate-limited the request or blocked the client. Wait before retrying, or use <Code>--cookies-from-browser</Code> to authenticate."],
          ["130", "Cancelled (Ctrl+C)", "The process was interrupted by the user via SIGINT (Ctrl+C). The partial file is deleted automatically."],
          ["137", "Killed (OOM)", "The process was killed by the system (SIGKILL), typically due to out-of-memory. Reduce concurrency or download smaller files."],
        ]}
      />
      <Note>
        Always check <Code>$?</Code> (or <Code>$LASTEXITCODE</Code> in PowerShell) after running fetchit in a script. Exit code 0 is the only code that guarantees a usable output file.
      </Note>

      <H2>Parsing fetchit output in scripts</H2>
      <P>
        fetchit writes machine-parseable information to specific streams. Understanding the output stream layout is essential for reliable script integration.
      </P>

      <H3>stdout vs stderr</H3>
      <P>fetchit follows the Unix convention:</P>
      <Ul>
        <Li><strong>stdout (file descriptor 1)</strong> — The final output file path on success. Nothing else. This makes it trivial to capture the file path in a variable or pipe it to another command.</Li>
        <Li><strong>stderr (file descriptor 2)</strong> — Everything else: progress bars, status messages, warnings, and error messages. If you see text in your terminal during a download, it is almost certainly on stderr.</Li>
      </Ul>
      <Pre>{`# Capture only the file path
file=$(fetchit --best https://youtu.be/dQw4w9WgXcQ 2>/dev/null)
echo "Downloaded to: $file"

# Capture file path and keep stderr visible
file=$(fetchit --best https://youtu.be/dQw4w9WgXcQ)
echo "File saved at: $file"

# Merge both streams (not recommended for parsing)
output=$(fetchit --best https://youtu.be/dQw4w9WgXcQ 2>&1)`}</Pre>

      <H3>Machine-readable output patterns</H3>
      <P>
        When the download succeeds, stdout contains exactly one line: the absolute path to the downloaded file. This is guaranteed to be a valid path on the local filesystem.
      </P>
      <Pre>{`C:\Users\alice\Downloads\Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ].mp4`}</Pre>

      <H3>Parsing in different shells</H3>
      <H4>Bash / Zsh</H4>
      <Pre>{`file=$(fetchit --best "https://youtu.be/dQw4w9WgXcQ" 2>/dev/null)
if [ -f "$file" ]; then
  echo "OK: $file"
else
  echo "Download failed" >&2
fi`}</Pre>

      <H4>PowerShell</H4>
      <Pre>{`$file = & fetchit --best "https://youtu.be/dQw4w9WgXcQ" 2>$null
if (Test-Path $file) {
  Write-Output "OK: $file"
} else {
  Write-Error "Download failed"
}`}</Pre>

      <H4>Fish</H4>
      <Pre>{`set file (fetchit --best "https://youtu.be/dQw4w9WgXcQ" 2>/dev/null)
if test -f "$file"
  echo "OK: $file"
else
  echo "Download failed" >&2
end`}</Pre>

      <H3>Suppressing stderr in scripts</H3>
      <P>
        In scriptable mode, stderr contains progress spinners and status lines that are useful in interactive use but noisy in logs. Redirect or suppress them as needed:
      </P>
      <Pre>{`# Suppress all stderr (only get the file path)
file=$(fetchit --best url 2>/dev/null)

# Log stderr to a file for debugging
file=$(fetchit --best url 2>>fetchit-errors.log)

# Discard stderr but still capture exit code
file=$(fetchit --best url 2>&-)
exit_code=$?`}</Pre>
      <Blockquote>
        Never rely on parsing stderr text for critical logic. The format of status messages may change between versions. Always use stdout for the file path and the exit code for success/failure detection.
      </Blockquote>

      <H2>Piping and redirection patterns</H2>
      <P>
        fetchit is designed to compose well with standard Unix pipelines. Here are common patterns:
      </P>

      <H3>Pipe file path to a media player</H3>
      <Pre>{`# Open directly in mpv
mpv "$(fetchit --best https://youtu.be/dQw4w9WgXcQ 2>/dev/null)"

# Open in VLC (macOS)
open -a VLC "$(fetchit --best https://youtu.be/dQw4w9WgXcQ 2>/dev/null)"

# Open in VLC (Linux)
vlc "$(fetchit --best https://youtu.be/dQw4w9WgXcQ 2>/dev/null)"

# Open in Windows Media Player (PowerShell)
& "C:\Program Files\Windows Media Player\wmplayer.exe" (fetchit --best url 2>$null)`}</Pre>

      <H3>Copy to clipboard</H3>
      <Pre>{`# macOS — copy path to clipboard
fetchit --best url 2>/dev/null | pbcopy

# Linux (X11) — copy path to clipboard
fetchit --best url 2>/dev/null | xclip -selection clipboard

# Linux (Wayland) — copy path to clipboard
fetchit --best url 2>/dev/null | wl-copy

# Windows (PowerShell) — copy path to clipboard
fetchit --best url 2>$null | Set-Clipboard`}</Pre>

      <H3>Copy file after download</H3>
      <Pre>{`# Move to a NAS after download
file=$(fetchit --best url 2>/dev/null)
cp "$file" /mnt/nas/videos/
echo "Copied to NAS"

# Upload via rsync
file=$(fetchit --best url 2>/dev/null)
rsync -avP "$file" user@server:/media/incoming/`}</Pre>

      <H3>Pipe URLs from a file</H3>
      <Pre>{`# Download every URL in urls.txt
while IFS= read -r url; do
  [ -z "$url" ] && continue
  fetchit --best "$url" -o ~/Downloads
done < urls.txt`}</Pre>

      <H2>Error handling in scripts</H2>
      <P>
        Robust scripts always check exit codes and handle failures gracefully. Here is a comprehensive error-handling template:
      </P>

      <H3>Check exit code</H3>
      <Pre>{`fetchit --best "https://youtu.be/dQw4w9WgXcQ"
case $? in
  0)  echo "Download succeeded" ;;
  1)  echo "Generic error — check stderr" >&2 ;;
  2)  echo "Usage error — bad arguments" >&2 ;;
  3)  echo "Probe failed — video may be private or unavailable" >&2 ;;
  4)  echo "Requested quality not available" >&2 ;;
  5)  echo "Download interrupted — network or disk issue" >&2 ;;
  6)  echo "Muxing failed — corrupt stream or FFmpeg error" >&2 ;;
  7)  echo "Rate limited — wait before retrying" >&2 ;;
  130) echo "Cancelled by user" >&2 ;;
  137) echo "Out of memory — reduce concurrency" >&2 ;;
  *)  echo "Unknown exit code $?" >&2 ;;
esac`}</Pre>

      <H3>Parse error messages</H3>
      <P>
        When an error occurs, fetchit writes a human-readable message to stderr. You can capture and inspect it:
      </P>
      <Pre>{`# Capture stderr to a variable
output=$(fetchit --best "https://youtu.be/dQw4w9WgXcQ" 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  # Extract the last line of stderr for the error message
  error_msg=$(echo "$output" | tail -1)
  echo "Error: $error_msg" >&2
  logger -t fetchit "Download failed: $error_msg"
  exit $exit_code
fi

file=$(echo "$output" | head -1)
echo "Downloaded: $file"`}</Pre>

      <H3>Retry with backoff</H3>
      <P>
        Transient errors (network timeouts, rate limiting) can often be resolved by retrying with exponential backoff:
      </P>
      <Pre>{`url="https://youtu.be/dQw4w9WgXcQ"
max_attempts=5
attempt=1
delay=10

while [ $attempt -le $max_attempts ]; do
  fetchit --best "$url" 2>/dev/null && break
  exit_code=$?

  if [ "$exit_code" -eq 7 ] || [ "$exit_code" -eq 5 ]; then
    echo "Attempt $attempt/$max_attempts failed (code $exit_code). Retrying in \${delay}s..."
    sleep $delay
    attempt=$((attempt + 1))
    delay=$((delay * 2))
  else
    echo "Non-retriable error (code $exit_code). Aborting." >&2
    exit $exit_code
  fi
done

if [ $attempt -gt $max_attempts ]; then
  echo "All $max_attempts attempts failed." >&2
  exit 1
fi`}</Pre>

      <H3>Fail-fast with <Code>set -e</Code></H3>
      <Pre>{`set -e  # Exit immediately if any command fails
set -u  # Error on undefined variables
set -o pipefail  # Pipelines fail if any component fails

file=$(fetchit --best "https://youtu.be/dQw4w9WgXcQ" 2>/dev/null)
echo "Downloaded: $file"`}</Pre>

      <Note>
        When using <Code>set -e</Code>, be aware that <Code>$(fetchit ... 2{'>'}/dev/null)</Code> in a variable assignment does not trigger <Code>set -e</Code> on failure. Always check <Code>$?</Code> or use a separate statement.
      </Note>

      <H2>Integration with other tools</H2>
      <P>
        fetchit works well with media players, transcoders, and file management tools. Here are common integrations:
      </P>

      <H3>FFmpeg</H3>
      <P>
        Pipe the output path directly into FFmpeg for further processing:
      </P>
      <Pre>{`# Transcode downloaded video to H.265
file=$(fetchit --best url 2>/dev/null)
ffmpeg -i "$file" -c:v libx265 -c:a copy "\${file%.*}_h265.mp4"

# Extract audio as FLAC
file=$(fetchit --best url 2>/dev/null)
ffmpeg -i "$file" -vn -c:a flac "\${file%.*}.flac"

# Create a GIF from a segment
file=$(fetchit --best url 2>/dev/null)
ffmpeg -i "$file" -ss 00:00:05 -t 3 -vf "fps=10,scale=320:-1" "\${file%.*}.gif"`}</Pre>

      <H3>MPV</H3>
      <P>
        Download and watch immediately:
      </P>
      <Pre>{`# One-liner: download then play
mpv "$(fetchit --best url 2>/dev/null)"

# Download a clip and play just that segment
file=$(fetchit --from 10:00 --to 12:30 url 2>/dev/null)
mpv --start=0 "$file"

# Queue multiple downloads in mpv playlist
for url in "url1" "url2" "url3"; do
  file=$(fetchit --best "$url" 2>/dev/null)
  echo "$file" >> playlist.txt
done
mpv --playlist=playlist.txt`}</Pre>

      <H3>VLC</H3>
      <Pre>{`# Linux
vlc "$(fetchit --best url 2>/dev/null)"

# macOS
open -a VLC "$(fetchit --best url 2>/dev/null)"

# Windows (PowerShell)
$file = fetchit --best url 2>$null
& "C:\Program Files\VideoLAN\VLC\vlc.exe" $file`}</Pre>

      <H3>File managers</H3>
      <Pre>{`# Open containing folder in Finder (macOS)
open "$(fetchit --best url 2>/dev/null)"

# Reveal in File Explorer (Windows, PowerShell)
$file = fetchit --best url 2>$null
Invoke-Item (Split-Path $file -Parent)

# Open in Nautilus (Linux)
nautilus "$(dirname "$(fetchit --best url 2>/dev/null)")"`}</Pre>

      <H2>Automation patterns</H2>
      <P>
        fetchit is built for automation. Below are patterns for every major automation platform.
      </P>

      <H3>Shell scripts (Bash / Zsh)</H3>
      <H4>Download a list of URLs</H4>
      <Pre>{`#!/bin/bash
set -euo pipefail

URLS=(
  "https://youtu.be/dQw4w9WgXcQ"
  "https://youtu.be/jNQXAC9IVRw"
  "https://youtu.be/9bZkp7q19f0"
)

for url in "\${URLS[@]}"; do
  fetchit --best "$url" -o ~/Videos 2>/dev/null
  echo "Finished: $url (exit code: $?)"
done`}</Pre>

      <H4>Download with logging</H4>
      <Pre>{`#!/bin/bash
logfile="fetchit-$(date +%Y%m%d).log"

fetchit --best "$1" -o ~/Videos >>"$logfile" 2>&1
exit_code=$?

echo "[$(date)] $1 -> exit $exit_code" >>"$logfile"
exit $exit_code`}</Pre>

      <H4>Watch a URL list file for changes</H4>
      <Pre>{`#!/bin/bash
# Downloads new URLs added to urls.txt
touch urls.txt urls_done.txt

while true; do
  while IFS= read -r url; do
    if ! grep -qxF "$url" urls_done.txt 2>/dev/null; then
      echo "Downloading: $url"
      if fetchit --best "$url" -o ~/Downloads 2>/dev/null; then
        echo "$url" >> urls_done.txt
      fi
    fi
  done < urls.txt
  sleep 30
done`}</Pre>

      <H3>Cron / launchd / systemd timers</H3>
      <H4>Cron (Linux / macOS)</H4>
      <P>
        Schedule recurring downloads with cron. Run <Code>crontab -e</Code> and add a line:
      </P>
      <Pre>{`# Daily podcast download at 6 AM
0 6 * * * /usr/local/bin/fetchit --mp3 https://youtu.be/... -o ~/Podcasts

# Weekly playlist sync every Sunday at 2 AM
0 2 * * 0 /usr/local/bin/fetchit --best --concurrency 3 https://youtube.com/playlist?list=PL... -o ~/Playlists

# Hourly check for new videos in a channel
0 * * * * /usr/local/bin/fetchit --best "https://www.youtube.com/@channel" -o ~/ChannelVids 2>>~/fetchit-hourly.log`}</Pre>

      <Note>
        Always use absolute paths in cron jobs. The <Code>PATH</Code> environment in cron is minimal. Specify the full binary path (e.g. <Code>/usr/local/bin/fetchit</Code>) or set <Code>PATH</Code> at the top of the crontab: <Code>PATH=/usr/local/bin:/usr/bin:/bin</Code>.
      </Note>

      <H4>launchd (macOS)</H4>
      <P>
        Create a plist file at <Code>~/Library/LaunchAgents/com.user.fetchit-podcast.plist</Code>:
      </P>
      <Pre>{`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.user.fetchit-podcast</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/fetchit</string>
    <string>--mp3</string>
    <string>https://youtu.be/...</string>
    <string>-o</string>
    <string>/Users/alice/Podcasts</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>6</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/tmp/fetchit-stdout.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/fetchit-stderr.log</string>
</dict>
</plist>`}</Pre>
      <P>Load and start the service:</P>
      <Pre>{`launchctl load ~/Library/LaunchAgents/com.user.fetchit-podcast.plist
launchctl start com.user.fetchit-podcast`}</Pre>

      <H4>systemd timer (Linux)</H4>
      <P>
        Create two files. First the service unit at <Code>~/.config/systemd/user/fetchit-download.service</Code>:
      </P>
      <Pre>{`[Unit]
Description=Download podcast via fetchit

[Service]
Type=oneshot
ExecStart=/usr/bin/fetchit --mp3 https://youtu.be/... -o ~/Podcasts
StandardOutput=append:~/.local/share/fetchit/download.log
StandardError=append:~/.local/share/fetchit/error.log`}</Pre>
      <P>Then the timer unit at <Code>~/.config/systemd/user/fetchit-download.timer</Code>:</P>
      <Pre>{`[Unit]
Description=Daily podcast download timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target`}</Pre>
      <P>Enable and start:</P>
      <Pre>{`systemctl --user daemon-reload
systemctl --user enable fetchit-download.timer
systemctl --user start fetchit-download.timer`}</Pre>

      <H3>GitHub Actions</H3>
      <P>
        Use fetchit in CI/CD pipelines to download test media assets or archive videos. Here is a workflow that downloads a video and uploads it as a release asset:
      </P>
      <Pre>{`name: Download and Release Media

on:
  schedule:
    - cron: '0 6 * * 1'  # Every Monday at 6 AM
  workflow_dispatch:  # Allow manual trigger

jobs:
  download:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install fetchit
        run: |
          curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh
          echo "$HOME/.fetchit/bin" >> $GITHUB_PATH

      - name: Download media
        run: |
          fetchit --best "https://youtu.be/dQw4w9WgXcQ" -o ./media 2>&1 | tee download.log
          echo "file=$(ls ./media/*.mp4)" >> $GITHUB_OUTPUT
        id: download

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: downloaded-media
          path: ./media/*

      - name: Create release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: ./media/*`}</Pre>

      <H3>Watch folders / directory triggers</H3>
      <H4>macOS — Folder Actions</H4>
      <P>
        Use macOS Folder Actions to trigger a download when a file containing URLs is added to a folder. In Script Editor:
      </P>
      <Pre>{`on adding folder items to this_folder after receiving added_items
  repeat with an_item in added_items
    set item_path to POSIX path of an_item
    if item_path ends with ".txt" then
      do shell script "while read url; do
        /usr/local/bin/fetchit --best \"$url\" -o ~/Downloads
      done < " & quoted form of item_path
    end if
  end repeat
end adding folder items to`}</Pre>

      <H4>inotify (Linux)</H4>
      <Pre>{`#!/bin/bash
# Watch ~/watch-folder for new .url files and download them
WATCH_DIR=~/watch-folder
mkdir -p "$WATCH_DIR"

inotifywait -m "$WATCH_DIR" -e create -e moved_to --format '%f' |
while read filename; do
  case "$filename" in
    *.txt|*.urls)
      filepath="$WATCH_DIR/$filename"
      while IFS= read -r url; do
        [ -z "$url" ] && continue
        fetchit --best "$url" -o ~/Downloads
      done < "$filepath"
      mv "$filepath" "$filepath.done"
      ;;
  esac
done`}</Pre>

      <H4>Windows PowerShell FileSystemWatcher</H4>
      <Pre>{`$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "$env:USERPROFILE\watch-folder"
$watcher.Filter = "*.txt"
$watcher.EnableRaisingEvents = $true

Register-ObjectEvent $watcher "Created" -Action {
  $path = $Event.SourceEventArgs.FullPath
  Get-Content $path | ForEach-Object {
    if ($_) {
      fetchit --best $_ -o "$env:USERPROFILE\Downloads" 2>$null
    }
  }
  # Rename to mark as processed
  Rename-Item $path -NewName "$([IO.Path]::GetFileNameWithoutExtension($path)).done"
}

# Keep the script running
while ($true) { Start-Sleep 60 }`}</Pre>

      <H2>Advanced patterns</H2>

      <H3>Download from URL list file</H3>
      <P>
        Maintain a plain text file with one URL per line and process it with a script:
      </P>
      <Pre>{`# urls.txt — one URL per line, blank lines and # comments are ignored
https://youtu.be/dQw4w9WgXcQ
https://youtu.be/jNQXAC9IVRw
# https://youtu.be/9bZkp7q19f0  (commented out — skipped)`}</Pre>
      <Pre>{`#!/bin/bash
input="urls.txt"
output_dir=~/Downloads

while IFS= read -r line; do
  # Trim whitespace
  line="\${line#"\${line%%[![:space:]]*}"}"
  line="\${line%"\${line##*[![:space:]]}"}"
  # Skip blank lines and comments
  [ -z "$line" ] && continue
  [ "\${line:0:1}" = "#" ] && continue

  echo "Downloading: $line"
  if fetchit --best "$line" -o "$output_dir" 2>/dev/null; then
    echo "  OK"
  else
    echo "  FAILED (exit code: $?)" >&2
  fi
done < "$input"`}</Pre>

      <H3>Parallel downloads across multiple terminals</H3>
      <P>
        When downloading many independent files, you can run multiple fetchit processes in parallel across different terminal windows or tmux panes:
      </P>
      <Pre>{`# Terminal 1 — 4K video
fetchit --best "https://youtu.be/video1" -o ~/Downloads/4K

# Terminal 2 — Audio podcast
fetchit --mp3 "https://youtu.be/podcast1" -o ~/Podcasts

# Terminal 3 — Playlist (override concurrency)
fetchit --best --concurrency 4 "https://youtube.com/playlist?list=PL..." -o ~/Playlists`}</Pre>
      <P>
        For coordinated parallel execution from a single script:
      </P>
      <Pre>{`#!/bin/bash
# Download three videos in parallel using background processes
urls=(
  "https://youtu.be/dQw4w9WgXcQ"
  "https://youtu.be/jNQXAC9IVRw"
  "https://youtu.be/9bZkp7q19f0"
)

pids=()
for url in "\${urls[@]}"; do
  (fetchit --best "$url" -o ~/Downloads 2>/dev/null) &
  pids+=($!)
done

# Wait for all downloads and check their exit codes
failed=0
for pid in "\${pids[@]}"; do
  wait "$pid" || failed=$((failed + 1))
done

echo "$failed downloads failed"
exit $failed`}</Pre>

      <H3>Parallel downloads with GNU Parallel</H3>
      <Pre>{`# Install GNU Parallel, then:
parallel -j 3 'fetchit --best {} -o ~/Downloads' :::: urls.txt

# With retry on failure
parallel --retries 3 'fetchit --best {} -o ~/Downloads' :::: urls.txt

# With progress bar
parallel --bar 'fetchit --best {} -o ~/Downloads 2>/dev/null' :::: urls.txt`}</Pre>

      <H3>Conditional logic — check if already downloaded</H3>
      <P>
        Avoid re-downloading videos that already exist. Use filename pattern matching:
      </P>
      <Pre>{`#!/bin/bash
url="https://youtu.be/dQw4w9WgXcQ"
output_dir=~/Downloads

# Extract video ID from URL
video_id=$(echo "$url" | sed -n 's/.*\/\\([a-zA-Z0-9_-]\\{11\\}\\).*/\\1/p')

# Check if any file already contains this video ID
if ls "$output_dir"/*"[$video_id]"* >/dev/null 2>&1; then
  echo "Already downloaded: $video_id"
  exit 0
fi

# Download
file=$(fetchit --best "$url" -o "$output_dir" 2>/dev/null)
if [ -f "$file" ]; then
  echo "Downloaded: $file"
else
  echo "Download failed" >&2
  exit 1
fi`}</Pre>

      <H3>Conditional by file size</H3>
      <Pre>{`#!/bin/bash
# Skip downloads that would produce a file smaller than 1 MB
url="https://youtu.be/dQw4w9WgXcQ"

file=$(fetchit --best "$url" 2>/dev/null)
size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

if [ "$size" -lt 1048576 ]; then
  echo "Warning: file is only $((size / 1024)) KB, may be corrupt" >&2
  rm "$file"
  exit 1
fi

echo "OK: $file ($((size / 1048576)) MB)"`}</Pre>

      <H2>Configuration via environment variables</H2>
      <P>
        fetchit respects several environment variables that override config file settings. Flags always take precedence over environment variables, which take precedence over the config file.
      </P>

      <Table
        headers={["Variable", "Type", "Description", "Example"]}
        rows={[
          ["<Code>FETCHIT_THEME</Code>", "string", "Override theme: <Code>auto</Code>, <Code>light</Code>, or <Code>dark</Code>", "FETCHIT_THEME=dark"],
          ["<Code>FETCHIT_DOWNLOAD_DIR</Code>", "string", "Default download directory", "FETCHIT_DOWNLOAD_DIR=~/Movies"],
          ["<Code>FETCHIT_LOG_LEVEL</Code>", "string", "Set log verbosity: <Code>debug</Code>, <Code>info</Code>, <Code>warn</Code>, <Code>error</Code>", "FETCHIT_LOG_LEVEL=debug"],
          ["<Code>FETCHIT_CONCURRENCY</Code>", "integer", "Default playlist concurrency", "FETCHIT_CONCURRENCY=5"],
          ["<Code>FETCHIT_OUTPUT_TEMPLATE</Code>", "string", "Output filename template (see output templates above)", 'FETCHIT_OUTPUT_TEMPLATE="{uploader} - {title}.{ext}"'],
          ["<Code>FETCHIT_COOKIES_BROWSER</Code>", "string", "Default browser for cookie extraction", "FETCHIT_COOKIES_BROWSER=firefox"],
          ["<Code>YTDLP_PATH</Code>", "string", "Path to a custom yt-dlp binary", "YTDLP_PATH=/opt/yt-dlp/yt-dlp"],
          ["<Code>FFMPEG_PATH</Code>", "string", "Path to a custom FFmpeg binary", "FFMPEG_PATH=/usr/local/bin/ffmpeg"],
          ["<Code>NO_COLOR</Code>", "any", "Disable colour output (see no-color.org)", "NO_COLOR=1"],
          ["<Code>TERM</Code>", "string", "Used for colour capability detection", "TERM=xterm-256color"],
          ["<Code>HOME</Code>", "string", "Used to resolve <Code>~</Code> in paths", "(set by system)"],
        ]}
      />

      <H3>Setting per-command</H3>
      <Pre>{`FETCHIT_DOWNLOAD_DIR=~/Movies FETCHIT_THEME=dark fetchit --best url`}</Pre>

      <H3>Setting in shell profile</H3>
      <P>Add to <Code>~/.zshrc</Code>, <Code>~/.bashrc</Code>, or PowerShell profile:</P>
      <Pre>{`# ~/.zshrc or ~/.bashrc
export FETCHIT_DOWNLOAD_DIR="$HOME/Downloads/fetchit"
export FETCHIT_THEME="dark"
export FETCHIT_LOG_LEVEL="warn"`}</Pre>
      <Pre>{`# PowerShell $PROFILE
$env:FETCHIT_DOWNLOAD_DIR = "$env:USERPROFILE\Downloads\fetchit"
$env:FETCHIT_THEME = "dark"`}</Pre>

      <H3>Setting in a <Code>.env</Code> file</H3>
      <P>
        If you use direnv or dotenv, create a <Code>.env</Code> file in your project:
      </P>
      <Pre>{`FETCHIT_DOWNLOAD_DIR=./downloads
FETCHIT_LOG_LEVEL=debug
FETCHIT_CONCURRENCY=2`}</Pre>

      <H2>Rules and validation</H2>
      <P>
        Scriptable mode enforces argument validation rules to prevent ambiguous or impossible commands. The table below lists every validation rule and its error message:
      </P>
      <Table
        headers={["Rule", "Error", "Explanation"]}
        rows={[
          ["<Code>--best</Code> and <Code>--mp3</Code> together", "can't be combined — pick one", "These flags conflict. <Code>--best</Code> downloads video+audio; <Code>--mp3</Code> downloads audio only and transcodes to MP3. They cannot both be active."],
          ["<Code>--best</Code> or <Code>--mp3</Code> without URL", "scriptable mode needs a url", "All scriptable-mode flags require a URL. Without a URL, fetchit would start interactive mode."],
          ["Unknown quality string", 'unknown quality "..."', "The quality positional argument does not match any known resolution, format ID, or shorthand. Valid values: <Code>2160p</Code>, <Code>1440p</Code>, <Code>1080p</Code>, <Code>720p</Code>, <Code>480p</Code>, <Code>360p</Code>, <Code>240p</Code>, <Code>144p</Code>, <Code>best</Code>, <Code>mp3</Code>, or a yt-dlp format ID (e.g. <Code>137+140</Code>)."],
          ["More than 2 positional arguments", "expected a url and optional quality", "fetchit accepts at most two positional arguments: the URL (required) and an optional quality string. Extra positional arguments are rejected."],
          ["Invalid URL format", "could not parse url", "The URL does not appear to be valid. Ensure it starts with <Code>http://</Code> or <Code>https://</Code> and points to a supported site."],
          ["<Code>--from</Code> without <Code>--to</Code> after it", "clipping requires --to with --from", "<Code>--from</Code> can be used alone (downloads from start time to end of video). If <Code>--to</Code> appears before <Code>--from</Code>, the argument parser rejects it."],
          ["Negative <Code>--concurrency</Code>", "concurrency must be a positive integer", "Concurrency values must be 1 or greater. Zero or negative values are invalid."],
        ]}
      />

      <H2>Exit code reference for scripts</H2>
      <P>
        The following patterns help you interpret exit codes in script logic:
      </P>
      <Pre>{`# Success
fetchit --best url && echo "Downloaded"

# Failure with error classification
fetchit --best url
case $? in
  0)  ;;  # success, nothing to do
  2|4) echo "Fix arguments and retry" ;;
  3|7) echo "Remote issue, retry later" ;;
  5|6) echo "Local issue, check disk/ffmpeg" ;;
  130) echo "User cancelled" ;;
  *)   echo "Unknown error" ;;
esac

# Retry on transient failures
until fetchit --best url; do
  case $? in
    0) break ;;
    130) exit 130 ;;  # respect user cancellation
    137) exit 137 ;;  # OOM won't resolve by retrying
    *) sleep 10 ;;
  esac
done`}</Pre>

      <H2>Rules of thumb</H2>
      <Ul>
        <Li><strong>stdout is the file path, stderr is human-readable output.</strong> Never parse stderr for automation logic.</Li>
        <Li><strong>Always check the exit code.</strong> Exit code 0 is the only guarantee of success.</Li>
        <Li><strong>Use absolute paths in cron/systemd/launchd.</strong> Relative paths depend on the working directory, which may not be what you expect.</Li>
        <Li><strong>Set a <Code>PATH</Code> in cron.</strong> Cron runs with a minimal environment. Add <Code>PATH=/usr/local/bin:/usr/bin:/bin</Code> to your crontab.</Li>
        <Li><strong>Use <Code>2{'>'}/dev/null</Code> to capture only the file path.</strong> Without this, stderr status lines intermix with your captured output.</Li>
        <Li><strong>Test with <Code>--log-level debug</Code> first.</strong> When building a script, run the fetchit command manually with debug logging to see exactly what yt-dlp returns and how fetchit handles it.</Li>
        <Li><strong>Resume interrupted downloads.</strong> Re-running the same fetchit command on a partially downloaded file resumes where it left off (yt-dlp handles partial file detection automatically).</Li>
      </Ul>

      <H2>See also</H2>
      <Ul>
        <Li><Link href="/docs/interactive-mode">Interactive Mode</Link> — full-screen TUI for manual downloads</Li>
        <Li><Link href="/docs/playlists">Playlists &amp; Multi-Video Downloads</Link> — batch download patterns and concurrency</Li>
        <Li><Link href="/docs/getting-started">Getting Started</Link> — installation, first download, and common workflows</Li>
        <Li><Link href="/docs/troubleshooting">Troubleshooting</Link> — common issues and solutions for both modes</Li>
      </Ul>
    </Prose>
  )
}
