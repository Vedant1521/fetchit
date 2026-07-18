import {spawn, type ChildProcess} from 'node:child_process'
import {createWriteStream} from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import {formatBytes} from './format.js'

const FETCHIT_DIR = path.join(os.homedir(), '.fetchit', 'bin')
const RELEASE_BASE = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download'

function ytDlpAssetName(): string {
  if (process.platform === 'win32') return 'yt-dlp.exe'
  if (process.platform === 'darwin') return 'yt-dlp_macos'
  return process.arch === 'arm64' ? 'yt-dlp_linux_aarch64' : 'yt-dlp_linux'
}

// async on purpose: a spawnSync here blocks the event loop, which freezes
// ink mid-frame — the user hits enter and sees nothing until it returns
function commandWorks(cmd: string, args: string[]): Promise<boolean> {
  return new Promise(resolve => {
    let child
    try {
      // shell: true is needed on Windows — spawn() without it doesn't search PATH
      // the way cmd does, so a freshly winget-installed ffmpeg is missed.
      child = spawn(cmd, args, {stdio: 'ignore', timeout: 10_000, shell: process.platform === 'win32'})
    } catch {
      resolve(false)
      return
    }
    child.on('error', () => resolve(false))
    child.on('close', code => resolve(code === 0))
  })
}

/**
 * Resolve a usable yt-dlp binary: system install first, then a previously
 * downloaded copy, then download the standalone binary from GitHub releases.
 */
export async function ensureYtDlp(onStatus: (message: string) => void, signal?: AbortSignal): Promise<string> {
  if (await commandWorks('yt-dlp', ['--version'])) return 'yt-dlp'

  const local = path.join(FETCHIT_DIR, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')
  if (await commandWorks(local, ['--version'])) return local

  onStatus('first run: fetching yt-dlp…')
  await fs.mkdir(FETCHIT_DIR, {recursive: true})

  const url = `${RELEASE_BASE}/${ytDlpAssetName()}`
  const response = await fetch(url, {signal})
  if (!response.ok || !response.body) {
    throw new Error(`Could not download yt-dlp (${response.status}). Check your connection and try again.`)
  }

  const tmp = `${local}.download`
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(tmp), {signal})
  await fs.chmod(tmp, 0o755)
  // Windows Defender / AV often locks a freshly-written .exe for scanning, causing
  // EPERM on rename. Retry a few times with a delay — the lock releases after ~1s.
  await renameWithRetry(tmp, local)
  return local
}

async function renameWithRetry(src: string, dest: string, retries = 5): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await fs.rename(src, dest)
      return
    } catch (error) {
      if (attempt === retries - 1) throw error
      // EPERM/EBUSY = AV is scanning; wait and retry
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
}

/**
 * Find ffmpeg for stream merging / mp3 extraction: system install first,
 * ffmpeg-static as fallback. Returns undefined if neither exists — yt-dlp
 * still works for single-file formats without it.
 */
export async function findFfmpeg(): Promise<string | undefined> {
  if (await commandWorks('ffmpeg', ['-version'])) return undefined // on PATH, yt-dlp finds it itself
  try {
    const mod = await import('ffmpeg-static')
    const ffmpegPath = (mod.default ?? mod) as unknown as string | null
    if (ffmpegPath && (await commandWorks(ffmpegPath, ['-version']))) return ffmpegPath
  } catch {
    // ffmpeg-static not installed or unsupported platform
  }
  return undefined
}

export type VideoInfo = {
  title: string
  uploader?: string
  duration?: number
  webpage_url?: string
  extractor_key?: string
  formats?: RawFormat[]
}

type RawFormat = {
  format_id: string
  ext?: string
  vcodec?: string
  acodec?: string
  height?: number
  width?: number
  abr?: number
  tbr?: number
  filesize?: number
  filesize_approx?: number
}

export type ProbeResult = {
  info: VideoInfo
  /** Raw -J output saved to disk so downloads can skip re-extraction via --load-info-json. */
  infoJsonPath: string
}

