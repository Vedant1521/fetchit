import type { ReactNode } from "react"

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-custom max-w-none space-y-6">
      {children}
    </div>
  )
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">{children}</h1>
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 mb-4 text-xl font-semibold tracking-tight text-foreground border-b border-border pb-2">{children}</h2>
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-3 text-lg font-semibold tracking-tight text-foreground">{children}</h3>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono text-foreground">{children}</code>
}

export function Pre({ children }: { children: ReactNode }) {
  return <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4 text-xs font-mono leading-relaxed text-foreground">{children}</pre>
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">{children}</ul>
}

export function Ol({ children }: { children: ReactNode }) {
  return <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">{children}</ol>
}

export function Li({ children }: { children: ReactNode }) {
  return <li className="leading-relaxed">{children}</li>
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-xs text-muted-foreground">{cell}</td>
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
    <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
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
    <blockquote className="border-l-2 border-foreground pl-4 text-sm text-muted-foreground italic">
      {children}
    </blockquote>
  )
}
