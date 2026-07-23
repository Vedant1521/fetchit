"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ExternalLink,
  ArrowUp,
  ListFilter,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react"

interface HeadingItem {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // Hydrate collapsed state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fetchit_toc_collapsed")
      if (stored !== null) {
        setIsCollapsed(stored === "true")
      }
    } catch {
      // Ignore SSR
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("fetchit_toc_collapsed", String(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(".prose-custom h2, .prose-custom h3")
      )

      const usedIds = new Set<string>()

      const items: HeadingItem[] = elements.map((el, index) => {
        const text = el.textContent || ""
        let baseSlug = slugify(text) || `heading-${index}`
        let slug = baseSlug
        let count = 1

        while (usedIds.has(slug)) {
          slug = `${baseSlug}-${count}`
          count++
        }

        usedIds.add(slug)
        el.id = slug

        return {
          id: slug,
          text,
          level: Number(el.tagName.replace("H", "")),
        }
      })

      setHeadings(items)
      if (items.length > 0) {
        setActiveId(items[0].id)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id)
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(headings[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (headings.length === 0) return null

  // Render Collapsed Floating Pill
  if (isCollapsed) {
    return (
      <aside className="sticky top-20 flex flex-col items-end">
        <button
          onClick={toggleCollapse}
          title="Expand On This Page sidebar"
          aria-label="Expand outline"
          className="group flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-mono font-medium text-muted-foreground backdrop-blur-md shadow-xs transition-all hover:border-foreground/30 hover:bg-secondary hover:text-foreground cursor-pointer active:scale-95"
        >
          <ListFilter className="size-3.5 text-emerald-400 transition-transform group-hover:scale-110" />
          <span>On This Page</span>
          <PanelRightOpen className="size-3.5 opacity-60 group-hover:opacity-100" />
        </button>
      </aside>
    )
  }

  // Render Expanded Right Sidebar
  return (
    <aside className="sticky top-20 w-60 max-h-[calc(100vh-6rem)] overflow-y-auto py-2 text-xs font-sans transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between font-medium text-foreground tracking-tight pb-2 border-b border-border/40">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
          On This Page
        </span>
        <button
          onClick={toggleCollapse}
          title="Minimize sidebar"
          aria-label="Minimize outline"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground cursor-pointer active:scale-95"
        >
          <PanelRightClose className="size-3.5" />
        </button>
      </div>

      {/* Heading List with Active Emerald Left Border */}
      <div className="relative border-l border-border/60 pl-3 my-3 space-y-1.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(heading.id)
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" })
                  setActiveId(heading.id)
                  history.pushState(null, "", `#${heading.id}`)
                }
              }}
              className={cn(
                "block py-0.5 leading-snug transition-all truncate text-xs font-sans",
                heading.level === 3 && "pl-2.5 text-[11px]",
                isActive
                  ? "font-semibold text-emerald-400 -ml-[13px] border-l-2 border-emerald-400 pl-[11px]"
                  : "text-muted-foreground/80 hover:text-foreground"
              )}
              title={heading.text}
            >
              {heading.text}
            </a>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-3.5 border-t border-border/40 space-y-2 text-xs text-muted-foreground font-sans">
        <a
          href="https://github.com/Vedant1521/fetchit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
        >
          <ExternalLink className="size-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
          <span>Edit page on GitHub</span>
        </a>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors w-full text-left cursor-pointer group"
        >
          <ArrowUp className="size-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
          <span>Scroll to top</span>
        </button>
      </div>
    </aside>
  )
}
