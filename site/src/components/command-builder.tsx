"use client"

import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { Sliders, Play, Film, Volume2, Sparkles, Folder, Scissors, Bookmark, Users, Shield } from "lucide-react"

export interface CommandBuilderProps {
  onRunInTerminal?: (cmd: string) => void
  className?: string
}

export function CommandBuilder({ onRunInTerminal, className = "" }: CommandBuilderProps) {
  const [url, setUrl] = useState("https://youtu.be/dQw4w9WgXcQ")
  const [mode, setMode] = useState<"interactive" | "best" | "mp3" | "1080p" | "720p">("interactive")
  const [outputPath, setOutputPath] = useState("")
  const [chapters, setChapters] = useState(false)
  const [fromTime, setFromTime] = useState("")
  const [toTime, setToTime] = useState("")
  const [concurrency, setConcurrency] = useState("")
  const [browserCookies, setBrowserCookies] = useState("")

  // Construct CLI command string dynamically according to actual src/lib/args.ts parser
  const buildCommand = () => {
    let parts = ["fetchit"]

    if (mode === "best") parts.push("--best")
    if (mode === "mp3") parts.push("--mp3")

    if (chapters) parts.push("--chapters")

    if (fromTime.trim()) {
      parts.push(`--from ${fromTime.trim()}`)
    }
    if (toTime.trim()) {
      parts.push(`--to ${toTime.trim()}`)
    }

    if (concurrency.trim()) {
      parts.push(`--concurrency ${concurrency.trim()}`)
    }

    if (browserCookies.trim()) {
      parts.push(`--cookies-from-browser ${browserCookies.trim()}`)
    }

    if (outputPath.trim()) {
      parts.push(`-o "${outputPath.trim()}"`)
    }

    parts.push(url.trim() || "<URL>")

    if (mode === "1080p") parts.push("1080p")
    if (mode === "720p") parts.push("720p")

    return parts.join(" ")
  }

  const generatedCmd = buildCommand()

  return (
    <div className={`rounded-2xl border border-border bg-[#09090b] dark:bg-[#070709] overflow-hidden shadow-xl ring-1 ring-white/5 ${className}`}>
      {/* M3 & Emil Typography Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-[#121215]/90 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="size-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-tight text-foreground">Command Builder</span>
        </div>
        <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
          CLI SPEC
        </span>
      </div>

      {/* Visual Options Form */}
      <div className="p-5 space-y-5 text-sm bg-[#070709]">
        {/* 1. Target URL Input Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center justify-between">
            <span>Media URL</span>
            <span className="text-muted-foreground/60 text-[11px] font-sans font-normal">YouTube, X, Instagram, TikTok, etc.</span>
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/dQw4w9WgXcQ"
            className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
          />
        </div>

        {/* 2. Format & Resolution Mode Picker */}
        <div className="space-y-2">
          <label className="text-xs font-sans font-semibold tracking-tight text-foreground">Mode & Direct Quality</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: "interactive", label: "Interactive", icon: Film, desc: "TUI Picker" },
              { id: "best", label: "--best", icon: Sparkles, desc: "Best Video" },
              { id: "mp3", label: "--mp3", icon: Volume2, desc: "Audio Only" },
              { id: "1080p", label: "1080p", icon: Film, desc: "Direct 1080p" },
              { id: "720p", label: "720p", icon: Film, desc: "Direct 720p" },
            ].map((item) => {
              const Icon = item.icon
              const isSelected = mode === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id as any)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 cursor-pointer select-none active:scale-[0.97] ${
                    isSelected
                      ? "bg-foreground text-background border-foreground font-semibold shadow-md"
                      : "bg-secondary/40 text-muted-foreground border-border/50 hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="size-4 mb-1 shrink-0" />
                  <span className="text-xs font-mono font-semibold tracking-tight">{item.label}</span>
                  <span className={`text-[10px] font-sans ${isSelected ? "text-background/80" : "text-muted-foreground/60"}`}>
                    {item.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. Output Path & Time Trimming */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Custom Output Directory (-o / --output) */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              <Folder className="size-3.5 text-muted-foreground" />
              <span>Save Folder (-o)</span>
            </label>
            <input
              type="text"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
              placeholder="e.g. ~/Videos"
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            />
          </div>

          {/* Start Time (--from) */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              <Scissors className="size-3.5 text-muted-foreground" />
              <span>Trim Start (--from)</span>
            </label>
            <input
              type="text"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              placeholder="e.g. 0:30 or 1:15:00"
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            />
          </div>

          {/* End Time (--to) */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              <Scissors className="size-3.5 text-muted-foreground" />
              <span>Trim End (--to)</span>
            </label>
            <input
              type="text"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              placeholder="e.g. 2:45"
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            />
          </div>
        </div>

        {/* 4. Advanced Official CLI Flags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Concurrency (--concurrency) */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-muted-foreground" />
              <span>Playlist Concurrency (--concurrency)</span>
            </label>
            <input
              type="text"
              value={concurrency}
              onChange={(e) => setConcurrency(e.target.value)}
              placeholder="Default: 3"
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            />
          </div>

          {/* Browser Cookies (--cookies-from-browser) */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              <Shield className="size-3.5 text-muted-foreground" />
              <span>Browser Cookies (--cookies-from-browser)</span>
            </label>
            <select
              value={browserCookies}
              onChange={(e) => setBrowserCookies(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            >
              <option value="">None (Public content)</option>
              <option value="chrome">Chrome</option>
              <option value="firefox">Firefox</option>
              <option value="edge">Edge</option>
              <option value="safari">Safari</option>
              <option value="brave">Brave</option>
              <option value="opera">Opera</option>
            </select>
          </div>
        </div>

        {/* 5. Checkboxes */}
        <div className="flex items-center gap-6 pt-1 text-xs font-sans">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={chapters}
              onChange={(e) => setChapters(e.target.checked)}
              className="rounded border-border bg-background text-emerald-500 focus:ring-0"
            />
            <span className="text-foreground flex items-center gap-1.5 font-medium">
              <Bookmark className="size-3 text-muted-foreground" />
              <span>Embed Chapter Markers (--chapters)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Generated Command Output Bar */}
      <div className="border-t border-border bg-[#0d0d10] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 overflow-x-auto font-mono text-sm bg-background/80 rounded-xl border border-border px-3.5 py-2 text-emerald-400 flex items-center justify-between">
          <code className="whitespace-pre truncate font-semibold">{generatedCmd}</code>
          <CopyButton text={generatedCmd} />
        </div>

        {onRunInTerminal && (
          <button
            onClick={() => onRunInTerminal(generatedCmd)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-xl bg-foreground text-background hover:opacity-90 active:scale-[0.97] transition-all duration-150 shrink-0 cursor-pointer shadow-md"
          >
            <Play className="size-3.5 fill-current" />
            <span>Test in Terminal</span>
          </button>
        )}
      </div>
    </div>
  )
}
