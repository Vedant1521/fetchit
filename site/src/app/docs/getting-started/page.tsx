import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"
import { MultiPlatformCodeTabs } from "@/components/multi-platform-code-tabs"

export const metadata: Metadata = { title: "Getting Started" }

export default function GettingStarted() {
  return (
    <Prose>
      <H1>Getting Started with fetchit</H1>
      <P>
        Welcome! This guide walks you through installing fetchit, running it for the first time, and
        downloading your first video. By the end, you&apos;ll be comfortable using fetchit from your
        terminal to download media from hundreds of sites.
      </P>

      <H2>Prerequisites</H2>
      <P>
        Before you begin, make sure you&apos;re comfortable using a terminal (command prompt on Windows,
        Terminal.app on macOS, or your preferred shell on Linux). You&apos;ll need permission to install
        software on your machine — typically administrator or sudo access for the one-line installers.
      </P>
      <Ul>
        <Li><strong>Terminal basics:</strong> You should know how to open a terminal, paste a command, and read command output.</Li>
        <Li><strong>Operating system:</strong> fetchit supports Windows 10+, macOS 12+, and Linux (x86-64 and ARM).</Li>
        <Li><strong>Internet connection:</strong> The installer downloads a ~15 MB binary, and downloads themselves can be large.</Li>
        <Li><strong>Optional — Node.js 18+:</strong> If you prefer installing via npm, you&apos;ll need Node.js 18 or later.</Li>
      </Ul>
      <Blockquote>
        fetchit does <strong>not</strong> require Python, FFmpeg, or any system dependencies. Everything is bundled
        into a single executable.
      </Blockquote>

      <H2>What is fetchit?</H2>
      <P>
        fetchit is a modern terminal application for downloading video and audio from the web. It was
        built to replace the frustrating experience of hunting for download buttons, dealing with
        spammy sites, or remembering arcane <Code>yt-dlp</Code> flags.
      </P>
      <H3>How it works under the hood</H3>
      <P>
        fetchit uses <strong>yt-dlp</strong> as its download engine — the same battle-tested tool that powers most
        video downloading software. yt-dlp supports over 2,000 websites including YouTube, Twitter/X,
        Instagram, TikTok, Facebook, Twitch, Vimeo, Reddit, and many more. fetchit wraps this engine
        in a polished terminal user interface (TUI) built with <strong>Ink</strong> and <strong>React</strong>, giving you
        interactive resolution pickers, real-time progress bars, and a clean experience — all inside
        your terminal.
      </P>
      <P>
        Concretely, when you pass a URL to fetchit, it: (1) probes the URL with yt-dlp to extract
        available formats, metadata, and thumbnails; (2) presents the formats in an interactive
        selector sorted by quality; (3) streams the selected format to your chosen output location;
        and (4) prints the final file path so you can open it immediately.
      </P>
      <H3>Why use fetchit over yt-dlp directly?</H3>
      <P>
        If you know yt-dlp well, you might wonder why you&apos;d reach for fetchit. The answer is
        convenience. fetchit remembers your preferences, shows you visual quality pickers with file
        sizes, supports audio-only extraction without memorizing flags, and handles output naming
        consistently. It&apos;s yt-dlp with training wheels that you never outgrow.
      </P>
      <H3>Why use fetchit over browser extensions?</H3>
      <P>
        Browser extensions can see your browsing history, sell your data, or disappear when the
        browser updates. fetchit is an open-source CLI tool that runs entirely on your machine. No
        accounts, no telemetry, no monetization. It downloads at the full speed of your connection
        and writes files directly to your filesystem.
      </P>

      <H2>Step 1: Install fetchit</H2>
      <P>
        Choose one of the methods below. The quick install script is recommended for most users — it
        requires no existing runtime and takes about 10 seconds.
      </P>

      <H3>Quick install (recommended)</H3>
      <P>
        This method downloads a standalone binary and adds it to your PATH. Toggle between platforms or package managers below:
      </P>

      <MultiPlatformCodeTabs title="Installing fetchit" />
      <P>
        The installer places the <Code>fetchit</Code> binary in <Code>~/.fetchit/bin/</Code> and appends this
        directory to your shell configuration file (<Code>.zshrc</Code>, <Code>.bashrc</Code>, or PowerShell profile).
        You may need to restart your terminal or run <Code>source ~/.zshrc</Code> (or equivalent) for the
        change to take effect.
      </P>
      <Note>
        On macOS, if you see a security warning about the unsigned binary, open
        <Code>System Settings → Privacy & Security</Code>, scroll to the security section, and click
        <Code>Allow Anyway</Code> next to the fetchit message. This only happens once.
      </Note>

      <H3>Via npm (requires Node.js 18+)</H3>
      <P>
        If you already have Node.js 18 or later on your machine, you can install fetchit globally
        through npm. This is the same binary — not a wrapper or a JavaScript implementation.
      </P>
      <Pre>{`npm install -g @vedant1521/fetchit`}</Pre>
      <P>
        npm places the binary in your global Node modules bin directory, which is usually already on
        your PATH. Verify it worked by running <Code>fetchit --version</Code>.
      </P>

      <H3>Verify your installation</H3>
      <P>
        After installing, verify that fetchit is available and print the installed version:
      </P>
      <Pre>{`fetchit --version`}</Pre>
      <P>
        You should see a version number like <Code>1.2.0</Code> printed to your terminal. If you see
        <Code>command not found</Code> (or <Code>fetchit is not recognized</Code> on Windows), your PATH hasn&apos;t
        been updated yet — try restarting your terminal or running your shell&apos;s config reload command.
      </P>
      <P>
        You can also print the full help menu to see all available options:
      </P>
      <Pre>{`fetchit --help`}</Pre>

      <H2>Step 2: Your first download</H2>
      <P>
        Now that fetchit is installed, let&apos;s download a video. We&apos;ll use the classic Internet
        Archive &ldquo;Rick Astley — Never Gonna Give You Up&rdquo; as our test URL.
      </P>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ`}</Pre>

      <H3>What you&apos;ll see</H3>
      <P>
        Running that command does the following, in order:
      </P>
      <Ol>
        <Li>
          <strong>Fetching video info —</strong> fetchit contacts YouTube and retrieves metadata: title,
          duration, available resolutions, and file sizes. This takes 1–3 seconds.
        </Li>
        <Li>
          <strong>Interactive picker —</strong> A list of formats appears, sorted by quality. You&apos;ll see
          entries like <Code>1080p (MP4, ~45 MB)</Code>, <Code>720p (MP4, ~20 MB)</Code>, and
          <Code>Audio only (M4A, ~3 MB)</Code>. Use the arrow keys (↑/↓) to navigate and press
          <Code>Enter</Code> to select.
        </Li>
        <Li>
          <strong>Download progress —</strong> A real-time progress bar shows download speed, ETA, and
          percentage complete. The bar updates smoothly as chunks arrive.
        </Li>
        <Li>
          <strong>Completion —</strong> When the download finishes, fetchit prints the full file path
          (e.g., <Code>~/Downloads/Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ].mp4</Code>) and
          exits. You can now open the file in your media player of choice.
        </Li>
      </Ol>
      <Note>
        The first download may be slightly slower because yt-dlp caches some data. Subsequent
        downloads are faster. If you want to skip the interactive picker and grab the best quality
        immediately, add the <Code>--best</Code> flag — see the Common Workflows section below.
      </Note>

      <H2>What you can download</H2>
      <P>
        fetchit inherits its site support from yt-dlp, which means it works with virtually every
        major video and audio platform on the web. Here are the most commonly used sites:
      </P>
      <Table
        headers={["Site", "URL format", "Notes"]}
        rows={[
          ["YouTube", "youtube.com/watch?v=... or youtu.be/...", "Full support: 4K, HDR, 60fps, audio, playlists, subtitles"],
          ["X / Twitter", "x.com/username/status/...", "Video and GIF downloads; inline media from tweets"],
          ["Instagram", "instagram.com/reel/... or instagram.com/p/...", "Reels, posts, stories, IGTV; highest quality available"],
          ["Threads", "threads.net/@username/post/...", "Video and image downloads from Threads posts"],
          ["TikTok", "tiktok.com/@username/video/...", "Watermark-free downloads when available"],
          ["Facebook", "facebook.com/watch/...", "Public video downloads from Watch and Pages"],
          ["Twitch", "twitch.tv/videos/... or clips", "Clips, VODs, and highlights"],
          ["Vimeo", "vimeo.com/...", "High-quality video downloads; supports password-protected videos"],
          ["Reddit", "reddit.com/r/.../comments/...", "Video and audio from Reddit-hosted content"],
          ["SoundCloud", "soundcloud.com/...", "Audio downloads (track and playlist support)"],
          ["LinkedIn", "linkedin.com/feed/update/...", "Public video downloads from posts"],
          ["Pinterest", "pin.it/... or pinterest.com/pin/...", "Video pin downloads"],
        ]}
      />
      <P>
        In addition to these, fetchit works with thousands of other sites supported by yt-dlp,
        including many news outlets, educational platforms, and niche video hosts. If a site plays
        video in a browser, fetchit can almost certainly download it.
      </P>

      <H2>Understanding the output</H2>
      <H3>File naming</H3>
      <P>
        fetchit names downloaded files using a consistent pattern:
      </P>
      <Pre>{`{title} [{video_id}].{ext}`}</Pre>
      <P>
        For example, downloading <Code>https://youtu.be/dQw4w9WgXcQ</Code> produces
        <Code>Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ].mp4</Code>. The video ID is included
        in square brackets to guarantee uniqueness — two different videos with the same title will
        never collide.
      </P>

      <H3>Output location</H3>
      <P>
        By default, fetchit saves files to your system&apos;s downloads directory
        (<Code>~/Downloads</Code> on macOS/Linux, <Code>%USERPROFILE%\Downloads</Code> on Windows). You
        can change this with the <Code>-o</Code> (or <Code>--output</Code>) flag:
      </P>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ -o ~/Videos`}</Pre>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ -o "D:\Media\Downloads"`}</Pre>
      <P>
        The output path is created automatically if it doesn&apos;t exist. You can also use
        <Code>--output-template</Code> for advanced naming patterns — see the
        <Link href="/docs/scriptable-mode">scriptable mode</Link> docs for details.
      </P>

      <H3>File format</H3>
      <P>
        The file extension depends on what you selected in the interactive picker. Video streams are
        typically <Code>.mp4</Code> or <Code>.webm</Code>, and audio streams are <Code>.m4a</Code>,
        <Code>.mp3</Code> (when transcoded), or <Code>.opus</Code>. fetchit prefers MP4/M4A when available
        for maximum compatibility with media players.
      </P>

      <H2>Common workflows</H2>
      <P>
        Here are the day-to-day commands you&apos;ll use most often with fetchit:
      </P>

      <H3>Download the best quality (no interaction)</H3>
      <P>
        Skip the interactive picker and automatically download the highest-resolution stream
        available. This is perfect for scripts or when you just want the best quality immediately.
      </P>
      <Pre>{`fetchit --best https://youtu.be/dQw4w9WgXcQ`}</Pre>
      <P>
        The <Code>--best</Code> flag selects the highest resolution video with the best audio track and
        merges them automatically. If the user has set a preference in the config, that preference
        is respected.
      </P>

      <H3>Download audio only (MP3)</H3>
      <P>
        Extract the audio track and convert it to MP3. This is useful for music videos, podcasts,
        or any content you want to listen to without the video file.
      </P>
      <Pre>{`fetchit --mp3 https://youtu.be/dQw4w9WgXcQ`}</Pre>
      <P>
        fetchit downloads the best available audio stream (typically Opus or M4A) and transcodes it
        to MP3 using FFmpeg (bundled). The output is a standalone audio file you can import into any
        music player.
      </P>

      <H3>Download a specific resolution</H3>
      <P>
        If you know exactly which resolution you want, you can pass it as a positional argument
        after the URL. This bypasses the interactive picker.
      </P>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ 1080p`}</Pre>
      <P>
        fetchit matches the requested resolution to the closest available stream. If 1080p isn&apos;t
        available, it falls back to the next best option and prints a notice. Supported values
        include <Code>2160p</Code> (4K), <Code>1440p</Code>, <Code>1080p</Code>, <Code>720p</Code>,
        <Code>480p</Code>, and <Code>360p</Code>.
      </P>

      <H3>Save to a custom folder</H3>
      <P>
        Override the default download location for a single command:
      </P>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ -o ~/Videos`}</Pre>

      <H3>Download a playlist</H3>
      <P>
        fetchit supports YouTube playlists and other curated collections. When you pass a playlist
        URL, fetchit enters a playlist-aware mode:
      </P>
      <Pre>{`fetchit https://youtube.com/playlist?list=PL...`}</Pre>
      <P>
        See the <Link href="/docs/playlists">playlists guide</Link> for detailed instructions on
        playlist handling, including downloading specific playlist items and parallel downloads.
      </P>

      <Table
        headers={["Workflow", "Command"]}
        rows={[
          ["Interactive download", "fetchit &lt;url&gt;"],
          ["Best quality, no picker", "fetchit --best &lt;url&gt;"],
          ["Audio-only MP3", "fetchit --mp3 &lt;url&gt;"],
          ["Specific resolution", "fetchit &lt;url&gt; 1080p"],
          ["Custom output folder", "fetchit &lt;url&gt; -o ~/Videos"],
          ["Show help", "fetchit --help"],
        ]}
      />

      <H2>What&apos;s next</H2>
      <P>
        You&apos;ve installed fetchit and downloaded your first video. Here are some natural next steps:
      </P>
      <Ul>
        <Li>
          <Link href="/docs/interactive-mode">Interactive mode deep-dive</Link> — Learn about the TUI
          components: format filtering, thumbnail previews, download queueing, and keyboard shortcuts.
        </Li>
        <Li>
          <Link href="/docs/scriptable-mode">Scriptable mode &amp; configuration</Link> — Use fetchit
          entirely non-interactively, set default preferences, configure output templates, and
          integrate it into your shell scripts or automation pipelines.
        </Li>
        <Li>
          <Link href="/docs/playlists">Playlist downloading</Link> — Download entire YouTube playlists
          with a single command, choose specific items, and control concurrency.
        </Li>
        <Li>
          <Link href="/docs/install">Advanced installation</Link> — Build from source, install on
          headless servers, or set up fetchit in CI/CD environments.
        </Li>
        <Li>
          <Link href="/docs/troubleshooting">Troubleshooting</Link> — Fix common issues: download
          failures, rate limiting, missing formats, and platform-specific quirks.
        </Li>
      </Ul>
      <Blockquote>
        If you run into anything unexpected, open an issue on the
        <Link href="https://github.com/vedant1512/fetchit/issues"> GitHub repository</Link>.
        fetchit is actively maintained and new releases ship regularly.
      </Blockquote>
    </Prose>
  )
}
