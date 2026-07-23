export interface NavItem {
  href: string
  label: string
}

export interface NavSection {
  title: string
  href?: string
  items: NavItem[]
}

export const docsNavSections: NavSection[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    items: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/getting-started", label: "Quick Start" },
      { href: "/docs/install", label: "Installation" },
    ],
  },
  {
    title: "User Guide",
    href: "/docs/interactive-mode",
    items: [
      { href: "/docs/interactive-mode", label: "Interactive Mode" },
      { href: "/docs/scriptable-mode", label: "Scriptable Mode" },
      { href: "/docs/playlists", label: "Playlists" },
      { href: "/docs/configuration", label: "Configuration" },
    ],
  },
  {
    title: "Reference",
    href: "/docs/cli-reference",
    items: [
      { href: "/docs/cli-reference", label: "CLI Reference" },
    ],
  },
  {
    title: "Development",
    href: "/docs/contributing",
    items: [
      { href: "/docs/contributing", label: "Contributing" },
    ],
  },
  {
    title: "Support",
    href: "/docs/troubleshooting",
    items: [
      { href: "/docs/troubleshooting", label: "Troubleshooting" },
      { href: "/docs/faq", label: "FAQ" },
    ],
  },
]

export function getNavContext(pathname: string) {
  let currentSectionTitle = ""
  let currentSectionHref = ""
  let currentItemLabel = ""

  for (const section of docsNavSections) {
    const found = section.items.find((item) => item.href === pathname)
    if (found) {
      currentSectionTitle = section.title
      currentSectionHref = section.href || ""
      currentItemLabel = found.label
      break
    }
  }

  const allItems = docsNavSections.flatMap((section) => section.items)
  const currentIndex = allItems.findIndex((item) => item.href === pathname)

  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const next = currentIndex >= 0 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  return {
    sectionTitle: currentSectionTitle,
    sectionHref: currentSectionHref,
    itemLabel: currentItemLabel,
    prev,
    next,
  }
}
