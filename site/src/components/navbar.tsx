"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Search } from "@/components/search"
import { M3ThemePicker } from "@/components/m3-theme-picker"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
                    ? "text-foreground font-medium"
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
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              Menu
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://www.npmjs.com/package/@vedant1521/fetchit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  npm Package
                </a>
                <a
                  href="https://github.com/Vedant1521/fetchit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
