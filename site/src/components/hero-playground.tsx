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
    <div id="playground" className="scroll-mt-20 my-8 w-full">
      {/* M3 & Emil Typography Spec Tab Bar */}
      <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-secondary/30 p-1 rounded-xl border border-border/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "terminal"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Terminal className="size-3.5" />
            <span>Interactive Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "builder"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Sliders className="size-3.5" />
            <span>Command Builder</span>
          </button>
          <button
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "inspector"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Search className="size-3.5" />
            <span>Metadata Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
              activeTab === "batch"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium"
            }`}
          >
            <Layers className="size-3.5" />
            <span>Batch Queue (--concurrency)</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="transition-opacity duration-150">
        {activeTab === "terminal" && <InteractiveTerminal initialCommand={activeCommand} />}
        {activeTab === "builder" && <CommandBuilder onRunInTerminal={handleRunCommand} />}
        {activeTab === "inspector" && <UrlMetadataInspector />}
        {activeTab === "batch" && <BatchQueueSimulator />}
      </div>
    </div>
  )
}
