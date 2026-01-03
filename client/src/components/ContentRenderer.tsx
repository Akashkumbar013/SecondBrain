import { useEffect, useRef, useState } from "react"
import { Resizable } from "re-resizable"

declare global {
  interface Window {
    twttr?: any
    instgrm?: any
  }
}

/* ---------- HELPERS ---------- */

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v")
      if (!id) return null
      return `https://www.youtube.com/embed/${id}`
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }
    return null
  } catch {
    return null
  }
}

function getInstagramEmbedHtml(url: string) {
  // Simple blockquote approach for Instagram
  // The script will replace it
  return `
      <blockquote 
        class="instagram-media" 
        data-instgrm-permalink="${url}"
        data-instgrm-version="14"
        style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
      >
      </blockquote>
    `
}

/* ---------- COMPONENTS ---------- */

function ContentRenderer({
  content,
  onDelete,
}: {
  content: any
  onDelete: () => void
}) {
  const tweetRef = useRef<HTMLDivElement | null>(null)
  const instaRef = useRef<HTMLDivElement | null>(null)
  const renderedRef = useRef(false)

  // Default size state for resizable items
  const [size, setSize] = useState({ width: "100%", height: "auto" })

  /* ---------- TWITTER SCRIPT ---------- */
  useEffect(() => {
    if (content.type !== "tweet") return
    if (!tweetRef.current) return
    if (renderedRef.current) return

    let tweetId = ""
    if (content.value.includes("/status/")) {
      tweetId = content.value.split("/status/")[1].split("?")[0]
    } else if (content.value.includes("/i/status/")) {
      tweetId = content.value.split("/i/status/")[1].split("?")[0]
    }

    if (!tweetId) return

    renderedRef.current = true
    tweetRef.current.innerHTML = ""

    const renderTweet = () => {
      window.twttr.widgets.createTweet(tweetId, tweetRef.current!)
    }

    if (!window.twttr) {
      const script = document.createElement("script")
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      script.onload = renderTweet
      document.body.appendChild(script)
    } else {
      renderTweet()
    }
  }, [content])

  /* ---------- INSTAGRAM EMBED ---------- */
  // No script needed for iframe approach, but keeping this effect clean
  // in case we need to revert or add other scripts later.
  useEffect(() => {
    // Cleanup if needed
    return () => { }
  }, [])


  /* ---------- RENDERERS ---------- */

  // WRAPPER FOR RESIZABLE
  const ResizableWrapper = ({ children, defaultHeight = "300px" }: any) => (
    <div className="relative group mb-4">
      <Resizable
        defaultSize={{
          width: "100%",
          height: defaultHeight,
        }}
        className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50"
        enable={{
          top: false, right: false, bottom: true, left: false,
          topRight: false, bottomRight: true, bottomLeft: false, topLeft: false
        }}
      >
        {children}
        <DeleteButton onDelete={onDelete} />
        {/* Resize Handle Hint */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-slate-600/50 rounded-br cursor-nwse-resize hover:bg-indigo-500 transition-colors" />
      </Resizable>
    </div>
  )

  // 1. YOUTUBE
  if (content.type === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(content.value)
    if (!embedUrl) return <p className="text-red-400">Invalid YouTube link</p>
    return (
      <ResizableWrapper defaultHeight="300px">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
        />
      </ResizableWrapper>
    )
  }

  // 2. TWEET (Not Resizable Wrapper, simpler to let Twitter handle height)
  if (content.type === "tweet") {
    return (
      <div className="relative group bg-slate-900 rounded-xl p-4 mb-4 border border-slate-800">
        <div ref={tweetRef} className="flex justify-center" />
        <DeleteButton onDelete={onDelete} />
      </div>
    )
  }

  // 3. IMAGE
  if (content.type === "image") {
    return (
      <ResizableWrapper defaultHeight="auto">
        <img
          src={content.value}
          alt="Brain content"
          className="w-full h-full object-contain"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400?text=Invalid+Image+URL")}
        />
      </ResizableWrapper>
    )
  }

  // 4. VIDEO (Normal)
  if (content.type === "video") {
    return (
      <ResizableWrapper defaultHeight="auto">
        <video
          src={content.value}
          controls
          className="w-full h-full object-contain"
        />
      </ResizableWrapper>
    )
  }

  // 5. INSTAGRAM
  if (content.type === "instagram") {
    // Ensure URL has /embed at the end for the iframe source
    let embedUrl = content.value.split("?")[0] // Remove existing params
    if (!embedUrl.endsWith("/")) embedUrl += "/"
    embedUrl += "embed"

    return (
      <ResizableWrapper defaultHeight="500px">
        <iframe
          src={embedUrl}
          className="w-full h-full object-contain bg-white rounded-xl"
          frameBorder="0"
          scrolling="no"
          allowTransparency
        />
      </ResizableWrapper>
    )
  }

  // 6. DOCUMENTS (PDF / DOC) - Google Docs Viewer
  if (content.type === "pdf" || content.type === "doc") {
    // Use Google Docs Viewer for embedding
    const googleDocsBase = "https://docs.google.com/gview?embedded=true&url="
    const src = googleDocsBase + encodeURIComponent(content.value)

    return (
      <ResizableWrapper defaultHeight="500px">
        <iframe
          src={src}
          className="w-full h-full bg-white"
          title="Document Viewer"
        />
      </ResizableWrapper>
    )
  }

  // 7. TEXT / NOTE
  if (content.type === "text") {
    return (
      <div className="relative group bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-700/50">
        <p className="text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
          {content.value}
        </p>
        <DeleteButton onDelete={onDelete} />
      </div>
    )
  }

  // 8. LINK (Default)
  return (
    <div className="relative group bg-slate-900/50 rounded-lg p-3 mb-4 border border-slate-700/50 flex items-center gap-3">
      <span className="text-2xl">🔗</span>
      <a
        href={content.value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-400 underline break-all hover:text-indigo-300 transition-colors"
      >
        {content.value}
      </a>
      <DeleteButton onDelete={onDelete} />
    </div>
  )
}

/* ---------- DELETE BUTTON ---------- */
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      onClick={onDelete}
      className="
        absolute top-2 right-2 z-50
        text-xs bg-red-600/80 hover:bg-red-600
        text-white px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        transition-all duration-200
        shadow-lg
      "
    >
      🗑
    </button>
  )
}

export default ContentRenderer
