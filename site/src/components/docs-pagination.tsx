"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getNavContext } from "@/lib/docs-nav"

export function DocsPagination() {
  const pathname = usePathname()
  const { prev, next } = getNavContext(pathname)

  if (!prev && !next) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-6 border-t border-border/60">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:bg-secondary/50 hover:border-foreground/20 hover:shadow-xs"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors mb-1">
            <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="text-sm font-semibold text-foreground group-hover:text-primary">
            {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col justify-between items-end rounded-xl border border-border/60 bg-card/40 p-4 text-right transition-all hover:bg-secondary/50 hover:border-foreground/20 hover:shadow-xs sm:col-start-2"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors mb-1">
            Next
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-sm font-semibold text-foreground group-hover:text-primary">
            {next.label}
          </span>
        </Link>
      ) : null}
    </div>
  )
}
