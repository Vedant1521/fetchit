import Link from "next/link"
import { CopyButton } from "@/components/copy-button"
import { CountUp } from "@/components/count-up"

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:py-32">
      <section className="text-center">
        <h1 className="text-[15vw] sm:text-[13vw] md:text-[10vw] lg:text-[8vw] font-black tracking-[-0.04em] text-foreground leading-none">
          FETCHIT
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
          Download videos from YouTube, X, Instagram, Threads, TikTok and 2,000+ other sites — right from your terminal.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-full max-w-lg">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">macOS / Linux</div>
            <div className="flex items-center rounded-xl border border-border bg-[#0a0a0a] dark:bg-black pl-4 pr-2 py-2.5">
              <code className="flex-1 text-sm font-mono text-[#e5e5e5] truncate">
                curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh
              </code>
              <CopyButton text="curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh" />
            </div>
          </div>
          <div className="w-full max-w-lg">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">Windows</div>
            <div className="flex items-center rounded-xl border border-border bg-[#0a0a0a] dark:bg-black pl-4 pr-2 py-2.5">
              <code className="flex-1 text-sm font-mono text-[#e5e5e5] truncate">
                powershell -c &quot;irm https://fetchit-cli.vercel.app/install.ps1 | iex&quot;
              </code>
              <CopyButton text='powershell -c "irm https://fetchit-cli.vercel.app/install.ps1 | iex"' />
            </div>
          </div>
        </div>
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

      <section className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center gap-1">
          <CountUp end={2000} suffix="+" duration={3500} />
          <p className="text-sm text-muted-foreground">supported sites</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CountUp end={3} duration={3500} />
          <p className="text-sm text-muted-foreground">install methods</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CountUp start={750} end={0} duration={4000} />
          <p className="text-sm text-muted-foreground">dependencies needed</p>
        </div>
      </section>

      <section className="mt-28 grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xl border border-border overflow-hidden bg-border">
        <div className="bg-background p-6 sm:p-7">
          <svg className="size-5 text-muted-foreground mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <h3 className="text-[15px] font-semibold text-foreground">One command, every site</h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-[1.65]">
            Paste a link from YouTube, X, Instagram, Threads, TikTok, or any of 2,000+ sites. Pick a resolution (or audio-only mp3). Done.
          </p>
        </div>
        <div className="bg-background p-6 sm:p-7">
          <svg className="size-5 text-muted-foreground mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" x2="20" y1="19" y2="19" />
          </svg>
          <h3 className="text-[15px] font-semibold text-foreground">Full-screen TUI</h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-[1.65]">
            Takes over your terminal with a centered interface. Mouse and keyboard driven. Live resize. Restores your scrollback on exit.
          </p>
        </div>
        <div className="bg-background p-6 sm:p-7">
          <svg className="size-5 text-muted-foreground mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" x2="21" y1="20" y2="20" />
            <polyline points="21 3 14 10" />
            <line x1="15" x2="9" y1="10" y2="10" />
          </svg>
          <h3 className="text-[15px] font-semibold text-foreground">Scriptable mode</h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-[1.65]">
            <code className="font-mono text-xs font-medium text-foreground">--best</code>, <code className="font-mono text-xs font-medium text-foreground">--mp3</code>, or direct quality. No picker, no terminal takeover. Built for scripts, cron, CI.
          </p>
        </div>
        <div className="bg-background p-6 sm:p-7">
          <svg className="size-5 text-muted-foreground mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4 7.55 4.24" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" x2="12" y1="22" y2="12" />
          </svg>
          <h3 className="text-[15px] font-semibold text-foreground">Zero setup</h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-[1.65]">
            No Python, no Node.js, no pip. Standalone binary. yt-dlp and ffmpeg are fetched automatically on first run.
          </p>
        </div>
      </section>

      <footer className="mt-28 border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">MIT License &middot; Vedant Gupta</p>
      </footer>
    </main>
  )
}
