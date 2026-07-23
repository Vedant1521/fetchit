import { Sidebar } from "@/components/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="min-w-0 flex-1 py-8 md:pl-60">
        <div className="mx-auto max-w-3xl px-4">
          {children}
        </div>
      </main>
    </div>
  )
}
