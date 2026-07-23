"use client"

import { useEffect, useState, useRef } from "react"

export function CountUp({ start = 0, end, suffix = "", duration = 2500 }: { start?: number; end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(start)
  const ref = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)
  const range = end - start

  useEffect(() => {
    const startAnimation = () => {
      if (hasRun.current) return
      hasRun.current = true
      const startTime = performance.now()
      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(start + eased * range))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      startAnimation()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && (entry.isIntersecting || entry.intersectionRatio > 0)) {
          startAnimation()
        }
      },
      { threshold: 0.01, rootMargin: "50px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    // Safety fallback timer if intersection observer misses on mobile
    const fallbackTimer = setTimeout(() => {
      startAnimation()
    }, 800)

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [start, end, duration, range])

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums select-none">
      {count}{suffix}
    </div>
  )
}
