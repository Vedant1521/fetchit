"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Item {
  href: string
  label: string
}

interface Section {
  title: string
  items: Item[]
}

const sections: Section[] = [
  {
    title: "Getting Started",
    items: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/getting-started", label: "Quick Start" },
      { href: "/docs/install", label: "Installation" },
    ],
  },
  {
    title: "User Guide",
    items: [
      { href: "/docs/interactive-mode", label: "Interactive Mode" },
      { href: "/docs/scriptable-mode", label: "Scriptable Mode" },
      { href: "/docs/playlists", label: "Playlists" },
      { href: "/docs/configuration", label: "Configuration" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/docs/cli-reference", label: "CLI Reference" },
    ],
  },
  {
    title: "Development",
    items: [
      { href: "/docs/contributing", label: "Contributing" },
    ],
  },
  {
    title: "Support",
    items: [
      { href: "/docs/troubleshooting", label: "Troubleshooting" },
      { href: "/docs/faq", label: "FAQ" },
    ],
  },
]

function NavItem({ item, pathname }: { item: Item; pathname: string }) {
  const isActive = pathname === item.href
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "relative block rounded-md px-3 py-1.5 text-[14px] transition-all",
          isActive
            ? "bg-secondary font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
        )}
      >
        {item.label}
      </Link>
    </li>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-14 bottom-0 left-0 w-56 shrink-0 hidden md:block overflow-y-auto border-r border-border bg-background z-40">
      <nav className="py-8 px-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="mb-1.5 px-3 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/60">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
