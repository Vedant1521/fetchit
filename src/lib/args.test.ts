import assert from 'node:assert/strict'
import test from 'node:test'
import {parseArgs} from './args.js'
import {normalizeTime} from './ytdlp.js'
import {isThemeMode, nextThemeMode, themeFor} from '../theme.js'

test('parses a url and a spaced theme option without confusing the value for the url', () => {
  assert.deepEqual(parseArgs(['--theme', 'light', 'https://example.com/video']), {
    help: false,
    version: false,
    themeMode: 'light',
    initialUrl: 'https://example.com/video',
  })
})

test('parses an equals-style theme option after the url', () => {
  assert.deepEqual(parseArgs(['https://example.com/video', '--theme=dark']), {
    help: false,
    version: false,
    themeMode: 'dark',
    initialUrl: 'https://example.com/video',
  })
})

test('rejects missing, invalid, and unknown options', () => {
  assert.match(parseArgs(['--theme']).error ?? '', /needs a value/)
  assert.match(parseArgs(['--theme', 'sepia']).error ?? '', /unknown theme/)
  assert.match(parseArgs(['--wat']).error ?? '', /unknown option/)
  assert.match(parseArgs(['one', 'two', 'three']).error ?? '', /url and optional quality/)
})

test('accepts a quality as the second positional: 1080p, 720p, mp3, audio', () => {
  assert.equal(parseArgs(['https://example.com/v', '1080p']).quality, '1080p')
  assert.equal(parseArgs(['https://example.com/v', '720p']).quality, '720p')
  assert.equal(parseArgs(['https://example.com/v', 'mp3']).quality, 'mp3')
  assert.equal(parseArgs(['https://example.com/v', 'audio']).quality, 'audio')
  assert.equal(parseArgs(['https://example.com/v', '2160p']).quality, '2160p')
})

test('rejects an unknown quality', () => {
  assert.match(parseArgs(['https://example.com/v', 'hd']).error ?? '', /unknown quality/)
  assert.match(parseArgs(['https://example.com/v', '4k']).error ?? '', /unknown quality/)
})

test('--best/--mp3 can’t be combined with a direct quality', () => {
  assert.match(parseArgs(['--best', 'https://example.com/v', '1080p']).error ?? '', /can’t be combined/)
  assert.match(parseArgs(['--mp3', 'https://example.com/v', 'mp3']).error ?? '', /can’t be combined/)
})

test('--chapters sets the chapters flag', () => {
  assert.equal(parseArgs(['--chapters', 'https://example.com/v']).chapters, true)
  assert.equal(parseArgs(['https://example.com/v']).chapters, undefined)
})

test('--chapters without a url is rejected', () => {
  assert.match(parseArgs(['--chapters']).error ?? '', /needs a url/)
})

test('--from and --to accept MM:SS and HH:MM:SS and normalize to HH:MM:SS', () => {
  assert.equal(parseArgs(['--from', '5:30', 'https://example.com/v']).from, '00:05:30')
  assert.equal(parseArgs(['--from', '01:02:30', 'https://example.com/v']).from, '01:02:30')
  assert.equal(parseArgs(['--to', '10:15', 'https://example.com/v']).to, '00:10:15')
  assert.equal(parseArgs(['--to=1:00:00', 'https://example.com/v']).to, '01:00:00')
})

test('--from/--to reject invalid times', () => {
  assert.match(parseArgs(['--from', 'abc', 'https://example.com/v']).error ?? '', /isn’t a valid time/)
  assert.match(parseArgs(['--from', '5:99', 'https://example.com/v']).error ?? '', /isn’t a valid time/)
  assert.match(parseArgs(['--to', '99:99:99', 'https://example.com/v']).error ?? '', /isn’t a valid time/)
})

test('--from/--to without a url is rejected', () => {
  assert.match(parseArgs(['--from', '5:30']).error ?? '', /needs a url/)
  assert.match(parseArgs(['--to', '10:15']).error ?? '', /needs a url/)
})

