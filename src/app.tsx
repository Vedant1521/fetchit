import React, {useCallback, useEffect, useRef, useState} from 'react'
import os from 'node:os'
import path from 'node:path'
import {Box, Text, useApp, useInput, useStdout} from 'ink'
import SelectInput, {type IndicatorProps, type ItemProps} from 'ink-select-input'
import Spinner from 'ink-spinner'
import {FramedInput} from './components/framed-input.js'
import {FullScreen} from './components/fullscreen.js'
import {Logo} from './components/logo.js'
import {MultiSelect} from './components/multi-select.js'
import {Panel} from './components/panel.js'
import {ProgressBar} from './components/progress-bar.js'
import {Shortcuts} from './components/shortcuts.js'
import {TextInput} from './components/text-input.js'
import {clickTargetAt, findFrameRow, frameRowSpan, type ClickTarget} from './lib/click-map.js'
import {formatBytes, formatDuration, formatEta, formatSpeed, shortenPath, truncate, wrapText} from './lib/format.js'
import {addToHistory, loadHistory} from './lib/history.js'
import {detectPlatform, isProbablyUrl, type Platform} from './lib/platforms.js'
import {useMouseClick} from './lib/use-mouse-click.js'
import {nextThemeMode, ThemeProvider, type ThemeMode, useTheme} from './theme.js'
import {
  buildChoices,
  cleanupProbeInfo,
  download,
  downloadPlaylistParallel,
  ensureYtDlp,
  findFfmpeg,
  normalizeTime,
  probePlaylistItem,
  smartProbe,
  updateYtDlp,
  type DownloadChoice,
  type DownloadProgress,
  type PlaylistEntry,
  type VideoInfo,
} from './lib/ytdlp.js'

const OUT_DIR = path.join(os.homedir(), 'Downloads')
const FETCHIT_BUTTON = 'fetchit'
const DONE_LABEL = '[Enter] fetchit another'
const TAGLINE = 'grab any video. paste. fetch. done.'

const choiceLabel = (choice: DownloadChoice) => `${choice.kind === 'audio' ? '♪ ' : '▶ '}${choice.label}`

function ChoiceIndicator({isSelected}: IndicatorProps) {
  const theme = useTheme()
  return (
    <Box marginRight={1}>
      <Text color={theme.primary}>{isSelected ? '❯' : ' '}</Text>
    </Box>
  )
}

function ChoiceItem({isSelected, label}: ItemProps) {
  const theme = useTheme()
  return (
    <Text color={theme.primary} bold={isSelected}>
      {label}
    </Text>
  )
}

// explicit blank lines — empty <Box height={1}/> spacers can collapse, and
// ink boxes default to flexShrink=1, so spacers are the first thing yoga
// crushes when content overflows the terminal
const Gap = ({lines = 1}: {lines?: number}) => (
  <Box flexDirection="column" flexShrink={0}>
    {Array.from({length: lines}, (_, i) => (
      <Text key={i}> </Text>
    ))}
  </Box>
)

// fixed-width slots — the centered line must not change width as values tick,
// otherwise the whole layout shifts on every progress update
function partLabel(progress: DownloadProgress): string {
  // explains the bar resetting between files (video, then audio)
  return progress.totalParts > 1 ? `part ${progress.part + 1}/${progress.totalParts}  ` : ''
}

function downloadMeta(progress: DownloadProgress): string {
  const speed = progress.speed ? formatSpeed(progress.speed) : ''
  const eta = progress.eta ? `${formatEta(progress.eta)} left` : ''
  return `${partLabel(progress)}${speed.padStart(10)}  ${eta.padEnd(12)}`
}

function indeterminateMeta(progress: DownloadProgress): string {
  const bytes = formatBytes(progress.downloadedBytes)
  const speed = progress.speed ? formatSpeed(progress.speed) : ''
  return `${partLabel(progress)}${bytes.padStart(8)}  ${speed.padEnd(10)}`
}

