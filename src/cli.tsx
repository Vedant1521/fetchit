import React from 'react'
import {createRequire} from 'node:module'
import os from 'node:os'
import path from 'node:path'
import {render} from 'ink'
import {App, type Outcome} from './app.js'
import {captureFrames} from './lib/click-map.js'
import {parseArgs} from './lib/args.js'
import {readClipboard} from './lib/clipboard.js'
import {isProbablyUrl} from './lib/platforms.js'
import {
  cleanupProbeInfo,
  download,
  downloadPlaylistParallel,
  ensureYtDlp,
  findFfmpeg,
  pickChoice,
  pickChoiceByLabel,
  probePlaylistItem,
  smartProbe,
  updateYtDlp,
} from './lib/ytdlp.js'

// read at runtime from the shipped package.json so npm version bumps
// can't drift from a hardcoded constant
const VERSION: string = createRequire(import.meta.url)('../package.json').version

const HELP = `
  fetchit — grab any video. paste. fetch. done.

  Usage
    $ fetchit [url]
    $ fetchit update          update the bundled yt-dlp binary

  Examples
    $ fetchit https://youtu.be/dQw4w9WgXcQ
    $ fetchit https://x.com/user/status/123456
    $ fetchit                 (prompts for a url)

  Scriptable (no picker — for scripts & pipes)
    $ fetchit --best https://youtu.be/…          best quality, straight to download
    $ fetchit --mp3 https://youtu.be/…           audio-only mp3, straight to download
    $ fetchit https://youtu.be/… 1080p           direct quality, straight to download
    $ fetchit https://youtu.be/… mp3             same as --mp3, positional form
    $ fetchit --best -o ~/Videos https://youtu.be/…   save into ~/Videos
    $ fetchit --chapters https://youtu.be/…      best quality + embed chapter markers
    $ fetchit --best --from 5:30 --to 10:15 https://youtu.be/…   download a clip

  Options
    --best          skip the picker, download best quality (scriptable mode)
    --mp3           skip the picker, download audio-only mp3 (scriptable mode)
    [quality]       a resolution like 1080p/720p/360p, or mp3/audio (scriptable mode)
    --chapters      embed YouTube chapter markers into the output file
    --from <time>   download from this point (MM:SS or HH:MM:SS)
    --to <time>     download up to this point (MM:SS or HH:MM:SS)
    --concurrency <n>  parallel playlist downloads (default 3; YouTube auto-sequential)
    --cookies-from-browser <browser>  use browser cookies for authenticated downloads
    -o, --output <dir>  save into <dir> instead of ~/Downloads
    --theme <mode>  use auto, light, or dark for this run
    -h, --help      show this help
    -v, --version   show version

  Downloads are saved to ~/Downloads.
  Powered by yt-dlp — YouTube, X, Instagram, Threads, TikTok & 2000+ sites.
`

const args = parseArgs(process.argv.slice(2))

if (args.error) {
  console.error(`fetchit: ${args.error}\nTry “fetchit --help” for usage.`)
  process.exit(1)
}

if (args.help) {
  console.log(HELP)
  process.exit(0)
}

if (args.version) {
  console.log(VERSION)
  process.exit(0)
}

