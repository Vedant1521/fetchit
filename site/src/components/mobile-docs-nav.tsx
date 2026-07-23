"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { docsNavSections, getNavContext } from "@/lib/docs-nav"
import { Menu, X, BookOpen, ChevronRight, Sparkles } from "lucide-react"

export function MobileDocsNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { sectionTitle, itemLabel } = getNavContext(pathname)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-close drawer when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="md:hidden sticky top-14 z-30 w-full border-b border-border/80 bg-[#0c0c0e]/95 backdrop-blur-md px-4 py-2.5">
      {/* Mobile Top Navigation Trigger Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          suppressHydrationWarning
          className="flex items-center gap-2 text-xs font-mono font-semibold text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/20 shadow-xs transition-all active:scale-[0.97] cursor-pointer"
        >
          <Menu className="size-3.5 text-emerald-400" />
          <span>Docs Menu</span>
        </button>

        {/* Current Path Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono truncate max-w-[210px]">
          <BookOpen className="size-3 text-emerald-400/80 shrink-0" />
          <span className="truncate text-white font-semibold">
            {itemLabel || sectionTitle || "Overview"}
          </span>
        </div>
      </div>

      {/* Slide-over Full-Screen Navigation Overlay (Portaled directly to document.body to bypass parent overflow clipping) */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#0c0c0f] flex flex-col font-sans">
          {/* Overlay Header Bar */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/15 bg-[#141419] shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white tracking-wider uppercase">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>FETCHIT DOCUMENTATION</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              suppressHydrationWarning
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-xs font-mono font-bold text-white hover:bg-white/25 transition-all cursor-pointer active:scale-[0.96] border border-white/20"
            >
              <X className="size-4 text-emerald-400" />
              <span>Close</span>
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7 bg-[#0c0c0f]">
            {docsNavSections.map((section) => (
              <div key={section.title} className="space-y-2.5">
                {section.href ? (
                  <Link
                    href={section.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-xs font-mono font-extrabold tracking-wider uppercase text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {section.title}
                  </Link>
                ) : (
                  <div className="text-xs font-mono font-extrabold tracking-wider uppercase text-slate-400">
                    {section.title}
                  </div>
                )}

                <ul className="space-y-1.5 pl-3 border-l-2 border-emerald-500/30">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-all font-sans font-medium",
                            isActive
                              ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm"
                              : "text-slate-200 hover:text-white hover:bg-white/10"
                          )}
                        >
                          <span>{item.label}</span>
                          {isActive && <ChevronRight className="size-4 text-emerald-400 stroke-[3]" />}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
