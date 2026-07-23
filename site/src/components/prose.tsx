"use client"

import type { ReactNode } from "react"
import { CopyButton } from "@/components/copy-button"
import { Kbd } from "@/components/kbd"
import { Terminal, Play } from "lucide-react"
import { toast } from "@/components/ui/sonner-toast"
import { useRouter } from "next/navigation"

export { Kbd }

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-custom max-w-none">
      {children}
    </div>
  )
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{children}</h1>
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="scroll-mt-20 mt-12 mb-4 text-xl font-semibold tracking-tight text-foreground">{children}</h2>
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="scroll-mt-20 mt-8 mb-3 text-base font-semibold tracking-tight text-foreground">{children}</h3>
}

export function H4({ children }: { children: ReactNode }) {
  return <h4 className="scroll-mt-20 mt-6 mb-2 text-sm font-semibold tracking-tight text-foreground">{children}</h4>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.7] text-muted-foreground mb-5 last:mb-0">{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-[6px] bg-secondary px-[5px] py-[2px] text-sm font-mono text-foreground ring-1 ring-border/50">{children}</code>
}

function getCodeText(children: ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(getCodeText).join("")
  return ""
}

function detectLanguage(code: string, filename?: string): string {
  if (filename) {
    if (filename.endsWith(".sh") || filename.endsWith(".bash")) return "BASH"
    if (filename.endsWith(".ps1")) return "POWERSHELL"
    if (filename.endsWith(".json")) return "JSON"
    if (filename.endsWith(".ts") || filename.endsWith(".js")) return "JAVASCRIPT"
  }
  const clean = code.trim()
  if (clean.startsWith("npm ") || clean.startsWith("yarn ") || clean.startsWith("pnpm ") || clean.startsWith("npx ")) return "NPM"
  if (clean.startsWith("fetchit") || clean.startsWith("curl") || clean.startsWith("wget") || clean.includes("powershell") || clean.includes("Invoke-WebRequest")) return "CLI"
  if (clean.startsWith("{") || clean.startsWith("[")) return "JSON"
  return "BASH"
}

export function Pre({ children, filename }: { children: ReactNode; filename?: string }) {
  const code = getCodeText(children)
  const lang = detectLanguage(code, filename)
  const router = useRouter()

  const isExecutableCommand = Boolean(
    code &&
    !code.trim().startsWith("{") &&
    !code.trim().startsWith("[") &&
    (lang === "BASH" || lang === "CLI" || lang === "NPM" || lang === "POWERSHELL" || code.includes("curl") || code.includes("fetchit") || code.includes("npm"))
  )

  const handleTestInTerminal = () => {
    if (!code) return
    navigator.clipboard.writeText(code)
    toast.success("Loaded command into Terminal Playground!", {
      description: `Copied: ${code.trim().slice(0, 45)}${code.length > 45 ? "..." : ""}`,
    })
    
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
    <div className="my-5 overflow-hidden rounded-xl ring-1 ring-border/70 bg-[#09090b] shadow-md group">
      {/* Vercel-Style Code Top Bar */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 bg-[#111115]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <Terminal className="size-3.5 shrink-0 text-emerald-400" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            {lang}
          </span>
          {filename && <span className="text-xs font-mono text-muted-foreground truncate">{filename}</span>}
        </div>

        <div className="flex items-center gap-1.5">
          {isExecutableCommand && (
            <button
              onClick={handleTestInTerminal}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all duration-150 active:scale-[0.97] cursor-pointer"
              title="Test this command in interactive playground"
            >
              <Play className="size-3 text-emerald-400" />
              <span className="inline">Try in Playground</span>
            </button>
          )}
          {code && <CopyButton text={code} />}
        </div>
      </div>

      {/* Code Area */}
      <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed text-foreground/90 selection:bg-white/20 selection:text-white">
        {children}
      </pre>
    </div>
  )
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className="mb-5 list-disc pl-6 text-[15px] leading-[1.7] text-muted-foreground space-y-1.5 last:mb-0">{children}</ul>
}

export function Ol({ children }: { children: ReactNode }) {
  return <ol className="mb-5 list-decimal pl-6 text-[15px] leading-[1.7] text-muted-foreground space-y-1.5 last:mb-0">{children}</ol>
}

export function Li({ children }: { children: ReactNode }) {
  return <li className="leading-[1.7]">{children}</li>
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-border bg-[#09090b]">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border bg-[#111115]">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-foreground/90">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-[13px] text-muted-foreground">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3.5 text-[14px] leading-[1.7] text-muted-foreground">
      {children}
    </div>
  )
}

export function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-foreground underline underline-offset-2 decoration-border hover:decoration-emerald-400 hover:text-emerald-400 transition-colors font-medium">
      {children}
    </a>
  )
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-5 border-l-2 border-emerald-400/50 pl-5 text-[14px] leading-[1.7] text-muted-foreground italic">
      {children}
    </blockquote>
  )
}
