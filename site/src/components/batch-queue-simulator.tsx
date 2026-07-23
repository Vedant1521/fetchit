"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "@/components/copy-button"
import { Layers, Play, Pause, RefreshCw, Check, Plus, Trash2, Users, Sparkles, Film } from "lucide-react"

export interface QueueItem {
  id: string
  title: string
  url: string
  size: string
  progress: number
  status: "queued" | "downloading" | "complete"
  speed: number
}

const DEFAULT_QUEUE: QueueItem[] = [
  { id: "q1", title: "01 - Advanced CLI Architecture & Rust Core.mp4", url: "https://youtu.be/video_01", size: "45.8 MB", progress: 0, status: "queued", speed: 0 },
  { id: "q2", title: "02 - High Concurrency HLS Playlist Streaming.mp4", url: "https://youtu.be/video_02", size: "32.1 MB", progress: 0, status: "queued", speed: 0 },
  { id: "q3", title: "03 - Custom Terminal UI Layout Design.mp4", url: "https://youtu.be/video_03", size: "64.5 MB", progress: 0, status: "queued", speed: 0 },
  { id: "q4", title: "04 - Cross-Platform Binary Bundling.mp4", url: "https://youtu.be/video_04", size: "28.9 MB", progress: 0, status: "queued", speed: 0 },
]

export function BatchQueueSimulator({ className = "" }: { className?: string }) {
  const [queue, setQueue] = useState<QueueItem[]>(DEFAULT_QUEUE)
  const [concurrency, setConcurrency] = useState<number>(3)
  const [isRunning, setIsRunning] = useState(false)
  const [newUrl, setNewUrl] = useState("")

  // Simulation loop for parallel downloading according to concurrency limit
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setQueue((prevQueue) => {
        // Count active downloading streams
        const activeCount = prevQueue.filter((item) => item.status === "downloading").length
        const availableSlots = concurrency - activeCount

        let updated = prevQueue.map((item) => {
          if (item.status === "downloading") {
            const delta = Math.floor(Math.random() * 15) + 10
            const nextProg = item.progress + delta >= 100 ? 100 : item.progress + delta
            const nextStatus = nextProg >= 100 ? "complete" : "downloading"
            const nextSpeed = nextStatus === "complete" ? 0 : +(12.5 + (Math.random() * 4 - 2)).toFixed(1)
            return { ...item, progress: nextProg, status: nextStatus as any, speed: nextSpeed }
          }
          return item
        })

        // Promote queued items to downloading if slot is available
        if (availableSlots > 0) {
          let slotsToFill = availableSlots
          updated = updated.map((item) => {
            if (item.status === "queued" && slotsToFill > 0) {
              slotsToFill--
              return { ...item, status: "downloading", speed: 14.5 }
            }
            return item
          })
        }

        // Check if all complete
        const allDone = updated.every((item) => item.status === "complete")
        if (allDone) {
          setIsRunning(false)
        }

        return updated
      })
    }, 250)

    return () => clearInterval(interval)
  }, [isRunning, concurrency])

  const handleStartSim = () => {
    setIsRunning(true)
  }

  const handleResetQueue = () => {
    setIsRunning(false)
    setQueue(DEFAULT_QUEUE.map((i) => ({ ...i, progress: 0, status: "queued", speed: 0 })))
  }

  const handleAddItem = () => {
    if (!newUrl.trim()) return
    const id = Math.random().toString(36).substring(2, 7)
    setQueue((prev) => [
      ...prev,
      {
        id,
        title: `Custom Download ${prev.length + 1} (${newUrl.slice(-10)})`,
        url: newUrl.trim(),
        size: "35.0 MB",
        progress: 0,
        status: "queued",
        speed: 0,
      },
    ])
    setNewUrl("")
  }

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((i) => i.id !== id))
  }

  const totalSpeed = queue.reduce((acc, curr) => acc + curr.speed, 0).toFixed(1)
  const completedCount = queue.filter((i) => i.status === "complete").length
  const cliCommand = `fetchit playlist_url --concurrency ${concurrency}`

  return (
    <div className={`rounded-2xl border border-border bg-[#09090b] dark:bg-[#070709] overflow-hidden shadow-xl ring-1 ring-white/5 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-[#121215]/90 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-tight text-foreground">
            Playlist & Batch Concurrency Simulator
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
            --concurrency {concurrency}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-4 border-b border-border/40 bg-[#08080a] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Concurrency Selector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <Users className="size-3.5 text-muted-foreground" />
            <span className="text-foreground font-semibold">Parallel Threads:</span>
            {[1, 3, 5].map((num) => (
              <button
                key={num}
                onClick={() => setConcurrency(num)}
                className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-all duration-150 cursor-pointer active:scale-[0.96] ${
                  concurrency === num
                    ? "bg-foreground text-background font-bold border-foreground shadow-sm"
                    : "bg-secondary/40 text-muted-foreground border-border/40 hover:text-foreground"
                }`}
              >
                {num} Threads
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/40 transition-all duration-150 cursor-pointer active:scale-[0.96]"
            >
              <RefreshCw className="size-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleStartSim}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-semibold rounded-xl bg-foreground text-background hover:opacity-90 active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Play className="size-3 fill-current" />
              <span>{isRunning ? "Downloading..." : "Start Batch Demo"}</span>
            </button>
          </div>
        </div>

        {/* Add Custom Item Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            placeholder="Add URL to batch queue..."
            className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
          />
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border/50 transition-all duration-150 cursor-pointer active:scale-[0.96]"
          >
            <Plus className="size-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="p-4 space-y-2.5 bg-[#070709] max-h-72 overflow-y-auto no-scrollbar">
        {queue.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl border border-border/50 bg-secondary/20 space-y-2 transition-all duration-150"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 truncate pr-2">
                <Film className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-foreground font-medium truncate">{item.title}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                    item.status === "complete"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : item.status === "downloading"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-white/5 text-muted-foreground border-white/5"
                  }`}
                >
                  {item.status}
                </span>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-muted-foreground/40 hover:text-rose-400 transition-colors p-0.5 rounded cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Item Progress Bar */}
            <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden border border-border/40">
              <div
                className={`h-full rounded-full transition-all duration-150 ease-out ${
                  item.status === "complete" ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/70">
              <span>{item.size}</span>
              {item.status === "downloading" && <span className="text-blue-400 font-semibold">{item.speed} MB/s</span>}
              {item.status === "complete" && <span className="text-emerald-400 font-semibold">100% Done</span>}
              {item.status === "queued" && <span>Waiting for slot...</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Metrics & CLI Output Bar */}
      <div className="border-t border-border bg-[#0d0d10] p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Completed: <strong className="text-foreground">{completedCount}/{queue.length}</strong></span>
          <span>Total Bandwidth: <strong className="text-emerald-400">{totalSpeed} MB/s</strong></span>
        </div>

        <div className="bg-background/80 rounded-xl border border-border px-3 py-1.5 text-emerald-400 flex items-center gap-2">
          <code>{cliCommand}</code>
          <CopyButton text={cliCommand} />
        </div>
      </div>
    </div>
  )
}