/** Remove the probe's cached info.json — safe to call with undefined or a missing path. */
export async function cleanupProbeInfo(infoJsonPath?: string): Promise<void> {
  if (!infoJsonPath) return
  await fs.rm(infoJsonPath, {force: true})
}

export async function probe(ytdlp: string, url: string, signal?: AbortSignal): Promise<ProbeResult> {
  const stdout = await runYtDlp(ytdlp, ['-J', '--no-playlist', '--no-warnings', url], signal)
  let info: VideoInfo
  try {
    info = JSON.parse(stdout) as VideoInfo
  } catch {
    throw new Error('Could not parse video info from yt-dlp.')
  }
  return {info, infoJsonPath: await writeInfoJson(stdout)}
}

/** Run yt-dlp with -J-style args and resolve its stdout, rejecting on a non-zero exit. */
function runYtDlp(ytdlp: string, args: string[], signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(ytdlp, args, {signal})
    let out = ''
    let stderr = ''
    child.stdout.on('data', chunk => (out += chunk))
    child.stderr.on('data', chunk => (stderr += chunk))
    child.on('error', reject)
    child.on('close', code => {
      if (code !== 0) reject(new Error(cleanYtDlpError(stderr) || `yt-dlp exited with code ${code}`))
      else resolve(out)
    })
  })
}

async function writeInfoJson(stdout: string): Promise<string> {
  const infoJsonPath = path.join(os.tmpdir(), `fetchit-info-${process.pid}-${Date.now()}.json`)
  await fs.writeFile(infoJsonPath, stdout)
  return infoJsonPath
}

export type PlaylistEntry = {
  id?: string
  title?: string
  duration?: number
  url?: string
  webpage_url?: string
  uploader?: string
}

export type PlaylistInfo = {
  title: string
  entries: PlaylistEntry[]
}

export type SmartProbe =
  | {kind: 'video'; info: VideoInfo; infoJsonPath: string}
  | {kind: 'playlist'; playlist: PlaylistInfo; infoJsonPath: string}

/** Classify a yt-dlp -J result as a playlist or a single video (pure, testable). */
export function classifyProbe(parsed: VideoInfo & {entries?: PlaylistEntry[]}): 'playlist' | 'video' {
  return Array.isArray(parsed.entries) && parsed.entries.length > 1 ? 'playlist' : 'video'
}

/**
 * Probe that auto-detects playlists: a `--flat-playlist` pass is fast even for
 * big playlists (it lists entries without extracting formats). If the url is a
 * playlist with >1 entry we keep the flat list for the picker; otherwise the
 * single-video info is returned (re-extracted fully if flat mode stripped
 * the formats).
 */
export async function smartProbe(ytdlp: string, url: string, signal?: AbortSignal): Promise<SmartProbe> {
  const stdout = await runYtDlp(ytdlp, ['-J', '--flat-playlist', '--no-warnings', url], signal)
  let parsed: VideoInfo & {entries?: PlaylistEntry[]}
  try {
    parsed = JSON.parse(stdout) as VideoInfo & {entries?: PlaylistEntry[]}
  } catch {
    throw new Error('Could not parse video info from yt-dlp.')
  }

  if (classifyProbe(parsed) === 'playlist') {
    return {
      kind: 'playlist',
      playlist: {title: parsed.title ?? 'playlist', entries: parsed.entries!},
      infoJsonPath: await writeInfoJson(stdout),
    }
  }

  // single video — flat mode usually carries formats; if not, re-extract fully
  if (parsed.formats && parsed.formats.length > 0) {
    return {kind: 'video', info: parsed, infoJsonPath: await writeInfoJson(stdout)}
  }
  const fallback = await probe(ytdlp, url, signal)
  return {kind: 'video', info: fallback.info, infoJsonPath: fallback.infoJsonPath}
}

