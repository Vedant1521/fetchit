"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface KbdProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function Kbd({ children, className, title }: KbdProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    const text = typeof children === "string" ? children : ""
    if (text) {
      navigator.clipboard.writeText(text).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <kbd
      onClick={handleClick}
      title={title || `Click to copy shortcut '${children}'`}
      className={cn(
        "relative inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-[11px] font-mono font-medium select-none rounded-[5px]",
        "bg-secondary/90 text-foreground border border-border/80",
        "shadow-[0_1.5px_0_0_rgba(0,0,0,0.12)] dark:shadow-[0_1.5px_0_0_rgba(255,255,255,0.12)]",
        "hover:bg-accent hover:border-foreground/30 hover:-translate-y-[0.5px]",
        "active:translate-y-[1px] active:shadow-none",
        "transition-all duration-100 ease-out cursor-pointer group",
        className,
      )}
    >
      {children}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-foreground text-background text-[10px] font-sans font-medium animate-in fade-in zoom-in-95 duration-150 pointer-events-none z-50 shadow-md">
          Copied!
        </span>
      )}
    </kbd>
  )
}
