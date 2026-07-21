import type { Metadata } from "next"
import { Prose, H1, H2, H3, P, Code, Pre, Ul, Li, Table, Note, Link } from "@/components/prose"

export const metadata: Metadata = { title: "Playlists" }

export default function Playlists() {
  return (
    <Prose>
      <H1>Playlists &amp; Multi-Video Downloads</H1>
      <P>
        fetchit can download entire playlists, multi-post Threads, and any url that yt-dlp recognizes as more than one video.
      </P>

      <H2>How it works</H2>
      <P>When you paste a url, fetchit does a fast probe first. If the url has more than one video, it shows you a checklist. All videos start selected — just press Enter to download the whole playlist.</P>

      <H2>Interactive mode</H2>
      <Ul>
        <Li>Use <Code>[↑]/[↓]</Code> to move, <Code>[Space]</Code> to toggle videos on/off</Li>
        <Li>Press <Code>[Enter]</Code> to confirm, then pick a format (applies to all selected videos)</Li>
        <Li>The quality you pick applies to every selected video</Li>
      </Ul>

      <H2>Scriptable mode</H2>
      <P>All videos are downloaded automatically:</P>
      <Pre>{`fetchit --best https://www.youtube.com/playlist?list=PL...`}</Pre>

      <H2>Where files go</H2>
      <P>Playlist downloads save into a subfolder named after the playlist:</P>
      <Pre>{`~/Downloads/My Awesome Playlist/
  01-First Video.mp4
  02-Second Video.mp4
  ...`}</Pre>

      <H2>Parallel downloads</H2>
      <P>Playlist items download 3 at a time instead of one-by-one. YouTube is auto-sequential (it throttles parallel streams). Override with <Code>--concurrency</Code>:</P>
      <Pre>{`fetchit --best --concurrency 5 https://youtube.com/...`}</Pre>

      <H2>What counts as a playlist</H2>
      <Table
        headers={["Source", "Url pattern", "Detected as"]}
        rows={[
          ["YouTube", "youtube.com/playlist?list=…", "Playlist"],
          ["YouTube", "youtu.be/…", "Single video"],
          ["Threads", "Multi-post thread", "Playlist"],
          ["Instagram", "Multi-post carousel", "Playlist"],
        ]}
      />

      <P>See the <Link href="/docs/interactive-mode">Interactive Mode</Link> guide for keyboard and mouse reference.</P>
    </Prose>
  )
}
