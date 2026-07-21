"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/install", label: "Install Guide" },
  { href: "/docs/interactive-mode", label: "Interactive Mode" },
  { href: "/docs/scriptable-mode", label: "Scriptable Mode" },
  { href: "/docs/playlists", label: "Playlists" },
  { href: "/docs/troubleshooting", label: "Troubleshooting" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 hidden md:block">
      <nav className="sticky top-14 py-8 pr-4">
        <div className="mb-4 px-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Documentation
        </div>
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
