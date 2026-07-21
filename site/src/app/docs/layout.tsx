import { Sidebar } from "@/components/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-5xl px-4">
      <Sidebar />
      <main className="min-w-0 flex-1 py-8 pl-0 md:pl-8">
        {children}
      </main>
    </div>
  )
}
