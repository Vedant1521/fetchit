import type { Metadata } from "next"
import { Prose, H1, H2, H3, P, Code, Pre, Ul, Ol, Li, Table, Note } from "@/components/prose"

export const metadata: Metadata = { title: "Install Guide" }

export default function Install() {
  return (
    <Prose>
      <H1>Install Guide</H1>
      <P>fetchit can be installed in several ways. Pick the one that fits your setup.</P>

      <Table
        headers={["Method", "Requires", "Binary size", "Best for"]}
        rows={[
          ["curl/sh one-liner", "Nothing", "~100 MB", "Most users"],
          ["npm install", "Node.js 18+", "~93 KB (npm)", "Node.js developers"],
          ["npx", "Node.js 18+", "~93 KB (cached)", "Trying once"],
          ["Build from source", "Node.js 18+ + git", "~100 MB", "Contributors"],
        ]}
      />

      <H2>One-liner (recommended)</H2>
      <P><strong>macOS / Linux:</strong></P>
      <Pre>{`curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh`}</Pre>
      <P><strong>Windows (PowerShell):</strong></P>
      <Pre>{`powershell -c "irm https://fetchit-cli.vercel.app/install.ps1 | iex"`}</Pre>

      <H3>What the script does</H3>
      <Ol>
        <Li>Checks for Node.js 18+. If found, installs via npm.</Li>
        <Li>Otherwise downloads the standalone binary from the latest GitHub Release.</Li>
        <Li>Places it in <Code>~/.fetchit/bin/fetchit</Code>.</Li>
        <Li>Adds to PATH in your shell config.</Li>
        <Li>Downloads the yt-dlp engine so first run is fast.</Li>
      </Ol>

      <H2>Install via npm</H2>
      <Pre>{`npm install -g @vedant1521/fetchit`}</Pre>
      <Pre>{`npx @vedant1521/fetchit`}</Pre>

      <H2>Build from source</H2>
      <P>Requires Node.js 18+ and Git.</P>
      <Pre>{`git clone https://github.com/Vedant1521/fetchit.git
cd fetchit
npm install
npm run build`}</Pre>

      <H3>Generate a standalone binary</H3>
      <P>Requires <Code>Bun</Code> installed.</P>
      <Pre>{`npm install
bun scripts/build-binary.js`}</Pre>
      <P>The output binary is at <Code>dist/fetchit</Code> (or <Code>dist/fetchit.exe</Code> on Windows).</P>

      <H2>Platform notes</H2>
      <H3>Windows</H3>
      <Ul>
        <Li>Single <Code>.exe</Code> (~100 MB). No DLLs needed.</Li>
        <Li>If you get a SmartScreen warning, click &quot;More info&quot; then &quot;Run anyway.&quot;</Li>
      </Ul>
      <H3>macOS</H3>
      <Ul>
        <Li>Not notarized. Right-click and &quot;Open&quot; to bypass Gatekeeper on first run.</Li>
        <Li>Or run <Code>xattr -d com.apple.quarantine ~/.fetchit/bin/fetchit</Code>.</Li>
      </Ul>
      <H3>Linux</H3>
      <Ul>
        <Li>Statically linked. Works on most glibc-based distros.</Li>
      </Ul>

      <H2>Uninstalling</H2>
      <Pre>{`rm -rf ~/.fetchit
npm uninstall -g @vedant1521/fetchit`}</Pre>
    </Prose>
  )
}
