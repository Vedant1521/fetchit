import {execFile, execFileSync} from 'node:child_process'
import {promisify} from 'node:util'

const execFileAsync = promisify(execFile)

const COMMANDS: Array<[string, string[]]> =
  process.platform === 'darwin'
    ? [['pbpaste', []]]
    : process.platform === 'win32'
      ? [['powershell', ['-NoProfile', '-Command', 'Get-Clipboard']]]
      : [
          ['wl-paste', ['--no-newline']],
          ['xclip', ['-selection', 'clipboard', '-o']],
          ['xsel', ['--clipboard', '--output']],
        ]

export function readClipboardSync(): string {
  for (const [command, args] of COMMANDS) {
    try {
      return execFileSync(command, args, {encoding: 'utf8', timeout: 800, stdio: ['ignore', 'pipe', 'ignore']})
    } catch {
      // tool missing or clipboard empty — try the next one
    }
  }
  return ''
}

export async function readClipboard(): Promise<string> {
  for (const [command, args] of COMMANDS) {
    try {
      const {stdout} = await execFileAsync(command, args, {encoding: 'utf8', timeout: 8_000})
      return stdout
    } catch {
      // tool missing or clipboard empty — try the next one
    }
  }
  return ''
}
