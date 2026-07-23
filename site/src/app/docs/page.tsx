import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Documentation",
  description: "fetchit documentation — guides for install, usage, configuration, and troubleshooting",
}

const sections = [
  {
    title: "Getting Started",
    description: "New to fetchit? Start here.",
    items: [
      { title: "Overview", description: "What fetchit is, how it works, and what you can do with it.", href: "/docs" },
      { title: "Quick Start", description: "Install fetchit and download your first video in under 5 minutes.", href: "/docs/getting-started" },
      { title: "Installation", description: "All install methods: one-liner, npm, build from source, and platform notes.", href: "/docs/install" },
    ],
  },
  {
    title: "User Guide",
    description: "Learn how to use fetchit day-to-day.",
    items: [
      { title: "Interactive Mode", description: "Full-screen TUI with keyboard, mouse, themes, clipboard detection, and URL history.", href: "/docs/interactive-mode" },
      { title: "Scriptable Mode", description: "Download without the picker using --best, --mp3, direct quality, and exit codes.", href: "/docs/scriptable-mode" },
      { title: "Playlists", description: "Download entire playlists, multi-post threads, and manage parallel downloads.", href: "/docs/playlists" },
      { title: "Configuration", description: "Customize fetchit via config file, environment variables, and output templates.", href: "/docs/configuration" },
    ],
  },
  {
    title: "Reference",
    description: "Detailed API and CLI documentation.",
    items: [
      { title: "CLI Reference", description: "Complete reference for all commands, flags, options, and exit codes.", href: "/docs/cli-reference" },
    ],
  },
  {
    title: "Development",
    description: "For contributors and maintainers.",
    items: [
      { title: "Contributing", description: "Setup, development workflow, testing, building binaries, and PR process.", href: "/docs/contributing" },
    ],
  },
  {
    title: "Support",
    description: "Get help when something goes wrong.",
    items: [
      { title: "Troubleshooting", description: "Fix common errors: yt-dlp issues, ffmpeg, rate limiting, platform-specific problems.", href: "/docs/troubleshooting" },
      { title: "FAQ", description: "Answers to frequently asked questions about fetchit.", href: "/docs/faq" },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="pb-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Documentation</h1>
        <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed max-w-xl">
          Everything you need to install, configure, and use fetchit — from your first download to advanced scripting and contributing.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-10">
          <div className="mb-1">
            <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
            <p className="text-[13px] text-muted-foreground">{section.description}</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {section.items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-all hover:bg-secondary/50 active:scale-[0.99]">
                  <CardHeader>
                    <CardTitle className="text-sm">{item.title}</CardTitle>
                    <CardDescription className="text-[13px]">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
