"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, BookOpen } from "lucide-react"
import { getNavContext } from "@/lib/docs-nav"

export function Breadcrumbs() {
  const pathname = usePathname()
  const { sectionTitle, sectionHref, itemLabel } = getNavContext(pathname)

  // If path is root docs page or unmapped
  const isOverview = pathname === "/docs"

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
      <Link
        href="/docs"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <BookOpen className="size-3.5" />
        <span>Docs</span>
      </Link>

      {sectionTitle && (
        <>
          <ChevronRight className="size-3 shrink-0 opacity-50" />
          {sectionHref ? (
            <Link href={sectionHref} className="hover:text-foreground transition-colors">
              {sectionTitle}
            </Link>
          ) : (
            <span>{sectionTitle}</span>
          )}
        </>
      )}

      {itemLabel && !isOverview && (
        <>
          <ChevronRight className="size-3 shrink-0 opacity-50" />
          <span className="font-medium text-foreground">{itemLabel}</span>
        </>
      )}
    </nav>
  )
}
