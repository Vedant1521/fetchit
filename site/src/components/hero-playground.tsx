"use client"

import { useState } from "react"
import { InteractiveTerminal } from "@/components/interactive-terminal"
import { CommandBuilder } from "@/components/command-builder"
import { UrlMetadataInspector } from "@/components/url-metadata-inspector"
import { BatchQueueSimulator } from "@/components/batch-queue-simulator"
import { Terminal, Sliders, Search, Layers } from "lucide-react"

export function HeroPlayground() {
  const [activeTab, setActiveTab] = useState<"terminal" | "builder" | "inspector" | "batch">("terminal")
  const [activeCommand, setActiveCommand] = useState("fetchit https://youtu.be/dQw4w9WgXcQ")

  const handleRunCommand = (cmd: string) => {
    setActiveCommand(cmd)
    setActiveTab("terminal")
  }

  return (
    <div id="playground" className="scroll-mt-20 my-6 sm:my-8 w-full">
      {/* Touch-Friendly Scrollable Tab Bar */}
      <div className="mb-3 px-0.5 overflow-x-auto no-scrollbar">
        <div className="inline-flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-border/50 min-w-full sm:min-w-0">
          <button
            onClick={() => setActiveTab("terminal")}
            suppressHydrationWarning
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "terminal"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Terminal className="size-3.5 shrink-0 text-emerald-400" />
            <span className="hidden sm:inline">Interactive Terminal</span>
            <span className="sm:hidden">Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            suppressHydrationWarning
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "builder"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Sliders className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Command Builder</span>
            <span className="sm:hidden">Builder</span>
          </button>
          <button
            onClick={() => setActiveTab("inspector")}
            suppressHydrationWarning
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "inspector"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Search className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Metadata Inspector</span>
            <span className="sm:hidden">Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            suppressHydrationWarning
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "batch"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Layers className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Batch Queue (--concurrency)</span>
            <span className="sm:hidden">Batch</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="transition-opacity duration-150 overflow-hidden">
        {activeTab === "terminal" && <InteractiveTerminal initialCommand={activeCommand} />}
        {activeTab === "builder" && <CommandBuilder onRunInTerminal={handleRunCommand} />}
        {activeTab === "inspector" && <UrlMetadataInspector />}
        {activeTab === "batch" && <BatchQueueSimulator />}
      </div>
    </div>
  )
}
