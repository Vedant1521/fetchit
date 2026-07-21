import type { Metadata } from "next"
import { Prose, H1, H2, H3, P, Code, Pre, Ul, Ol, Li, Table, Note, Link } from "@/components/prose"

export const metadata: Metadata = { title: "Troubleshooting" }

export default function Troubleshooting() {
  return (
    <Prose>
      <H1>Troubleshooting</H1>
      <P>
        Common problems and how to fix them. If your issue isn&apos;t here, check the{" "}
        <Link href="https://github.com/Vedant1521/fetchit/issues">GitHub issues</Link>.
      </P>

      <H2>yt-dlp errors</H2>
      <H3>Update yt-dlp first</H3>
      <P>Most issues are fixed by updating yt-dlp:</P>
      <Pre>{`fetchit update`}</Pre>
      <P>Or if you installed yt-dlp system-wide:</P>
      <Pre>{`pip install -U yt-dlp
# or
brew upgrade yt-dlp
# or
winget upgrade yt-dlp`}</Pre>

      <H3>&quot;Sign in to confirm you&apos;re not a bot&quot;</H3>
      <P>YouTube rate-limits IPs that download a lot. Three fixes:</P>
      <Ol>
        <Li><strong>Use a VPN</strong> — different IP, works immediately</Li>
        <Li><strong>Use a mobile hotspot</strong> — different IP, instant</Li>
        <Li><strong>Wait 24-48 hours</strong> — the flag resets automatically</Li>
      </Ol>

      <H3>Pass browser cookies</H3>
      <Pre>{`fetchit --cookies-from-browser firefox https://youtube.com/...`}</Pre>
      <P>From inside the TUI, press <Code>[B]</Code> on the error screen to pick a browser and retry.</P>
      <P>Use Firefox on Windows — Chrome and Edge encrypt their cookies.</P>

      <H2>ffmpeg issues</H2>
      <P>Install ffmpeg for merging streams and mp3 extraction:</P>
      <Pre>{`# macOS
brew install ffmpeg
# Ubuntu/Debian
sudo apt install ffmpeg
# Windows
winget install ffmpeg`}</Pre>

      <H2>Downloads are slow</H2>
      <Ul>
        <Li>High quality = big files. Try a lower resolution.</Li>
        <Li>YouTube rate-limits sometimes. This is a yt-dlp limitation.</Li>
      </Ul>

      <H2>&quot;EPERM: operation not permitted&quot; (Windows)</H2>
      <P>Windows Defender is scanning the yt-dlp binary. Close stuck processes and retry, or add <Code>~/.fetchit/bin</Code> to antivirus exclusions.</P>

      <H2>Clipboard detection doesn&apos;t work</H2>
      <Ul>
        <Li>Only runs when stdout is a terminal (not in scripts)</Li>
        <Li>Linux: install <Code>xclip</Code> or <Code>wl-paste</Code></Li>
        <Li>PowerShell cold-start on Windows — wait a few seconds</Li>
      </Ul>

      <H2>Still stuck?</H2>
      <P>
        <Link href="https://github.com/Vedant1521/fetchit/issues">Open a GitHub issue</Link> — include the url, the command you ran, and the error message.
      </P>
    </Prose>
  )
}
