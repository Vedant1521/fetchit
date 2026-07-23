"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { docsNavSections, getNavContext } from "@/lib/docs-nav"
import { Menu, X, BookOpen, ChevronRight } from "lucide-react"

export function MobileDocsNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { sectionTitle, itemLabel } = getNavContext(pathname)

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
          className="flex items-center gap-2 text-xs font-mono font-medium text-foreground bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all active:scale-[0.97] cursor-pointer"
        >
          <Menu className="size-3.5 text-emerald-400" />
          <span>Docs Menu</span>
        </button>

        {/* Current Path Indicator */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono truncate max-w-[200px]">
          <BookOpen className="size-3 text-muted-foreground/60 shrink-0" />
          <span className="truncate text-foreground font-semibold">
            {itemLabel || sectionTitle || "Overview"}
          </span>
        </div>
      </div>

      {/* Slide-over Full-Screen Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-background/95 backdrop-blur-xl animate-in fade-in duration-150 flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#101014]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground tracking-wider uppercase">
              <BookOpen className="size-4 text-emerald-400" />
              <span>Documentation Navigation</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              suppressHydrationWarning
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {docsNavSections.map((section) => (
              <div key={section.title} className="space-y-2">
                {section.href ? (
                  <Link
                    href={section.href}
                    className="block text-xs font-mono font-bold tracking-wider uppercase text-emerald-400 hover:underline"
                  >
                    {section.title}
                  </Link>
                ) : (
                  <div className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground/70">
                    {section.title}
                  </div>
                )}

                <ul className="space-y-1 pl-2 border-l border-border/60">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all font-sans",
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                        >
                          <span>{item.label}</span>
                          {isActive && <ChevronRight className="size-4 text-emerald-400" />}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
