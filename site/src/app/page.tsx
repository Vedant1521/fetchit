import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:py-32">
      <section className="text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
          fetchit
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
          Download videos from YouTube, X, Instagram, Threads, TikTok and 2,000+ other sites — right from your terminal.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <code className="inline-flex items-center rounded-md border border-border bg-secondary px-4 py-2 text-sm font-mono text-foreground">
            curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh
          </code>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          macOS / Linux &middot; Windows:{" "}
          <code className="font-mono text-xs">powershell -c &quot;irm https://fetchit-cli.vercel.app/install.ps1 | iex&quot;</code>
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/docs/getting-started"
            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Documentation
          </Link>
        </div>
      </section>

      <section className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-foreground">2,000+</div>
          <p className="mt-1 text-sm text-muted-foreground">supported sites</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">3</div>
          <p className="mt-1 text-sm text-muted-foreground">install methods</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">0</div>
          <p className="mt-1 text-sm text-muted-foreground">dependencies needed</p>
        </div>
      </section>

      <section className="mt-24 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-semibold text-foreground">One command, every site</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Paste a link from YouTube, X, Instagram, Threads, TikTok, or any of 2,000+ sites. Pick a resolution (or audio-only mp3). Done.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Full-screen TUI</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Takes over your terminal with a centered interface. Mouse and keyboard driven. Live resize. Restores your scrollback on exit.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Scriptable mode</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              <code className="font-mono text-xs">--best</code>, <code className="font-mono text-xs">--mp3</code>, or direct quality. No picker, no terminal takeover. Built for scripts, cron, CI.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Zero setup</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              No Python, no Node.js, no pip. Standalone binary. yt-dlp and ffmpeg are fetched automatically on first run.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-32 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        <p>MIT License &middot; Vedant Gupta &middot; Built with Ink + React</p>
      </footer>
    </main>
  )
}
