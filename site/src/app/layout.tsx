import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ToastProvider } from "@/components/ui/sonner-toast"
import { CommandPalette } from "@/components/command-palette"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "fetchit — grab any video. paste. fetch. done.",
    template: "%s — fetchit",
  },
  description:
    "Download videos from YouTube, X, Instagram, Threads, TikTok and 2,000+ other sites — right from your terminal.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased relative selection:bg-foreground selection:text-background overflow-x-hidden">
        <ToastProvider>
          <CommandPalette />
          <div className="fixed inset-0 bg-grid-mesh opacity-40 pointer-events-none z-0" />
          <div className="luminous-glow" />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">{children}</div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
