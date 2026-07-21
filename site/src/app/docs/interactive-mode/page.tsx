import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "Interactive Mode" }

export default function InteractiveMode() {
  return (
    <Prose>
      <H1>Interactive Mode</H1>
      <P>
        fetchit's interactive mode is a full-screen terminal interface for downloading media from YouTube, Twitch, and hundreds of other sites. It guides you through every step — from pasting a URL to choosing the right format and watching the download complete in real time. This guide covers every screen, key, and feature in detail.
      </P>

      <H2>Launching fetchit</H2>
      <P>
        You start the interactive interface by running the <Code>fetchit</Code> command with no arguments, or by passing a URL directly.
      </P>

      <H3>Without a URL</H3>
      <Pre>{`fetchit`}</Pre>
      <P>
        When you run <Code>fetchit</Code> without any arguments, it opens directly to the <strong>Input screen</strong>. A text field at the top of the terminal awaits a URL. If fetchit detects a valid media link on your clipboard, it shows a hint suggesting you press <Code>[Tab]</Code> to paste it. This is the most common way to launch the tool.
      </P>

      <H3>With a URL</H3>
      <Pre>{`fetchit "https://youtube.com/watch?v=dQw4w9WgXcQ"`}</Pre>
      <P>
        Pass a URL as the first argument to skip the Input screen entirely. fetchit goes straight into the <strong>Probing phase</strong>, fetching metadata for that link. This is useful when scripting or when you already know what you want to download.
      </P>

      <H3>With flags</H3>
      <P>Several flags modify how the interactive interface behaves at launch:</P>
      <Table
        headers={["Flag", "Description"]}
        rows={[
          ["--theme dark", "Start with the dark theme (bypasses auto-detection)"],
          ["--theme light", "Start with the light theme"],
          ["--format id", "Pre-select a format by ID (skips the format picker)"],
          ["--windowed", "Force windowed mode (disables full-screen)"],
          ["--log-level debug", "Show verbose debug output alongside the UI"],
        ]}
      />
      <P>
        For a full list of available flags, run <Code>fetchit --help</Code>.
      </P>

      <Note>
        When you pass both a URL and <Code>--format</Code>, fetchit runs fully automatically — it probes, selects the format, downloads, and exits. This is useful for quick one-shot downloads without interactive input.
      </Note>

      <H2>Screen-by-screen walkthrough</H2>
      <P>Each time you use fetchit, it moves through a series of phases. Here is what happens on every screen.</P>

      <H3>1. Input screen</H3>
      <P>
        This is the first screen you see when launching without a URL. A clean text field sits at the top with a blinking cursor, ready for a link. Below it, a footer shows available keyboard actions and a compact fetchit logo.
      </P>

      <H4>URL field</H4>
      <P>
        Type or paste a URL into the field. The supported URL formats include standard YouTube links (<Code>youtube.com/watch?v=...</Code>), short links (<Code>youtu.be/...</Code>), Twitch streams and VODs, and URLs from any site yt-dlp supports. The field supports standard text editing keys — see the keyboard reference below for the full list.
      </P>

      <H4>Clipboard detection</H4>
      <P>
        On launch, fetchit reads your system clipboard. If it finds a string that looks like a media URL (contains <Code>youtube.com</Code>, <Code>twitch.tv</Code>, <Code>youtu.be</Code>, etc.), a subtle hint appears in the footer: <em>"Clipboard: press [Tab] to paste"</em>. Press <Code>[Tab]</Code> to populate the field instantly.
      </P>

      <H4>URL history</H4>
      <P>
        Once the field has focus, press <Code>[↑]</Code> and <Code>[↓]</Code> to cycle through your most recent URLs. The last 50 URLs you downloaded are stored on disk, so history persists across sessions. See the <Link href="#url-history">URL history section</Link> for details on managing it.
      </P>

      <H3>2. Probing phase</H3>
      <P>
        After you press <Code>[Enter]</Code> with a valid URL, fetchit hands the link to yt-dlp to fetch available formats and metadata. This typically takes 1-5 seconds.
      </P>

      <H4>What happens</H4>
      <P>
        fetchit runs <Code>yt-dlp --dump-json</Code> in the background. The response includes:
      </P>
      <Ul>
        <Li>Video title, uploader, duration, and thumbnail URL</Li>
        <Li>Every available format — video-only streams, audio-only streams, and combined streams</Li>
        <Li>For each format: resolution, codec, FPS, bitrate, file size estimate, and format ID</Li>
        <Li>Chapter markers (if the site provides them)</Li>
      </Ul>

      <H4>Progress indicators</H4>
      <P>
        A spinner animates in the terminal while probing. If you passed the <Code>--log-level debug</Code> flag, the raw yt-dlp JSON output streams beneath the spinner in real time, giving you full visibility into what is being fetched.
      </P>

      <H4>Cancelling</H4>
      <P>
        Press <Code>[Esc]</Code> to cancel the probe and return to the Input screen. This is useful if you pasted the wrong URL or the probe is taking too long.
      </P>

      <H3>3. Format picker</H3>
      <P>
        Once probing completes, fetchit displays a scrollable list of available formats. The best matches are sorted to the top: recommended combined formats first, then high-resolution video-only streams, then audio-only options. Each row shows metadata about the format so you can make an informed choice.
      </P>

      <H4>Understanding format metadata</H4>
      <P>Each format row displays up to seven columns of information:</P>
      <Table
        headers={["Column", "Description"]}
        rows={[
          ["ID", "Internal format identifier (e.g. 137, 140, 247+251)"],
          ["Resolution", "Video dimensions (e.g. 1920x1080) or audio bitrate label"],
          ["Codec", "Video codec (av01, vp9, h264) or audio codec (aac, opus, mp3)"],
          ["FPS", "Frames per second — 30, 60, or variable"],
          ["Size", "Estimated file size (e.g. 245.3 MiB)"],
          ["Bitrate", "Average bitrate in kbps"],
          ["Notes", "Extra info — HDR, 3D, live, or download status"],
        ]}
      />
      <P>
        The <strong>Size</strong> column is an estimate based on bitrate and duration. The actual file may differ slightly due to container overhead and variable bitrate encoding. Formats labelled <Code>DASH</Code> or <Code>video only</Code> / <Code>audio only</Code> require muxing — fetchit merges them automatically after download.
      </P>

      <H4>Understanding format options</H4>
      <P>
        Formats fall into three broad categories. Understanding the trade-offs helps you pick the right one.
      </P>
      <Ul>
        <Li>
          <strong>Video + Audio (combined)</strong> — A single file containing both video and audio tracks. These are the simplest to use; the file is ready immediately after downloading. They are usually limited to 720p or 1080p on most platforms.
        </Li>
        <Li>
          <strong>Video only</strong> — High-resolution video without audio. Common for 4K, 60 FPS, or HDR streams. fetchit will automatically download the best matching audio stream and mux them into a single file using ffmpeg.
        </Li>
        <Li>
          <strong>Audio only</strong> — Just the audio track, typically in opus (webm), m4a (aac), or mp3 format. Useful for music, podcasts, or when you only need the soundtrack.
        </Li>
      </Ul>

      <H4>Codec choices</H4>
      <P>
        YouTube and other platforms serve video in several codecs. Each offers different quality-per-bitrate trade-offs:
      </P>
      <Ul>
        <Li><strong>av01</strong> — Best compression efficiency, largest playback compatibility gap. Great quality at low bitrates. May not play on older devices.</Li>
        <Li><strong>vp9</strong> — Excellent compression, widely supported in modern browsers. YouTube's primary codec for 4K content.</Li>
        <Li><strong>h264 (avc1)</strong> — Universal compatibility. Every device can play it, but requires higher bitrates for the same quality as vp9 or av01.</Li>
      </Ul>
      <P>
        When multiple codecs are available for the same resolution, fetchit sorts av01 above vp9 above h264 — reflecting the best quality-to-size ratio. You are free to pick any option based on your playback needs.
      </P>

      <H4>Chapters feature</H4>
      <P>
        Press <Code>[C]</Code> while the format list is focused to toggle chapter embedding. When enabled, fetchit pulls chapter markers from the video metadata and embeds them into the output file. Chapters appear as named timestamps in media players like VLC, MPV, and macOS QuickTime. This feature works on YouTube and any other site that exposes chapter information in yt-dlp's output.
      </P>
      <P>
        The chapter data is embedded into the file's container metadata — it does not re-encode the video, so there is no quality loss. The toggle state persists for the current session but resets when you start a new download.
      </P>

      <H4>Time range clipping</H4>
      <P>
        Press <Code>[T]</Code> in the format picker to open a time-range prompt. You can enter a start and end time to download only a portion of the video. This creates a clip without re-encoding using ffmpeg's fast seek.
      </P>
      <P>Supported time formats:</P>
      <Table
        headers={["Syntax", "Example", "Description"]}
        rows={[
          ["MM:SS-MM:SS", "5:30-10:15", "From 5:30 to 10:15"],
          ["HH:MM:SS-HH:MM:SS", "1:05:00-1:30:00", "From 1h 5m to 1h 30m"],
          ["-MM:SS", "-2:00", "Last 2 minutes of the video"],
          ["MM:SS-", "3:00-", "From 3:00 to the end"],
        ]}
      />
      <H4>Limitations</H4>
      <Ul>
        <Li>Time range clipping uses lossless stream copy — it cuts at the nearest keyframe, not at the exact second you specify. The clip may start or end a few frames early or late.</Li>
        <Li>Some formats (especially DASH streams with separate audio and video) may have slight A/V desync at the cut points. This is rare but depends on the source encoding.</Li>
        <Li>Time ranges are not compatible with chapter embedding when the range does not align with chapter boundaries.</Li>
      </Ul>

      <Note>
        If you need frame-accurate cuts, download the full file and use a video editor. fetchit's clipping is designed for quick, throwaway clips and social media sharing — not precision editing.
      </Note>

      <H3>4. Download phase</H3>
      <P>
        After you select a format, fetchit begins downloading. A full-screen progress bar shows real-time status.
      </P>

      <H4>Progress bar details</H4>
      <P>
        The progress bar fills from left to right as the download progresses. It includes:
      </P>
      <Ul>
        <Li><strong>Percentage</strong> — complete percentage (e.g. 73%)</Li>
        <Li><strong>Downloaded / Total</strong> — bytes transferred vs. total file size (e.g. 180.2 / 245.3 MiB)</Li>
        <Li><strong>Speed</strong> — current download speed (e.g. 12.5 MiB/s)</Li>
        <Li><strong>ETA</strong> — estimated time remaining (e.g. 00:05)</Li>
        <Li><strong>Elapsed</strong> — time since download started (e.g. 00:14)</Li>
      </Ul>
      <P>
        For formats that require muxing (e.g. separate DASH video + audio streams), fetchit shows two progress bars sequentially: first the video download, then the audio download, then a brief "Muxing..." step where ffmpeg merges them into the final file.
      </P>

      <H4>Cancelling</H4>
      <P>
        Press <Code>[Esc]</Code> to cancel the download at any time. The partially downloaded file is deleted automatically. You return to the format picker to choose again or press <Code>[Esc]</Code> again to go back to the Input screen.
      </P>

      <H3>5. Done screen</H3>
      <P>
        When the download completes successfully, fetchit shows a confirmation screen with details about the saved file:
      </P>
      <Ul>
        <Li><strong>File path</strong> — absolute path to the downloaded file on disk</Li>
        <Li><strong>File size</strong> — final size of the completed file</Li>
        <Li><strong>Title</strong> — the video title for confirmation</Li>
        <Li><strong>Duration</strong> — the length of the downloaded media</Li>
      </Ul>
      <P>
        Press <Code>[Enter]</Code> to fetch another URL. This returns you to the Input screen with a fresh URL field. Your history and theme selection persist.
      </P>

      <H3>6. Error screen</H3>
      <P>
        If something goes wrong at any phase, fetchit displays an error screen with a descriptive message. Common errors include:
      </P>
      <Ul>
        <Li><strong>Invalid URL</strong> — the URL could not be parsed or is not supported by yt-dlp</Li>
        <Li><strong>Network error</strong> — connection timed out, DNS resolution failed, or the site returned an error</Li>
        <Li><strong>Format unavailable</strong> — the selected format is no longer available (rare, usually means the video was removed or geo-blocked)</Li>
        <Li><strong>Download failed</strong> — the download stream was interrupted mid-transfer</Li>
        <Li><strong>Muxing failed</strong> — ffmpeg could not merge the video and audio streams</Li>
      </Ul>
      <P>
        Each error screen shows the raw error message from yt-dlp or ffmpeg at the bottom for troubleshooting. Press <Code>[Enter]</Code> to retry (returning to the Input screen), or <Code>[Esc]</Code> to quit.
      </P>

      <Note>
        If you encounter persistent errors, run <Code>fetchit --log-level debug</Code> to see the full command output. This often reveals missing dependencies, outdated yt-dlp, or network configuration issues.
      </Note>

      <H2>Complete keyboard reference</H2>
      <P>Every key in fetchit is context-aware. The same key may do different things depending on the active phase. Keys are grouped by category below.</P>

      <H3>Global keys (all phases)</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Ctrl+C]", "Quit fetchit immediately"],
          ["[Ctrl+T]", "Cycle theme: auto → light → dark → auto"],
          ["[Ctrl+L]", "Clear terminal and redraw the UI"],
        ]}
      />

      <H3>Input phase</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Enter]", "Start probing the entered URL"],
          ["[Tab]", "Paste clipboard URL into the field"],
          ["[↑]", "Recall previous URL from history"],
          ["[↓]", "Recall next URL from history"],
          ["[U]", "Update yt-dlp to the latest version"],
          ["[Esc]", "Quit fetchit"],
        ]}
      />

      <H3>Text editing (URL field)</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[←] / [→]", "Move cursor one character left/right"],
          ["[Ctrl+A] / [Home]", "Jump to the start of the field"],
          ["[Ctrl+E] / [End]", "Jump to the end of the field"],
          ["[Alt+←] / [Alt+B]", "Jump back one word"],
          ["[Alt+→] / [Alt+F]", "Jump forward one word"],
          ["[Backspace]", "Delete character before cursor"],
          ["[Delete]", "Delete character at cursor"],
          ["[Ctrl+U]", "Delete from cursor to start"],
          ["[Ctrl+K]", "Delete from cursor to end"],
          ["[Ctrl+W]", "Delete word before cursor"],
        ]}
      />

      <H3>Probing phase</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Esc]", "Cancel probing, return to Input screen"],
        ]}
      />

      <H3>Format picker phase</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[↑] / [↓]", "Move highlight up/down through format list"],
          ["[PageUp] / [PageDown]", "Scroll formats by one page"],
          ["[Home]", "Jump to the first format"],
          ["[End]", "Jump to the last format"],
          ["[Enter]", "Download the highlighted format"],
          ["[C]", "Toggle chapter embedding on/off"],
          ["[T]", "Set a time range for clipping"],
          ["[U]", "Update yt-dlp to the latest version"],
          ["[Esc]", "Go back to Input screen"],
        ]}
      />

      <H3>Download phase</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Esc]", "Cancel the current download"],
        ]}
      />

      <H3>Done phase</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Enter]", "Start a new download (returns to Input)"],
          ["[Esc]", "Quit fetchit"],
        ]}
      />

      <H3>Error phase</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Enter]", "Retry (returns to Input screen)"],
          ["[Esc]", "Quit fetchit"],
        ]}
      />

      <H2>Theme system</H2>
      <P>fetchit ships with three themes — <strong>auto</strong>, <strong>light</strong>, and <strong>dark</strong>. The interface is built with the <Link href="https://charm.sh/">Bubble Tea</Link> framework and respects your terminal's colour capabilities.</P>

      <H3>Auto mode</H3>
      <P>
        When set to <Code>auto</Code>, fetchit inspects the terminal's background colour using OSC 11 escape sequence queries. If the terminal reports a dark background (brightness below 50% in HSL), the dark theme is applied. Otherwise, the light theme is used. This detection runs once at startup and again each time you cycle to <Code>auto</Code> via <Code>[Ctrl+T]</Code>.
      </P>
      <Blockquote>
        Auto-detection requires terminal support for the OSC 11 query. Most modern terminals (iTerm2, kitty, WezTerm, Windows Terminal, GNOME Terminal, Alacritty) support it. If the query fails or times out, fetchit defaults to the dark theme.
      </Blockquote>

      <H3>Light &amp; dark themes</H3>
      <P>
        Light mode uses a clean white background with dark text — suitable for well-lit environments. Dark mode uses a near-black background with light text — easier on the eyes in dim lighting and on OLED screens. Both themes use the full 24-bit colour range of your terminal for progress bars, borders, and highlights.
      </P>

      <H3>Cycling themes</H3>
      <P>Press <Code>[Ctrl+T]</Code> to cycle through <Code>auto → light → dark → auto</Code>. The current theme is shown briefly in the footer when it changes.</P>

      <H3>Setting a theme at startup</H3>
      <Pre>{`fetchit --theme dark
fetchit --theme light
fetchit --theme auto`}</Pre>

      <H3>Customizing theme colours</H3>
      <P>
        fetchit does not expose individual colour overrides through the CLI. To customize the look, you can configure your terminal's colour scheme — fetchit inherits the <Code>foreground</Code>, <Code>background</Code>, and standard ANSI colours from your terminal emulator. For deep customization, consider modifying the base theme definitions in fetchit's source under <Code>internal/ui/styles/</Code>.
      </P>

      <H2>Mouse support</H2>
      <P>fetchit has full mouse support in terminals that enable the SGR mouse protocol (most modern terminal emulators). Interactive elements detect click events and respond accordingly.</P>

      <H3>Which terminals support it</H3>
      <P>Mouse support works in iTerm2, kitty, WezTerm, Windows Terminal, GNOME Terminal, Alacritty, Konsole, and any terminal that sets the <Code>TERM</Code> environment to <Code>xterm-256color</Code> or a variant that includes mouse tracking. Raw terminal multiplexers like <Code>tmux</Code> also support it when configured with <Code>set -g mouse on</Code>.</P>

      <H3>What is clickable</H3>
      <Ul>
        <Li><strong>Format rows</strong> — click any row in the format picker to select it and immediately start downloading</Li>
        <Li><strong>fetchit button</strong> — on the Input screen, click the styled "fetchit" button to trigger the current URL</Li>
        <Li><strong>Footer hints</strong> — each footer hint (e.g. "[Enter] Fetch") is clickable and triggers the same action as the corresponding key</Li>
        <Li><strong>Logo</strong> — clicking the fetchit logo returns you to the Input screen (acts like pressing <Code>[Esc]</Code> from most phases)</Li>
      </Ul>
      <P>
        Mouse support can be disabled by starting fetchit with the <Code>--windowed</Code> flag, which disables full-screen rendering and mouse event capture.
      </P>

      <H2>Clipboard detection</H2>
      <P>
        On launch, fetchit reads the system clipboard using platform-specific commands:
      </P>
      <Ul>
        <Li><strong>macOS</strong> — <Code>pbpaste</Code></Li>
        <Li><strong>Linux</strong> — <Code>xclip -selection clipboard -o</Code> or <Code>wl-paste</Code> (Wayland)</Li>
        <Li><strong>Windows</strong> — PowerShell's <Code>Get-Clipboard</Code></Li>
      </Ul>
      <P>
        If the clipboard content matches a known URL pattern for a supported site, fetchit displays a subtle hint in the footer: <em>"Clipboard: press [Tab] to paste"</em>. Pressing <Code>[Tab]</Code> fills the URL field with the detected link. Clipboard detection only happens at startup — it does not watch for changes while the app is running.
      </P>

      <H2>URL history</H2>
      <P>fetchit keeps a record of your downloaded URLs to make repeat downloads fast.</P>

      <H3>Viewing history</H3>
      <P>
        On the Input screen, use <Code>[↑]</Code> and <Code>[↓]</Code> to cycle through previous URLs. The field updates with each entry. History is ordered from most recent to oldest.
      </P>

      <H3>Storage location</H3>
      <P>History is stored in a JSON file on disk:</P>
      <Table
        headers={["Platform", "Path"]}
        rows={[
          ["macOS / Linux", "~/.config/fetchit/history.json"],
          ["Windows", "%APPDATA%\\fetchit\\history.json"],
        ]}
      />

      <H3>Clearing history</H3>
      <P>
        Deleting the file resets history completely. The file is plain JSON — you can view it with any text editor:
      </P>
      <Pre>{`cat ~/.config/fetchit/history.json`}</Pre>
      <P>
        The file is capped at 50 entries. When a new URL is added past the limit, the oldest entry is removed automatically.
      </P>

      <H2>Config file</H2>
      <P>fetchit reads configuration from a JSON file on startup. Settings are merged with CLI flags — flags take precedence over the config file.</P>

      <H3>Location</H3>
      <Table
        headers={["Platform", "Path"]}
        rows={[
          ["macOS / Linux", "~/.config/fetchit/config.json"],
          ["Windows", "%APPDATA%\\fetchit\\config.json"],
        ]}
      />

      <H3>Available options</H3>
      <Table
        headers={["Key", "Type", "Default", "Description"]}
        rows={[
          ["theme", "string", "auto", "Default theme: auto, light, or dark"],
          ["download_dir", "string", "current dir", "Default download directory path"],
          ["max_history", "integer", "50", "Maximum history entries to store"],
          ["windowed", "boolean", "false", "Start in windowed mode"],
          ["log_level", "string", "info", "Log verbosity: debug, info, warn, error"],
        ]}
      />

      <H3>Example config</H3>
      <Pre>{`{
  "theme": "dark",
  "download_dir": "~/Downloads/fetchit",
  "max_history": 100,
  "windowed": true,
  "log_level": "warn"
}`}</Pre>

      <H2>Environment variables</H2>
      <P>fetchit respects the following environment variables:</P>
      <Table
        headers={["Variable", "Description"]}
        rows={[
          ["FETCHIT_THEME", "Override theme: auto, light, or dark (overrides config, overridden by --theme flag)"],
          ["FETCHIT_DOWNLOAD_DIR", "Override the default download directory"],
          ["FETCHIT_LOG_LEVEL", "Set log level: debug, info, warn, error"],
          ["YTDLP_PATH", "Path to a custom yt-dlp binary (default: lookup in PATH)"],
          ["FFMPEG_PATH", "Path to a custom ffmpeg binary (default: lookup in PATH)"],
          ["NO_COLOR", "If set, disables colour output (see no-color.org)"],
          ["TERM", "Used for colour capability detection and mouse support negotiation"],
        ]}
      />

      <H2>Tips &amp; power user tricks</H2>

      <H3>Bypass the format picker</H3>
      <P>
        If you always want the best quality, combine a URL with the <Code>--format best</Code> flag. fetchit downloads immediately without showing the picker:
      </P>
      <Pre>{`fetchit "https://youtube.com/watch?v=..." --format best`}</Pre>
      <P>
        Use <Code>--format bestaudio</Code> to download only the audio track without interaction.
      </P>

      <H3>Quick yt-dlp updates</H3>
      <P>
        Press <Code>[U]</Code> from either the Input screen or the format picker to update yt-dlp to the latest version. fetchit runs <Code>yt-dlp --update</Code> in the background and shows the result. This is useful when a site changes its API and existing formats fail.
      </P>

      <H3>Download to a specific directory</H3>
      <P>
        Set a default download directory in the config file, or change it per-session with the <Code>FETCHIT_DOWNLOAD_DIR</Code> environment variable:
      </P>
      <Pre>{`FETCHIT_DOWNLOAD_DIR=~/Movies fetchit "https://youtube.com/watch?v=..."`}</Pre>

      <H3>Debug mode for troubleshooting</H3>
      <P>
        When a download fails and the error message is not helpful, run with debug logging:
      </P>
      <Pre>{`fetchit --log-level debug "https://youtube.com/watch?v=..."`}</Pre>
      <P>
        This streams the full yt-dlp and ffmpeg output beneath the UI, including any stderr warnings, HTTP status codes, and command-line invocations.
      </P>

      <H3>Using with tmux</H3>
      <P>
        fetchit works inside tmux sessions. Enable mouse support in tmux for clickable elements:
      </P>
      <Pre>{`set -g mouse on  # in ~/.tmux.conf`}</Pre>
      <P>
        Ensure pass-through mode is enabled for OSC 11 colour queries to work correctly in auto theme mode:
      </P>
      <Pre>{`set -g allow-passthrough on  # in ~/.tmux.conf`}</Pre>

      <H3>Resume interrupted downloads</H3>
      <P>
        yt-dlp supports partial download resumption. If your download was interrupted, fetch the same URL and format again — yt-dlp automatically resumes where it left off. Note that the progress bar starts from 0% while yt-dlp checks the existing file, then jumps to the actual progress once it confirms the partial data.
      </P>

      <H3>Keyboard-driven workflow</H3>
      <P>
        For the fastest possible workflow, memorise these three keys:
      </P>
      <Ol>
        <Li><Code>[Tab]</Code> — paste clipboard URL (skips typing)</Li>
        <Li><Code>[Enter]</Code> — probe / download (confirms the current action)</Li>
        <Li><Code>[↑]</Code> / <Code>[↓]</Code> — navigate history or format list</Li>
      </Ol>
      <P>
        With practice, you can go from terminal to downloaded file in under three seconds.
      </P>

      <H2>See also</H2>
      <Ul>
        <Li><Link href="/docs/scriptable-mode">Scriptable Mode</Link> — automate downloads with flags and scripts</Li>
        <Li><Link href="/docs/configuration">Configuration Reference</Link> — all config options in detail</Li>
        <Li><Link href="/docs/troubleshooting">Troubleshooting</Link> — common issues and solutions</Li>
      </Ul>
    </Prose>
  )
}
