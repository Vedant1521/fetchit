"use client"

import { useEffect, useState, useRef } from "react"

export function CountUp({ start = 0, end, suffix = "", duration = 3000 }: { start?: number; end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(start)
  const ref = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)
  const range = end - start

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
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
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [start, end, duration, range])

  return (
    <div ref={ref} className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
      {count}{suffix}
    </div>
  )
}
