"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Keyboard, X, Command, Sparkles, Terminal, BookOpen, Download, Palette } from "lucide-react"

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle modal on '?' (Shift + '/')
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  const shortcuts = [
    { key: "⌘ K / Ctrl+K", desc: "Open Command Palette & Global Search", icon: Command },
    { key: "?", desc: "Toggle Keyboard Shortcuts Cheat Sheet", icon: Keyboard },
    { key: "g then h", desc: "Go to Homepage", icon: BookOpen },
    { key: "g then d", desc: "Go to Documentation", icon: BookOpen },
    { key: "t", desc: "Focus Interactive Terminal Input", icon: Terminal },
    { key: "1 - 5", desc: "Switch M3 Dynamic Theme Accent Colors", icon: Palette },
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-[#0e0e12]/95 p-5 shadow-2xl ring-1 ring-white/10 text-foreground animate-in zoom-in-95 duration-150 backdrop-blur-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-sm font-mono font-semibold tracking-tight text-foreground">
            <Keyboard className="size-4 text-emerald-400" />
            <span>Power-User Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="space-y-2">
          {shortcuts.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-secondary/30 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-3.5 text-emerald-400 shrink-0" />
                  <span className="text-foreground/90 font-sans">{item.desc}</span>
                </div>
                <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-foreground font-mono font-semibold text-[11px] shadow-xs">
                  {item.key}
                </kbd>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border/40 pt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground/60">
          <span>Press ? anytime to toggle shortcut guide</span>
          <span className="text-emerald-400">Emil & M3 Ergonomics</span>
        </div>
      </div>
    </div>
  )
}
