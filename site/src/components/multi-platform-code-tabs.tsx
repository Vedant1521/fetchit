"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "@/components/copy-button"
import { ChevronDown, ChevronUp, Terminal, Play } from "lucide-react"
import { toast } from "@/components/ui/sonner-toast"
import { useRouter } from "next/navigation"

export interface TabConfig {
  id: string
  label: string
  icon?: string
  code: string
  description?: string
  highlightedLines?: number[]
  outputPreview?: string[]
}

export interface MultiPlatformCodeTabsProps {
  tabs?: TabConfig[]
  defaultTabId?: string
  title?: string
  showOutputToggle?: boolean
  className?: string
}

const DEFAULT_TABS: TabConfig[] = [
  {
    id: "macos",
    label: "macOS",
    icon: "apple",
    code: `curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh`,
    description: "Zsh / Bash one-line installer",
    outputPreview: [
      "[fetchit] Detecting architecture... macOS (arm64)",
      "✔ Downloaded latest release tarball v0.5.1",
      "✔ Linked binary to ~/.fetchit/bin/fetchit",
      "✨ Done! Run 'fetchit <URL>' to start.",
    ],
  },
  {
    id: "linux",
    label: "Linux",
    icon: "linux",
    code: `curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh`,
    description: "POSIX shell installer for Linux distros",
    outputPreview: [
      "[fetchit] Arch: Linux (x86_64)",
      "✔ Verified checksums & extracted binary",
      "✔ Installed executable to /usr/local/bin/fetchit",
      "✨ Installed! Try: fetchit <URL>",
    ],
  },
  {
    id: "windows",
    label: "Windows",
    icon: "windows",
    code: `powershell -c "irm https://fetchit-cli.vercel.app/install.ps1 | iex"`,
    description: "PowerShell one-liner installer",
    outputPreview: [
      "PS C:\\> powershell -c \"irm https://fetchit-cli.vercel.app/install.ps1 | iex\"",
      "✔ Downloaded fetchit-win-x64.exe",
      "✔ Updated User PATH environment variable",
      "✨ fetchit successfully installed for Windows!",
    ],
  },
  {
    id: "npm",
    label: "npm",
    icon: "npm",
    code: `npm install -g @vedant1521/fetchit`,
    description: "Global package installation via Node.js",
    outputPreview: [
      "added 1 package in 720ms",
      "✔ Symlinked executable to global bin directory",
    ],
  },
  {
    id: "npx",
    label: "npx",
    icon: "npx",
    code: `npx @vedant1521/fetchit <URL>`,
    description: "Execute directly without global install",
    outputPreview: [
      "✔ Probing media formats...",
      "✔ Downloading 1080p MP4 [====================] 100% 42.1MB",
      "Saved to ~/Downloads/video.mp4",
    ],
  },
  {
    id: "binary",
    label: "Binary",
    icon: "binary",
    code: `curl -L https://github.com/Vedant1521/fetchit/releases/latest/download/fetchit-linux-x64 -o fetchit && chmod +x fetchit`,
    description: "Direct release binary download",
    outputPreview: [
      "Downloading binary release...",
      "100 48.2M  100 48.2M    0     0  14.2M      0  0:00:03",
      "✔ Set executable permissions (chmod +x)",
    ],
  },
]

function renderIcon(iconName?: string) {
  switch (iconName) {
    case "apple":
      return (
        <svg className="size-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.34c.62-.75 1.04-1.8 0.93-2.84-.9.04-2 .6-2.65 1.36-.58.68-1.09 1.76-.95 2.8.1.01 2.05.34 2.67-1.32z" />
        </svg>
      )
    case "linux":
      return (
        <svg className="size-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12.002 2c-3.1 0-5.617 2.686-5.617 6 0 1.258.366 2.432 1.002 3.42C5.97 12.634 5 14.568 5 16.8c0 2.87 2.42 5.2 5.4 5.2.82 0 1.6-.2 2.3-.55.7.35 1.48.55 2.3.55 2.98 0 5.4-2.33 5.4-5.2 0-2.232-.97-4.166-2.387-5.38.636-.988 1.002-2.162 1.002-3.42 0-3.314-2.517-6-5.715-6zm0 2c1.996 0 3.617 1.79 3.617 4s-1.621 4-3.617 4-3.617-1.79-3.617-4 1.621-4 3.617-4z" />
        </svg>
      )
    case "windows":
      return (
        <svg className="size-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M0 3.449L9.75 2.1v9.451H0zm10.949-1.606L24 0v11.4H10.949zM0 12.6h9.75v9.451L0 20.699zm10.949 0H24V24l-13.051-1.842z" />
        </svg>
      )
    case "npm":
      return (
        <svg className="size-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.13h13.74v13.74h-3.435V8.565h-3.435v10.305H5.13z" />
        </svg>
      )
    default:
      return null
  }
}

