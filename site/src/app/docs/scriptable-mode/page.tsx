import type { Metadata } from "next"
import { Prose, H1, H2, H3, P, Code, Pre, Ul, Li, Table, Note, Link } from "@/components/prose"

export const metadata: Metadata = { title: "Scriptable Mode" }

export default function ScriptableMode() {
  return (
    <Prose>
      <H1>Scriptable Mode</H1>
      <P>
        Download videos without the interactive picker — no full-screen takeover, no arrow keys. Just a one-line command that probes, downloads, and exits.
      </P>

      <H2>Three ways to skip the picker</H2>
      <H3>1. <Code>--best</Code> — best quality</H3>
      <Pre>{`fetchit --best https://youtu.be/dQw4w9WgXcQ`}</Pre>

      <H3>2. <Code>--mp3</Code> — audio only</H3>
      <Pre>{`fetchit --mp3 https://youtu.be/dQw4w9WgXcQ`}</Pre>

      <H3>3. Direct quality</H3>
      <Pre>{`fetchit https://youtu.be/dQw4w9WgXcQ 1080p
fetchit https://youtu.be/dQw4w9WgXcQ 720p
fetchit https://youtu.be/dQw4w9WgXcQ mp3`}</Pre>

      <H2>Embedding chapters</H2>
      <Pre>{`fetchit --chapters https://youtu.be/...
fetchit https://youtu.be/... 1080p --chapters`}</Pre>

      <H2>Time ranges</H2>
      <Pre>{`fetchit --from 5:30 --to 10:15 https://youtu.be/...
fetchit --from 1:00:00 https://youtu.be/...`}</Pre>

      <H2>Custom output folder</H2>
      <Pre>{`fetchit --best https://youtu.be/... -o ~/Videos`}</Pre>

      <H2>Rules &amp; validation</H2>
      <Table
        headers={["Rule", "Error"]}
        rows={[
          ["--best and --mp3 together", "can't be combined — pick one"],
          ["--best without url", "scriptable mode needs a url"],
          ["Unknown quality", 'unknown quality "hd"'],
          ["More than 2 positionals", "expected a url and optional quality"],
        ]}
      />

      <H2>Exit codes</H2>
      <Table
        headers={["Code", "Meaning"]}
        rows={[
          ["0", "Download succeeded"],
          ["1", "Error occurred"],
          ["130", "Cancelled (Ctrl+C)"],
        ]}
      />

      <H2>Scripting examples</H2>
      <Pre>{`# Download and open
FILE=$(fetchit --best https://youtu.be/... 2>&1 | grep '✓' | cut -d'→' -f2)
open "$FILE"

# Loop through urls
for url in "https://youtu.be/a" "https://youtu.be/b"; do
  fetchit --best "$url" -o ~/Videos
done

# Cron job
0 6 * * * fetchit --mp3 https://youtu.be/... -o ~/Podcasts`}</Pre>

      <P>See the <Link href="/docs/playlists">Playlists</Link> guide for batch downloads.</P>
    </Prose>
  )
}
