"use client"

import { useState } from "react"
import { Search, Film, Music, Shield, Bookmark, Sparkles, Check, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/sonner-toast"

export interface PlatformItem {
  id: string
  name: string
  category: string
  domain: string
  sampleUrl: string
  features: {
    video4k?: boolean
    audioOnly?: boolean
    chapters?: boolean
    cookiesAuth?: boolean
    playlists?: boolean
  }
}

export const SUPPORTED_PLATFORMS: PlatformItem[] = [
  {
    id: "youtube",
    name: "YouTube",
    category: "Video",
    domain: "youtube.com / youtu.be",
    sampleUrl: "https://youtu.be/dQw4w9WgXcQ",
    features: { video4k: true, audioOnly: true, chapters: true, cookiesAuth: true, playlists: true },
  },
  {
    id: "twitter",
    name: "X / Twitter",
    category: "Social",
    domain: "x.com / twitter.com",
    sampleUrl: "https://x.com/space/status/123456789",
    features: { video4k: true, audioOnly: true, cookiesAuth: true, playlists: false },
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Social",
    domain: "instagram.com (Reels & Posts)",
    sampleUrl: "https://instagram.com/reel/C8xyz123",
    features: { video4k: false, audioOnly: true, cookiesAuth: true, playlists: false },
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "Shorts",
    domain: "tiktok.com (No Watermark)",
    sampleUrl: "https://tiktok.com/@user/video/7391283",
    features: { video4k: false, audioOnly: true, cookiesAuth: false, playlists: false },
  },
  {
    id: "threads",
    name: "Threads",
    category: "Social",
    domain: "threads.net",
    sampleUrl: "https://threads.net/@user/post/1234",
    features: { video4k: false, audioOnly: true, cookiesAuth: false, playlists: false },
  },
  {
    id: "twitch",
    name: "Twitch",
    category: "Streaming",
    domain: "twitch.tv (Clips & VODs)",
    sampleUrl: "https://twitch.tv/clip/sample",
    features: { video4k: true, audioOnly: true, cookiesAuth: true, playlists: false },
  },
  {
    id: "vimeo",
    name: "Vimeo",
    category: "Video",
    domain: "vimeo.com",
    sampleUrl: "https://vimeo.com/123456",
    features: { video4k: true, audioOnly: true, chapters: true, cookiesAuth: true, playlists: true },
  },
  {
    id: "bilibili",
    name: "Bilibili",
    category: "Video",
    domain: "bilibili.com",
    sampleUrl: "https://bilibili.com/video/BV1xx",
    features: { video4k: true, audioOnly: true, chapters: false, cookiesAuth: true, playlists: true },
  },
  {
    id: "reddit",
    name: "Reddit",
    category: "Social",
    domain: "reddit.com (v.redd.it)",
    sampleUrl: "https://reddit.com/r/videos/comments/sample",
    features: { video4k: false, audioOnly: true, cookiesAuth: false, playlists: false },
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    category: "Audio",
    domain: "soundcloud.com",
    sampleUrl: "https://soundcloud.com/artist/track",
    features: { video4k: false, audioOnly: true, chapters: false, cookiesAuth: true, playlists: true },
  },
  {
    id: "pinterest",
    name: "Pinterest",
    category: "Social",
    domain: "pinterest.com",
    sampleUrl: "https://pinterest.com/pin/1234",
    features: { video4k: false, audioOnly: false, cookiesAuth: false, playlists: false },
  },
  {
    id: "kick",
    name: "Kick",
    category: "Streaming",
    domain: "kick.com",
    sampleUrl: "https://kick.com/streamer",
    features: { video4k: true, audioOnly: true, cookiesAuth: false, playlists: false },
  },
]

export function PlatformSupportMatrix({ className = "" }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const filteredPlatforms = SUPPORTED_PLATFORMS.filter((platform) => {
    const matchesSearch =
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedFilter === "4k") return platform.features.video4k
    if (selectedFilter === "audio") return platform.features.audioOnly
    if (selectedFilter === "chapters") return platform.features.chapters
    if (selectedFilter === "cookies") return platform.features.cookiesAuth
    if (selectedFilter === "playlists") return platform.features.playlists

    return true
  })

  const handleTestPlatform = (platform: PlatformItem) => {
    toast.success(`Copied test command for ${platform.name}!`, {
      description: `fetchit ${platform.sampleUrl}`,
    })
    navigator.clipboard.writeText(`fetchit ${platform.sampleUrl}`)
  }

  return (
    <div className={`rounded-2xl border border-border bg-[#09090b] dark:bg-[#070709] overflow-hidden shadow-xl ring-1 ring-white/5 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-[#121215]/90 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-tight text-foreground">
            Supported Sites Matrix (2,000+ Platforms)
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">
          YT-DLP CORE
        </span>
      </div>

      {/* Filter Bar & Search */}
      <div className="p-4 border-b border-border/40 bg-[#08080a] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms (YouTube, X, TikTok, Twitch, Bilibili...)"
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
            {[
              { id: "all", label: "All Sites" },
              { id: "4k", label: "4K Video" },
              { id: "audio", label: "Audio MP3" },
              { id: "chapters", label: "Chapters" },
              { id: "cookies", label: "Cookies Auth" },
              { id: "playlists", label: "Playlists" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium tracking-tight border transition-all duration-150 cursor-pointer active:scale-[0.96] shrink-0 ${
                  selectedFilter === tab.id
                    ? "bg-foreground text-background font-bold border-foreground shadow-sm"
                    : "bg-secondary/40 text-muted-foreground border-border/40 hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#070709] max-h-96 overflow-y-auto no-scrollbar">
        {filteredPlatforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => handleTestPlatform(platform)}
            className="group p-3.5 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/60 hover:border-border/80 transition-all duration-150 cursor-pointer active:scale-[0.98] flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                  <span>{platform.name}</span>
                </h4>
                <span className="text-[10px] font-mono text-muted-foreground/70 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {platform.category}
                </span>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground/60 truncate pt-0.5">
                {platform.domain}
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/30">
              {platform.features.video4k && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  4K / 1080p
                </span>
              )}
              {platform.features.audioOnly && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  MP3 Audio
                </span>
              )}
              {platform.features.chapters && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Chapters
                </span>
              )}
              {platform.features.cookiesAuth && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Auth Cookies
                </span>
              )}
              {platform.features.playlists && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  Playlists
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border bg-[#0d0d10] p-3 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>Showing {filteredPlatforms.length} of 2,000+ supported extractors</span>
        <span className="text-emerald-400 font-medium">Click card to copy test command</span>
      </div>
    </div>
  )
}
