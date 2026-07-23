"use client"

import { useState, useEffect } from "react"
import { Copy, Star, Check } from "lucide-react"
import { toast } from "@/components/ui/sonner-toast"
import { safeCopyToClipboard } from "@/components/copy-button"

export function MobileQuickActionDock() {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleCopyInstall = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15)
      }
    } catch {
      // Ignore
    }
    const installCmd = "curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh"
    await safeCopyToClipboard(installCmd)
    setCopied(true)
    toast.success("Installer command copied!", {
      description: "Paste into your macOS or Linux terminal.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isVisible) return null

  return (
    <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#121216]/90 border border-white/15 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 text-xs font-mono">
        <button
          onClick={handleCopyInstall}
          suppressHydrationWarning
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 transition-all active:scale-[0.95] cursor-pointer"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span>Copy Install</span>
        </button>

        <a
          href="https://github.com/Vedant1521/fetchit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-foreground font-medium border border-white/10 transition-all active:scale-[0.95]"
        >
          <Star className="size-3.5 text-amber-400 fill-amber-400/20" />
          <span>Star</span>
        </a>
      </div>
    </div>
  )
}