// `fetchit update` — update the bundled yt-dlp binary in place
if (args.subcommand === 'update') {
  try {
    const version = await updateYtDlp(m => console.log(m))
    console.log(`✓ yt-dlp updated to ${version}`)
    process.exit(0)
  } catch (error) {
    console.error(`fetchit: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

const initialUrl = args.initialUrl
const initialThemeMode = args.themeMode ?? 'auto'
const outDir = args.outputDir ?? path.join(os.homedir(), 'Downloads')

// Scriptable mode: --best / --mp3 / direct quality skips the TUI entirely — probe,
// download, print, exit. No alternate screen, no React, no progress UI; just a dot
// per progress tick so a script can see it's alive and pipe output without terminal
// noise. --chapters / --from / --to are also scriptable (no picker to toggle them in).
const scriptable = args.best || args.mp3 || args.quality
if (scriptable || args.chapters || args.from || args.to) {
  const url = initialUrl!
  const controller = new AbortController()
  process.on('SIGINT', () => controller.abort())
  // resolve a choice from the probed info: --best/--mp3 use pickChoice, a direct
  // quality (1080p/mp3/audio) uses pickChoiceByLabel, otherwise default to best
  const resolveChoice = (info: import('./lib/ytdlp.js').VideoInfo) => {
    if (args.best) return pickChoice(info, 'best')
    if (args.mp3) return pickChoice(info, 'mp3')
    if (args.quality) return pickChoiceByLabel(info, args.quality)
    return pickChoice(info, 'best')
  }
  // chapters + sections + cookies apply to every download in this run
  const extras = {
    chapters: args.chapters,
    sections: (args.from || args.to) ? {from: args.from, to: args.to} : undefined,
    cookiesFromBrowser: args.cookiesFromBrowser,
  }
  try {
    const ytdlp = await ensureYtDlp(() => {}, controller.signal)
    const probeResult = await smartProbe(ytdlp, url, controller.signal, args.cookiesFromBrowser)
    if (probeResult.kind === 'playlist') {
      // playlist: download items in parallel (3 concurrent) for ~3x speedup
      void cleanupProbeInfo(probeResult.infoJsonPath)
      const indices = probeResult.playlist.entries.map((_, i) => i + 1)
      const firstInfo = (await probePlaylistItem(ytdlp, url, 1, controller.signal, args.cookiesFromBrowser)).info
      const choice = resolveChoice(firstInfo)
      const ffmpegLocation = await findFfmpeg()
      const filepaths = await downloadPlaylistParallel(
        {ytdlp, ffmpegLocation, url, choice, outDir, indices, concurrency: args.concurrency, ...extras},
        {
          onProgress: p => process.stdout.write('.'),
          onProcessing: () => process.stdout.write('|'),
        },
        controller.signal,
      )
      process.stdout.write('\n')
      if (filepaths.length === 1) console.log(`✓ fetched → ${filepaths[0]}`)
      else console.log(`✓ fetched ${filepaths.length} files → ${path.dirname(filepaths[0]!)}/`)
    } else {
      const choice = resolveChoice(probeResult.info)
      const ffmpegLocation = await findFfmpeg()
      const filepaths = await download(
        {ytdlp, ffmpegLocation, url, choice, outDir, infoJsonPath: probeResult.infoJsonPath, ...extras},
        {
          onProgress: p => process.stdout.write('.'),
          onProcessing: () => process.stdout.write('|'),
        },
        controller.signal,
      )
      void cleanupProbeInfo(probeResult.infoJsonPath)
      process.stdout.write('\n')
      if (filepaths.length === 1) console.log(`✓ fetched → ${filepaths[0]}`)
      else console.log(`✓ fetched ${filepaths.length} files → ${path.dirname(filepaths[0]!)}/`)
    }
    process.exit(0)
  } catch (error) {
    if (controller.signal.aborted) {
      console.error('cancelled.')
      process.exit(130)
    }
    console.error(`fetchit: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

const isTTY = Boolean(process.stdout.isTTY)

// no url given — offer the clipboard url (⇥ to paste) when it already holds one
let clipboardUrl: string | undefined
if (!initialUrl && isTTY) {
  const clipped = readClipboard().trim()
  // reject multi-line clipboard content — new URL() silently strips newlines
  if (clipped && !/\s/.test(clipped) && isProbablyUrl(clipped)) clipboardUrl = clipped
}
const enterAltScreen = () => process.stdout.write('\x1b[?1049h\x1b[H')
// also switch mouse tracking off — a crash can skip React effect cleanup
const leaveAltScreen = () => process.stdout.write('\x1b[?1006l\x1b[?1000l\x1b[?1049l')

if (isTTY) {
  enterAltScreen()
  process.on('exit', leaveAltScreen)
  // restore the terminal BEFORE a crash prints, or the stack trace is
  // wiped along with the alternate screen and the app looks like it
  // silently quit
  for (const event of ['uncaughtException', 'unhandledRejection'] as const) {
    process.on(event, (error: unknown) => {
      leaveAltScreen()
      console.error(error)
      process.exit(1)
    })
  }
}

let outcome: Outcome = {}
const {waitUntilExit} = render(
  <App
    initialUrl={initialUrl}
    clipboardUrl={clipboardUrl}
    initialThemeMode={initialThemeMode}
    outputDir={outDir}
    concurrency={args.concurrency}
    cookiesFromBrowser={args.cookiesFromBrowser}
    onOutcome={result => (outcome = result)}
  />,
  // keep a copy of every frame so clicks can be hit-tested against it
  {stdout: captureFrames(process.stdout)},
)

await waitUntilExit()

if (isTTY) leaveAltScreen()
if (outcome.filepaths?.length === 1) {
  console.log(`✓ fetched → ${outcome.filepaths[0]}`)
} else if (outcome.filepaths?.length) {
  console.log(`✓ fetched ${outcome.filepaths.length} files → ${path.dirname(outcome.filepaths[0]!)}/`)
}
