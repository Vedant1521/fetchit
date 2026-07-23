"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function FeedbackWidget() {
  const pathname = usePathname()
  const [voted, setVoted] = useState<"yes" | "no" | null>(null)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showInput, setShowInput] = useState(false)

  // Reset when navigating to a new doc page
  useEffect(() => {
    setVoted(null)
    setComment("")
    setSubmitted(false)
    setShowInput(false)
  }, [pathname])

  const handleVote = (type: "yes" | "no") => {
    setVoted(type)
    if (type === "no") {
      setShowInput(true)
    } else {
      setSubmitted(true)
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="my-12 rounded-xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm shadow-sm transition-all hover:border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {!submitted ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Was this page helpful?
              </span>
            </div>
            {!showInput && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote("yes")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-150",
                    "hover:bg-secondary hover:border-foreground/30 hover:scale-[1.03]",
                    "active:scale-95 active:bg-accent",
                    voted === "yes" && "border-foreground bg-foreground text-background"
                  )}
                  aria-label="Helpful"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  Yes
                </button>
                <button
                  onClick={() => handleVote("no")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-150",
                    "hover:bg-secondary hover:border-foreground/30 hover:scale-[1.03]",
                    "active:scale-95 active:bg-accent",
                    voted === "no" && "border-foreground bg-foreground text-background"
                  )}
                  aria-label="Not helpful"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                  No
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground animate-in fade-in zoom-in-95 duration-200">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              ✓
            </span>
            <span>Thank you for your feedback! It helps us improve the docs.</span>
          </div>
        )}
      </div>

      {showInput && !submitted && (
        <form onSubmit={handleSubmitComment} className="mt-3.5 pt-3.5 border-t border-border/60 animate-in fade-in duration-150">
          <label htmlFor="feedback-comment" className="block text-xs text-muted-foreground mb-2">
            How can we improve this page? <span className="text-muted-foreground/60">(Optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="feedback-comment"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Needs more CLI examples or clearer setup steps..."
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 active:scale-95"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
