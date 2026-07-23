"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "@/components/copy-button"
import { Search, Sparkles, Film, Music, Check, Clock, User, ExternalLink, Play, ArrowRight, Eye } from "lucide-react"

export interface StreamFormat {
  id: string
  quality: string
  ext: string
  filesize: string
  bitrate: string
  fps?: number
  type: "video" | "audio"
  command: string
}

export interface MetadataResult {
  url: string
  platform: "youtube" | "twitter" | "instagram" | "tiktok"
  platformName: string
  title: string
  creator: string
  duration: string
  views: string
  formats: StreamFormat[]
}

const MOCK_METADATA_DATABASE: Record<string, MetadataResult> = {
  youtube: {
    url: "https://youtu.be/dQw4w9WgXcQ",
    platform: "youtube",
    platformName: "YouTube",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    creator: "@RickAstley",
    duration: "03:33",
    views: "1.5B views",
    formats: [
      { id: "f1", quality: "1080p", ext: "mp4", filesize: "48.2 MB", bitrate: "4.2 Mbps", fps: 60, type: "video", command: "fetchit https://youtu.be/dQw4w9WgXcQ 1080p" },
      { id: "f2", quality: "720p", ext: "mp4", filesize: "22.5 MB", bitrate: "2.1 Mbps", fps: 60, type: "video", command: "fetchit https://youtu.be/dQw4w9WgXcQ 720p" },
      { id: "f3", quality: "480p", ext: "mp4", filesize: "11.1 MB", bitrate: "1.0 Mbps", fps: 30, type: "video", command: "fetchit https://youtu.be/dQw4w9WgXcQ 480p" },
      { id: "f4", quality: "Audio MP3", ext: "mp3", filesize: "4.8 MB", bitrate: "320 kbps", type: "audio", command: "fetchit --mp3 https://youtu.be/dQw4w9WgXcQ" },
      { id: "f5", quality: "Audio M4A", ext: "m4a", filesize: "3.6 MB", bitrate: "256 kbps", type: "audio", command: "fetchit https://youtu.be/dQw4w9WgXcQ mp3" },
    ],
  },
  twitter: {
    url: "https://x.com/space/status/123456789",
    platform: "twitter",
    platformName: "X / Twitter",
    title: "Starship Flight Test Heavy Booster Return & Catch",
    creator: "@SpaceX",
    duration: "01:12",
    views: "42.8M views",
    formats: [
      { id: "f1", quality: "1080p HD", ext: "mp4", filesize: "28.4 MB", bitrate: "5.1 Mbps", fps: 60, type: "video", command: "fetchit https://x.com/space/status/123456789 --best" },
      { id: "f2", quality: "720p HD", ext: "mp4", filesize: "14.2 MB", bitrate: "2.4 Mbps", fps: 30, type: "video", command: "fetchit https://x.com/space/status/123456789 720p" },
      { id: "f3", quality: "Audio Only", ext: "mp3", filesize: "2.1 MB", bitrate: "192 kbps", type: "audio", command: "fetchit --mp3 https://x.com/space/status/123456789" },
    ],
  },
  instagram: {
    url: "https://instagram.com/reel/C8xyz123",
    platform: "instagram",
    platformName: "Instagram Reel",
    title: "Cinematic Japan Alps Autumn Drone Sequence",
    creator: "@earth_explore",
    duration: "00:45",
    views: "8.9M views",
    formats: [
      { id: "f1", quality: "1080p Reel", ext: "mp4", filesize: "18.6 MB", bitrate: "3.8 Mbps", fps: 60, type: "video", command: "fetchit https://instagram.com/reel/C8xyz123 --best" },
      { id: "f2", quality: "720p Reel", ext: "mp4", filesize: "9.2 MB", bitrate: "1.8 Mbps", fps: 30, type: "video", command: "fetchit https://instagram.com/reel/C8xyz123 720p" },
      { id: "f3", quality: "Reel Audio", ext: "mp3", filesize: "1.4 MB", bitrate: "256 kbps", type: "audio", command: "fetchit --mp3 https://instagram.com/reel/C8xyz123" },
    ],
  },
  tiktok: {
    url: "https://tiktok.com/@user/video/7391283",
    platform: "tiktok",
    platformName: "TikTok",
    title: "Fast 10-Minute High Protein Meal Prep Recipe",
    creator: "@chef_hacks",
    duration: "00:58",
    views: "12.4M views",
    formats: [
      { id: "f1", quality: "1080p No Watermark", ext: "mp4", filesize: "15.1 MB", bitrate: "3.2 Mbps", fps: 60, type: "video", command: "fetchit https://tiktok.com/@user/video/7391283 --best" },
      { id: "f2", quality: "Original Sound", ext: "mp3", filesize: "1.2 MB", bitrate: "320 kbps", type: "audio", command: "fetchit --mp3 https://tiktok.com/@user/video/7391283" },
    ],
  },
}

