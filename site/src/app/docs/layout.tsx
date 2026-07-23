import { Sidebar } from "@/components/sidebar"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DocsPagination } from "@/components/docs-pagination"
import { TableOfContents } from "@/components/table-of-contents"
import { FeedbackWidget } from "@/components/feedback-widget"
import { MobileDocsNav } from "@/components/mobile-docs-nav"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
      <Sidebar />
      <MobileDocsNav />
      <main className="min-w-0 flex-1 px-3.5 sm:px-6 py-6 md:py-8 md:pl-60 md:pr-6 lg:pr-10">
        <div className="w-full max-w-[1440px] mx-auto flex justify-between gap-8 lg:gap-12 items-start">
          <div className="min-w-0 flex-1 max-w-4xl xl:max-w-5xl transition-all duration-300">
            <Breadcrumbs />
            {children}
            <DocsPagination />
            <FeedbackWidget />
          </div>
          <div className="hidden xl:block shrink-0">
            <TableOfContents />
          </div>
        </div>
      </main>
    </div>
  )
}
