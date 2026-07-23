"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Command,
  BookOpen,
  Terminal,
  Download,
  Sliders,
  Palette,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react"
import { M3_THEMES, type M3Theme } from "@/components/m3-theme-picker"
import { toast } from "@/components/ui/sonner-toast"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  // Cmd+K / Ctrl+K keyboard shortcut trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const actions = [
    {
      id: "docs-start",
      title: "Getting Started Guide",
      subtitle: "Quick setup & basic usage instructions",
      icon: BookOpen,
      category: "Documentation",
      perform: () => router.push("/docs/getting-started"),
    },
    {
      id: "docs-install",
      title: "Installation Guide",
      subtitle: "Install via macOS Brew, Linux Binary, Winget, or npm",
      icon: Download,
      category: "Documentation",
      perform: () => router.push("/docs/install"),
    },
    {
      id: "docs-tui",
      title: "Interactive Mode (TUI)",
      subtitle: "Keyboard navigation & format selection specs",
      icon: Terminal,
      category: "Documentation",
      perform: () => router.push("/docs/interactive-mode"),
    },
    {
      id: "docs-cli",
      title: "CLI Command Reference",
      subtitle: "100% flags reference & scriptable usage",
      icon: Sliders,
      category: "Documentation",
      perform: () => router.push("/docs/cli-reference"),
    },
    // Theme options
    ...M3_THEMES.map((theme) => ({
      id: `theme-${theme.id}`,
      title: `Switch Theme: ${theme.name}`,
      subtitle: theme.description,
      icon: Palette,
      category: "M3 Seed Themes",
      perform: () => {
        const root = document.documentElement
        root.style.setProperty("--m3-primary", theme.primary)
        root.style.setProperty("--m3-primary-container", theme.primaryContainer)
        root.style.setProperty("--m3-on-primary-container", theme.onPrimaryContainer)
        root.style.setProperty("--m3-accent-glow", theme.accentGlow)
        localStorage.setItem("fetchit_m3_theme", theme.id)
        toast.info(`Theme set to ${theme.name}`, { description: theme.description })
      },
    })),
  ]

  const filteredActions = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectAction = useCallback(
    (action: (typeof actions)[0]) => {
      action.perform()
      setIsOpen(false)
      setSearchQuery("")
    },
    []
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length))
    } else if (e.key === "Enter" && filteredActions[selectedIndex]) {
      e.preventDefault()
      handleSelectAction(filteredActions[selectedIndex])
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xl rounded-2xl border border-border bg-[#0e0e12]/95 p-3 shadow-2xl ring-1 ring-white/10 overflow-hidden text-foreground animate-in zoom-in-95 duration-150 backdrop-blur-2xl"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border/60">
          <Search className="size-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command or search documentation..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-white/5 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Actions List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-1 no-scrollbar">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-muted-foreground/60">
              No matching commands or pages found.
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectAction(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                    isSelected
                      ? "bg-foreground text-background font-semibold shadow-md"
                      : "hover:bg-secondary/60 text-foreground/90"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? "bg-background/20 text-background" : "bg-white/5 text-emerald-400 border border-white/5"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div className="truncate">
                      <div className="text-xs font-mono font-semibold tracking-tight flex items-center gap-2 truncate">
                        <span>{item.title}</span>
                      </div>
                      <div
                        className={`text-[11px] font-sans truncate ${
                          isSelected ? "text-background/80" : "text-muted-foreground/70"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ml-2 ${
                      isSelected
                        ? "bg-background/20 text-background"
                        : "bg-white/5 text-muted-foreground border border-white/5"
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="flex items-center justify-between border-t border-border/40 px-3 pt-2.5 pb-1 text-[11px] font-mono text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-foreground">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-foreground">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-foreground">↵</kbd>
              <span>Select</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Command className="size-3" />
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  )
}