/** Detect common yt-dlp errors and append a plain-English hint. */
function friendlyError(message: string): {message: string; needsAuth: boolean} {
  const browserFromMessage = (msg: string): string =>
    /chrome|chromium/i.test(msg) ? 'Chrome'
      : /firefox/i.test(msg) ? 'Firefox'
      : /edge/i.test(msg) ? 'Edge'
      : /brave/i.test(msg) ? 'Brave'
      : /safari/i.test(msg) ? 'Safari'
      : 'your browser'

  // DPAPI / App-Bound Encryption — Chrome 127+ on Windows encrypts cookies with
  // ABE, which yt-dlp can't decrypt. Closing the browser won't help; the only
  // fix is a different browser whose cookies aren't ABE-protected.
  if (/dpapi|app.?bound.*encrypt|failed to decrypt/i.test(message)) {
    const browser = browserFromMessage(message)
    return {
      message: `${message}\n\n${browser} encrypts its cookies on Windows in a way fetchit can't read. Press [Enter] to retry without cookies, or [B] to try a different browser (Firefox or Edge usually work).`,
      needsAuth: true,
    }
  }
  // cookie DB locked — the browser is still running and holds the file
  if (/could not copy.*cookie.*database|cookie.*database.*locked|unable to copy.*cookie/i.test(message)) {
    const browser = browserFromMessage(message)
    return {
      message: `${message}\n\nfix: fully quit ${browser} (check your taskbar / task manager for background processes), then press [Enter] to try again. Or press [B] to use a different browser you're logged into.`,
      needsAuth: true,
    }
  }
  // YouTube sign-in wall
  if (/sign in to confirm|not a bot|cookies.*from.*browser/i.test(message)) {
    return {
      message: `${message}\n\nfix: press [B] to retry with your browser cookies (pick a browser you're logged into YouTube with).`,
      needsAuth: true,
    }
  }
  return {message, needsAuth: false}
}

export type Outcome = {filepaths?: string[]}

type Phase =
  | {name: 'input'; warning?: string}
  | {name: 'probing'; status: string}
  | {name: 'playlist'; title: string; entries: PlaylistEntry[]; selected: boolean[]}
  | {name: 'picking'; timeInput?: boolean}
  | {
      name: 'downloading'
      choice: DownloadChoice
      progress?: DownloadProgress
      processing: boolean
      refreshing?: boolean
    }
  | {name: 'done'; filepaths: string[]}
  | {name: 'error'; message: string; needsAuth?: boolean; pickingBrowser?: boolean}

const HINTS: Record<Phase['name'], Array<[string, string]>> = {
  input: [
    ['[Enter]', 'fetchit'],
    ['[U]', 'update'],
    ['[Ctrl+C]', 'quit'],
  ],
  probing: [
    ['[Esc]', 'cancel'],
    ['[Ctrl+C]', 'quit'],
  ],
  playlist: [
    ['[↑/↓]', 'move'],
    ['[Space]', 'toggle'],
    ['[Enter]', 'fetchit'],
    ['[U]', 'update'],
    ['[Esc]', 'back'],
    ['[Ctrl+C]', 'quit'],
  ],
  picking: [
    ['[↑/↓]', 'choose'],
    ['[Enter]', 'fetchit'],
    ['[C]', 'chapters'],
    ['[T]', 'time range'],
    ['[U]', 'update'],
    ['[Esc]', 'back'],
    ['[Ctrl+C]', 'quit'],
  ],
  downloading: [
    ['[Esc]', 'cancel'],
    ['[Ctrl+C]', 'quit'],
  ],
  done: [['[Enter]', 'fetchit another'], ['[U]', 'update'], ['[Ctrl+C]', 'quit']],
  error: [
    ['[Enter]', 'try again'],
    ['[Esc]', 'back'],
    ['[U]', 'update'],
    ['[B]', 'retry with cookies'],
    ['[Ctrl+C]', 'quit'],
  ],
}

type AppProps = {
  initialUrl?: string
  clipboardUrl?: string
  initialThemeMode?: ThemeMode
  outputDir?: string
  concurrency?: number
  cookiesFromBrowser?: string
  onOutcome: (outcome: Outcome) => void
}

export function App({initialThemeMode = 'auto', outputDir, concurrency, cookiesFromBrowser, ...props}: AppProps) {
  const [themeMode, setThemeMode] = useState(initialThemeMode)
  const cycleTheme = useCallback(() => {
    setThemeMode(nextThemeMode)
  }, [])

  return (
    <ThemeProvider mode={themeMode}>
      <AppContent {...props} outputDir={outputDir} concurrency={concurrency} cookiesFromBrowser={cookiesFromBrowser} cycleTheme={cycleTheme} />
    </ThemeProvider>
  )
}

