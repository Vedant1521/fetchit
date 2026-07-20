#!/usr/bin/env bun
import path from 'node:path'

const outfile = path.resolve(import.meta.dir, '..', 'dist', process.platform === 'win32' ? 'fetchit.exe' : 'fetchit')

Bun.build({
  entrypoints: [path.resolve(import.meta.dir, '..', 'src/cli.tsx')],
  outfile,
  target: 'bun',
  format: 'esm',
  sourcemap: 'none',
  minify: true,
  plugins: [
    {
      name: 'stub-optional-deps',
      setup(build) {
        build.onResolve({filter: /react-devtools-core/}, () => ({
          path: 'react-devtools-core',
          namespace: 'stub',
        }))
        build.onLoad({filter: /.*/, namespace: 'stub'}, () => ({
          contents: 'module.exports = {}',
          loader: 'js',
        }))
      },
    },
  ],
}).then(() => {
  console.log(`✓ Binary built: ${outfile}`)
}).catch(err => {
  console.error(err)
  process.exit(1)
})
