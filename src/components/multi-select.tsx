import React, {useState} from 'react'
import {Box, Text, useInput} from 'ink'
import {formatDuration, truncate} from '../lib/format.js'
import {useTheme} from '../theme.js'

type Item = {
  title: string
  duration?: number
  uploader?: string
}

/**
 * Multi-select checklist for playlists. `space` toggles the highlighted row,
 * `↑`/`↓` move, `enter` confirms with the selected indices. The list scrolls
 * a fixed window so long playlists don't overflow the centered layout.
 */
export function MultiSelect({
  items,
  initialSelected,
  onConfirm,
}: {
  items: Item[]
  initialSelected: boolean[]
  onConfirm: (indices: number[]) => void
}) {
  const theme = useTheme()
  const [cursor, setCursor] = useState(0)
  const [selected, setSelected] = useState<boolean[]>(initialSelected)

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor(c => Math.max(0, c - 1))
    } else if (key.downArrow) {
      setCursor(c => Math.min(items.length - 1, c + 1))
    } else if (key.return) {
      onConfirm(selected.flatMap((on, index) => (on ? [index] : [])))
    } else if (input === ' ') {
      setSelected(sel => sel.map((on, index) => (index === cursor ? !on : on)))
    }
  })

  const visible = 10
  let start = Math.max(0, cursor - Math.floor(visible / 2))
  const end = Math.min(items.length, start + visible)
  if (end - start < visible) start = Math.max(0, end - visible)

  return (
    <Box flexDirection="column">
      {items.slice(start, end).map((item, i) => {
        const index = start + i
        const on = selected[index]
        const isCursor = index === cursor
        const title = truncate(item.title || 'untitled', 44)
        const dur = item.duration ? ` · ${formatDuration(item.duration)}` : ''
        const up = item.uploader ? ` · ${truncate(item.uploader, 18)}` : ''
        return (
          <Box key={index}>
            <Box marginRight={1}>
              <Text color={theme.primary}>{isCursor ? '❯' : ' '}</Text>
            </Box>
            <Text color={theme.primary} bold={isCursor}>
              {on ? '☒' : '☐'}
            </Text>
            <Text color={on ? theme.primary : theme.gray} dimColor={!on && theme.dimSecondary} bold={isCursor}>
              {` ${title}${dur}${up}`}
            </Text>
          </Box>
        )
      })}
      {items.length > visible ? (
        <Text color={theme.gray} dimColor={theme.dimSecondary}>
          {' '}{'↑↓ move · ⇧ scroll'} {start + 1}–{end}/{items.length}
        </Text>
      ) : null}
    </Box>
  )
}
