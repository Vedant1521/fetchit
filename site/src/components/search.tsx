"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

const searchItems = [
  { label: "Getting Started", href: "/docs/getting-started", keywords: "start first download install" },
  { label: "Install Guide", href: "/docs/install", keywords: "installation setup npm binary" },
  { label: "Interactive Mode", href: "/docs/interactive-mode", keywords: "tui keyboard mouse theme" },
  { label: "Scriptable Mode", href: "/docs/scriptable-mode", keywords: "script cli automation best mp3" },
  { label: "Playlists", href: "/docs/playlists", keywords: "playlist multi video batch" },
  { label: "Troubleshooting", href: "/docs/troubleshooting", keywords: "error fix help bugs" },
]

export function Search() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground text-xs gap-2 w-32 justify-start"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search...
        <kbd className="ml-auto hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {searchItems.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.label} ${item.keywords}`}
                onSelect={() => runCommand(item.href)}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
