import type { Metadata } from "next"
import { Prose, H1, H2, H3, P, Code, Pre, Ul, Li, Table, Note, Link } from "@/components/prose"

export const metadata: Metadata = { title: "Interactive Mode" }

export default function InteractiveMode() {
  return (
    <Prose>
      <H1>Interactive Mode</H1>
      <P>
        This guide covers everything you can do in fetchit&apos;s full-screen interface — keyboard shortcuts, mouse clicks, themes, clipboard detection, and url history.
      </P>

      <H2>The phases</H2>
      <P>fetchit moves through these phases each time you use it:</P>
      <Ul>
        <Li><strong>Input</strong> — paste a url, press Enter</Li>
        <Li><strong>Probing</strong> — fetching video info</Li>
        <Li><strong>Picking</strong> — choose a format from the list</Li>
        <Li><strong>Downloading</strong> — progress bar fills up</Li>
        <Li><strong>Done</strong> — file is ready</Li>
        <Li><strong>Error</strong> — something went wrong</Li>
      </Ul>

      <H2>Keyboard shortcuts</H2>
      <H3>Global keys</H3>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Ctrl+C]", "Quit fetchit"],
          ["[Ctrl+T]", "Cycle theme: auto → light → dark"],
        ]}
      />

      <H3>Phase-specific keys</H3>
      <Table
        headers={["Phase", "Key", "Action"]}
        rows={[
          ["Input", "[Enter]", "Start fetching"],
          ["Input", "[Tab]", "Paste clipboard url"],
          ["Input", "[↑]/[↓]", "Recall url history"],
          ["Input", "[U]", "Update yt-dlp"],
          ["Probing", "[Esc]", "Cancel, go back"],
          ["Picking", "[↑]/[↓]", "Move highlight"],
          ["Picking", "[Enter]", "Download selected"],
          ["Picking", "[C]", "Toggle chapters"],
          ["Picking", "[T]", "Set time range"],
          ["Picking", "[U]", "Update yt-dlp"],
          ["Downloading", "[Esc]", "Cancel download"],
          ["Done", "[Enter]", "Fetch another"],
          ["Error", "[Enter]", "Try again"],
        ]}
      />

      <H2>Url field editing</H2>
      <Table
        headers={["Key", "Action"]}
        rows={[
          ["[Ctrl+A]", "Jump to start"],
          ["[Ctrl+E]", "Jump to end"],
          ["[Alt+←]/[Alt+B]", "Jump back one word"],
          ["[Alt+→]/[Alt+F]", "Jump forward one word"],
          ["[Ctrl+U]", "Delete to start"],
          ["[Ctrl+K]", "Delete to end"],
          ["[Backspace]", "Delete char back"],
        ]}
      />

      <H2>Mouse support</H2>
      <P>Click the <strong>fetchit button</strong>, any <strong>format row</strong>, any <strong>footer hint</strong>, or the <strong>logo</strong> (goes home). Works on most modern terminals.</P>

      <H2>Themes</H2>
      <P>Three themes: <Code>auto</Code> (follows your terminal), <Code>light</Code>, and <Code>dark</Code>. Cycle with <Code>[Ctrl+T]</Code> or set with <Code>--theme dark</Code>.</P>

      <H2>Clipboard detection</H2>
      <P>Launch without a url and fetchit checks your clipboard. Press <Code>[Tab]</Code> to paste a detected link.</P>

      <H2>Chapters &amp; time ranges</H2>
      <P>In the format picker, press <Code>[C]</Code> to embed YouTube chapter markers, or <Code>[T]</Code> to download just a clip (e.g. <Code>5:30-10:15</Code>).</P>

      <H2>URL history</H2>
      <P>Last 50 urls are saved to <Code>~/.config/fetchit/history.json</Code>. Recall with <Code>[↑]</Code> / <Code>[↓]</Code>.</P>

      <P>See the <Link href="/docs/scriptable-mode">Scriptable Mode</Link> guide for automation.</P>
    </Prose>
  )
}
