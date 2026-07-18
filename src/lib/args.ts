import {isThemeMode, type ThemeMode} from '../theme.js'
import {normalizeTime} from './ytdlp.js'

export type CliArgs = {
  help: boolean
  version: boolean
  initialUrl?: string
  themeMode?: ThemeMode
  /** Scriptable mode: download best quality, skip the picker. */
  best?: boolean
  /** Scriptable mode: audio-only mp3, skip the picker. */
  mp3?: boolean
  /** Direct format selection: a resolution like 1080p/720p/360p or "mp3"/"audio". */
  quality?: string
  /** Override the output directory (default ~/Downloads). */
  outputDir?: string
  /** Embed chapter markers into the output file. */
  chapters?: boolean
  /** Download only a time range — start endpoint (HH:MM:SS, MM:SS, or SS). */
  from?: string
  /** Download only a time range — end endpoint. */
  to?: string
  error?: string
}

/** Accepted direct-format queries. Resolutions are matched loosely (see pickChoiceByLabel). */
const VALID_QUALITIES = new Set(['mp3', 'audio', 'best'])

function isQuality(value: string): boolean {
  if (VALID_QUALITIES.has(value.toLowerCase())) return true
  // any "<digits>p" like 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p
  return /^\d{2,4}p$/i.test(value)
}

export function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {help: false, version: false}
  const positional: string[] = []

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!
    if (arg === '-h' || arg === '--help') {
      result.help = true
    } else if (arg === '-v' || arg === '--version') {
      result.version = true
    } else if (arg === '--theme') {
      const value = args[++index]
      if (!value) return {...result, error: '--theme needs a value: auto, light, or dark'}
      if (!isThemeMode(value)) return {...result, error: `unknown theme “${value}” — use auto, light, or dark`}
      result.themeMode = value
    } else if (arg.startsWith('--theme=')) {
      const value = arg.slice('--theme='.length)
      if (!isThemeMode(value)) return {...result, error: `unknown theme “${value}” — use auto, light, or dark`}
      result.themeMode = value
    } else if (arg === '--best') {
      result.best = true
    } else if (arg === '--mp3') {
      result.mp3 = true
    } else if (arg === '--chapters') {
      result.chapters = true
    } else if (arg === '--from') {
      const value = args[++index]
      if (!value) return {...result, error: '--from needs a time like 5:30 or 01:02:30'}
      const normalized = normalizeTime(value)
      if (!normalized) return {...result, error: `--from “${value}” isn’t a valid time — use MM:SS or HH:MM:SS`}
      result.from = normalized
    } else if (arg.startsWith('--from=')) {
      const value = arg.slice('--from='.length)
      const normalized = normalizeTime(value)
      if (!normalized) return {...result, error: `--from “${value}” isn’t a valid time — use MM:SS or HH:MM:SS`}
      result.from = normalized
    } else if (arg === '--to') {
      const value = args[++index]
      if (!value) return {...result, error: '--to needs a time like 10:15 or 01:00:00'}
      const normalized = normalizeTime(value)
      if (!normalized) return {...result, error: `--to “${value}” isn’t a valid time — use MM:SS or HH:MM:SS`}
      result.to = normalized
    } else if (arg.startsWith('--to=')) {
      const value = arg.slice('--to='.length)
      const normalized = normalizeTime(value)
      if (!normalized) return {...result, error: `--to “${value}” isn’t a valid time — use MM:SS or HH:MM:SS`}
      result.to = normalized
    } else if (arg === '-o' || arg === '--output') {
      const value = args[++index]
      if (!value) return {...result, error: `${arg} needs a directory path`}
      result.outputDir = value
    } else if (arg.startsWith('--output=')) {
      result.outputDir = arg.slice('--output='.length)
    } else if (arg.startsWith('-o=')) {
      result.outputDir = arg.slice('-o='.length)
    } else if (arg.startsWith('-')) {
      return {...result, error: `unknown option “${arg}”`}
    } else {
      positional.push(arg)
    }
  }

  if (positional.length > 2) return {...result, error: 'expected a url and optional quality (e.g. 1080p or mp3)'}
  result.initialUrl = positional[0]
  if (positional[1]) {
    if (!isQuality(positional[1])) {
      return {...result, error: `unknown quality “${positional[1]}” — use a resolution like 1080p, or mp3/audio`}
    }
    result.quality = positional[1]!.toLowerCase()
  }

  const scriptable = result.best || result.mp3 || result.quality
  if (result.best && result.mp3) {
    return {...result, error: '--best and --mp3 can’t be combined — pick one'}
  }
  if (result.quality && (result.best || result.mp3)) {
    return {...result, error: `--best/--mp3 can’t be combined with a direct quality — pick one`}
  }
  if (scriptable && !result.initialUrl) {
    return {...result, error: `scriptable mode needs a url`}
  }
  if (result.chapters && !result.initialUrl) {
    return {...result, error: '--chapters needs a url'}
  }
  if ((result.from || result.to) && !result.initialUrl) {
    return {...result, error: '--from/--to needs a url'}
  }

  return result
}
