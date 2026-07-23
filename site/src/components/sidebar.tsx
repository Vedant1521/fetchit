"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { docsNavSections, NavItem as Item } from "@/lib/docs-nav"

function NavItemComponent({ item, pathname }: { item: Item; pathname: string }) {
  const isActive = pathname === item.href
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "relative block rounded-md px-3 py-1.5 text-[14px] transition-all",
          isActive
            ? "bg-secondary font-medium text-foreground text-emerald-400"
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
        {docsNavSections.map((section) => (
          <div key={section.title} className="mb-6">
            {section.href ? (
              <Link
                href={section.href}
                className="mb-1.5 block px-3 text-[11px] font-mono font-bold tracking-widest uppercase text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                {section.title}
              </Link>
            ) : (
              <div className="mb-1.5 px-3 text-[11px] font-mono font-bold tracking-widest uppercase text-muted-foreground/60">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <NavItemComponent key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
