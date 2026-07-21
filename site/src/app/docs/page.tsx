import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Documentation",
  description: "fetchit documentation — guides for install, usage, and troubleshooting",
}

const docCards = [
  {
    title: "Getting Started",
    description: "Your first download in 5 minutes. Install, run, done.",
    href: "/docs/getting-started",
  },
  {
    title: "Install Guide",
    description: "All install methods: one-liner, npm, build from source, platform notes.",
    href: "/docs/install",
  },
  {
    title: "Interactive Mode",
    description: "Full-screen TUI, keyboard shortcuts, mouse, themes, clipboard, history.",
    href: "/docs/interactive-mode",
  },
  {
    title: "Scriptable Mode",
    description: "Download without the picker. --best, --mp3, direct quality, exit codes.",
    href: "/docs/scriptable-mode",
  },
  {
    title: "Playlists",
    description: "Download whole playlists, multi-post threads, parallel downloads.",
    href: "/docs/playlists",
  },
  {
    title: "Troubleshooting",
    description: "Fix common errors, update yt-dlp, ffmpeg issues, YouTube blocks.",
    href: "/docs/troubleshooting",
  },
]

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Documentation</h1>
      <p className="mt-2 text-muted-foreground">
        Everything you need to use fetchit.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {docCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full transition-colors hover:bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
