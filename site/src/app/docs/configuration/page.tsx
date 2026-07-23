import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "Configuration" }

export default function Configuration() {
  return (
    <Prose>
      <H1>Configuration</H1>
      <P>
        fetchit is designed to be flexible out of the box while giving you full control over every
        aspect of its behaviour. You can configure it through a JSON config file, environment
        variables, or CLI flags — each layer overriding the one below it. This page documents every
        configuration option, the environment variables that map to them, the directory layout, and
        how fetchit integrates with yt-dlp and ffmpeg.
      </P>

      <H2>Configuration File</H2>
      <P>
        fetchit reads its persistent configuration from a JSON file located at{" "}
        <Code>~/.config/fetchit/config.json</Code>. This file is optional — if it does not exist,
        fetchit falls back to built-in defaults. You can also specify a custom config directory via
        the <Code>FETCHIT_CONFIG_DIR</Code> environment variable, which changes where fetchit looks
        for this file.
      </P>
      <P>
        The file must be valid JSON with a top-level object. Unknown keys are silently ignored, so
        you can safely keep deprecated options when upgrading. Boolean values must be{" "}
        <Code>true</Code> or <Code>false</Code> (not strings). Null values explicitly unset a field
        and cause fetchit to fall through to the default.
      </P>
      <P>Here is an example configuration file with every available option:</P>
      <Pre filename="~/.config/fetchit/config.json">{`{
  "theme": "auto",
  "concurrency": 3,
  "output": "~/Downloads",
  "ytdlpPath": null,
  "ffmpegPath": null,
  "cookiesFromBrowser": null,
  "defaultQuality": null
}`}</Pre>
      <P>
        Each field maps directly to a CLI flag and an environment variable. The table below
        describes them in detail.
      </P>

      <H2>Options</H2>
      <Table
        headers={["Option", "Type", "Default", "Description"]}
        rows={[
          ["theme", "string", '"auto"', 'Theme for the TUI. Accepts "auto" (follows system preference), "light", or "dark". When set to "auto", fetchit reads the OS-level color scheme and switches between light and dark palettes accordingly.'],
          ["concurrency", "number", "3", "Maximum number of parallel fragment downloads. Higher values (8–16) can speed up downloads on fast connections but consume more memory and CPU. Lower values (1–2) are gentler on limited bandwidth. The default of 3 is a safe starting point for most connections."],
          ["output", "string", '"~/Downloads"', 'Default output directory for downloaded files. Supports the tilde (~) shortcut for the user home directory. Relative paths are resolved from the current working directory. This path is used when no -o / --output flag is provided.'],
          ["ytdlpPath", "string", "null", "Absolute path to a custom yt-dlp binary. When set, fetchit uses this binary instead of the auto-managed copy at ~/.fetchit/bin/yt-dlp. Useful for pinning a specific yt-dlp version or using a system-wide installation. Set to null to use the bundled copy."],
          ["ffmpegPath", "string", "null", "Absolute path to a custom ffmpeg binary. If set, fetchit passes this location to yt-dlp for merging streams and transcoding. Set to null to let fetchit search PATH and common installation directories automatically."],
          ["cookiesFromBrowser", "string", "null", 'Name of the browser to extract cookies from. Accepts "firefox", "chrome", "chromium", "edge", "brave", "opera", and "safari". Cookies enable access to private videos, age-restricted content, and premium-quality streams. Set to null to disable browser cookie extraction. Firefox is recommended on Windows because it stores cookies in plaintext SQLite — Chrome and Edge encrypt them with platform-level keys that yt-dlp may not be able to decrypt.'],
          ["defaultQuality", "string", "null", 'Default quality to use when no quality argument or --best / --mp3 flag is provided. Accepts resolution keywords like "1080p", "720p", "480p", or special values "best" and "mp3". When null, fetchit prompts the user in TUI mode or defaults to "best" in non-interactive mode.'],
        ]}
      />

      <H2>Environment Variables</H2>
      <P>
        Every configuration option can be set via an environment variable with the{" "}
        <Code>FETCHIT_</Code> prefix. Environment variables sit above the config file in the
        precedence hierarchy but below CLI flags, making them ideal for CI/CD pipelines, Docker
        containers, and shared development environments where you want to override defaults without
        touching a config file.
      </P>
      <P>
        Boolean-like environment variables (those that enable or disable a feature) accept the
        values <Code>1</Code>, <Code>true</Code>, <Code>yes</Code>, and <Code>on</Code> (all
        case-insensitive). Any other value — including an empty string or the variable being unset —
        is treated as false.
      </P>
      <Table
        headers={["Variable", "Overrides", "Description"]}
        rows={[
          ["FETCHIT_THEME", "theme", 'Default theme for the TUI. Accepts "auto", "light", or "dark". Overrides the theme field in config.json when no --theme flag is passed.'],
          ["FETCHIT_CONCURRENCY", "concurrency", "Default number of parallel fragment downloads. Must be a positive integer. Overrides the concurrency field in config.json when no --concurrency flag is passed."],
          ["FETCHIT_OUTPUT", "output", "Default output directory. Overrides the output field in config.json when no -o / --output flag is passed. Supports tilde expansion."],
          ["FETCHIT_YTDLP_PATH", "ytdlpPath", "Path to a custom yt-dlp binary. If set, fetchit uses this binary instead of the auto-managed copy. Takes precedence over the ytdlpPath field in config.json."],
          ["FETCHIT_FFMPEG_PATH", "ffmpegPath", "Path to a custom ffmpeg binary. If set, fetchit passes this location to yt-dlp. Takes precedence over the ffmpegPath field in config.json."],
          ["FETCHIT_COOKIES_BROWSER", "cookiesFromBrowser", 'Name of the browser to extract cookies from. Overrides the cookiesFromBrowser field in config.json. Supported: firefox, chrome, chromium, edge, brave, opera, safari.'],
          ["FETCHIT_CONFIG_DIR", "—", "Custom directory for the configuration file. When set, fetchit reads config.json from this directory instead of ~/.config/fetchit/. This is useful for portable setups, testing, or when you want to keep configuration alongside a project."],
          ["FETCHIT_HOME", "—", "Custom data directory. When set, fetchit uses this directory instead of ~/.local/share/fetchit/ (or the platform equivalent) for storing runtime data such as the auto-downloaded yt-dlp binary and cache files."],
        ]}
      />
      <P>
        Two of these variables — <Code>FETCHIT_CONFIG_DIR</Code> and <Code>FETCHIT_HOME</Code> —
        do not correspond to a config file field because they control <em>where</em> fetchit looks
        for configuration and stores data, rather than their values. They are read early during
        startup, before the config file is parsed.
      </P>
      <Note>
        Environment variables are the recommended way to configure fetchit in Docker containers and
        CI/CD runners. They require no filesystem setup and are inheritable across process
        boundaries. For local development, a config file is usually more convenient because it
        persists across terminal sessions automatically.
      </Note>

      <H2>Configuration Precedence</H2>
      <P>
        fetchit resolves its effective configuration using a layered precedence model. Each layer
        can override the one below it. When a value is not set at a given layer, fetchit looks at
        the next layer down. This is a common pattern in CLI tools and gives you fine-grained
        control without requiring you to specify every option every time.
      </P>
      <P>The precedence hierarchy, from highest to lowest priority, is:</P>
      <Ol>
        <Li>
          <strong>CLI flags</strong> — Highest priority. Any flag passed on the command line
          overrides all other sources. If you pass <Code>--concurrency 8</Code>, that value is used
          regardless of what the config file or environment variables say. Not every option has a
          CLI flag; options like <Code>ytdlpPath</Code> are only configurable via the config file or
          environment variables.
        </Li>
        <Li>
          <strong>Environment variables</strong> — The <Code>FETCHIT_*</Code> variables are checked
          next. They override the config file but are overridden by CLI flags. This layer is
          especially useful in CI/CD where you want to inject configuration without modifying files.
        </Li>
        <Li>
          <strong>Config file</strong> — The JSON file at <Code>~/.config/fetchit/config.json</Code>{" "}
          (or the path specified by <Code>FETCHIT_CONFIG_DIR</Code>) provides persistent defaults.
          Values from this file are used when neither a CLI flag nor an environment variable is
          supplied for a given option.
        </Li>
        <Li>
          <strong>Built-in defaults</strong> — The fallback when no value is found in any of the
          above layers. These are hardcoded in fetchit and provide sensible defaults for a typical
          user: theme auto, concurrency 3, output ~/Downloads, and so on.
        </Li>
      </Ol>
      <P>
        This layered approach means you can set your preferred theme and output directory in the
        config file once, override concurrency via an environment variable in a specific terminal
        session, and then override the output directory for a single download via the{" "}
        <Code>-o</Code> flag — all without changing the config file.
      </P>
      <Blockquote>
        <strong>Implementation note:</strong> fetchit evaluates environment variables and CLI flags
        using their string representations, not their config-file equivalents. This means that if
        you set <Code>FETCHIT_CONCURRENCY=8</Code>, it is treated as an override of the default and
        the config file value — it does not merge with the config file value. The same applies to
        CLI flags: <Code>--concurrency 8</Code> completely replaces any concurrency setting from
        lower layers.
      </Blockquote>

      <H2>Data Directories</H2>
      <P>
        fetchit uses several directories to store configuration, runtime data, cache files, and
        download history. These follow the XDG Base Directory specification on Linux and macOS, with
        sensible equivalents on Windows. You can override the base locations using{" "}
        <Code>FETCHIT_CONFIG_DIR</Code> and <Code>FETCHIT_HOME</Code>.
      </P>

      <H3>Configuration directory</H3>
      <P>
        Stores the user configuration file. On Linux and macOS, this is{" "}
        <Code>~/.config/fetchit/</Code>. On Windows, it is{" "}
        <Code>%APPDATA%\fetchit\</Code> (typically{" "}
        <Code>C:\Users\&lt;user&gt;\AppData\Roaming\fetchit</Code>). This directory contains:
      </P>
      <Ul>
        <Li><Code>config.json</Code> — The main configuration file with all user preferences.</Li>
        <Li>
          <Code>history.json</Code> — A JSON array of recently downloaded URLs and their metadata.
          Used by the TUI for URL autocomplete and the <Code>--from-history</Code> flag. This file
          is managed automatically; you can delete it to clear your download history without
          affecting other settings.
        </Li>
      </Ul>

      <H3>Data directory</H3>
      <P>
        Stores runtime data that is not configuration but persists across sessions. On Linux, this
        is <Code>~/.local/share/fetchit/</Code>. On macOS, it is{" "}
        <Code>~/Library/Application Support/fetchit/</Code>. On Windows, it is{" "}
        <Code>%LOCALAPPDATA%\fetchit\</Code> (typically{" "}
        <Code>C:\Users\&lt;user&gt;\AppData\Local\fetchit</Code>). This directory contains:
      </P>
      <Ul>
        <Li>
          <Code>bin/yt-dlp</Code> (or <Code>bin/yt-dlp.exe</Code> on Windows) — The auto-downloaded
          yt-dlp engine. This binary is managed by fetchit and updated via <Code>fetchit update</Code>.
        </Li>
        <Li>
          Platform-specific metadata files used by yt-dlp for persistent storage, such as archive
          files and download tracker databases.
        </Li>
      </Ul>

      <H3>Cache directory</H3>
      <P>
        Stores temporary data that can be safely deleted. On Linux and macOS, this is{" "}
        <Code>~/.cache/fetchit/</Code>. On Windows, it is{" "}
        <Code>%LOCALAPPDATA%\fetchit\cache\</Code>. This directory contains:
      </P>
      <Ul>
        <Li>
          Fragment cache — Partial download fragments that are being assembled into the final file.
          These are cleaned up automatically after a successful download.
        </Li>
        <Li>
          yt-dlp cache — yt-dlp maintains an internal cache for format lookups and player
          extraction, stored in a subdirectory here.
        </Li>
        <Li>
          Thumbnail cache — Thumbnails downloaded for display in the TUI, if applicable.
        </Li>
      </Ul>
      <P>
        The cache directory can be cleared at any time without data loss. Run{" "}
        <Code>fetchit doctor --clean-cache</Code> or delete the directory manually.
      </P>

      <H3>History file</H3>
      <P>
        The download history is stored at <Code>~/.config/fetchit/history.json</Code> (or the
        platform equivalent). It is a JSON array of objects, each containing the URL, title,
        quality, and timestamp of a completed download. The TUI reads this file to provide URL
        suggestions and the <Code>--from-history</Code> flag allows you to re-download a recent
        video by its index in the history.
      </P>
      <P>
        The history file is capped at 500 entries by default. When the cap is reached, the oldest
        entries are trimmed. You can disable history entirely by setting{" "}
        <Code>FETCHIT_NO_HISTORY=1</Code> or by adding <Code>"noHistory": true</Code> to the config
        file.
      </P>

      <Note>
        If you are using <Code>FETCHIT_HOME</Code> to redirect the data directory, note that the
        config directory is <em>not</em> affected — it is controlled separately by{" "}
        <Code>FETCHIT_CONFIG_DIR</Code>. This separation lets you keep configuration in a
        version-controlled location (e.g., a dotfiles repository) while storing bulky runtime data
        elsewhere.
      </Note>

      <H2>yt-dlp Integration</H2>
      <P>
        fetchit is not a downloader itself — it delegates all actual downloading to{" "}
        <Link href="https://github.com/yt-dlp/yt-dlp">yt-dlp</Link>, the well-known command-line
        program for downloading videos from YouTube and hundreds of other sites. fetchit acts as a
        friendly frontend: it manages the yt-dlp binary, constructs the appropriate command-line
        arguments, parses the output, and presents a polished TUI or CLI interface.
      </P>

      <H3>Auto-download on first run</H3>
      <P>
        When you run fetchit for the first time, it checks whether a compatible yt-dlp binary is
        available. If none is found, fetchit automatically downloads the latest stable release of
        yt-dlp from GitHub and places it at <Code>~/.local/share/fetchit/bin/yt-dlp</Code> (or the
        platform equivalent under <Code>FETCHIT_HOME</Code>). This binary is used for all
        subsequent downloads unless overridden by <Code>ytdlpPath</Code> or{" "}
        <Code>FETCHIT_YTDLP_PATH</Code>.
      </P>
      <P>
        The auto-download happens in the background during startup and typically completes within a
        few seconds on a fast connection. If the download fails (e.g., no network access), fetchit
        prints a warning and falls back to any yt-dlp found on PATH. You can trigger a manual
        re-download with <Code>fetchit update</Code>.
      </P>

      <H3>Updating yt-dlp</H3>
      <P>
        YouTube and other sites frequently change their APIs and player code, which means yt-dlp
        must be updated regularly to stay functional. fetchit provides a dedicated command to update
        the managed yt-dlp binary:
      </P>
      <Pre>{`fetchit update`}</Pre>
      <P>
        This command downloads the latest yt-dlp release, verifies its integrity via SHA-256
        checksum, replaces the old binary atomically (the old binary is renamed to{" "}
        <Code>yt-dlp.old</Code> as a backup), and prints the new version number. If you use a
        custom yt-dlp path (<Code>ytdlpPath</Code>), the update command skips the managed copy and
        prints a reminder to update your custom binary manually.
      </P>
      <P>
        fetchit does <em>not</em> auto-update yt-dlp on every run. You are responsible for running{" "}
        <Code>fetchit update</Code> periodically. We recommend updating at least once a month, or
        whenever you encounter download failures that mention "This video is unavailable" or "Sign
        in to confirm your age" — these are often signs that yt-dlp is out of date.
      </P>

      <H3>Custom yt-dlp path</H3>
      <P>
        If you prefer to manage yt-dlp yourself — for example, you have a system-wide installation
        via your package manager, or you need a specific version for compatibility — you can tell
        fetchit to use a custom binary:
      </P>
      <Ul>
        <Li>
          <strong>Config file:</strong> Set <Code>"ytdlpPath": "/usr/local/bin/yt-dlp"</Code> in{" "}
          <Code>config.json</Code>.
        </Li>
        <Li>
          <strong>Environment variable:</strong> Set{" "}
          <Code>FETCHIT_YTDLP_PATH=/usr/local/bin/yt-dlp</Code>.
        </Li>
      </Ul>
      <P>
        When a custom path is configured, fetchit uses that binary directly and skips the managed
        copy. The <Code>fetchit update</Code> command will detect the custom path and skip the
        update, printing a notice instead. This is particularly useful in CI/CD pipelines where you
        want to pin a specific yt-dlp version for reproducibility.
      </P>

      <H3>Fallback behaviour</H3>
      <P>
        If the configured yt-dlp binary does not exist or fails to execute, fetchit attempts these
        fallbacks in order:
      </P>
      <Ol>
        <Li>The managed copy at <Code>~/.local/share/fetchit/bin/yt-dlp</Code>.</Li>
        <Li>Any <Code>yt-dlp</Code> found on the system PATH.</Li>
        <Li>
          A prompt to download yt-dlp automatically. If the user confirms, the download proceeds
          and fetchit retries the operation.
        </Li>
      </Ol>
      <P>
        If all fallbacks fail, fetchit exits with an error message explaining that yt-dlp could not
        be located and provides instructions for manual installation.
      </P>

      <H2>ffmpeg Integration</H2>
      <P>
        ffmpeg is required for several fetchit features: merging separate video and audio streams
        into a single file, extracting audio and transcoding to MP3, embedding chapter markers, and
        clipping video segments by timestamp. Unlike yt-dlp, fetchit does <em>not</em> bundle or
        auto-download ffmpeg — you must install it separately.
      </P>

      <H3>Detection logic</H3>
      <P>
        When fetchit needs ffmpeg (for example, when downloading 1080p video, which on YouTube is
        typically delivered as separate video-only and audio-only streams), it searches for an
        ffmpeg binary in the following order:
      </P>
      <Ol>
        <Li>
          The path specified by <Code>ffmpegPath</Code> in the config file or{" "}
          <Code>FETCHIT_FFMPEG_PATH</Code> in the environment.
        </Li>
        <Li>
          Any <Code>ffmpeg</Code> or <Code>ffmpeg.exe</Code> found on the system PATH.
        </Li>
        <Li>
          Common installation directories: <Code>/usr/bin/ffmpeg</Code>,{" "}
          <Code>/usr/local/bin/ffmpeg</Code>, <Code>/opt/homebrew/bin/ffmpeg</Code> (macOS ARM),
          <Code>C:\tools\ffmpeg.exe</Code>, <Code>C:\ProgramData\chocolatey\bin\ffmpeg.exe</Code>,
          and <Code>%LOCALAPPDATA%\Microsoft\WinGet\packages\ffmpeg</Code>.
        </Li>
      </Ol>
      <P>
        If ffmpeg is not found and the requested operation requires it, fetchit prints a clear error
        message with installation instructions for your platform. Downloads that do not require
        ffmpeg (e.g., 720p YouTube videos that come as a single multiplexed stream, or audio-only
        downloads with the <Code>--ytdl-args "-x --audio-format mp3"</Code> fallback) proceed
        without it.
      </P>

      <H3>What requires ffmpeg</H3>
      <Ul>
        <Li>
          <strong>Stream merging:</strong> When a video is downloaded in a resolution that requires
          merging a separate video-only stream and audio-only stream (typical for YouTube 1080p and
          above), ffmpeg is used to multiplex them into a single MP4 or MKV file.
        </Li>
        <Li>
          <strong>MP3 extraction:</strong> The <Code>--mp3</Code> flag and <Code>mp3</Code> quality
          keyword use ffmpeg to transcode the downloaded audio stream to MP3 format.
        </Li>
        <Li>
          <strong>Chapter embedding:</strong> The <Code>--chapters</Code> flag uses ffmpeg to
          embed YouTube chapter markers into the output file.
        </Li>
        <Li>
          <strong>Timestamp clipping:</strong> The <Code>--from</Code> and <Code>--to</Code> flags
          use ffmpeg to cut the downloaded video to the specified time range without re-encoding
          (fast seek).
        </Li>
      </Ul>

      <H3>Installing ffmpeg</H3>
      <P>
        Installation instructions vary by platform. Here are the recommended methods:
      </P>
      <Table
        headers={["Platform", "Command / Method"]}
        rows={[
          ["macOS (Homebrew)", "brew install ffmpeg"],
          ["Ubuntu / Debian", "sudo apt install ffmpeg"],
          ["Fedora / RHEL", "sudo dnf install ffmpeg"],
          ["Arch Linux", "sudo pacman -S ffmpeg"],
          ["Windows (Chocolatey)", "choco install ffmpeg"],
          ["Windows (WinGet)", "winget install ffmpeg"],
          ["Windows (manual)", "Download from https://ffmpeg.org/download.html and add to PATH"],
          ["Docker", 'RUN apt update && apt install -y ffmpeg  (Debian-based images)'],
        ]}
      />
      <P>
        After installing, run <Code>ffmpeg -version</Code> to verify the installation. Then run{" "}
        <Code>fetchit doctor</Code> to confirm fetchit detects ffmpeg correctly. If you installed
        ffmpeg to a non-standard location, set <Code>ffmpegPath</Code> in the config file or{" "}
        <Code>FETCHIT_FFMPEG_PATH</Code> in the environment.
      </P>

      <H3>Custom ffmpeg path</H3>
      <P>
        Just like yt-dlp, you can point fetchit to a custom ffmpeg binary. This is useful if you
        have a specific build (e.g., a static build for portability, or a version with specific
        codec support):
      </P>
      <Ul>
        <Li>
          <strong>Config file:</strong> Set <Code>"ffmpegPath": "/opt/ffmpeg-custom/bin/ffmpeg"</Code>{" "}
          in <Code>config.json</Code>.
        </Li>
        <Li>
          <strong>Environment variable:</strong> Set{" "}
          <Code>FETCHIT_FFMPEG_PATH=/opt/ffmpeg-custom/bin/ffmpeg</Code>.
        </Li>
      </Ul>
      <P>
        When a custom path is set, fetchit uses it directly and skips all detection logic. If the
        binary at the custom path does not exist or is not executable, fetchit prints an error and
        does <em>not</em> fall back to other locations — this is intentional so that misconfigured
        paths are surfaced immediately rather than silently ignored.
      </P>

      <H2>Custom Output Templates</H2>
      <P>
        fetchit uses yt-dlp&apos;s powerful output template system to name downloaded files. By
        default, downloaded files are saved using the following pattern:
      </P>
      <Pre>{`~/Downloads/%(title)s.%(ext)s`}</Pre>
      <P>
        This produces files like <Code>~/Downloads/Never Gonna Give You Up.mp4</Code>. The{" "}
        <Code>%(title)s</Code> placeholder expands to the video title, and{" "}
        <Code>%(ext)s</Code> expands to the appropriate file extension (mp4, mkv, webm, mp3, etc.).
      </P>
      <P>
        You can customise this pattern using yt-dlp&apos;s full set of template variables. Pass your
        custom template via the <Code>-o</Code> / <Code>--output</Code> flag:
      </P>
      <Pre>{`# Include video ID and upload date
fetchit -o "~/Downloads/%(upload_date)s - %(id)s - %(title)s.%(ext)s" https://...

# Organise by uploader
fetchit -o "~/Downloads/%(uploader)s/%(title)s.%(ext)s" https://...

# Limit title length (useful on Windows where paths are limited to 260 characters)
fetchit -o "~/Downloads/%(title).100B.%(ext)s" https://...

# Use a flat numeric index
fetchit -o "~/Downloads/video_%(autonumber)03d.%(ext)s" https://...`}</Pre>

      <H3>Playlist subfolder behaviour</H3>
      <P>
        When downloading a playlist, fetchit organises files into subdirectories named after the
        playlist title by default. The effective output pattern becomes:
      </P>
      <Pre>{`~/Downloads/%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s`}</Pre>
      <P>
        This creates a folder structure like:
      </P>
      <Pre>{`~/Downloads/
  My Playlist/
    1 - First Video.mp4
    2 - Second Video.mp4
    3 - Third Video.mp4`}</Pre>
      <P>
        The playlist subfolder behaviour can be disabled with the <Code>--flat</Code> flag. When{" "}
        <Code>--flat</Code> is passed, all files are saved directly into the output directory
        regardless of playlist membership:
      </P>
      <Pre>{`fetchit --flat https://youtube.com/playlist?list=...`}</Pre>
      <P>
        You can also override the playlist template entirely by providing a custom output pattern
        that includes (or excludes) playlist variables:
      </P>
      <Pre>{`# Flatten but still include playlist index in the filename
fetchit -o "~/Downloads/%(playlist_title)s - %(playlist_index)s - %(title)s.%(ext)s" --flat https://...

# Custom subfolder structure by playlist ID instead of title
fetchit -o "~/Downloads/%(playlist_id)s/%(title)s.%(ext)s" https://...`}</Pre>

      <H3>Supported template variables</H3>
      <P>
        fetchit supports all yt-dlp output template variables. The most commonly used ones are:
      </P>
      <Table
        headers={["Variable", "Description", "Example"]}
        rows={[
          ["%(title)s", "Video title (may contain characters invalid on some filesystems)", "Never Gonna Give You Up"],
          ["%(id)s", "Video ID from the URL", "dQw4w9WgXcQ"],
          ["%(ext)s", "Output file extension", "mp4"],
          ["%(uploader)s", "Channel / uploader name", "Rick Astley"],
          ["%(upload_date)s", "Upload date in YYYYMMDD format", "20091025"],
          ["%(playlist_title)s", "Playlist title (empty for single videos)", "My Mix"],
          ["%(playlist_id)s", "Playlist ID", "PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"],
          ["%(playlist_index)s", "Numeric index within playlist (1-based)", "1"],
          ["%(playlist_count)s", "Total number of items in the playlist", "42"],
          ["%(autonumber)s", "Auto-incrementing number across all downloads", "00001"],
          ["%(duration)s", "Video duration in seconds", "212"],
          ["%(height)s", "Height of the downloaded video stream", "1080"],
          ["%(resolution)s", "Resolution string (width x height)", "1920x1080"],
          ["%(fps)s", "Frame rate of the video stream", "30"],
        ]}
      />
      <P>
        For the complete list, see the{" "}
        <Link href="https://github.com/yt-dlp/yt-dlp#output-template">yt-dlp output template
        documentation</Link>. Note that characters that are illegal on your filesystem (such as{" "}
        <Code>/</Code>, <Code>\0</Code>, or <Code>:</Code> on Windows) are automatically
        sanitised by yt-dlp and replaced with underscores.
      </P>

      <Note>
        On Windows, file paths are limited to 260 characters by default. If your output template
        produces paths longer than this, the download will fail with a "path too long" error. Use
        the <Code>%(title).100B</Code> syntax to truncate the title to 100 bytes, or enable long
        path support via Group Policy (<Code>Computer Configuration &gt; Administrative Templates
        &gt; System &gt; Filesystem &gt; Enable Win32 long paths</Code>).
      </Note>

      <H2>Configuring the TUI</H2>
      <P>
        In addition to the options described above, the TUI has a few behaviour flags that can be
        set in the config file or via CLI flags:
      </P>
      <Table
        headers={["Option / Flag", "Type", "Default", "Description"]}
        rows={[
          ["noHistory", "boolean", "false", "If true, do not record download history. This can also be set via FETCHIT_NO_HISTORY=1."],
        ]}
      />
      <P>
        These options are additional fields you can include at the top level of{" "}
        <Code>config.json</Code> alongside the ones in the Options table above.
      </P>

      <H2>Validating your configuration</H2>
      <P>
        After editing your config file or setting environment variables, you can validate
        everything is correct by running:
      </P>
      <Pre>{`fetchit doctor`}</Pre>
      <P>
        The <Code>doctor</Code> command reads your configuration, checks for common issues,
        verifies that yt-dlp and ffmpeg are accessible (and that the configured custom paths
        exist), and prints a summary of all resolved settings. This is the fastest way to confirm
        that your changes have taken effect and that your setup is healthy.
      </P>
      <P>
        You can also print the effective configuration for inspection:
      </P>
      <Pre>{`fetchit --verbose doctor`}</Pre>
      <P>
        This displays the full merged configuration object, showing which value each option
        resolved to and which layer it came from.
      </P>

      <H2>Example configurations</H2>

      <H3>Minimal setup</H3>
      <P>
        If you only want to change the output directory and set a default quality, your config file
        can be as small as:
      </P>
      <Pre filename="~/.config/fetchit/config.json">{`{
  "output": "~/Videos/fetchit",
  "defaultQuality": "1080p"
}`}</Pre>

      <H3>Power user setup</H3>
      <P>
        An example that uses custom binary paths, dark theme, high concurrency, and browser cookies:
      </P>
      <Pre filename="~/.config/fetchit/config.json">{`{
  "theme": "dark",
  "concurrency": 8,
  "output": "~/Movies/fetchit",
  "ytdlpPath": "/usr/local/bin/yt-dlp",
  "ffmpegPath": "/opt/homebrew/bin/ffmpeg",
  "cookiesFromBrowser": "firefox",
  "defaultQuality": "best",
  "windowed": true,
  "logLevel": "info",
  "noHistory": false
}`}</Pre>

      <H3>Windows setup</H3>
      <P>
        On Windows, paths use backslashes and the default data directories differ:
      </P>
      <Pre filename="%APPDATA%\fetchit\config.json">{`{
  "theme": "auto",
  "concurrency": 4,
  "output": "C:\\Users\\<user>\\Videos\\fetchit",
  "ytdlpPath": "C:\\tools\\yt-dlp\\yt-dlp.exe",
  "ffmpegPath": "C:\\tools\\ffmpeg\\bin\\ffmpeg.exe",
  "cookiesFromBrowser": "firefox",
  "defaultQuality": "720p"
}`}</Pre>
      <P>
        Note that on Windows, backslashes in JSON must be escaped as <Code>\\</Code>. You can also
        use forward slashes — Windows accepts them in most contexts.
      </P>

      <H2>Next steps</H2>
      <P>
        With your configuration in place, explore the <Link href="/docs/cli-reference">CLI
        Reference</Link> for the full list of flags and arguments, or dive into{" "}
        <Link href="/docs/interactive-mode">Interactive Mode</Link> to learn how to use the TUI
        efficiently. Run <Code>fetchit doctor</Code> anytime to verify your setup is healthy.
      </P>
    </Prose>
  )
}
