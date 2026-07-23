"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Terminal as TerminalIcon, Play, RefreshCw, Check, Sparkles, CornerDownLeft } from "lucide-react"
import { toast } from "@/components/ui/sonner-toast"

export interface FormatOption {
  id: string
  label: string
  res: string
  size: string
  codec: string
}

const MOCK_FORMATS: FormatOption[] = [
  { id: "1080p", label: "1080p Full HD (MP4)", res: "1920x1080", size: "48.2 MB", codec: "h264/aac" },
  { id: "720p", label: "720p HD (MP4)", res: "1280x720", size: "22.5 MB", codec: "h264/aac" },
  { id: "480p", label: "480p SD (MP4)", res: "854x480", size: "11.1 MB", codec: "h264/aac" },
  { id: "mp3", label: "Audio Only (MP3)", res: "Audio 320k", size: "4.8 MB", codec: "mp3" },
]

export interface InteractiveTerminalProps {
  initialCommand?: string
  className?: string
}

type Step = "IDLE" | "PROBING" | "PICKER" | "DOWNLOADING" | "COMPLETE"

interface ParsedMediaInfo {
  title: string
  id: string
  filename: string
}

function parseVideoMetadataFromUrl(rawUrl: string): ParsedMediaInfo {
  let cleanUrl = rawUrl.trim().replace(/^\.+/, "") // Clean leading dots if pasted by user

  // Extract YouTube Video ID
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
  if (ytMatch) {
    const videoId = ytMatch[1]
    if (videoId === "dQw4w9WgXcQ") {
      return {
        title: "Rick Astley - Never Gonna Give You Up",
        id: "dQw4w9WgXcQ",
        filename: "Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ]",
      }
    }
    return {
      title: `YouTube Video [${videoId}]`,
      id: videoId,
      filename: `YouTube Media [${videoId}]`,
    }
  }

  // Extract X / Twitter ID
  const twitterMatch = cleanUrl.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/)
  if (twitterMatch) {
    const handle = twitterMatch[1]
    const statusId = twitterMatch[2]
    return {
      title: `@${handle} Post Video`,
      id: statusId,
      filename: `${handle} - Post Media [${statusId.slice(-6)}]`,
    }
  }

  // Extract Instagram Reel ID
  const igMatch = cleanUrl.match(/instagram\.com\/(?:reel|p)\/([^/]+)/)
  if (igMatch) {
    const reelId = igMatch[1]
    return {
      title: `Instagram Reel [${reelId}]`,
      id: reelId,
      filename: `Instagram Reel [${reelId}]`,
    }
  }

  // Extract TikTok ID
  const tiktokMatch = cleanUrl.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/)
  if (tiktokMatch) {
    const user = tiktokMatch[1]
    const videoId = tiktokMatch[2]
    return {
      title: `@${user} TikTok Video`,
      id: videoId,
      filename: `${user} - TikTok [${videoId.slice(-6)}]`,
    }
  }

  // General URL fallback
  try {
    const parsed = new URL(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`)
    const pathnameParts = parsed.pathname.split("/").filter(Boolean)
    const lastSlug = pathnameParts[pathnameParts.length - 1] || "video"
    return {
      title: `${parsed.hostname} ${lastSlug}`,
      id: "media",
      filename: `${parsed.hostname.replace("www.", "")} - ${lastSlug}`,
    }
  } catch {
    return {
      title: "Media File",
      id: "fetchit",
      filename: "Downloaded Media [fetchit]",
    }
  }
}

export function InteractiveTerminal({ initialCommand = "", className = "" }: InteractiveTerminalProps) {
  const [commandInput, setCommandInput] = useState(initialCommand || "fetchit https://youtu.be/dQw4w9WgXcQ")
  const [step, setStep] = useState<Step>("IDLE")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(14.2)
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>(MOCK_FORMATS[0])
  const [activeMediaInfo, setActiveMediaInfo] = useState<ParsedMediaInfo>({
    title: "Rick Astley - Never Gonna Give You Up",
    id: "dQw4w9WgXcQ",
    filename: "Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ]",
  })
  const [logs, setLogs] = useState<string[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const clearPendingTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Sync initialCommand prop when it changes
  useEffect(() => {
    if (initialCommand) {
      setCommandInput(initialCommand)
    }
  }, [initialCommand])

  // Download simulation loop
  useEffect(() => {
    if (step !== "DOWNLOADING") return
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStep("COMPLETE")
          return 100
        }
        const delta = Math.floor(Math.random() * 18) + 12
        const next = prev + delta > 100 ? 100 : prev + delta
        setSpeed((prevSpeed) => +(prevSpeed + (Math.random() * 1.5 - 0.7)).toFixed(1))
        return next
      })
    }, 150)
    return () => clearInterval(interval)
  }, [step])

  // Trigger toast side-effect when download completes
  useEffect(() => {
    if (step === "COMPLETE") {
      toast.success("Download Complete!", {
        description: activeMediaInfo.title,
      })
    }
  }, [step, activeMediaInfo.title])

  // Scroll to bottom on updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [step, progress, logs])

  const executeCommand = useCallback(async (cmdToRun?: string) => {
    clearPendingTimers()
    const cmd = cmdToRun !== undefined ? cmdToRun : commandInput
    if (!cmd.trim()) return

    // Clean leading dots or stray characters
    const cleanCmd = cmd.trim().replace(/^\.+/, "")

    // Parse URL from command string dynamically
    const urlMatches = cleanCmd.match(/https?:\/\/[^\s]+/)
    const parsedUrl = urlMatches ? urlMatches[0] : cleanCmd.replace("fetchit", "").trim()
    
    // Initial sync parse
    let fallbackInfo = parseVideoMetadataFromUrl(parsedUrl)
    setActiveMediaInfo(fallbackInfo)

    setLogs((prev) => [...prev, `$ ${cleanCmd}`])

    // Try fetching real oEmbed metadata for YouTube / Web URLs
    if (parsedUrl.startsWith("http")) {
      try {
        const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(parsedUrl)}`
        const res = await fetch(oembedUrl)
        if (res.ok) {
          const data = await res.json()
          if (data && data.title) {
            const author = data.author_name ? ` (${data.author_name})` : ""
            const ytMatch = parsedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
            const vidId = ytMatch ? ytMatch[1] : fallbackInfo.id
            const cleanTitle = data.title.replace(/[^\w\s-]/gi, "")
            setActiveMediaInfo({
              title: `${data.title}${author}`,
              id: vidId,
              filename: `${cleanTitle} [${vidId}]`,
            })
          }
        }
      } catch {
        // Fallback info remains active
      }
    }

    if (cleanCmd.includes("--best")) {
      setStep("PROBING")
      setSelectedFormat(MOCK_FORMATS[0])
      timerRef.current = setTimeout(() => setStep("DOWNLOADING"), 800)
      return
    }

    if (cleanCmd.includes("--mp3") || cleanCmd.includes(" mp3") || cleanCmd.includes(" audio")) {
      setStep("PROBING")
      setSelectedFormat(MOCK_FORMATS[3])
      timerRef.current = setTimeout(() => setStep("DOWNLOADING"), 800)
      return
    }

    if (cleanCmd.includes("1080p")) {
      setStep("PROBING")
      setSelectedFormat(MOCK_FORMATS[0])
      timerRef.current = setTimeout(() => setStep("DOWNLOADING"), 800)
      return
    }

    if (cleanCmd.includes("720p")) {
      setStep("PROBING")
      setSelectedFormat(MOCK_FORMATS[1])
      timerRef.current = setTimeout(() => setStep("DOWNLOADING"), 800)
      return
    }

    if (cleanCmd.includes("480p")) {
      setStep("PROBING")
      setSelectedFormat(MOCK_FORMATS[2])
      timerRef.current = setTimeout(() => setStep("DOWNLOADING"), 800)
      return
    }

    setStep("PROBING")
    timerRef.current = setTimeout(() => {
      setStep("PICKER")
      setSelectedIndex(0)
    }, 900)
  }, [commandInput, clearPendingTimers])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (step === "PICKER") {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % MOCK_FORMATS.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + MOCK_FORMATS.length) % MOCK_FORMATS.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        setSelectedFormat(MOCK_FORMATS[selectedIndex])
        setStep("DOWNLOADING")
      }
    } else if (step === "IDLE" || step === "COMPLETE") {
      if (e.key === "Enter") {
        executeCommand()
      }
    }
  }

  const resetTerminal = () => {
    clearPendingTimers()
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 400)
    setStep("IDLE")
    setProgress(0)
    setSelectedIndex(0)
    setLogs([])
    setCommandInput("fetchit https://youtu.be/dQw4w9WgXcQ")
    setActiveMediaInfo({
      title: "Rick Astley - Never Gonna Give You Up",
      id: "dQw4w9WgXcQ",
      filename: "Rick Astley - Never Gonna Give You Up [dQw4w9WgXcQ]",
    })
    toast.info("Terminal session reset")
  }

  const runPreset = (cmd: string) => {
    setCommandInput(cmd)
    setStep("IDLE")
    executeCommand(cmd)
  }

  return (
    <div className={`rounded-xl sm:rounded-2xl border border-border bg-[#09090b] dark:bg-[#070709] overflow-hidden shadow-xl ring-1 ring-white/5 ${className}`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-[#121215]/90 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 pr-1">
            <span className="size-2 sm:size-2.5 rounded-full bg-foreground/20" />
            <span className="size-2 sm:size-2.5 rounded-full bg-foreground/20" />
            <span className="size-2 sm:size-2.5 rounded-full bg-foreground/20" />
          </div>
          <span className="text-[11px] sm:text-xs font-mono text-foreground font-semibold tracking-tight flex items-center gap-1.5 border-l border-border/60 pl-2 sm:pl-3">
            <TerminalIcon className="size-3.5 text-emerald-400 shrink-0" /> fetchit-terminal
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetTerminal}
            suppressHydrationWarning
            className="flex items-center gap-1 text-[11px] sm:text-xs font-mono font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors duration-150 px-2 py-1 rounded-md hover:bg-white/5 active:scale-[0.97] cursor-pointer"
            title="Reset Terminal Session"
          >
            <RefreshCw className={`size-3 transition-transform duration-300 ${isSpinning ? "rotate-180 text-emerald-400" : ""}`} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Action Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border-b border-border/40 bg-[#0d0d10] overflow-x-auto no-scrollbar text-xs font-mono">
        <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider shrink-0 font-semibold hidden xs:inline">PRESETS:</span>
        <button
          onClick={() => runPreset("fetchit https://youtu.be/dQw4w9WgXcQ")}
          suppressHydrationWarning
          className="px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-[11px] sm:text-xs tracking-tight transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.96] border border-border/40"
        >
          Interactive Picker
        </button>
        <button
          onClick={() => runPreset("fetchit https://youtu.be/dQw4w9WgXcQ --best")}
          suppressHydrationWarning
          className="px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[11px] sm:text-xs tracking-tight transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.96] border border-emerald-500/20"
        >
          --best (Auto)
        </button>
        <button
          onClick={() => runPreset("fetchit https://youtu.be/dQw4w9WgXcQ --mp3")}
          suppressHydrationWarning
          className="px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-mono text-[11px] sm:text-xs tracking-tight transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.96] border border-purple-500/20"
        >
          --mp3 (Audio)
        </button>
      </div>

      {/* Terminal Display Output Area */}
      <div
        ref={terminalRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        onClick={() => inputRef.current?.focus()}
        className="p-3.5 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-[#f1f5f9] h-[280px] sm:h-[310px] overflow-y-auto outline-none select-none bg-[#070709]"
      >
        {/* Previous Executed Command Logs */}
        {logs.map((log, i) => (
          <div key={i} className="text-muted-foreground/70 mb-1.5 font-mono text-xs break-all">
            {log}
          </div>
        ))}

        {/* Input prompt line when IDLE or COMPLETE */}
        {(step === "IDLE" || step === "COMPLETE") && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-foreground mb-3 bg-white/[0.02] p-2 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-emerald-400 font-semibold shrink-0 text-xs">~/fetchit $</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-foreground focus:ring-0 p-0"
                placeholder="Type fetchit <URL>..."
              />
            </div>
            <button
              onClick={() => executeCommand()}
              suppressHydrationWarning
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-foreground text-background font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-150 shrink-0 cursor-pointer shadow-sm"
            >
              <Play className="size-3 fill-current" />
              <span>Run</span>
            </button>
          </div>
        )}

        {/* PROBING STATE */}
        {step === "PROBING" && (
          <div className="space-y-1.5 text-cyan-300 py-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="animate-spin text-emerald-400 font-bold">⠋</span>
              <span className="font-semibold text-xs sm:text-sm truncate">Probing {activeMediaInfo.title}...</span>
            </div>
            <div className="text-[11px] sm:text-xs text-muted-foreground pl-5 sm:pl-6">
              Retrieving format manifest, stream info, and duration...
            </div>
          </div>
        )}

        {/* INTERACTIVE PICKER STATE */}
        {step === "PICKER" && (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-xs text-emerald-400 font-semibold flex items-center justify-between border-b border-border/40 pb-2 flex-wrap gap-1">
              <span className="flex items-center gap-1">
                <span>Select Format</span>
                <span className="text-muted-foreground/60 font-normal hidden sm:inline">(Use ↑/↓ or click):</span>
              </span>
              <span className="text-muted-foreground font-mono text-[10px] sm:text-[11px] truncate max-w-[180px] sm:max-w-[220px]">
                {activeMediaInfo.title}
              </span>
            </div>

            <div className="space-y-1.5 py-1">
              {MOCK_FORMATS.map((fmt, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <div
                    key={fmt.id}
                    onClick={() => {
                      setSelectedIndex(idx)
                      setSelectedFormat(fmt)
                      setStep("DOWNLOADING")
                    }}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-all duration-150 border gap-1 sm:gap-2 ${
                      isSelected
                        ? "bg-foreground text-background border-foreground font-semibold shadow-md translate-x-0.5 sm:translate-x-1"
                        : "bg-secondary/40 text-foreground/80 hover:bg-secondary/80 border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`text-xs ${isSelected ? "text-background" : "text-emerald-400 font-bold"}`}>
                        {isSelected ? "❯" : " "}
                      </span>
                      <span className="text-xs">{fmt.label}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] sm:text-xs font-mono pl-4 sm:pl-0">
                      <span className={isSelected ? "text-background/80" : "text-muted-foreground"}>
                        {fmt.res}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono ${
                          isSelected ? "bg-background/20 text-background" : "bg-secondary text-foreground border border-border/40"
                        }`}
                      >
                        {fmt.size}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground pt-1 border-t border-border/30">
              <span className="flex items-center gap-1">
                <span>Tap or press</span>
                <kbd className="px-1 py-0.5 rounded bg-secondary border border-border text-foreground font-mono text-[10px]">Enter</kbd>
              </span>
              <span className="text-emerald-400 font-mono">Interactive TUI</span>
            </div>
          </div>
        )}

        {/* DOWNLOADING STATE */}
        {step === "DOWNLOADING" && (
          <div className="space-y-2 py-2 sm:py-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-1">
              <span className="text-foreground font-semibold flex items-center gap-1.5 truncate max-w-[220px] sm:max-w-[360px]">
                <Sparkles className="size-3 sm:size-3.5 text-amber-400 animate-pulse shrink-0" />
                <span className="truncate">Downloading {activeMediaInfo.title}...</span>
              </span>
              <span className="text-emerald-400 font-bold text-xs">{progress}%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-secondary/80 rounded-full h-2.5 overflow-hidden border border-border/60">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-mono pt-1">
              <span>Speed: {speed} MB/s</span>
              <span>Size: {selectedFormat.size}</span>
              <span>ETA: {Math.max(0, Math.ceil((100 - progress) / 35))}s</span>
            </div>
          </div>
        )}

        {/* COMPLETE STATE */}
        {step === "COMPLETE" && (
          <div className="space-y-2 py-2.5 sm:py-3 border-t border-emerald-500/30 bg-emerald-500/5 rounded-lg px-3 sm:px-4 my-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm">
              <Check className="size-3.5 sm:size-4 stroke-[3]" />
              <span>Download Complete!</span>
            </div>
            <div className="text-[11px] sm:text-xs text-foreground/90 font-mono pl-5 sm:pl-6 break-all">
              Saved to: <code className="text-emerald-300 font-bold">~/Downloads/{activeMediaInfo.filename}.{selectedFormat.id === "mp3" ? "mp3" : "mp4"}</code>
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="border-t border-border bg-[#0b0b0e] px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono text-muted-foreground flex items-center justify-between">
        <span>Interactive CLI Simulation</span>
        <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-medium">
          <CornerDownLeft className="size-3 hidden xs:inline" /> Press Enter to test
        </span>
      </div>
    </div>
  )
}