/** Full info for one playlist entry (by 1-based index), for the format picker. */
export async function probePlaylistItem(
  ytdlp: string,
  url: string,
  index: number,
  signal?: AbortSignal,
): Promise<ProbeResult> {
  const stdout = await runYtDlp(ytdlp, ['-J', '--no-warnings', '--playlist-items', String(index), url], signal)
  let parsed: VideoInfo & {entries?: VideoInfo[]}
  try {
    parsed = JSON.parse(stdout) as VideoInfo & {entries?: VideoInfo[]}
  } catch {
    throw new Error('Could not parse video info from yt-dlp.')
  }
  const info = Array.isArray(parsed.entries) ? parsed.entries[0]! : parsed
  return {info, infoJsonPath: await writeInfoJson(stdout)}
}

/**
 * Pick a ready-made choice for scriptable mode. `best` returns the first (highest)
 * video option from buildChoices, `mp3` returns the audio choice. Both fall back to
 * a generic selector if buildChoices produced nothing usable.
 */
export function pickChoice(info: VideoInfo, mode: 'best' | 'mp3'): DownloadChoice {
  const choices = buildChoices(info)
  if (mode === 'mp3') {
    return (
      choices.find(c => c.kind === 'audio') ?? {
        label: 'audio only · mp3',
        kind: 'audio',
        args: ['-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0'],
      }
    )
  }
  // best: first video choice, or a generic best-video selector if none built
  return (
    choices.find(c => c.kind === 'video') ?? {
      label: 'best available · mp4',
      kind: 'video',
      args: ['-f', 'bv*+ba/b', '--merge-output-format', 'mp4'],
    }
  )
}

/**
 * Pick a choice by direct query for scriptable mode — `1080p` matches the
 * `1080p · mp4` label, `mp3`/`audio` matches the audio row. Case-insensitive
 * substring match on the label. Throws if nothing matches.
 */
export function pickChoiceByLabel(info: VideoInfo, query: string): DownloadChoice {
  const choices = buildChoices(info)
  const needle = query.toLowerCase()
  // exact token match first (so "1080p" doesn't accidentally hit "1080p" inside a
  // different resolution's label — unlikely, but be precise)
  const exact = choices.find(c => c.label.toLowerCase().startsWith(needle))
  if (exact) return exact
  const substring = choices.find(c => c.label.toLowerCase().includes(needle))
  if (substring) return substring
  throw new Error(`no format matching “${query}” — run without a quality to see the picker`)
}

export type DownloadChoice = {
  label: string
  kind: 'video' | 'audio'
  args: string[]
  /**
   * Used when the probe's cached info can't be reused (expired media urls) and
   * yt-dlp re-extracts from the network. The freshly extracted formats may not
   * carry the same format_ids, so a height-bounded selector is safer than the
   * pinned id pair in `args`.
   */
  fallbackArgs?: string[]
}

const MAX_VIDEO_CHOICES = 8

