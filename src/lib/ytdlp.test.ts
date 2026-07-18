import assert from 'node:assert/strict'
import test from 'node:test'
import {buildChoices, classifyProbe, pickChoice, pickChoiceByLabel, type VideoInfo} from './ytdlp.js'

const info = (formats: VideoInfo['formats']): VideoInfo => ({title: 'test', formats})

test('pins the exact video+audio format_ids in args so the size label matches what downloads', () => {
  const choices = buildChoices(info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ]))
  const video144 = choices.find(c => c.label.startsWith('144p'))!
  assert.deepEqual(video144.args, ['-f', '160+140', '--merge-output-format', 'mp4'])
  // size label sums the pinned video + best audio (5 + 3 MB = 8 MB)
  assert.match(video144.label, /~7\.6 MB/)
})

test('pins a muxed format directly when it already carries audio', () => {
  const choices = buildChoices(info([
    {format_id: '18', vcodec: 'avc1', acodec: 'mp4a', height: 360, ext: 'mp4', filesize: 10_000_000, tbr: 500},
  ]))
  const video360 = choices.find(c => c.label.startsWith('360p'))!
  assert.deepEqual(video360.args, ['-f', '18', '--merge-output-format', 'mp4'])
})

test('falls back to the video id alone when no audio-only format exists', () => {
  const choices = buildChoices(info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
  ]))
  const video144 = choices.find(c => c.label.startsWith('144p'))!
  assert.deepEqual(video144.args, ['-f', '160', '--merge-output-format', 'mp4'])
})

test('fallbackArgs stays height-bounded — never ends in an unconstrained /b that grabs 4K', () => {
  const choices = buildChoices(info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ]))
  const video144 = choices.find(c => c.label.startsWith('144p'))!
  const selector = video144.fallbackArgs![1]!
  assert.match(selector, /bv\*\[height=144\]\+ba\/b\[height=144\]\/bv\*\[height<=144\]\+ba\/b\[height<=144\]/)
  assert.doesNotMatch(selector, /\/b$/, 'trailing /b would let yt-dlp escape the height cap')
})

test('audio choice pins bestAudio.format_id and falls back to ba/b on retry', () => {
  const choices = buildChoices(info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ]))
  const audio = choices.find(c => c.kind === 'audio')!
  assert.deepEqual(audio.args, ['-f', '140', '-x', '--audio-format', 'mp3', '--audio-quality', '0'])
  assert.deepEqual(audio.fallbackArgs, ['-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0'])
})

test('classifyProbe detects a playlist when entries has more than one item', () => {
  assert.equal(
    classifyProbe({title: 'my playlist', entries: [{title: 'a'}, {title: 'b'}, {title: 'c'}]}),
    'playlist',
  )
})

test('classifyProbe treats a single entry as a video, not a playlist', () => {
  assert.equal(classifyProbe({title: 'solo', entries: [{title: 'only'}]}), 'video')
})

test('classifyProbe treats a bare video with no entries as a video', () => {
  assert.equal(classifyProbe({title: 'solo', formats: []}), 'video')
})

test('pickChoice(best) returns the first (highest) video choice', () => {
  const choices = buildChoices(info([
    {format_id: '137', vcodec: 'avc1', acodec: 'none', height: 1080, ext: 'mp4', filesize: 50_000_000, tbr: 5000},
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ]))
  const best = pickChoice(info([
    {format_id: '137', vcodec: 'avc1', acodec: 'none', height: 1080, ext: 'mp4', filesize: 50_000_000, tbr: 5000},
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ]), 'best')
  assert.equal(best.kind, 'video')
  assert.equal(best.label, choices.find(c => c.kind === 'video')!.label)
})

test('pickChoice(mp3) returns the audio choice with the pinned best-audio format_id', () => {
  const mp3 = pickChoice(info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ]), 'mp3')
  assert.equal(mp3.kind, 'audio')
  assert.deepEqual(mp3.args, ['-f', '140', '-x', '--audio-format', 'mp3', '--audio-quality', '0'])
})

test('pickChoice falls back to a generic selector when no formats are present', () => {
  const best = pickChoice({title: 'solo', formats: []}, 'best')
  assert.deepEqual(best.args, ['-f', 'bv*+ba/b', '--merge-output-format', 'mp4'])
  const mp3 = pickChoice({title: 'solo', formats: []}, 'mp3')
  assert.deepEqual(mp3.args, ['-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0'])
})

test('pickChoiceByLabel matches a resolution token at the start of the label', () => {
  const data = info([
    {format_id: '137', vcodec: 'avc1', acodec: 'none', height: 1080, ext: 'mp4', filesize: 50_000_000, tbr: 5000},
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ])
  const choice = pickChoiceByLabel(data, '1080p')
  assert.match(choice.label, /^1080p/)
  assert.equal(choice.kind, 'video')
})

test('pickChoiceByLabel matches mp3/audio to the audio choice', () => {
  const data = info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ])
  assert.equal(pickChoiceByLabel(data, 'mp3').kind, 'audio')
  assert.equal(pickChoiceByLabel(data, 'audio').kind, 'audio')
})

test('pickChoiceByLabel throws when no format matches the query', () => {
  const data = info([
    {format_id: '160', vcodec: 'avc1', acodec: 'none', height: 144, ext: 'mp4', filesize: 5_000_000, tbr: 100},
    {format_id: '140', vcodec: 'none', acodec: 'mp4a', abr: 128, filesize: 3_000_000, tbr: 130},
  ])
  assert.throws(() => pickChoiceByLabel(data, '4k'), /no format matching/)
})