test('normalizeTime accepts SS, MM:SS, HH:MM:SS', () => {
  assert.equal(normalizeTime('42'), '00:00:42')
  assert.equal(normalizeTime('5:30'), '00:05:30')
  assert.equal(normalizeTime('01:02:30'), '01:02:30')
})

test('normalizeTime rejects malformed input', () => {
  assert.equal(normalizeTime('abc'), undefined)
  assert.equal(normalizeTime('5:99'), undefined)
  assert.equal(normalizeTime(''), undefined)
  assert.equal(normalizeTime('1:2:3:4'), undefined)
})

test('--concurrency accepts a positive integer in spaced and equals forms', () => {
  assert.equal(parseArgs(['--concurrency', '3', 'https://example.com/v']).concurrency, 3)
  assert.equal(parseArgs(['--concurrency=5', 'https://example.com/v']).concurrency, 5)
  assert.equal(parseArgs(['--concurrency', '1', 'https://example.com/v']).concurrency, 1)
})

test('--concurrency rejects missing, zero, negative, and non-numeric values', () => {
  assert.match(parseArgs(['--concurrency']).error ?? '', /needs a number/)
  assert.match(parseArgs(['--concurrency', '0', 'https://example.com/v']).error ?? '', /positive number/)
  assert.match(parseArgs(['--concurrency', '-1', 'https://example.com/v']).error ?? '', /positive number/)
  assert.match(parseArgs(['--concurrency', 'abc', 'https://example.com/v']).error ?? '', /positive number/)
})

test('--best sets the scriptable flag and keeps the url', () => {
  assert.deepEqual(parseArgs(['--best', 'https://example.com/v']), {
    help: false,
    version: false,
    best: true,
    initialUrl: 'https://example.com/v',
  })
})

test('--mp3 sets the scriptable flag and keeps the url', () => {
  assert.deepEqual(parseArgs(['https://example.com/v', '--mp3']), {
    help: false,
    version: false,
    mp3: true,
    initialUrl: 'https://example.com/v',
  })
})

test('-o and --output set the output directory in spaced and equals forms', () => {
  assert.equal(parseArgs(['-o', '~/Videos', 'https://example.com/v']).outputDir, '~/Videos')
  assert.equal(parseArgs(['--output', '~/Videos', 'https://example.com/v']).outputDir, '~/Videos')
  assert.equal(parseArgs(['--output=~/Videos', 'https://example.com/v']).outputDir, '~/Videos')
  assert.equal(parseArgs(['-o=~/Videos', 'https://example.com/v']).outputDir, '~/Videos')
})

test('--best and --mp3 are mutually exclusive and both require a url', () => {
  assert.match(parseArgs(['--best', '--mp3', 'https://example.com/v']).error ?? '', /can’t be combined/)
  assert.match(parseArgs(['--best']).error ?? '', /needs a url/)
  assert.match(parseArgs(['--mp3']).error ?? '', /needs a url/)
  assert.match(parseArgs(['-o']).error ?? '', /needs a directory/)
})

test('recognizes only supported modes and cycles through all of them', () => {
  assert.equal(isThemeMode('auto'), true)
  assert.equal(isThemeMode('light'), true)
  assert.equal(isThemeMode('dark'), true)
  assert.equal(isThemeMode('sepia'), false)
  assert.equal(nextThemeMode('auto'), 'light')
  assert.equal(nextThemeMode('light'), 'dark')
  assert.equal(nextThemeMode('dark'), 'auto')
})

test('auto delegates to terminal colors while forced modes own the full surface', () => {
  assert.deepEqual(themeFor('auto'), {
    mode: 'auto',
    primary: undefined,
    gray: undefined,
    dark: undefined,
    background: undefined,
    dimSecondary: true,
    inverseButton: true,
  })

  assert.equal(themeFor('light').background, '#ffffff')
  assert.equal(themeFor('light').primary, '#18181b')
  assert.equal(themeFor('dark').background, '#18181b')
  assert.equal(themeFor('dark').primary, '#ffffff')
})