export function MultiPlatformCodeTabs({
  tabs = DEFAULT_TABS,
  defaultTabId,
  showOutputToggle = true,
  className = "",
}: MultiPlatformCodeTabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || tabs[0]?.id || "macos")
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (defaultTabId) return
    const storedTab = localStorage.getItem("fetchit_preferred_tab")
    if (storedTab && tabs.some((t) => t.id === storedTab)) {
      setActiveTabId(storedTab)
      return
    }

    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes("win")) {
      setActiveTabId("windows")
    } else if (ua.includes("mac")) {
      setActiveTabId("macos")
    } else if (ua.includes("linux")) {
      setActiveTabId("linux")
    }
  }, [defaultTabId, tabs])

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId)
    localStorage.setItem("fetchit_preferred_tab", tabId)
  }

  const handleTestInTerminal = () => {
    if (!activeTab?.code) return
    navigator.clipboard.writeText(activeTab.code)
    toast.success("Loaded command into Terminal Playground!", {
      description: `Copied: ${activeTab.code.slice(0, 45)}${activeTab.code.length > 45 ? "..." : ""}`,
    })
    
    // If on homepage already, scroll directly to #playground
    if (window.location.pathname === "/") {
      const elem = document.getElementById("playground")
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      router.push("/#playground")
      setTimeout(() => {
        const elem = document.getElementById("playground")
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 200)
    }
  }

  return (
    <div className={`my-5 overflow-hidden rounded-xl border border-border bg-[#09090b] dark:bg-[#070709] ring-1 ring-white/5 shadow-2xl transition-all duration-200 ${className}`}>
      {/* Minimalist Tab Header with Emil Kowalski Micro-Transitions */}
      <div className="flex items-center justify-between border-b border-border/80 bg-[#121215]/80 backdrop-blur-md px-2.5 py-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-all duration-200 shrink-0 cursor-pointer select-none active:scale-[0.97] ${
                  isActive
                    ? "bg-background text-foreground font-medium shadow-sm border border-border/90 text-emerald-400 dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                {renderIcon(tab.icon)}
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-emerald-500 rounded-full animate-in fade-in zoom-in-50 duration-200" />
                )}
              </button>
            )
          })}
        </div>

        <div className="pl-2 shrink-0 flex items-center gap-1.5">
          <button
            onClick={handleTestInTerminal}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all duration-150 active:scale-[0.97] cursor-pointer"
            title="Test this command in interactive playground"
          >
            <Play className="size-3 text-emerald-400" />
            <span className="hidden sm:inline">Try in Playground</span>
          </button>
          <CopyButton text={activeTab?.code || ""} />
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative p-4 sm:p-5 font-mono text-sm leading-relaxed text-[#f1f5f9] overflow-x-auto bg-[#08080a] group">
        <code className="whitespace-pre flex-1 select-all">{activeTab?.code}</code>
      </div>

      {/* Optional Terminal Output Toggle */}
      {showOutputToggle && activeTab?.outputPreview && activeTab.outputPreview.length > 0 && (
        <div className="border-t border-border/60 bg-[#0d0d10]">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none active:bg-white/[0.02]"
          >
            <span className="flex items-center gap-2">
              <Terminal className="size-3.5 text-emerald-400/80" />
              <span>Terminal Output Preview</span>
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span>{showPreview ? "Hide" : "Show"}</span>
              {showPreview ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </span>
          </button>

          {showPreview && (
            <div className="px-4 py-3 font-mono text-xs text-[#a1a1aa] bg-black/60 border-t border-white/5 space-y-1 overflow-x-auto leading-relaxed">
              {activeTab.outputPreview.map((outLine, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-muted-foreground/30 select-none">›</span>
                  <span>{outLine}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