export function buildChoices(info: VideoInfo): DownloadChoice[] {
  const formats = info.formats ?? []
  const choices: DownloadChoice[] = []

  const audioOnly = formats.filter(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'))
  const bestAudio = [...audioOnly].sort((a, b) => (b.abr ?? b.tbr ?? 0) - (a.abr ?? a.tbr ?? 0))[0]
  const audioSize = bestAudio?.filesize ?? bestAudio?.filesize_approx

  const videos = formats.filter(f => f.vcodec && f.vcodec !== 'none' && f.height)
  const heights = [...new Set(videos.map(f => f.height as number))].sort((a, b) => b - a)

  for (const height of heights.slice(0, MAX_VIDEO_CHOICES)) {
    const candidates = videos.filter(f => f.height === height)
    const best = [...candidates].sort((a, b) => scoreVideo(b) - scoreVideo(a))[0]!
    const muxed = best.acodec && best.acodec !== 'none'
    const size = (best.filesize ?? best.filesize_approx ?? 0) + (muxed ? 0 : audioSize ?? 0)
    const sizeLabel = size > 0 ? ` · ~${formatBytes(size)}` : ''
    // pin the exact format we sized the label from. A height-based selector
    // ending in /b can escape the cap and grab 4K when the DASH pair yt-dlp's
    // bv* accepts is missing (e.g. only a story_card 144p exists, which bv*
    // skips) — the label then lies about ~5 MB while 232 MB comes down.
    const primaryFormat = muxed || !bestAudio ? best.format_id : `${best.format_id}+${bestAudio.format_id}`
    choices.push({
      kind: 'video',
      label: `${height}p · mp4${sizeLabel}`,
      args: ['-f', primaryFormat, '--merge-output-format', 'mp4'],
      fallbackArgs: [
        '-f',
        `bv*[height=${height}]+ba/b[height=${height}]/bv*[height<=${height}]+ba/b[height<=${height}]`,
        '--merge-output-format',
        'mp4',
      ],
    })
  }

  if (choices.length === 0) {
    choices.push({
      kind: 'video',
      label: 'best available · mp4',
      args: ['-f', 'bv*+ba/b', '--merge-output-format', 'mp4'],
    })
  }

  const audioSizeLabel = audioSize ? ` · ~${formatBytes(audioSize)}` : ''
  choices.push({
    kind: 'audio',
    label: `audio only · mp3${audioSizeLabel}`,
    args: bestAudio
      ? ['-f', bestAudio.format_id, '-x', '--audio-format', 'mp3', '--audio-quality', '0']
      : ['-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0'],
    fallbackArgs: ['-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0'],
  })

  return choices
}

function scoreVideo(f: RawFormat): number {
  let score = f.tbr ?? 0
  if (f.ext === 'mp4') score += 10_000
  if (f.vcodec?.startsWith('avc')) score += 5_000
  return score
}

export type DownloadProgress = {
  downloadedBytes: number
  totalBytes?: number
  speed?: number
  eta?: number
  part: number
  /** How many files this download resolves to (video+audio merges are 2). */
  totalParts: number
  /** 1-based index of the current item within a playlist download. */
  item: number
  /** Total items in this run (1 for a single video, N for a playlist). */
  totalItems: number
}

export type DownloadHandlers = {
  onProgress: (progress: DownloadProgress) => void
  onProcessing: () => void
}

const PROGRESS_PREFIX = 'FETCHIT|'
const PROGRESS_TEMPLATE = `${PROGRESS_PREFIX}%(progress.downloaded_bytes)s|%(progress.total_bytes)s|%(progress.total_bytes_estimate)s|%(progress.speed)s|%(progress.eta)s`

let activeChild: ChildProcess | undefined
process.on('exit', () => activeChild?.kill('SIGTERM'))

/**
 * Parse a time string (SS, MM:SS, or HH:MM:SS) into yt-dlp's HH:MM:SS form.
 * Returns undefined if the input is malformed. Used for --download-sections.
 */
export function normalizeTime(input: string): string | undefined {
  const parts = input.trim().split(':')
  if (parts.length < 1 || parts.length > 3) return undefined
  const nums = parts.map(p => Number.parseInt(p, 10))
  if (nums.some(n => !Number.isFinite(n) || n < 0)) return undefined
  const [h, m, s] =
    nums.length === 3 ? nums : nums.length === 2 ? [0, ...nums] : [0, 0, ...nums]
  if (s >= 60 || m >= 60) return undefined
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function download(
  opts: {
    ytdlp: string
    ffmpegLocation?: string
    url: string
    /** When set, reuse the probe's metadata instead of re-extracting — starts much faster. */
    infoJsonPath?: string
    choice: DownloadChoice
    outDir: string
    /** Playlist mode: download specific items of the playlist url, into a titled subfolder. */
    playlist?: {indices: number[]}
    /** Embed chapter markers into the output file (requires ffmpeg). */
    chapters?: boolean
    /** Download only a time range; both endpoints optional. */
    sections?: {from?: string; to?: string}
  },
  handlers: DownloadHandlers,
  signal?: AbortSignal,
): Promise<string[]> {
  const playlist = opts.playlist
  const args = [
    // playlist mode always re-extracts from the url (no cached info to reuse);
    // single-video reuses the probe's metadata when available
    ...(playlist ? [opts.url] : opts.infoJsonPath ? ['--load-info-json', opts.infoJsonPath] : [opts.url]),
    // pinned format_ids only apply when the cached info guarantees them — across
    // separate videos (a playlist) the ids differ, so the generic height-bounded
    // fallbackArgs selector is the safe choice
    ...(playlist
      ? opts.choice.fallbackArgs ?? opts.choice.args
      : opts.infoJsonPath ? opts.choice.args : opts.choice.fallbackArgs ?? opts.choice.args),
    ...(playlist ? ['--playlist-items', playlist.indices.join(',')] : ['--no-playlist']),
    // restrict filenames to ASCII + underscores — Windows can't have | : * ? " < > in
    // filenames, and yt-dlp's --print after_move:filepath sanitizes illegal chars
    // differently than its file writer, so the printed path wouldn't match the real file
    '--restrict-filenames',
    '--no-warnings',
    '--newline',
    // --print implies --quiet, which suppresses progress bars and the
    // [Merger]/[ExtractAudio] lines we detect the processing phase from
    '--no-quiet',
    '--progress',
    '--progress-template',
    `download:${PROGRESS_TEMPLATE}`,
    '--print',
    'after_move:filepath',
    '--no-simulate',
    '-o',
    playlist
      ? path.join(opts.outDir, '%(playlist_title).80B', '%(playlist_index)02d-%(title).60s.%(ext)s')
      : path.join(opts.outDir, '%(title).60s.%(ext)s'),
  ]
  if (opts.ffmpegLocation) args.push('--ffmpeg-location', opts.ffmpegLocation)
  // chapters: embed YouTube chapter markers into the file (ffmpeg post-process)
  if (opts.chapters) args.push('--embed-chapters')
  // NOTE: time-range trimming is done as a post-processing step (see trimWithFfmpeg
  // below) rather than yt-dlp's --download-sections, which hangs on some videos
  // and isn't supported by the bundled ffmpeg-static on Windows.

  return new Promise((resolve, reject) => {
    const child = spawn(opts.ytdlp, args, {signal})
    activeChild = child

    let stderr = ''
    const filepaths: string[] = []
    let part = 0
    let totalParts = 1
    let item = 1
    const totalItems = playlist?.indices.length ?? 1
    let lastDownloaded = 0
    let buffer = ''
    // every file yt-dlp writes this run, so a cancel can clean up after itself
    const destinations: string[] = []

    child.stdout.on('data', (chunk: Buffer) => {
      buffer += chunk.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line) continue
        if (line.startsWith(PROGRESS_PREFIX)) {
          const [downloaded, total, totalEstimate, speed, eta] = line.slice(PROGRESS_PREFIX.length).split('|')
          const downloadedBytes = toNumber(downloaded) ?? 0
          if (downloadedBytes < lastDownloaded) part++
          lastDownloaded = downloadedBytes
          handlers.onProgress({
            downloadedBytes,
            totalBytes: toNumber(total) ?? toNumber(totalEstimate),
            speed: toNumber(speed),
            eta: toNumber(eta),
            part,
            totalParts,
            item,
            totalItems,
          })
        } else if (line.includes('Downloading 1 format(s):')) {
          // "[info] xxx: Downloading 1 format(s): 395+251" — each id is one file
          totalParts = (line.split('format(s):')[1] ?? '').trim().split('+').length
        } else if (line.startsWith('[download] Downloading item ')) {
          // "[download] Downloading item 3 of 12" — a new playlist item starts
          const m = /Downloading item (\d+) of (\d+)/.exec(line)
          if (m) {
            item = Number(m[1])
            part = 0
            lastDownloaded = 0
          }
        } else if (line.includes('[Merger]') || line.includes('[ExtractAudio]')) {
          const merging = /^\[Merger\] Merging formats into "(.+)"$/.exec(line)?.[1]
          const extracting = /^\[ExtractAudio\] Destination: (.+)$/.exec(line)?.[1]
          const target = merging ?? extracting
          if (target) destinations.push(target)
          handlers.onProcessing()
        } else if (line.startsWith('[download] Destination: ')) {
          destinations.push(line.slice('[download] Destination: '.length))
        } else if (path.isAbsolute(line)) {
          filepaths.push(line)
        }
      }
    })
    child.stderr.on('data', chunk => (stderr += chunk))
    child.on('error', reject)
    child.on('close', async code => {
      activeChild = undefined
      if (signal?.aborted) {
        // cancelled on purpose — don't leave half-written files behind
        void removePartials(destinations)
        reject(new Error('Download cancelled.'))
        return
      }
      if (code !== 0 || filepaths.length === 0) {
        reject(new Error(cleanYtDlpError(stderr) || `Download failed (yt-dlp exit code ${code}).`))
        return
      }
      // time-range trim: cut each downloaded file to the requested start/end using
      // ffmpeg's -ss/-to. Done as post-processing (not --download-sections) for
      // reliability — it works on every video and with any ffmpeg build.
      if (opts.sections && (opts.sections.from || opts.sections.to)) {
        try {
          const trimmed = await trimWithFfmpeg(filepaths, opts.sections, opts.ffmpegLocation, handlers, signal)
          resolve(trimmed)
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
        return
      }
      resolve(filepaths)
    })
  })
}

/**
 * Cut each file to the requested time range using ffmpeg -ss/-to. Re-encodes
 * (stream copy can leave keyframe-aligned gaps); safe for the small clips this
 * feature is meant for. Replaces the originals with the trimmed versions.
 */
async function trimWithFfmpeg(
  filepaths: string[],
  sections: {from?: string; to?: string},
  ffmpegLocation: string | undefined,
  handlers: DownloadHandlers,
  signal?: AbortSignal,
): Promise<string[]> {
  const ffmpeg = ffmpegLocation ?? 'ffmpeg'
  const result: string[] = []
  for (const filepath of filepaths) {
    if (signal?.aborted) throw new Error('Download cancelled.')
    handlers.onProcessing()
    const ext = path.extname(filepath)
    const base = filepath.slice(0, -ext.length)
    const tmp = `${base}.trimmed${ext}`
    const args = ['-y']
    if (sections.from) args.push('-ss', sections.from)
    if (sections.to) args.push('-to', sections.to)
    args.push('-i', filepath, '-c:a', 'copy', '-c:v', 'copy', tmp)
    await new Promise<void>((resolve, reject) => {
      const child = spawn(ffmpeg, args, {signal, shell: process.platform === 'win32' && !ffmpegLocation})
      child.on('error', reject)
      child.on('close', code => {
        if (code === 0) resolve()
        else reject(new Error(`ffmpeg trim failed (exit code ${code}) — is ffmpeg installed?`))
      })
    })
    await fs.rm(filepath, {force: true})
    await fs.rename(tmp, filepath)
    result.push(filepath)
  }
  return result
}

function removePartials(destinations: string[]): Promise<unknown> {
  return Promise.allSettled(
    destinations
      .flatMap(dest => [dest, `${dest}.part`, `${dest}.ytdl`])
      .map(file => fs.rm(file, {force: true})),
  )
}

function toNumber(value: string | undefined): number | undefined {
  if (!value || value === 'NA' || value === 'None') return undefined
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : undefined
}

function cleanYtDlpError(stderr: string): string {
  const lines = stderr
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('ERROR:'))
  const last = lines.at(-1)
  return last ? last.replace(/^ERROR:\s*(\[[^\]]+\]\s*)?/, '') : ''
}
