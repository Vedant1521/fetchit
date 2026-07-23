import type { ReactNode } from "react"
import { CopyButton } from "@/components/copy-button"

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
  return <h2 className="mt-12 mb-4 text-xl font-semibold tracking-tight text-foreground">{children}</h2>
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-3 text-base font-semibold tracking-tight text-foreground">{children}</h3>
}

export function H4({ children }: { children: ReactNode }) {
  return <h4 className="mt-6 mb-2 text-sm font-semibold tracking-tight text-foreground">{children}</h4>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.7] text-muted-foreground mb-5 last:mb-0">{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-secondary px-[5px] py-[2px] text-sm font-mono text-foreground border border-border/50">{children}</code>
}

function getCodeText(children: ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  return ""
}

export function Pre({ children, filename }: { children: ReactNode; filename?: string }) {
  const code = getCodeText(children)
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-border bg-[#0a0a0a] dark:bg-black">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-yellow-500/80" />
            <span className="size-2.5 rounded-full bg-green-500/80" />
          </div>
          {filename && <span className="text-xs text-white/40 font-mono truncate">{filename}</span>}
        </div>
        {code && <CopyButton text={code} />}
      </div>
      <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed text-[#e5e5e5]">{children}</pre>
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
    <div className="my-5 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30">
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
    <div className="my-5 rounded-xl border border-border bg-secondary/50 px-5 py-3.5 text-[14px] leading-[1.7] text-muted-foreground">
      {children}
    </div>
  )
}

export function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors">
      {children}
    </a>
  )
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-5 border-l-2 border-foreground/20 pl-5 text-[14px] leading-[1.7] text-muted-foreground italic">
      {children}
    </blockquote>
  )
}
