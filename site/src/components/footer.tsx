"use client"

import Link from "next/link"
import { Sparkles, ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-[#08080a] py-14 px-4 mt-24">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Top Grid: Professional Vercel / Tailwind Docs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-sans">
          {/* Col 1: Brand & Description */}
          <div className="space-y-2.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black tracking-tight text-foreground">FETCHIT</span>
            </div>
            <p className="text-muted-foreground/80 text-xs leading-relaxed max-w-md font-normal">
              High-performance, scriptable media downloader for YouTube, X, Instagram, TikTok, and 2,000+ sites. Zero setup required.
            </p>
            <p className="text-muted-foreground/60 text-xs font-normal">
              Fast, cross-platform media downloader CLI for terminal power users.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <div className="text-foreground font-semibold tracking-tight text-xs uppercase text-[11px] text-muted-foreground/90">
              Resources
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground/80 font-normal">
              <li>
                <Link href="/docs/getting-started" className="hover:text-foreground transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/install" className="hover:text-foreground transition-colors">
                  Installation Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/interactive-mode" className="hover:text-foreground transition-colors">
                  Interactive Mode (TUI)
                </Link>
              </li>
              <li>
                <Link href="/docs/cli-reference" className="hover:text-foreground transition-colors">
                  CLI Flag Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community Links */}
          <div className="space-y-3">
            <div className="text-foreground font-semibold tracking-tight text-xs uppercase text-[11px] text-muted-foreground/90">
              Community
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground/80 font-normal">
              <li>
                <a
                  href="https://github.com/Vedant1521/fetchit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <svg className="size-3.5 fill-current text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Vedant1521/fetchit/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Releases & Binaries
                </a>
              </li>
              <li>
                <span className="text-muted-foreground/60">MIT License</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: High-Craft Creator Credit Linked to GitHub */}
        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-muted-foreground">
          {/* Creator Credit Linked to GitHub */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium">
            <span>Designed & Built with precision by</span>
            <a
              href="https://github.com/Vedant1521"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground tracking-tight hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors duration-150"
            >
              Vedant Gupta
            </a>
            <Sparkles className="size-3.5 text-amber-400 shrink-0" />
          </div>

          {/* Copyright & License */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground/70 font-sans">
            <span>&copy; {new Date().getFullYear()} fetchit</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-400" /> Open Source MIT
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
