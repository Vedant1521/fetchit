import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "CLI Reference" }

export default function CliReference() {
  return (
    <Prose>
      <H1>CLI Reference</H1>
      <P>
        fetchit is a terminal-based video downloader with a rich CLI, an interactive TUI, and a
        scriptable non-interactive mode. This reference covers every command-line flag, argument,
        environment variable, exit code, and usage pattern. Whether you are writing a one-liner or
        integrating fetchit into a pipeline, this page is the canonical source of truth.
      </P>

      <H2>Usage</H2>
      <P>The basic invocation form is:</P>
      <Pre>{`fetchit [url] [quality] [options]`}</Pre>
      <P>
        The <Code>url</Code> argument is required in non-interactive mode. If omitted, fetchit
        launches the TUI and prompts for input. The <Code>quality</Code> argument is optional and
        can be specified positionally.
      </P>

      <H2>Positional Arguments</H2>
      <Table headers={["Argument", "Description"]} rows={[
        ["url", "Video or playlist URL to download. Supports YouTube, Vimeo, Twitter/X, Twitch, TikTok, Instagram, Facebook, and hundreds of other sites via yt-dlp."],
        ["quality", "Desired resolution or format. Accepts values like 1080p, 720p, 480p, 360p, best, or mp3. See Quality Specification below for details."],
      ]} />

      <H2>Options</H2>
      <Table headers={["Flag", "Description", "Default"]} rows={[
        ["--best", "Download the best available quality automatically. Equivalent to passing 'best' as the quality argument.", "false"],
        ["--mp3", "Extract audio from the video and save as MP3. Shorthand for setting quality to mp3.", "false"],
        ["--chapters", "Embed YouTube chapter markers into the output file (MP4/MKV only). Requires ffmpeg.", "false"],
        ["--from <time>", "Start download at a specific timestamp. Accepts formats like 5:30, 1:02:15, or 90 (seconds).", "—"],
        ["--to <time>", "Stop download at a specific timestamp. Same format as --from.", "—"],
        ["-o, --output <path>", "Output directory or file template. Supports yt-dlp output template variables like %(title)s, %(id)s, %(ext)s.", "./downloads"],
        ["--concurrency <n>", "Number of parallel fragment downloads. Higher values can speed up downloads on fast connections at the cost of more memory.", "3"],
        ["--theme <theme>", "Color theme for the TUI. Accepts auto (follows system), light, or dark.", "auto"],
        ["--cookies-from-browser <browser>", "Extract cookies from a browser profile and pass them to yt-dlp. Supported: firefox, chrome, chromium, edge, brave, opera, safari.", "—"],
        ["--version", "Print the installed fetchit version and exit.", "—"],
        ["--help", "Print a summary of all flags and exit.", "—"],
      ]} />

      <H2>Exit Codes</H2>
      <P>
        fetchit follows UNIX exit code conventions with additional codes for specific error
        conditions. Scripts and pipelines can inspect the exit code to determine how to handle
        failures.
      </P>
      <Table headers={["Code", "Meaning"]} rows={[
        ["0", "Success — the download completed without errors."],
        ["1", "Generic error — an unexpected error occurred. Check the log output for details."],
        ["2", "Invalid arguments — the provided flags or positional arguments could not be parsed."],
        ["3", "Network error — a connection could not be established or was interrupted."],
        ["4", "ffmpeg not found — ffmpeg is required but was not found in PATH or at the configured location."],
        ["5", "yt-dlp error — yt-dlp returned a non-zero exit code. Run with --verbose to see the full yt-dlp output."],
        ["6", "Rate limited — YouTube or the target site returned HTTP 429 (Too Many Requests)."],
        ["130", "Cancelled — the user pressed Ctrl+C to interrupt the download."],
      ]} />

      <H2>Quality Specification</H2>
      <P>
        The quality argument (and the underlying <Code>--best</Code> and <Code>--mp3</Code> flags)
        map to yt-dlp format selectors. fetchit simplifies the most common cases so you do not need
        to learn yt-dlp&apos;s format selector syntax for typical use.
      </P>

      <H3>Resolution Keywords</H3>
      <P>
        When you pass a resolution like <Code>1080p</Code>, <Code>720p</Code>,{" "}
        <Code>480p</Code>, or <Code>360p</Code>, fetchit selects the best video stream whose
        height is at most the given value and merges it with the best available audio stream.
        If ffmpeg is not installed, only formats that already contain both video and audio are
        considered (typically lower resolutions).
      </P>
      <Table headers={["Keyword", "Max Height", "Typical Use Case"]} rows={[
        ["2160p / 4k", "2160", "Ultra HD — very large files, requires fast internet and ample disk space."],
        ["1440p / 2k", "1440", "Quad HD — good balance above 1080p if available."],
        ["1080p", "1080", "Full HD — best quality for most viewers. Available on nearly all content."],
        ["720p", "720", "HD Ready — smaller files, faster downloads. Good for mobile or slower connections."],
        ["480p", "480", "SD — small files, suitable for limited data plans or archival."],
        ["360p", "360", "Lowest acceptable quality — usable for previews or very slow connections."],
        ["best", "infinite", "Download the single best quality available (highest resolution + best audio). Equivalent to --best."],
        ["mp3", "—", "Extract audio only and encode as MP3 (requires ffmpeg). Shortcut for --mp3."],
      ]} />
      <Note>
        Not all resolutions are available on every video. YouTube and other platforms encode videos
        at varying resolution tiers depending on the original upload. If a requested resolution is
        not available, yt-dlp falls back to the next best option and fetchit prints a notice.
      </Note>

      <H3>Format Selection Internals</H3>
      <P>
        Under the hood, fetchit translates quality keywords into yt-dlp format selectors. Here is
        the mapping so you can craft custom selectors if needed via the <Code>--ytdl-args</Code>{" "}
        passthrough:
      </P>
      <Table headers={["fetchit Keyword", "yt-dlp Format Selector"]} rows={[
        ["best", "b"],
        ["2160p / 4k", "bestvideo[height<=2160]+bestaudio/best[height<=2160]"],
        ["1440p / 2k", "bestvideo[height<=1440]+bestaudio/best[height<=1440]"],
        ["1080p", "bestvideo[height<=1080]+bestaudio/best[height<=1080]"],
        ["720p", "bestvideo[height<=720]+bestaudio/best[height<=720]"],
        ["480p", "bestvideo[height<=480]+bestaudio/best[height<=480]"],
        ["360p", "bestvideo[height<=360]+bestaudio/best[height<=360]"],
        ["mp3", "bestaudio/best"],
      ]} />
      <P>
        You can override format selection entirely by passing raw yt-dlp format selectors:
      </P>
      <Pre>{`fetchit --ytdl-args "-f 'bestvideo[codec=avc1]+bestaudio[codec=mp4a}'" https://...`}</Pre>

      <H3>Audio-Only Mode</H3>
      <P>
        When <Code>mp3</Code> quality or the <Code>--mp3</Code> flag is used, fetchit downloads
        the best available audio stream and transcodes it to MP3 via ffmpeg. If you need a
        different audio format, use the <Code>--ytdl-args</Code> passthrough:
      </P>
      <Pre>{`# Download as opus (smaller, better quality but less compatible)
fetchit --ytdl-args "-x --audio-format opus" https://...

# Download as flac (lossless, very large)
fetchit --ytdl-args "-x --audio-format flac" https://...

# Download as aac
fetchit --ytdl-args "-x --audio-format aac" https://...`}</Pre>

      <H2>Environment Variables</H2>
      <P>
        fetchit reads configuration from environment variables prefixed with{" "}
        <Code>FETCHIT_</Code>. These variables override the default values but are themselves
        overridden by CLI flags (CLI flags have the highest priority).
      </P>
      <Table headers={["Variable", "Description", "Example"]} rows={[
        ["FETCHIT_THEME", "Default theme for the TUI. Overrides --theme when no flag is passed.", "dark"],
        ["FETCHIT_CONCURRENCY", "Default number of parallel downloads. Overrides --concurrency.", "5"],
        ["FETCHIT_OUTPUT", "Default output directory. Overrides -o / --output.", "~/videos"],
        ["FETCHIT_YTDLP_PATH", "Path to a custom yt-dlp binary. If set, fetchit uses this instead of the bundled copy.", "/usr/local/bin/yt-dlp"],
        ["FETCHIT_FFMPEG_PATH", "Path to a custom ffmpeg binary. If set, fetchit passes this location to yt-dlp.", "/usr/local/bin/ffmpeg"],
        ["FETCHIT_NO_TUI", "If set to 1 or true, always run in non-interactive CLI mode.", "1"],
      ]} />
      <P>
        Environment variables are useful when you want to configure fetchit system-wide or in
        CI/CD pipelines without creating a config file. They are also the only way to configure
        fetchit in environments where config file access is restricted (e.g., Docker containers).
      </P>
      <Note>
        Boolean environment variables like <Code>FETCHIT_NO_TUI</Code> accept the values{" "}
        <Code>1</Code>, <Code>true</Code>, <Code>yes</Code>, or <Code>on</Code>. Any other value
        (including unset) is treated as false.
      </Note>

      <H2>Configuration File</H2>
      <P>
        In addition to CLI flags and environment variables, fetchit reads configuration from JSON
        files. The configuration hierarchy, from lowest to highest priority, is:
      </P>
      <Ol>
        <Li>Built-in defaults</Li>
        <Li>System-wide config at <Code>/etc/fetchit/config.json</Code> (Unix) or <Code>%PROGRAMDATA%\fetchit\config.json</Code> (Windows)</Li>
        <Li>User config at <Code>~/.fetchit/config.json</Code></Li>
        <Li>Project-level config at <Code>.fetchitrc</Code> in the current working directory</Li>
        <Li>Environment variables (<Code>FETCHIT_*</Code>)</Li>
        <Li>CLI flags (highest priority)</Li>
      </Ol>
      <P>Example user configuration file:</P>
      <Pre filename="~/.fetchit/config.json">{`{
  "outputDir": "~/videos",
  "defaultQuality": "1080p",
  "concurrency": 5,
  "theme": "dark",
  "flat": false,
  "windowed": false,
  "logLevel": "info",
  "chapters": true
}`}</Pre>

      <H2>Examples</H2>

      <H3>Basic Download</H3>
      <P>Download a video at the best available quality:</P>
      <Pre>{`fetchit https://youtube.com/watch?v=dQw4w9WgXcQ`}</Pre>

      <H3>Specify Quality</H3>
      <P>Download at a specific resolution:</P>
      <Pre>{`fetchit https://youtube.com/watch?v=dQw4w9WgXcQ 1080p`}</Pre>

      <H3>Audio Extraction</H3>
      <P>Download a video and extract its audio as an MP3 file:</P>
      <Pre>{`fetchit --mp3 https://youtube.com/watch?v=dQw4w9WgXcQ

# Equivalent using positional quality argument:
fetchit https://youtube.com/watch?v=dQw4w9WgXcQ mp3`}</Pre>

      <H3>Best Quality Shortcut</H3>
      <P>Download the absolute best quality available, regardless of resolution:</P>
      <Pre>{`fetchit --best https://youtube.com/watch?v=dQw4w9WgXcQ`}</Pre>

      <H3>Clip a Section</H3>
      <P>Download only a specific segment of a video using start and end times:</P>
      <Pre>{`fetchit --from 1:30 --to 3:45 https://youtube.com/watch?v=dQw4w9WgXcQ

# Using seconds
fetchit --from 90 --to 225 https://youtube.com/watch?v=dQw4w9WgXcQ`}</Pre>
      <Note>
        Time-based clipping works by passing <Code>--download-sections</Code> to yt-dlp, which
        uses a fast seek where possible. The result is a precisely cut video file — no need for
        separate editing software.
      </Note>

      <H3>Custom Output Directory</H3>
      <P>Save downloads to a specific folder:</P>
      <Pre>{`fetchit -o ~/Movies https://youtube.com/watch?v=dQw4w9WgXcQ

# With output template variables
fetchit -o "~/Movies/%(playlist)s/%(title)s.%(ext)s" https://youtube.com/playlist?list=...`}</Pre>

      <H3>Playlist Download</H3>
      <P>Download an entire playlist. fetchit creates a subfolder for each playlist by default.</P>
      <Pre>{`fetchit https://youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf

# Skip playlist subfolders
fetchit --flat https://youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf

# Download specific items from a playlist
fetchit --ytdl-args "--playlist-items 1,3,5-7" https://youtube.com/playlist?list=...`}</Pre>

      <H3>Authenticated Downloads</H3>
      <P>
        Pass browser cookies to access private videos, age-restricted content, or premium quality
        streams:
      </P>
      <Pre>{`# Use Firefox cookies
fetchit --cookies-from-browser firefox https://youtube.com/watch?v=...

# Use Chrome cookies
fetchit --cookies-from-browser chrome https://youtube.com/watch?v=...

# Use a cookies file (exported via browser extension)
fetchit --ytdl-args "--cookies cookies.txt" https://youtube.com/watch?v=...`}</Pre>
      <Blockquote>
        Firefox is recommended on Windows when extracting cookies. Chrome and Edge encrypt cookies
        with platform-level keys that yt-dlp may not be able to decrypt. Firefox stores cookies in
        plaintext SQLite and works reliably across all platforms.
      </Blockquote>

      <H3>Parallel Downloads</H3>
      <P>Increase or decrease the number of concurrent fragment downloads:</P>
      <Pre>{`# Faster downloads on high-bandwidth connections
fetchit --concurrency 8 https://youtube.com/watch?v=...

# Conservative setting for limited bandwidth
fetchit --concurrency 1 https://youtube.com/watch?v=...`}</Pre>
      <P>
        Higher concurrency values can significantly improve download speeds on fast connections but
        consume more memory and CPU. The default of 3 is a safe starting point. Monitor resource
        usage if you increase it substantially.
      </P>

      <H3>Embed Chapters</H3>
      <P>Preserve YouTube chapter markers in the downloaded file:</P>
      <Pre>{`fetchit --chapters https://youtube.com/watch?v=dQw4w9WgXcQ`}</Pre>
      <P>
        Chapters are embedded as MP4/MKV chapter markers. Not all media players support them, but
        most modern players (VLC, MPV, IINA) do.
      </P>

      <H3>Custom yt-dlp and ffmpeg Paths</H3>
      <P>
        If you have custom builds of yt-dlp or ffmpeg, point fetchit to them via environment
        variables:
      </P>
      <Pre>{`# PowerShell
$env:FETCHIT_YTDLP_PATH = "C:\tools\yt-dlp.exe"
$env:FETCHIT_FFMPEG_PATH = "C:\tools\ffmpeg.exe"
fetchit https://youtube.com/watch?v=dQw4w9WgXcQ

# Bash
export FETCHIT_YTDLP_PATH=/opt/yt-dlp-custom
export FETCHIT_FFMPEG_PATH=/opt/ffmpeg-custom
fetchit https://youtube.com/watch?v=dQw4w9WgXcQ`}</Pre>

      <H3>Theme Selection</H3>
      <P>Force a specific color theme for the TUI:</P>
      <Pre>{`fetchit --theme light https://youtube.com/watch?v=...
fetchit --theme dark https://youtube.com/watch?v=...

# Let fetchit follow the system theme
fetchit --theme auto https://youtube.com/watch?v=...`}</Pre>

      <H3>Download from Clipboard</H3>
      <P>
        When launched without arguments, fetchit opens the TUI and optionally detects a YouTube URL
        from the system clipboard:
      </P>
      <Pre>{`fetchit`}</Pre>
      <P>
        The TUI prompts you to paste a URL or confirms the one detected from the clipboard. This
        is the fastest way to download when you already have a URL copied.
      </P>

      <H3>Non-Interactive / Scriptable Mode</H3>
      <P>
        When stdout is not a terminal (piped, redirected, or run in CI), fetchit automatically
        disables the TUI and behaves as a pure CLI tool. This makes it suitable for scripting and
        automation:
      </P>
      <Pre>{`# In a shell script
fetchit https://youtube.com/watch?v=dQw4w9WgXcQ 720p -o ~/downloads > /dev/null

# Capture the output filename (if yt-dlp supports --print after download)
fetchit --ytdl-args "--print after_move:filepath" https://...`}</Pre>

      <H3>Using Behind a Proxy</H3>
      <P>fetchit passes proxy settings directly to yt-dlp:</P>
      <Pre>{`fetchit --ytdl-args "--proxy http://127.0.0.1:8080" https://...

# SOCKS5 proxy
fetchit --ytdl-args "--proxy socks5://127.0.0.1:1080" https://...`}</Pre>

      <H3>Rate Limit Workaround</H3>
      <P>
        If you hit YouTube rate limits, add a delay between requests and provide browser cookies:
      </P>
      <Pre>{`fetchit --cookies-from-browser firefox --ytdl-args "--sleep-interval 30" https://youtube.com/playlist?list=...`}</Pre>

      <H3>Download Only Subtitles</H3>
      <P>You can download subtitles or closed captions instead of video:</P>
      <Pre>{`fetchit --ytdl-args "--write-subs --sub-lang en --skip-download" https://...`}</Pre>

      <H3>Custom Output Template</H3>
      <P>Use yt-dlp output template variables for fine-grained file naming:</P>
      <Pre>{`# Use video ID and upload date
fetchit -o "%(upload_date)s - %(title)s.%(ext)s" https://...

# Limit title length (Windows path length workaround)
fetchit -o "%(title).100B.%(ext)s" https://...`}</Pre>

      <H3>Checking the Version</H3>
      <P>Print the currently installed fetchit version and exit:</P>
      <Pre>{`fetchit --version`}</Pre>

      <H3>Getting Help</H3>
      <P>Print a summary of all available flags:</P>
      <Pre>{`fetchit --help`}</Pre>

      <H2>Shell Completions</H2>
      <P>
        fetchit provides shell completion scripts for Bash, Zsh, and Fish. These are typically
        installed automatically when you install fetchit via npm, but can be manually sourced if
        needed.
      </P>
      <P>To enable completions for your current shell:</P>
      <Pre>{`# Bash — add to ~/.bashrc
source <(fetchit completion bash)

# Zsh — add to ~/.zshrc
source <(fetchit completion zsh)

# Fish — add to ~/.config/fish/config.fish
fetchit completion fish | source`}</Pre>
      <P>
        Completions provide tab-completion for URLs (from history), quality keywords, flags, and
        flag arguments (e.g., theme names, log levels).
      </P>

      <H2>Signal Handling</H2>
      <P>
        fetchit handles the following POSIX signals to ensure clean shutdown and avoid leaving
        partial files:
      </P>
      <Table headers={["Signal", "Behaviour"]} rows={[
        ["SIGINT / SIGTERM (Ctrl+C)", "Interrupts the current download gracefully. yt-dlp finalises any partial fragment before exiting. Exit code 130."],
        ["SIGQUIT (Ctrl+\\)", "Forcefully terminates the process without cleanup. Use only if SIGINT is unresponsive."],
        ["SIGHUP", "Sent when the terminal closes. fetchit attempts to save state and exit cleanly. Exit code 1."],
      ]} />

      <H2>Exit Code Usage in Scripts</H2>
      <P>
        The exit codes are designed to be actionable in shell scripts. Here is a common pattern:
      </P>
      <Pre>{`fetchit https://youtube.com/watch?v=... 1080p
case $? in
  0) echo "Download succeeded" ;;
  2) echo "Bad arguments — check your syntax" ;;
  3) echo "Network error — check your connection" ;;
  4) echo "ffmpeg is required for this operation" ;;
  5) echo "yt-dlp failed — run with --verbose" ;;
  6) echo "Rate limited — use cookies or a VPN" ;;
  130) echo "User cancelled" ;;
  *) echo "Unknown error ($?)" ;;
esac`}</Pre>
      <P>
        In CI/CD pipelines, consider retrying on exit codes 3 (network) and 6 (rate limit), as
        these are typically transient.
      </P>

      <H2>Global Flags</H2>
      <P>
        The following flags are available on every invocation and must appear before any positional
        arguments:
      </P>
      <Table headers={["Flag", "Description"]} rows={[
        ["--help", "Print help information and exit."],
        ["--version", "Print version information and exit."],
      ]} />
      <P>
        All other flags can appear in any order, but positional arguments must appear in the order
        shown in the usage line: <Code>fetchit [url] [quality] [options]</Code>.
      </P>

      <H2>Pass-Through Arguments</H2>
      <P>
        Any argument prefixed with <Code>--ytdl-args</Code> is passed verbatim to yt-dlp. This
        gives you access to the full power of yt-dlp while keeping fetchit&apos;s interface simple.
        Some useful passthrough options:
      </P>
      <Table headers={["Flag", "Description"]} rows={[
        ['--ytdl-args "--list-formats"', "List all available formats for a video without downloading."],
        ['--ytdl-args "--write-auto-subs"', "Download auto-generated subtitles (YouTube)."],
        ['--ytdl-args "--embed-thumbnail"', "Embed the video thumbnail into the output file."],
        ['--ytdl-args "--embed-metadata"', "Embed metadata (title, uploader, etc.) into the output file."],
        ['--ytdl-args "--sleep-interval 30"', "Wait 30 seconds between each video in a playlist."],
        ['--ytdl-args "--limit-rate 5M"', "Limit download speed to 5 MB/s."],
        ['--ytdl-args "--ignore-errors"', "Skip unavailable videos in a playlist and continue."],
        ['--ytdl-args "--no-mtime"', "Do not set file modification date to video upload date."],
      ]} />
      <Note>
        When passing quoted arguments through <Code>--ytdl-args</Code>, be careful with quoting
        rules in your shell. On Windows PowerShell, use single quotes for the inner yt-dlp flag
        value. On Unix, use double quotes around the entire <Code>--ytdl-args</Code> value and
        single quotes inside if needed.
      </Note>

      <H2>Best Practices</H2>
      <Ul>
        <Li>
          <strong>Always use --verbose when reporting bugs.</strong> The verbose output contains
          the exact yt-dlp command, its full output, and internal fetchit state. This is the
          single most helpful piece of information for debugging.
        </Li>
        <Li>
          <strong>Set FETCHIT_YTDLP_PATH in CI/CD</strong> to pin a specific yt-dlp version and
          avoid unexpected breakage from automatic updates.
        </Li>
        <Li>
          <strong>Use --flat for playlist downloads in scripts</strong> to guarantee a predictable
          output structure (no nested subdirectories).
        </Li>
        <Li>
          <strong>Prefer --cookies-from-browser over cookie files</strong> for security. Cookie
          files store credentials in plaintext.
        </Li>
        <Li>
          <strong>Set FETCHIT_THEME=dark</strong> in your shell profile if you consistently prefer
          the dark theme, so you do not need to pass <Code>--theme</Code> every time.
        </Li>
        <Li>
          <strong>Use --best or --mp3 in cron jobs or CI</strong> to avoid the interactive TUI.
          Override to --best temporarily when troubleshooting.
        </Li>
        <Li>
          <strong>Run <Code>fetchit doctor</Code></strong> to verify your environment when
          something does not work as expected. It checks for yt-dlp, ffmpeg, PATH configuration,
          and common misconfigurations.
        </Li>
      </Ul>
    </Prose>
  )
}
