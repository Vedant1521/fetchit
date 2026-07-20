#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import {execSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dir, '..')
const devtoolsPath = path.join(root, 'node_modules', 'ink', 'build', 'devtools.js')
const devtoolsBackup = devtoolsPath + '.bak'

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const outfile = path.join(root, 'dist', process.platform === 'win32' ? 'fetchit.exe' : 'fetchit')

const original = fs.readFileSync(devtoolsPath, 'utf8')
fs.writeFileSync(devtoolsBackup, original)

const patched = original.replace(
  "import devtools from 'react-devtools-core'",
  'const devtools = { initialize: () => {}, connectToDevTools: () => {} }',
)
fs.writeFileSync(devtoolsPath, patched)

try {
  execSync(
    `bun build --compile --target=bun --define=__VERSION__="${pkg.version}" --outfile="${outfile}" src/cli.tsx`,
    {cwd: root, stdio: 'inherit'},
  )
  console.log('\n\x1b[32m\u2713\x1b[0m Binary built:', outfile)
} finally {
  fs.writeFileSync(devtoolsPath, original)
  try { fs.unlinkSync(devtoolsBackup) } catch {}
}
