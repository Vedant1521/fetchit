"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Search } from "@/components/search"
import { M3ThemePicker } from "@/components/m3-theme-picker"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { docsNavSections } from "@/lib/docs-nav"
import { BookOpen, ExternalLink, Menu } from "lucide-react"

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/install", label: "Install" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md shadow-xs transition-colors">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
            FETCHIT
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  pathname === link.href || (link.href !== "/docs" && pathname.startsWith(link.href))
                    ? "text-foreground font-medium text-emerald-400"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Search />
          <M3ThemePicker />
          <a
            href="https://www.npmjs.com/package/@vedant1521/fetchit"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 font-mono text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-150 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/40 active:scale-[0.96]"
          >
            npm
          </a>
          <a
            href="https://github.com/Vedant1521/fetchit"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 font-mono text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-150 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/40 active:scale-[0.96]"
          >
            GitHub
          </a>
          <Sheet>
            <SheetTrigger
              suppressHydrationWarning
              className="md:hidden inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 px-3 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <Menu className="size-3.5 text-emerald-400" />
              <span>Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-[#0a0a0c] border-l border-border">
              <div className="p-4 border-b border-border bg-[#101014] flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground tracking-tight">FETCHIT DOCS</span>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)] space-y-6">
                {/* Main Links */}
                <div className="space-y-1">
                  <Link
                    href="/"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-white/5"
                  >
                    Home
                  </Link>
                  <Link
                    href="/docs"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-white/5"
                  >
                    Overview
                  </Link>
                </div>

                {/* Docs Sections Tree */}
                {docsNavSections.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <div className="px-3 text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                      {section.title}
                    </div>
                    <ul className="space-y-1 pl-2">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "block rounded-md px-3 py-1.5 text-xs transition-colors",
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                              )}
                            >
                              {item.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}

                {/* External Links */}
                <div className="pt-4 border-t border-border/60 space-y-2 text-xs font-mono">
                  <a
                    href="https://www.npmjs.com/package/@vedant1521/fetchit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-foreground hover:bg-white/10"
                  >
                    <span>npm Package</span>
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </a>
                  <a
                    href="https://github.com/Vedant1521/fetchit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-foreground hover:bg-white/10"
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