function AppContent({
  initialUrl,
  clipboardUrl,
  outputDir,
  concurrency,
  cookiesFromBrowser,
  onOutcome,
  cycleTheme,
}: {
  initialUrl?: string
  clipboardUrl?: string
  outputDir?: string
  concurrency?: number
  cookiesFromBrowser?: string
  onOutcome: (outcome: Outcome) => void
  cycleTheme: () => void
}) {
  const theme = useTheme()
  const {exit} = useApp()
  const {stdout} = useStdout()
  const [url, setUrl] = useState(initialUrl ?? '')
  const [urlInput, setUrlInput] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [platform, setPlatform] = useState<Platform>()
  const [info, setInfo] = useState<VideoInfo>()
  const [cookies, setCookies] = useState(cookiesFromBrowser)
  const [choices, setChoices] = useState<DownloadChoice[]>([])
  const ytdlpRef = useRef('')
  const highlightRef = useRef(0) // choice under the cursor, for the ↵ hint click
  const infoJsonRef = useRef<string | undefined>(undefined)
  const playlistSelectionRef = useRef<{indices: number[]; title: string} | undefined>(undefined)
  const abortRef = useRef<AbortController | undefined>(undefined)
  // chapters + time range — set in the picking phase, applied to the download
  const [chapters, setChapters] = useState(false)
  const [timeRange, setTimeRange] = useState<{from?: string; to?: string} | undefined>(undefined)
  const [timeInputValue, setTimeInputValue] = useState('')
  // in-TUI yt-dlp update — triggered with [U] from any non-busy phase
  const [updateStatus, setUpdateStatus] = useState<{state: 'idle' | 'updating' | 'done' | 'error'; message?: string}>({state: 'idle'})
  const [phase, setPhase] = useState<Phase>(initialUrl ? {name: 'probing', status: 'warming up…'} : {name: 'input'})

  const columns = stdout?.columns && stdout.columns > 0 ? stdout.columns : 80
  const boxWidth = Math.max(14, Math.min(64, columns - 6))
  const contentWidth = Math.max(10, Math.min(columns - 4, 78))

  const startProbe = useCallback(async (targetUrl: string, cookieSource?: string) => {
    const controller = new AbortController()
    abortRef.current = controller
    setPlatform(detectPlatform(targetUrl))
    setPhase({name: 'probing', status: 'warming up…'})
    try {
      const ytdlp =
        ytdlpRef.current ||
        (await ensureYtDlp(status => setPhase({name: 'probing', status}), controller.signal))
      ytdlpRef.current = ytdlp
      if (controller.signal.aborted) return
      setPhase({name: 'probing', status: 'fetching video info…'})
      const probeResult = await smartProbe(ytdlp, targetUrl, controller.signal, cookieSource ?? cookies)
      if (controller.signal.aborted) return
      if (probeResult.kind === 'playlist') {
        // the flat-playlist info.json is only good for the picker, not a download
        void cleanupProbeInfo(probeResult.infoJsonPath)
        setPhase({
          name: 'playlist',
          title: probeResult.playlist.title,
          entries: probeResult.playlist.entries,
          selected: probeResult.playlist.entries.map(() => true),
        })
        return
      }
      infoJsonRef.current = probeResult.infoJsonPath
      setInfo(probeResult.info)
      setChoices(buildChoices(probeResult.info))
      highlightRef.current = 0
      setPhase({name: 'picking'})
    } catch (error) {
      if (controller.signal.aborted) return
      setPhase(() => {
        const {message, needsAuth} = friendlyError(error instanceof Error ? error.message : String(error))
        return {name: 'error' as const, message, needsAuth}
      })
    }
  }, [])

  useEffect(() => {
    if (initialUrl) void startProbe(initialUrl)
  }, [initialUrl, startProbe])

  const resetToInput = useCallback(() => {
    void cleanupProbeInfo(infoJsonRef.current)
    infoJsonRef.current = undefined
    playlistSelectionRef.current = undefined
    setChapters(false)
    setTimeRange(undefined)
    setTimeInputValue('')
    setUpdateStatus({state: 'idle'})
    setUrl('')
    setUrlInput('')
    setPlatform(undefined)
    setInfo(undefined)
    setChoices([])
    // clear a browser picked via [B] so a plain retry doesn't keep using
    // cookies that fail (e.g. Chrome's DPAPI/App-Bound Encryption on Windows)
    setCookies(cookiesFromBrowser)
    setPhase({name: 'input'})
  }, [cookiesFromBrowser])

  const cancelRun = useCallback(() => {
    abortRef.current?.abort()
    resetToInput()
    setUrlInput(url) // keep the link around so a cancel isn't destructive
  }, [resetToInput, url])

  const triggerUpdate = useCallback(() => {
    if (updateStatus.state === 'updating') return
    setUpdateStatus({state: 'updating', message: 'updating yt-dlp…'})
    void (async () => {
      try {
        const version = await updateYtDlp(m => setUpdateStatus({state: 'updating', message: m}))
        setUpdateStatus({state: 'done', message: `✓ yt-dlp updated to ${version}`})
      } catch (error) {
        setUpdateStatus({state: 'error', message: error instanceof Error ? error.message : String(error)})
      }
    })()
  }, [updateStatus.state])

  useInput(
    (input, key) => {
      if (key.ctrl && input === 't') {
        cycleTheme()
        return
      }
      // [U] updates yt-dlp from any non-busy phase (not during probing/downloading)
      if ((input === 'u' || input === 'U') && phase.name !== 'probing' && phase.name !== 'downloading') {
        triggerUpdate()
        return
      }
      if (key.escape && (phase.name === 'picking' || phase.name === 'playlist' || phase.name === 'error' || phase.name === 'done')) resetToInput()
      if (key.escape && (phase.name === 'probing' || phase.name === 'downloading')) cancelRun()
      if (key.escape && phase.name === 'error' && phase.pickingBrowser) {
        setPhase({name: 'error', message: phase.message, needsAuth: phase.needsAuth})
        return
      }
      if (key.escape && phase.name === 'picking' && phase.timeInput) {
        setPhase({name: 'picking'})
        setTimeInputValue('')
        return
      }
      // [B] retry with browser cookies — only on auth errors
      if ((input === 'b' || input === 'B') && phase.name === 'error' && phase.needsAuth && !phase.pickingBrowser) {
        setPhase({name: 'error', message: phase.message, needsAuth: true, pickingBrowser: true})
        return
      }
      // browser picker: number keys 1-5 select a browser
      if (phase.name === 'error' && phase.pickingBrowser) {
        const browsers = ['chrome', 'firefox', 'edge', 'brave', 'safari']
        const idx = Number.parseInt(input, 10) - 1
        if (idx >= 0 && idx < browsers.length) {
          const browser = browsers[idx]!
          setCookies(browser)
          void startProbe(url, browser)
          return
        }
      }
      if (key.return && (phase.name === 'error' || phase.name === 'done')) resetToInput()
      // picking-phase toggles for chapters and time range — only when the time
      // input isn't active (those keys belong to the TextInput then)
      if (phase.name === 'picking' && !phase.timeInput) {
        if (input === 'c' || input === 'C') {
          setChapters(c => !c)
          return
        }
        if (input === 't' || input === 'T') {
          setPhase({name: 'picking', timeInput: true})
          setTimeInputValue(timeRange ? `${timeRange.from ?? ''}-${timeRange.to ?? ''}` : '')
          return
        }
      }
    },
    {isActive: Boolean(process.stdin.isTTY)},
  )

  // submit the time-range input — accepts "from-to", "from-" (to end), or "-to" (from start)
  const handleTimeSubmit = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      // empty clears the range
      setTimeRange(undefined)
      setPhase({name: 'picking'})
      setTimeInputValue('')
      return
    }
    const [fromRaw, toRaw] = trimmed.split('-')
    const from = fromRaw?.trim() ? normalizeTime(fromRaw.trim()) : undefined
    const to = toRaw?.trim() ? normalizeTime(toRaw.trim()) : undefined
    if (fromRaw?.trim() && !from) {
      setTimeRange(undefined)
      setPhase({name: 'picking'})
      setTimeInputValue('')
      setPhase({name: 'error', message: `invalid start time “${fromRaw.trim()}” — use MM:SS or HH:MM:SS`})
      return
    }
    if (toRaw?.trim() && !to) {
      setTimeRange(undefined)
      setPhase({name: 'picking'})
      setTimeInputValue('')
      setPhase({name: 'error', message: `invalid end time “${toRaw.trim()}” — use MM:SS or HH:MM:SS`})
      return
    }
    setTimeRange({from, to})
    setPhase({name: 'picking'})
    setTimeInputValue('')
  }

  const handleUrlSubmit = (value: string) => {
    const trimmed = value.trim()
    if (!isProbablyUrl(trimmed)) {
      setPhase({name: 'input', warning: 'not a valid url — paste a full link, e.g. https://youtu.be/…'})
      return
    }
    setUrl(trimmed)
    void startProbe(trimmed)
  }

  const clipboardOffered = Boolean(clipboardUrl) && urlInput === ''
  const clipboardAccepted = Boolean(clipboardUrl) && urlInput === clipboardUrl

  const handlePlaylistConfirm = (selectedIndices: number[]) => {
    if (selectedIndices.length === 0) return
    const controller = new AbortController()
    abortRef.current = controller
    // 1-based for yt-dlp's --playlist-items; keep the title so the format picker
    // and download header can say "N videos" instead of the first item's title
    playlistSelectionRef.current = {
      indices: selectedIndices.map(i => i + 1),
      title: phase.name === 'playlist' ? phase.title : 'playlist',
    }
    void (async () => {
      try {
        setPhase({name: 'probing', status: 'fetching format options…'})
        const ytdlp = ytdlpRef.current
        if (!ytdlp) throw new Error('yt-dlp not ready')
        const {info: itemInfo, infoJsonPath} = await probePlaylistItem(
          ytdlp,
          url,
          selectedIndices[0]! + 1,
          controller.signal,
          cookies,
        )
        if (controller.signal.aborted) return
        infoJsonRef.current = infoJsonPath
        setInfo(itemInfo)
        setChoices(buildChoices(itemInfo))
        highlightRef.current = 0
        setPhase({name: 'picking'})
      } catch (error) {
        if (controller.signal.aborted) return
        setPhase(() => {
        const {message, needsAuth} = friendlyError(error instanceof Error ? error.message : String(error))
        return {name: 'error' as const, message, needsAuth}
      })
      }
    })()
  }

  const handlePick = (item: {value: number}) => {
    const choice = choices[item.value]
    const controller = new AbortController()
    abortRef.current = controller
    const playlist = playlistSelectionRef.current
    setPhase({name: 'downloading', choice, processing: false})
    void (async () => {
      const handlers = {
        onProgress: (progress: DownloadProgress) =>
          setPhase(prev => (prev.name === 'downloading' ? {...prev, progress, processing: false} : prev)),
        onProcessing: () =>
          setPhase(prev => (prev.name === 'downloading' ? {...prev, processing: true} : prev)),
      }
      try {
        const ffmpegLocation = await findFfmpeg()
        const base = {
          ytdlp: ytdlpRef.current,
          ffmpegLocation,
          url,
          choice,
          outDir: outputDir ?? OUT_DIR,
          chapters,
          sections: timeRange,
          cookiesFromBrowser: cookies,
        }
        let filepaths: string[]
        try {
          if (playlist) {
            // playlist: download items concurrently (3 for non-YouTube, 1 for YouTube
            // which throttles parallel streams) for a speedup on sites that allow it
            filepaths = await downloadPlaylistParallel(
              {...base, indices: playlist.indices, concurrency},
              handlers,
              controller.signal,
            )
          } else {
            // single video: reuse the probe's metadata — starts immediately
            filepaths = await download({...base, infoJsonPath: infoJsonRef.current}, handlers, controller.signal)
          }
        } catch (error) {
          if (controller.signal.aborted) throw error
          // media urls in the cached info can expire — retry with a fresh extraction
          setPhase(prev =>
            prev.name === 'downloading' ? {...prev, progress: undefined, refreshing: true} : prev,
          )
          if (playlist) {
            filepaths = await downloadPlaylistParallel({...base, indices: playlist.indices, concurrency}, handlers, controller.signal)
          } else {
            filepaths = await download(base, handlers, controller.signal)
          }
        }
        onOutcome({filepaths})
        setHistory(addToHistory(url))
        setPhase({name: 'done', filepaths})
      } catch (error) {
        if (controller.signal.aborted) return
        setPhase(() => {
        const {message, needsAuth} = friendlyError(error instanceof Error ? error.message : String(error))
        return {name: 'error' as const, message, needsAuth}
      })
      } finally {
        void cleanupProbeInfo(infoJsonRef.current)
        infoJsonRef.current = undefined
      }
    })()
  }

  let hints: Array<[string, string]> = [...HINTS[phase.name], ['[Ctrl+T]', `theme:${theme.mode}`]]
  if (phase.name === 'input' && history.length > 0) {
    hints = [hints[0]!, ['[↑]', 'history'], ...hints.slice(1)]
  }
  // hide the [B] retry-with-cookies hint unless this is an auth error
  if (phase.name === 'error' && !phase.needsAuth) {
    hints = hints.filter(([key]) => key !== '[B]')
  }
  // hide [B] once the browser picker is open (number keys take over)
  if (phase.name === 'error' && phase.pickingBrowser) {
    hints = hints.filter(([key]) => key !== '[B]')
  }

  // Anything a mouse user would expect to press is clickable. Targets are
  // found by their text in the rendered frame (see lib/click-map.ts), so
  // there is no layout math to keep in sync.
  const hintAction = (key: string): (() => void) | undefined => {
    if (key === '[Ctrl+C]') return () => exit()
    if (key === '[Ctrl+T]') return cycleTheme
    if (key === '[U]') return triggerUpdate
    if (key === '[B]') return phase.name === 'error' && phase.needsAuth
      ? () => setPhase({name: 'error', message: phase.message, needsAuth: true, pickingBrowser: true})
      : undefined
    if (key === '[Esc]') return phase.name === 'probing' || phase.name === 'downloading' ? cancelRun : resetToInput
    if (key === '[Enter]') {
      if (phase.name === 'input') return () => handleUrlSubmit(urlInput)
      if (phase.name === 'picking') return () => handlePick({value: highlightRef.current})
      if (phase.name === 'error' || phase.name === 'done') return resetToInput
    }
    return undefined // [↑/↓] / [↑] stay keyboard-only
  }
  const clickTargets: ClickTarget[] = []
  if (phase.name === 'input') {
    // the frame button rows above/below the label are part of the button
    clickTargets.push({match: `  ${FETCHIT_BUTTON}  `, padY: 1, action: () => handleUrlSubmit(urlInput)})
  }
  if (phase.name === 'picking') {
    for (const [index, choice] of choices.entries()) {
      clickTargets.push({match: choiceLabel(choice), action: () => handlePick({value: index})})
    }
  }
  if (phase.name === 'done') {
    clickTargets.push({match: 'fetchit another', padX: 5, padY: 1, action: resetToInput})
  }
  for (const [key, label] of hints) {
    const action = hintAction(key)
    if (action) clickTargets.push({match: `${key} ${label}`, action})
  }

  useMouseClick(
    (x, y) => {
      // the logo takes you home — it's the 6 rows one gap above the tagline
      const taglineRow = findFrameRow(TAGLINE)
      if (taglineRow > 6 && y - 1 >= taglineRow - 7 && y - 1 <= taglineRow - 2) {
        const span = frameRowSpan(y - 1)
        if (span && x >= span[0] - 1 && x <= span[1] + 1) {
          if (phase.name === 'probing' || phase.name === 'downloading') cancelRun()
          else if (phase.name !== 'input') resetToInput()
          return
        }
      }
      clickTargetAt(x, y, clickTargets)?.action()
    },
    Boolean(process.stdin.isTTY),
  )

  return (
    <FullScreen>
      <Logo />
      <Gap />
      <Text color={theme.primary}>{TAGLINE}</Text>
      <Text color={theme.gray} dimColor={theme.dimSecondary}>one tool. every site. your terminal. — 2000+ supported</Text>
      <Gap />

      {phase.name === 'input' && (
        <Box flexDirection="column" alignItems="center">
          <FramedInput title="Paste a link" width={boxWidth} button={FETCHIT_BUTTON}>
            <TextInput
              value={urlInput}
              onChange={setUrlInput}
              onSubmit={handleUrlSubmit}
              placeholder="https://youtube.com/watch?v=…"
              width={boxWidth - 6}
              history={history}
              submitOnPaste={isProbablyUrl}
              onTab={() => {
                if (clipboardOffered) setUrlInput(clipboardUrl!)
              }}
            />
          </FramedInput>
          {phase.warning ? (
            <Text color={theme.gray} dimColor={theme.dimSecondary}>✗ {phase.warning}</Text>
          ) : clipboardOffered ? (
            <Text color={theme.gray} dimColor={theme.dimSecondary}>link in your clipboard — [Tab] to paste it</Text>
          ) : clipboardAccepted ? (
            <Text color={theme.gray} dimColor={theme.dimSecondary}>from your clipboard — [Enter] to fetch it</Text>
          ) : null}
        </Box>
      )}

      {phase.name === 'probing' && (
        <Box flexDirection="column" alignItems="center">
          <FramedInput title={platform ? platform.label : 'Paste a link'} width={boxWidth} button={FETCHIT_BUTTON} buttonDim>
            <Text color={theme.gray} dimColor={theme.dimSecondary}>{url.length > boxWidth - 8 ? `${url.slice(0, boxWidth - 9)}…` : url}</Text>
          </FramedInput>
        </Box>
      )}

      {phase.name === 'playlist' && (
        <Box flexDirection="column" alignItems="center">
          <Box width={contentWidth}>
            <Box flexDirection="column" flexGrow={1} flexBasis={0} paddingTop={1} paddingRight={3}>
              {wrapText(phase.title, Math.max(10, contentWidth - 41)).map((line, index) => (
                <Text key={index} bold color={theme.primary}>
                  {line}
                </Text>
              ))}
              <Gap />
              <Text color={theme.gray} dimColor={theme.dimSecondary}>
                ▸ {platform?.label ?? 'playlist'} · {phase.entries.length} videos
              </Text>
            </Box>
            <Panel title={`Playlist · ${phase.entries.length}`} width={48}>
              <MultiSelect
                items={phase.entries.map(entry => ({
                  title: entry.title ?? 'untitled',
                  duration: entry.duration,
                  uploader: entry.uploader,
                }))}
                initialSelected={phase.selected}
                onConfirm={handlePlaylistConfirm}
              />
            </Panel>
          </Box>
        </Box>
      )}

      {phase.name === 'picking' && platform && (
        <Box width={contentWidth}>
          <Box flexDirection="column" flexGrow={1} flexBasis={0} paddingTop={1} paddingRight={3}>
            {/* wrapped by hand so continuation lines stay flush left —
                ink's wrapping keeps the break's space as a 1-cell indent */}
            {wrapText(playlistSelectionRef.current?.title ?? info?.title ?? '', Math.max(10, contentWidth - 41)).map((line, index) => (
              <Text key={index} bold color={theme.primary}>
                {line}
              </Text>
            ))}
            <Gap />
            {playlistSelectionRef.current ? (
              <Text color={theme.gray} dimColor={theme.dimSecondary}>
                ▸ {platform.label} · {playlistSelectionRef.current.indices.length} videos to download
              </Text>
            ) : (
              <Text color={theme.gray} dimColor={theme.dimSecondary}>
                ▸ {platform.label}
                {info?.duration ? ` · ${formatDuration(info.duration)}` : ''}
                {info?.uploader ? ` · ${info.uploader}` : ''}
              </Text>
            )}
            {/* show current chapters / time-range state so the user knows what's applied */}
            {(chapters || timeRange) && (
              <Text color={theme.gray} dimColor={theme.dimSecondary}>
                {chapters ? 'chapters: on' : ''}
                {chapters && timeRange ? ' · ' : ''}
                {timeRange ? `range: ${timeRange.from ?? '0:00'}–${timeRange.to ?? 'end'}` : ''}
              </Text>
            )}
            {phase.timeInput ? (
              <>
                <Gap />
                <Text color={theme.gray} dimColor={theme.dimSecondary}>time range — start-end (e.g. 5:30-10:15), or empty to clear:</Text>
                <TextInput
                  value={timeInputValue}
                  onChange={setTimeInputValue}
                  onSubmit={handleTimeSubmit}
                  placeholder="5:30-10:15"
                  width={Math.max(10, contentWidth - 41)}
                />
              </>
            ) : null}
          </Box>
          <Panel title="Download" width={38}>
            <SelectInput
              indicatorComponent={ChoiceIndicator}
              itemComponent={ChoiceItem}
              items={choices.map((choice, index) => ({
                key: String(index),
                label: choiceLabel(choice),
                value: index,
              }))}
              onSelect={handlePick}
              onHighlight={item => (highlightRef.current = item.value)}
            />
          </Panel>
        </Box>
      )}

      {phase.name === 'downloading' && (
        <Box flexDirection="column" alignItems="center">
          <Text color={theme.gray} dimColor={theme.dimSecondary}>
            {phase.progress?.activeItems?.length
              ? `${phase.progress.completedItems ?? 0}/${phase.progress.totalItems} done · `
              : phase.progress && phase.progress.totalItems > 1
                ? `item ${phase.progress.item}/${phase.progress.totalItems} · `
                : ''}
            {playlistSelectionRef.current
              ? `${truncate(playlistSelectionRef.current.title, 42)} · ${phase.choice.label}`
              : `${info?.title ? `${truncate(info.title, 42)} · ` : ''}${phase.choice.label}`}
          </Text>
          <Gap />
          {/* parallel playlist: one bar per active download */}
          {phase.progress?.activeItems?.length ? (
            <Box flexDirection="column">
              {phase.progress.activeItems.map(item => (
                <Box key={item.index} flexDirection="column">
                  <Text color={theme.gray} dimColor={theme.dimSecondary}>
                    {`item ${item.index}  `}
                    {item.processing ? 'processing…' : item.totalBytes
                      ? `${Math.round((item.downloadedBytes / item.totalBytes) * 100)}%`
                      : `${formatBytes(item.downloadedBytes)}`}
                    {item.speed ? `  ${formatSpeed(item.speed)}` : ''}
                  </Text>
                  <ProgressBar
                    percent={item.totalBytes ? item.downloadedBytes / item.totalBytes : 0}
                    width={24}
                  />
                </Box>
              ))}
            </Box>
          ) : /* single download: the existing bar/spinner branches */ phase.processing ? (
            <>
              <ProgressBar percent={1} />
              <Gap />
              <Text>
                <Text color={theme.primary}>
                  <Spinner type="dots" />
                </Text>
                <Text color={theme.gray} dimColor={theme.dimSecondary}> processing…</Text>
              </Text>
            </>
          ) : phase.progress?.totalBytes ? (
            <>
              <ProgressBar percent={phase.progress.downloadedBytes / phase.progress.totalBytes} />
              <Gap />
              <Text color={theme.gray} dimColor={theme.dimSecondary}>{downloadMeta(phase.progress)}</Text>
            </>
          ) : phase.progress ? (
            <>
              <Text>
                <Text color={theme.primary}>
                  <Spinner type="dots" />
                </Text>
                <Text color={theme.gray} dimColor={theme.dimSecondary}> downloading…</Text>
              </Text>
              <Gap />
              <Text color={theme.gray} dimColor={theme.dimSecondary}>{indeterminateMeta(phase.progress)}</Text>
            </>
          ) : (
            <>
              <ProgressBar percent={0} />
              <Gap />
              <Text>
                <Text color={theme.primary}>
                  <Spinner type="dots" />
                </Text>
                <Text color={theme.gray} dimColor={theme.dimSecondary}>
                  {phase.refreshing ? ' link expired — grabbing a fresh one…' : ' starting download…'}
                </Text>
              </Text>
            </>
          )}
        </Box>
      )}

      {phase.name === 'done' && (
        <Box flexDirection="column" alignItems="center">
          {phase.filepaths.length > 1 ? (
            <>
              <Text>
                <Text bold color={theme.primary}>✓ fetched {phase.filepaths.length} files! </Text>
                <Text color={theme.primary}>find them in:</Text>
              </Text>
              <Text color={theme.gray} dimColor={theme.dimSecondary}>
                {shortenPath(path.dirname(phase.filepaths[0]!), os.homedir(), 60)}/
              </Text>
            </>
          ) : (
            <>
              <Text>
                <Text bold color={theme.primary}>✓ fetched! </Text>
                <Text color={theme.primary}>find your file in:</Text>
              </Text>
              <Text color={theme.gray} dimColor={theme.dimSecondary}>{shortenPath(phase.filepaths[0]!, os.homedir(), 60)}</Text>
            </>
          )}
          <Gap />
          <Box
            borderStyle="round"
            borderColor={theme.gray}
            borderDimColor={theme.dimSecondary}
            borderBackgroundColor={theme.background}
            paddingX={3}
          >
            <Text bold color={theme.primary}>{DONE_LABEL}</Text>
          </Box>
        </Box>
      )}

      {phase.name === 'error' && (
        <Box flexDirection="column" alignItems="center" width={Math.max(10, Math.min(columns - 6, 72))}>
          {phase.message.split('\n').map((line, i) => (
            <Text key={i} bold={i === 0} color={i === 0 ? theme.primary : theme.gray} dimColor={i > 0 && theme.dimSecondary}>
              {i === 0 ? `✗ ${line}` : line}
            </Text>
          ))}
          {phase.pickingBrowser ? (
            <>
              <Gap />
              <Text color={theme.gray} dimColor={theme.dimSecondary}>pick a browser you're logged into YouTube with:</Text>
              <Text color={theme.primary}>{'  1'}  chrome</Text>
              <Text color={theme.primary}>{'  2'}  firefox</Text>
              <Text color={theme.primary}>{'  3'}  edge</Text>
              <Text color={theme.primary}>{'  4'}  brave</Text>
              <Text color={theme.primary}>{'  5'}  safari</Text>
              <Gap />
              <Text color={theme.gray} dimColor={theme.dimSecondary}>[Esc] back</Text>
            </>
          ) : null}
        </Box>
      )}

      {updateStatus.state !== 'idle' ? (
        <Box flexDirection="column" alignItems="center">
          <Gap />
          {updateStatus.state === 'updating' ? (
            <Text>
              <Text color={theme.primary}>
                <Spinner type="dots" />
              </Text>
              <Text color={theme.gray} dimColor={theme.dimSecondary}> {updateStatus.message}</Text>
            </Text>
          ) : updateStatus.state === 'done' ? (
            <Text color={theme.primary}>{updateStatus.message}</Text>
          ) : (
            <Text color={theme.primary}>✗ {updateStatus.message}</Text>
          )}
        </Box>
      ) : null}

      {hints.length > 0 ? (
        <>
          <Gap lines={2} />
          <Shortcuts
            items={hints}
            leading={
              phase.name === 'probing' ? (
                <Text>
                  <Text color={theme.primary}>
                    <Spinner type="dots" />
                  </Text>
                  <Text color={theme.gray} dimColor={theme.dimSecondary}> {phase.status}</Text>
                </Text>
              ) : undefined
            }
          />
        </>
      ) : null}
    </FullScreen>
  )
}
