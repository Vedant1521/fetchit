import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "FAQ" }

export default function Page() {
  return (
    <Prose>
      <H1>FAQ</H1>
      <P>Frequently asked questions about fetchit — a terminal video downloader.</P>

      <H2>General</H2>

      <H3>What is fetchit?</H3>
      <P>
        fetchit is a terminal-based video downloader with a text-based user interface (TUI). It wraps{" "}
        <Link href="https://github.com/yt-dlp/yt-dlp">yt-dlp</Link> to download videos and audio from
        hundreds of sites. You give it a URL, pick a format from the interactive TUI, and it handles the rest.
      </P>

      <H3>What sites does it support?</H3>
      <P>
        fetchit supports everything yt-dlp supports — that's over 1,700 sites including YouTube, Vimeo,
        Twitch, Twitter/X, Instagram, TikTok, Reddit, Bilibili, SoundCloud, Bandcamp, Facebook, Dailymotion,
        and many more. See the full list on the{" "}
        <Link href="https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md">yt-dlp supported sites page</Link>.
      </P>

      <H3>Is it free?</H3>
      <P>
        Yes. fetchit is free and open source under the MIT license. You can use it, modify it, and distribute
        it freely. There are no paid tiers, subscriptions, or hidden charges.
      </P>

      <H3>Do I need an API key?</H3>
      <P>
        No. fetchit and yt-dlp work by extracting media URLs directly from web pages, not through official
        APIs. You don't need any API keys, tokens, or accounts to download.
      </P>

      <H2>Installation</H2>

      <H3>How do I install it?</H3>
      <P>
        See the <Link href="/docs/install">installation guide</Link> for platform-specific instructions.
        On most systems, you can use one of these methods:
      </P>
      <Pre filename="terminal">
{`# macOS (Homebrew)
brew install fetchit

# Windows (Scoop)
scoop bucket add fetchit https://github.com/your-org/scoop-bucket
scoop install fetchit

# Linux (curl binary)
curl -fsSL https://github.com/your-org/fetchit/releases/latest/download/fetchit-linux-x86_64.tar.gz | tar xz
sudo mv fetchit /usr/local/bin/

# Or build from source
cargo install fetchit`}
      </Pre>

      <H3>Why is the binary so large (~100 MB)?</H3>
      <P>
        The binary bundles a private copy of Python and yt-dlp so you don't have to install them separately.
        This makes fetchit self-contained and ensures the yt-dlp version is always compatible. Without this
        bundling, you'd need to install Python and yt-dlp manually, and version mismatches would cause
        frequent breakage. The trade-off is a larger binary in exchange for a zero-friction install.
      </P>

      <H3>How do I update?</H3>
      <P>
        fetchit checks for updates on startup and prompts you when a new version is available. You can also
        update manually:
      </P>
      <Pre filename="terminal">
{`# macOS
brew upgrade fetchit

# Windows
scoop update fetchit

# Linux — re-download the binary
# or if built from source
cargo install fetchit --force`}
      </Pre>

      <H3>How do I uninstall?</H3>
      <Pre filename="terminal">
{`# macOS
brew uninstall fetchit

# Windows
scoop uninstall fetchit

# Linux
sudo rm /usr/local/bin/fetchit

# Remove config and cache
rm -rf ~/.config/fetchit ~/.cache/fetchit`}
      </Pre>
      <P>
        On Windows, the config is at <Code>%APPDATA%\fetchit</Code> and cache at{" "}
        <Code>%LOCALAPPDATA%\fetchit</Code>.
      </P>

      <H2>Usage</H2>

      <H3>How do I download a video?</H3>
      <P>The simplest way is to pass a URL directly:</P>
      <Pre filename="terminal">
{`fetchit "https://www.youtube.com/watch?v=dQw4w9WgXcQ"`}
      </Pre>
      <P>
        This opens the TUI where you can choose the format and quality. To skip the TUI and use the best
        quality automatically:
      </P>
      <Pre filename="terminal">
{`fetchit "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --auto`}
      </Pre>
      <P>
        See the <Link href="/docs/getting-started">getting started guide</Link> for more details.
      </P>

      <H3>How do I get just the audio?</H3>
      <Pre filename="terminal">
{`fetchit "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --audio

# Specify a format (default is mp3)
fetchit "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --audio --audio-format flac

# Or use the TUI and select audio-only from the format list
fetchit "https://www.youtube.com/watch?v=dQw4w9WgXcQ"`}
      </Pre>
      <P>
        Audio-only mode extracts the best available audio stream and converts it to your chosen format.
      </P>

      <H3>How do I download a playlist?</H3>
      <P>
        fetchit detects playlists automatically. Pass the playlist URL and it will list all videos:
      </P>
      <Pre filename="terminal">
{`# Download all videos in a playlist
fetchit "https://www.youtube.com/playlist?list=PL..."

# Download a range of videos
fetchit "https://www.youtube.com/playlist?list=PL..." --range 1-5

# Download every Nth video
fetchit "https://www.youtube.com/playlist?list=PL..." --range 1-10:2`}
      </Pre>
      <P>
        You can also use <Code>--audio</Code> with playlists to download all videos as audio files.
      </P>

      <H3>Why is it asking me to download yt-dlp?</H3>
      <P>
        The first time you run fetchit (or after an update that bumps the yt-dlp version), fetchit needs to
        extract the bundled yt-dlp to your system. This is a one-time extraction — subsequent launches use
        the cached version. It may also ask if you're using a self-contained binary that doesn't bundle yt-dlp
        (e.g., if you built from source without the bundle feature).
      </P>

      <H2>Troubleshooting</H2>

      <H3>YouTube says "Sign in to confirm" — what do I do?</H3>
      <P>
        YouTube occasionally rate-limits downloads by requiring a sign-in. Try these solutions in order:
      </P>
      <Ol>
        <Li>
          <strong>Use cookies</strong> — export your YouTube cookies and pass them to fetchit (see{" "}
          <Link href="#how-do-i-pass-cookies">How do I pass cookies?</Link> below).
        </Li>
        <Li>
          <strong>Update yt-dlp</strong> — run <Code>fetchit --update-yt-dlp</Code> to get the latest
          extraction logic.
        </Li>
        <Li>
          <strong>Use a different IP</strong> — YouTube ratelimits by IP. Try a VPN or different network.
        </Li>
        <Li>
          <strong>Wait</strong> — the rate limit usually expires after a few hours.
        </Li>
      </Ol>
      <Note>
        Using <Code>--cookies-from-browser</Code> (see below) is the most reliable fix for this issue.
      </Note>

      <H3>Downloads are slow — why?</H3>
      <P>Several factors can affect download speed:</P>
      <Ul>
        <Li>
          <strong>Your internet connection</strong> — run a speed test to check your baseline.
        </Li>
        <Li>
          <strong>Source server throttling</strong> — YouTube and other sites limit download speeds
          to prevent abuse. This is normal and varies by region.
        </Li>
        <Li>
          <strong>Concurrent downloads</strong> — use{" "}
          <Code>fetchit --concurrent-downloads 3</Code> to download multiple streams at once.
        </Li>
        <Li>
          <strong>Rate limiting</strong> — see the "Sign in to confirm" section above for rate-limit fixes.
        </Li>
        <Li>
          <strong>ISP throttling</strong> — some ISPs throttle video streaming. A VPN may help.
        </Li>
      </Ul>

      <H3>The TUI doesn't look right in my terminal</H3>
      <P>
        fetchit's TUI uses terminal graphics (sixel or Kitty protocol) for thumbnails and Unicode box-drawing
        characters for the interface. If things look off:
      </P>
      <Ul>
        <Li>
          Use a modern terminal emulator —{" "}
          <Link href="https://sw.kovidgoyal.net/kitty/">Kitty</Link>,{" "}
          <Link href="https://github.com/alacritty/alacritty">Alacritty</Link>,{" "}
          <Link href="https://learn.microsoft.com/en-us/windows/terminal/">Windows Terminal</Link>,{" "}
          <Link href="https://iterm2.com/">iTerm2</Link>, or{" "}
          <Link href="https://ghostty.org/">Ghostty</Link>.
        </Li>
        <Li>
          Set your terminal font to a Nerd Font (e.g.,{" "}
          <Link href="https://github.com/ryanoasis/nerd-fonts">JetBrains Mono Nerd Font</Link>).
        </Li>
        <Li>
          Run <Code>fetchit --no-thumbnails</Code> to disable thumbnail rendering.
        </Li>
        <Li>
          Run <Code>fetchit --no-color</Code> if colors are garbled.
        </Li>
        <Li>
          Ensure <Code>$TERM</Code> is set correctly (e.g., <Code>xterm-256color</Code>,
          <Code>kitty</Code>, or <Code>alacritty</Code>).
        </Li>
      </Ul>

      <H3>How do I pass cookies?</H3>
      <P>
        To authenticate with sites that require login (e.g., YouTube premium, private Instagram profiles),
        export your browser cookies and pass them to fetchit:
      </P>
      <Pre filename="terminal">
{`# Automatically extract cookies from your browser (easiest)
fetchit "https://www.youtube.com/watch?v=..." --cookies-from-browser chrome

# Or use a cookies.txt file (export with a browser extension)
fetchit "https://www.youtube.com/watch?v=..." --cookies cookies.txt`}
      </Pre>
      <P>
        Supported browsers: <Code>chrome</Code>, <Code>firefox</Code>, <Code>brave</Code>,
        <Code>edge</Code>, <Code>opera</Code>, <Code>safari</Code>, and <Code>vivaldi</Code>.
      </P>
      <Note>
        Cookies files expire. Re-export them if authentication stops working after a few days.
      </Note>

      <H2>Technical</H2>

      <H3>How does fetchit work under the hood?</H3>
      <P>At a high level, fetchit follows these steps for every download:</P>
      <Ol>
        <Li>
          <strong>URL parsing</strong> — fetchit validates the URL and normalises it.
        </Li>
        <Li>
          <strong>Site detection</strong> — it identifies which site the URL belongs to and dispatches
          to the correct extractor.
        </Li>
        <Li>
          <strong>Metadata extraction</strong> — yt-dlp fetches the page, extracts available formats,
          resolutions, codecs, thumbnails, and metadata.
        </Li>
        <Li>
          <strong>TUI rendering</strong> — fetchit presents the available formats in an interactive list
          with thumbnails, file sizes, and quality labels.
        </Li>
        <Li>
          <strong>Selection & download</strong> — once you pick a format, fetchit invokes yt-dlp to
          stream the media to disk, showing a progress bar with ETA and speed.
        </Li>
        <Li>
          <strong>Post-processing</strong> — if requested, it converts audio to the target format,
          embeds metadata, and writes thumbnails.
        </Li>
      </Ol>
      <P>
        fetchit itself is a thin Rust wrapper around yt-dlp. The core download engine is entirely yt-dlp —
        fetchit provides the interactive user experience on top.
      </P>

      <H3>What is yt-dlp?</H3>
      <P>
        <Link href="https://github.com/yt-dlp/yt-dlp">yt-dlp</Link> is a command-line program for
        downloading videos from YouTube and over 1,700 other websites. It's a feature-rich fork of the
        original youtube-dl. yt-dlp handles all the complex extraction logic, format negotiation, and
        downloading — fetchit wraps it in a user-friendly TUI so you don't have to memorise yt-dlp's
        extensive command-line flags.
      </P>
      <P>
        You can use yt-dlp directly if you prefer — fetchit is entirely optional.
      </P>

      <H3>Is my privacy protected?</H3>
      <P>
        fetchit does not phone home. There are no telemetry, analytics, or usage tracking features. The
        only network requests fetchit makes are:
      </P>
      <Ul>
        <Li>Checking for updates (you can disable this with <Code>fetchit --no-update-check</Code>).</Li>
        <Li>Fetching video metadata and streams from the URLs you provide.</Li>
        <Li>Downloading the bundled yt-dlp on first launch (from GitHub releases).</Li>
      </Ul>
      <P>
        Your download history is stored locally in <Code>~/.cache/fetchit/history.json</Code> and is never
        sent anywhere. You can clear it at any time.
      </P>

      <H3>Can I use it in scripts?</H3>
      <P>
        Yes. Pass <Code>--auto</Code> to skip the TUI and use smart defaults. This makes fetchit suitable
        for cron jobs, shell scripts, and automation pipelines:
      </P>
      <Pre filename="terminal">
{`#!/bin/bash
# Download the best quality video automatically
fetchit "https://www.youtube.com/watch?v=..." --auto

# Download audio-only to a specific directory
fetchit "https://www.youtube.com/watch?v=..." --audio --output-dir ~/Music --auto

# Download a playlist, videos 1-5, best quality
fetchit "https://youtube.com/playlist?list=PL..." --range 1-5 --auto

# Quiet mode (no output at all)
fetchit "https://www.youtube.com/watch?v=..." --auto --quiet`}
      </Pre>
      <P>
        fetchit exits with a non-zero code on failure, so you can handle errors in your scripts.
      </P>

      <H2>Support</H2>

      <H3>How do I report a bug?</H3>
      <P>
        Open an issue on the{" "}
        <Link href="https://github.com/your-org/fetchit/issues">GitHub issue tracker</Link>.
        Please include:
      </P>
      <Ul>
        <Li>Your operating system and terminal emulator.</Li>
        <Li>The output of <Code>fetchit --version</Code>.</Li>
        <Li>The exact command you ran.</Li>
        <Li>The full error output (use <Code>--verbose</Code> for detailed logs).</Li>
        <Li>A sample URL if possible (you can obfuscate personal details).</Li>
      </Ul>
      <Pre filename="terminal">
{`# Run with verbose logging to help debugging
fetchit "https://www.youtube.com/watch?v=..." --verbose 2>&1 | tee fetchit-debug.log`}
      </Pre>

      <H3>Where do I request features?</H3>
      <P>
        Feature requests are welcome on the{" "}
        <Link href="https://github.com/your-org/fetchit/discussions">GitHub Discussions</Link> page.
        Before posting, please search existing discussions and issues to avoid duplicates. When requesting,
        describe the problem you're trying to solve rather than just suggesting a specific solution — this
        helps us find the best approach.
      </P>
      <Note>
        fetchit is a community-maintained project. Feature requests with pull requests attached get reviewed
        much faster.
      </Note>
    </Prose>
  )
}
