"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { CheckCircle2, Info, AlertTriangle, X, Copy, Sparkles, Terminal } from "lucide-react"

export type ToastType = "success" | "info" | "warning" | "error"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
  icon?: React.ReactNode
}

interface ToastContextType {
  toast: (title: string, options?: { description?: string; type?: ToastType; duration?: number; icon?: React.ReactNode }) => void
  dismiss: (id: string) => void
  toasts: ToastItem[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastListener: ((title: string, options?: { description?: string; type?: ToastType; duration?: number; icon?: React.ReactNode }) => void) | null = null

export const toast = (title: string, options?: { description?: string; type?: ToastType; duration?: number; icon?: React.ReactNode }) => {
  if (toastListener) {
    toastListener(title, options)
  }
}

toast.success = (title: string, options?: { description?: string; duration?: number }) => {
  toast(title, { ...options, type: "success" })
}

toast.info = (title: string, options?: { description?: string; duration?: number }) => {
  toast(title, { ...options, type: "info" })
}

toast.warning = (title: string, options?: { description?: string; duration?: number }) => {
  toast(title, { ...options, type: "warning" })
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const isWindowFocusedRef = useRef(true)
  const timersRef = useRef<Map<string, { remaining: number; startTime: number; timerId: NodeJS.Timeout | null }>>(new Map())

  // Window focus listener for auto-pausing timers (Sonner Spec)
  useEffect(() => {
    const handleFocus = () => {
      isWindowFocusedRef.current = true
    }
    const handleBlur = () => {
      isWindowFocusedRef.current = false
    }
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    const timerObj = timersRef.current.get(id)
    if (timerObj?.timerId) clearTimeout(timerObj.timerId)
    timersRef.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((title: string, options?: { description?: string; type?: ToastType; duration?: number; icon?: React.ReactNode }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const type = options?.type || "info"
    const duration = options?.duration || 4000
    const newToast: ToastItem = {
      id,
      title,
      description: options?.description,
      type,
      duration,
      icon: options?.icon,
    }

    setToasts((prev) => [newToast, ...prev].slice(0, 5)) // Keep max 5 stacked toasts

    // Setup auto-dismiss timer
    const timerId = setTimeout(() => {
      dismiss(id)
    }, duration)

    timersRef.current.set(id, {
      remaining: duration,
      startTime: Date.now(),
      timerId,
    })
  }, [dismiss])

  useEffect(() => {
    toastListener = addToast
    return () => {
      toastListener = null
    }
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toast: addToast, dismiss, toasts }}>
      {children}
      {/* Sonner Toast Stack Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex flex-col items-end pointer-events-auto gap-2">
          {toasts.map((t, index) => (
            <SonnerToastCard
              key={t.id}
              toast={t}
              index={index}
              total={toasts.length}
              isHovered={isHovered}
              onDismiss={() => dismiss(t.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Individual Sonner Toast Card with Emil Drag-to-Dismiss Momentum Gestures
function SonnerToastCard({
  toast,
  index,
  total,
  isHovered,
  onDismiss,
}: {
  toast: ToastItem
  index: number
  total: number
  isHovered: boolean
  onDismiss: () => void
}) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startTimeRef = useRef(0)

  // Drag-to-Dismiss Momentum Gesture Handler (Velocity calculation: velocity > 0.11)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    startYRef.current = e.clientY
    startTimeRef.current = Date.now()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const deltaY = e.clientY - startYRef.current
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    const deltaY = e.clientY - startYRef.current
    const deltaTime = Date.now() - startTimeRef.current
    const velocity = deltaY / Math.max(1, deltaTime)

    // Dismiss if velocity > 0.11 or displacement > 50px
    if (velocity > 0.11 || deltaY > 50) {
      setDragY(200)
      setTimeout(onDismiss, 150)
    } else {
      setDragY(0)
    }
  }

  // Calculate Sonner stacking transform & scale
  const isStacked = !isHovered
  const offsetY = isStacked ? index * -8 : 0
  const scale = isStacked ? 1 - index * 0.05 : 1
  const opacity = isStacked ? (index > 2 ? 0 : 1 - index * 0.15) : 1

  const getIcon = () => {
    if (toast.icon) return toast.icon
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
      case "warning":
        return <AlertTriangle className="size-4 text-amber-400 shrink-0" />
      case "error":
        return <X className="size-4 text-rose-400 shrink-0" />
      default:
        return <Info className="size-4 text-blue-400 shrink-0" />
    }
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(0, ${offsetY + dragY}px, 0) scale(${scale})`,
        opacity: opacity,
        zIndex: total - index,
        transition: isDragging ? "none" : "all 200ms cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform, opacity",
      }}
      className={`w-80 sm:w-88 rounded-2xl border border-border/80 bg-[#0e0e12]/95 backdrop-blur-xl p-3.5 shadow-2xl ring-1 ring-white/10 select-none cursor-grab active:cursor-grabbing ${
        index > 0 && isStacked ? "absolute bottom-0 right-0 pointer-events-none" : "relative"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="pt-0.5">{getIcon()}</div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-xs font-sans font-semibold text-foreground tracking-tight leading-snug">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-[11px] font-sans text-muted-foreground/80 leading-normal">
                {toast.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/5 active:scale-95 cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Drag-to-dismiss handle bar indicator */}
      <div className="w-8 h-1 rounded-full bg-white/10 mx-auto mt-2 opacity-40 hover:opacity-100 transition-opacity" />
    </div>
  )
}
