import type { Metadata } from "next"
import { Prose, H1, H2, H3, P, Code, Pre, Ul, Li, Table, Note, Link } from "@/components/prose"

export const metadata: Metadata = { title: "Getting Started" }

export default function GettingStarted() {
  return (
    <Prose>
      <H1>Getting Started with fetchit</H1>
      <P>
        Welcome! This guide walks you through installing fetchit, running it for the first time, and downloading your first video.
      </P>

      <H2>What is fetchit?</H2>
      <P>
        fetchit is a terminal tool that downloads videos from YouTube, X (Twitter), Instagram, Threads, TikTok, and 2,000+ other sites.
        You paste a link, pick a quality, and fetchit saves the file to your computer. No browser tabs, no popups, no sketchy download buttons.
      </P>

      <H2>Step 1: Install</H2>
      <H3>Quick install (no Node.js needed)</H3>
      <P><strong>macOS / Linux:</strong></P>
      <Pre>{`curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh`}</Pre>
      <P><strong>Windows (PowerShell):</strong></P>
      <Pre>{`powershell -c "irm https://fetchit-cli.vercel.app/install.ps1 | iex"`}</Pre>
      <P>The script downloads a standalone binary, puts it in <Code>~/.fetchit/bin/</Code>, and adds it to your PATH.</P>

      <H3>Via npm (requires Node 18+)</H3>
      <Pre>{`npm install -g @vedant1521/fetchit`}</Pre>

      <H2>Step 2: Your first download</H2>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ`}</Pre>
      <P>fetchit takes over your terminal, fetches video info, shows you a list of resolutions, and downloads your pick. When it&apos;s done, it prints the file path and exits.</P>

      <H2>Quick reference</H2>
      <Table
        headers={["What you want", "Command"]}
        rows={[
          ["Download a video (interactive)", "fetchit &lt;url&gt;"],
          ["Best quality, no picker", "fetchit --best &lt;url&gt;"],
          ["Audio-only mp3", "fetchit --mp3 &lt;url&gt;"],
          ["Specific resolution", "fetchit &lt;url&gt; 1080p"],
          ["Save to custom folder", "fetchit &lt;url&gt; -o ~/Videos"],
          ["Show help", "fetchit --help"],
        ]}
      />

      <P>
        See the <Link href="/docs/install">full install guide</Link> for building from source and platform-specific notes.
      </P>
    </Prose>
  )
}
