"use client"

import { useState } from "react"
import { toast } from "@/components/ui/sonner-toast"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Copied to clipboard!", {
          description: text.length > 50 ? `${text.slice(0, 50)}...` : text,
        })
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-background active:scale-[0.92] shrink-0 transition-all duration-150 ease-out cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg className="size-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}