export function UrlMetadataInspector({ className = "" }: { className?: string }) {
  const [inputUrl, setInputUrl] = useState("https://youtu.be/dQw4w9WgXcQ")
  const [isProbing, setIsProbing] = useState(false)
  const [activeMetadata, setActiveMetadata] = useState<MetadataResult>(MOCK_METADATA_DATABASE.youtube)
  const [copiedFormatId, setCopiedFormatId] = useState<string | null>(null)
  const [imgLoaded, setImgLoaded] = useState(true)

  const handleInspectUrl = async (urlToInspect?: string) => {
    const rawTarget = urlToInspect || inputUrl
    if (!rawTarget.trim()) return

    const targetUrl = rawTarget.trim().replace(/^\.+/, "")
    setIsProbing(true)
    setImgLoaded(false)

    let matched: MetadataResult = { ...MOCK_METADATA_DATABASE.youtube }
    if (targetUrl.includes("x.com") || targetUrl.includes("twitter.com")) {
      matched = { ...MOCK_METADATA_DATABASE.twitter }
    } else if (targetUrl.includes("instagram.com")) {
      matched = { ...MOCK_METADATA_DATABASE.instagram }
    } else if (targetUrl.includes("tiktok.com")) {
      matched = { ...MOCK_METADATA_DATABASE.tiktok }
    }

    matched.url = targetUrl

    if (targetUrl.startsWith("http")) {
      try {
        const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`
        const res = await fetch(oembedUrl)
        if (res.ok) {
          const data = await res.json()
          if (data && data.title) {
            matched.title = data.title
            if (data.author_name) matched.creator = `@${data.author_name.replace(/\s+/g, "")}`
            matched.formats = matched.formats.map((f) => ({
              ...f,
              command: `fetchit ${targetUrl} ${f.quality.includes("Audio") ? "--mp3" : f.quality}`,
            }))
          }
        }
      } catch {
        // Keep matched fallback
      }
    }

    setTimeout(() => {
      setActiveMetadata(matched)
      setIsProbing(false)
      setTimeout(() => setImgLoaded(true), 50)
    }, 700)
  }

  const handleCopyStreamCmd = async (fmt: StreamFormat) => {
    await navigator.clipboard.writeText(fmt.command)
    setCopiedFormatId(fmt.id)
    setTimeout(() => setCopiedFormatId(null), 1800)
  }

  return (
    <div className={`rounded-2xl border border-border bg-[#09090b] dark:bg-[#070709] overflow-hidden shadow-xl ring-1 ring-white/5 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-[#121215]/90 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Search className="size-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-tight text-foreground">Live Metadata & Format Inspector</span>
        </div>
        <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">
          PROBER SPEC
        </span>
      </div>

      {/* URL Input Bar & Quick Presets */}
      <div className="p-5 border-b border-border/40 bg-[#08080a] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInspectUrl()}
              placeholder="Paste any YouTube, X, Instagram, or TikTok URL..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-150"
            />
          </div>
          <button
            onClick={() => handleInspectUrl()}
            disabled={isProbing}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold rounded-xl bg-foreground text-background hover:opacity-90 active:scale-[0.97] transition-all duration-150 cursor-pointer shrink-0 shadow-sm"
          >
            {isProbing ? (
              <>
                <span className="animate-spin font-bold">⠋</span>
                <span>Probing...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5 text-amber-400" />
                <span>Inspect URL</span>
              </>
            )}
          </button>
        </div>

        {/* Quick URL Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono pt-1">
          <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider font-semibold shrink-0">TRY SITES:</span>
          {[
            { label: "YouTube", url: MOCK_METADATA_DATABASE.youtube.url },
            { label: "X / Twitter", url: MOCK_METADATA_DATABASE.twitter.url },
            { label: "Instagram Reel", url: MOCK_METADATA_DATABASE.instagram.url },
            { label: "TikTok", url: MOCK_METADATA_DATABASE.tiktok.url },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setInputUrl(p.url)
                handleInspectUrl(p.url)
              }}
              className="px-2.5 py-1 rounded-full bg-secondary/60 hover:bg-secondary text-foreground text-[11px] font-medium tracking-tight transition-all duration-150 shrink-0 cursor-pointer border border-border/40 active:scale-[0.96]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inspection Output Body */}
      {isProbing ? (
        <div className="p-10 text-center space-y-3 bg-[#070709] animate-in fade-in duration-150">
          <div className="inline-flex items-center justify-center size-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="animate-spin text-lg">⠋</span>
          </div>
          <div className="text-xs font-mono font-semibold text-foreground tracking-tight">
            Extracting HLS manifests, stream info, and thumbnail...
          </div>
          <div className="text-[11px] font-sans text-muted-foreground/70">
            Simulating live yt-dlp metadata probe across formats...
          </div>
        </div>
      ) : (
        <div className="p-5 space-y-6 bg-[#070709] animate-in fade-in duration-200">
          {/* Mock Video Preview Card with Emil Clip-Path Image Reveal */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-border/60 bg-secondary/20">
            {/* Thumbnail Box */}
            <div
              className={`relative w-full sm:w-44 h-28 rounded-lg overflow-hidden border border-border/50 bg-black/60 shrink-0 transition-all duration-300 ${
                imgLoaded ? "clip-path-full" : "clip-path-inset"
              }`}
              style={{
                clipPath: imgLoaded ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 300ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              {/* SVG Graphic Thumbnail */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary/60 to-black p-3 text-center">
                <Film className="size-6 text-emerald-400/80 mb-1" />
                <span className="text-[10px] font-mono text-muted-foreground line-clamp-1">{activeMetadata.platformName}</span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono font-semibold bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/10">
                  {activeMetadata.duration}
                </span>
              </div>
            </div>

            {/* Video Details */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeMetadata.platformName}
                </span>
                <span className="text-xs font-sans font-medium text-muted-foreground/80 flex items-center gap-1">
                  <User className="size-3" />
                  {activeMetadata.creator}
                </span>
                <span className="text-xs font-sans text-muted-foreground/60 flex items-center gap-1">
                  <Eye className="size-3" />
                  {activeMetadata.views}
                </span>
              </div>

              <h3 className="text-sm font-sans font-semibold tracking-tight text-foreground leading-snug line-clamp-2">
                {activeMetadata.title}
              </h3>

              <div className="text-xs font-mono text-muted-foreground/70 truncate flex items-center gap-1.5 pt-1">
                <ExternalLink className="size-3 text-muted-foreground/50 shrink-0" />
                <span className="truncate">{activeMetadata.url}</span>
              </div>
            </div>
          </div>

          {/* Staggered Stream Format Table (Emil Spec: 40ms staggered row entry) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-xs font-sans font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <Film className="size-3.5 text-emerald-400" />
                <span>Extracted Stream Formats ({activeMetadata.formats.length})</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground/60">Click any row to copy command</span>
            </div>

            <div className="space-y-1.5">
              {activeMetadata.formats.map((fmt, idx) => {
                const isCopied = copiedFormatId === fmt.id
                return (
                  <div
                    key={fmt.id}
                    onClick={() => handleCopyStreamCmd(fmt)}
                    style={{
                      animationDelay: `${idx * 40}ms`,
                    }}
                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 ${
                      isCopied
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-100"
                        : "bg-secondary/30 hover:bg-secondary/70 border-border/40 hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border ${fmt.type === "video" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-purple-500/10 border-purple-500/20 text-purple-400"}`}>
                        {fmt.type === "video" ? <Film className="size-3.5" /> : <Music className="size-3.5" />}
                      </div>

                      <div>
                        <div className="text-xs font-mono font-semibold text-foreground flex items-center gap-2">
                          <span>{fmt.quality}</span>
                          <span className="text-[10px] font-mono uppercase text-muted-foreground/70 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                            {fmt.ext}
                          </span>
                          {fmt.fps && <span className="text-[10px] text-emerald-400 font-mono">{fmt.fps}fps</span>}
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground/60">
                          {fmt.bitrate} &middot; {fmt.filesize}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="hidden md:inline text-xs font-mono text-emerald-400/90 bg-background/60 px-2.5 py-1 rounded-md border border-border/50 truncate max-w-[240px]">
                        {fmt.command}
                      </code>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyStreamCmd(fmt)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-150 cursor-pointer shrink-0 border ${
                          isCopied
                            ? "bg-emerald-500 text-white border-emerald-400"
                            : "bg-foreground text-background hover:opacity-90 active:scale-[0.95]"
                        }`}
                      >
                        {isCopied ? (
                          <span className="flex items-center gap-1">
                            <Check className="size-3 stroke-[3]" />
                            <span>Copied!</span>
                          </span>
                        ) : (
                          <span>Copy Command</span>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
