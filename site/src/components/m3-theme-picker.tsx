"use client"

import { useState, useEffect, useRef } from "react"
import { Check, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/sonner-toast"

export interface M3Theme {
  id: string
  name: string
  seedHex: string
  primary: string
  primaryContainer: string
  onPrimaryContainer: string
  accentGlow: string
  description: string
}

export const M3_THEMES: M3Theme[] = [
  {
    id: "slate",
    name: "Monochrome Slate",
    seedHex: "#f8fafc",
    primary: "#f8fafc",
    primaryContainer: "rgba(255, 255, 255, 0.08)",
    onPrimaryContainer: "#f1f5f9",
    accentGlow: "rgba(255, 255, 255, 0.12)",
    description: "Documentation default — clean, high-legibility slate",
  },
  {
    id: "cobalt",
    name: "Electric Cobalt",
    seedHex: "#3b82f6",
    primary: "#3b82f6",
    primaryContainer: "rgba(59, 130, 246, 0.15)",
    onPrimaryContainer: "#60a5fa",
    accentGlow: "rgba(59, 130, 246, 0.25)",
    description: "Professional developer blue",
  },
  {
    id: "indigo",
    name: "Cyber Indigo",
    seedHex: "#6366f1",
    primary: "#6366f1",
    primaryContainer: "rgba(99, 102, 241, 0.15)",
    onPrimaryContainer: "#818cf8",
    accentGlow: "rgba(99, 102, 241, 0.25)",
    description: "Electric indigo accent",
  },
  {
    id: "amber",
    name: "Warm Amber",
    seedHex: "#f59e0b",
    primary: "#f59e0b",
    primaryContainer: "rgba(245, 158, 11, 0.15)",
    onPrimaryContainer: "#fbbf24",
    accentGlow: "rgba(245, 158, 11, 0.25)",
    description: "Subtle warm gold accent",
  },
  {
    id: "emerald",
    name: "Muted Forest",
    seedHex: "#10b981",
    primary: "#10b981",
    primaryContainer: "rgba(16, 185, 129, 0.12)",
    onPrimaryContainer: "#34d399",
    accentGlow: "rgba(16, 185, 129, 0.2)",
    description: "Refined dark forest accent",
  },
]

export function M3ThemePicker() {
  const [activeThemeId, setActiveThemeId] = useState<string>("slate")
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const applyThemeTokens = (theme: M3Theme) => {
    const root = document.documentElement
    root.style.setProperty("--m3-primary", theme.primary)
    root.style.setProperty("--m3-primary-container", theme.primaryContainer)
    root.style.setProperty("--m3-on-primary-container", theme.onPrimaryContainer)
    root.style.setProperty("--m3-accent-glow", theme.accentGlow)
  }

  useEffect(() => {
    const savedId = localStorage.getItem("fetchit_m3_theme")
    const themeToApply = (savedId && M3_THEMES.find((t) => t.id === savedId)) || M3_THEMES[0]
    setActiveThemeId(themeToApply.id)
    applyThemeTokens(themeToApply)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleSelectTheme = (theme: M3Theme) => {
    setActiveThemeId(theme.id)
    localStorage.setItem("fetchit_m3_theme", theme.id)
    applyThemeTokens(theme)
    toast.info(`Theme updated to ${theme.name}`, {
      description: theme.description,
    })
    setIsOpen(false)
  }

  const activeTheme = M3_THEMES.find((t) => t.id === activeThemeId) || M3_THEMES[0]

  return (
    <div className="relative" ref={popoverRef}>
      {/* Minimalist Color Dot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customize Theme Color"
        title={`Theme: ${activeTheme.name}`}
        className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-background hover:bg-secondary transition-all duration-150 active:scale-[0.94] cursor-pointer"
      >
        <span
          className="size-3 rounded-full border border-white/20 shadow-xs transition-colors duration-200"
          style={{ backgroundColor: activeTheme.primary }}
        />
      </button>

      {/* Origin-Aware M3 Typography Spec Popover */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border bg-[#0e0e11] p-3.5 shadow-2xl ring-1 ring-white/10 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
          style={{ transformOrigin: "top right" }}
        >
          {/* Header Typography: M3 Title Medium + Label Small Badge */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3 px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold tracking-tight text-foreground">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Theme Accent Color</span>
            </div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">
              M3 SPEC
            </span>
          </div>

          {/* Theme List: M3 Title Small & Body Small Typography */}
          <div className="space-y-1.5">
            {M3_THEMES.map((t) => {
              const isSelected = t.id === activeThemeId
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-[0.97] ${
                    isSelected
                      ? "bg-white/10 border-white/20 shadow-sm"
                      : "bg-secondary/30 hover:bg-secondary/70 border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-3.5 rounded-full border border-white/30 shrink-0 shadow-xs"
                      style={{ backgroundColor: t.primary }}
                    />
                    <div>
                      {/* Title Small: 14px Medium / 0.1px tracking */}
                      <div className="text-[13px] font-sans font-semibold text-foreground tracking-tight flex items-center gap-1.5 leading-snug">
                        <span>{t.name}</span>
                      </div>
                      {/* Body Small: 12px Regular / 0.4px tracking */}
                      <div className="text-[11px] font-sans text-muted-foreground/80 leading-normal tracking-normal">
                        {t.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="size-3.5 text-foreground stroke-[3] shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
