import { useEffect, useRef, useState } from "react"
import { Resizable } from "re-resizable"
import api from "../services/api"

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

/* ---------- COMPONENTS ---------- */

function ContentRenderer({
  content,
  onDelete,
}: {
  content: any
  onDelete: () => void
}) {
  const tweetRef = useRef<HTMLDivElement | null>(null)
  const renderedRef = useRef(false)

  // Default size state for resizable items
  // We initialize from content metadata if it exists
  const [size, setSize] = useState({
    width: content.metadata?.width || "100%",
    height: content.metadata?.height || "auto"
  })

  // Update local state if content changes (e.g. initial load or props update)
  useEffect(() => {
    if (content.metadata?.width || content.metadata?.height) {
      setSize({
        width: content.metadata.width || "100%",
        height: content.metadata.height || "auto"
      })
    }
  }, [content.metadata?.width, content.metadata?.height])

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


  /* ---------- RENDERERS ---------- */

  // State to track resizing preventing iframe interaction
  const [isResizing, setIsResizing] = useState(false)

  const handleResizeStart = () => {
    setIsResizing(true)
  }

  const handleResize = (e: any, direction: any, ref: any, d: any) => {
    setSize({
      width: ref.style.width,
      height: ref.style.height,
    })
  }

  const handleResizeStop = async (e: any, direction: any, ref: any, d: any) => {
    setIsResizing(false)
    const newWidth = ref.style.width
    const newHeight = ref.style.height

    // Final update just in case
    setSize({ width: newWidth, height: newHeight })

    try {
      await api.put(`/content/${content._id}`, {
        metadata: {
          width: newWidth,
          height: newHeight
        }
      })
      console.log("Size saved:", newWidth, newHeight)
    } catch (err) {
      console.error("Failed to save resize", err)
    }
  }

  // WRAPPER FOR RESIZABLE
  const ResizableWrapper = ({ children, defaultHeight = "300px" }: any) => {
    // Logic:
    // We use UNCONTROLLED mode (defaultSize) for smoother performance.
    // We defaults to 350px width if no metadata is saved, avoiding "100%" collapse issues in flex containers.

    // Parse saved size or use defaults
    // We need to ensure we don't pass '100%' as a width to re-resizable in this context
    const getInitWidth = () => {
      if (content.metadata?.width && content.metadata.width !== "100%") return content.metadata.width
      return "350px" // Default card width
    }

    const getInitHeight = () => {
      if (content.metadata?.height && content.metadata.height !== "auto") return content.metadata.height
      return defaultHeight
    }

    return (
      <div className="relative group mb-6 p-1 bg-transparent">
        {/* Removed w-fit here, letting Resizable dictate size */}
        <Resizable
          key={content._id} // Re-mount if content changes
          defaultSize={{
            width: getInitWidth(),
            height: getInitHeight()
          }}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
          className="relative !overflow-visible shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm"
          handleClasses={{
            bottomRight: "z-50",
            right: "z-50",
            bottom: "z-50"
          }}
          enable={{
            top: false, right: true, bottom: true, left: false,
            topRight: false, bottomRight: true, bottomLeft: false, topLeft: false
          }}
          lockAspectRatio={false}
        >
          {/* 
              Pointer events logic:
              When resizing, disable pointer events on children (iframes) so they don't capture mouse.
          */}
          <div className="w-full h-full overflow-hidden rounded-xl" style={{ pointerEvents: isResizing ? 'none' : 'auto' }}>
            {children}
          </div>

          <DeleteButton onDelete={onDelete} />

          {/* Resize Handle Hint - Visible for better UX */}
          <div className="absolute bottom-0 right-0 w-6 h-6 z-50 cursor-nwse-resize group-hover:bg-slate-700/50 rounded-tl-lg transition-colors" />
        </Resizable>
      </div>
    )
  }

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
      <ResizableWrapper defaultHeight="400px">
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
      <ResizableWrapper defaultHeight="400px">
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
