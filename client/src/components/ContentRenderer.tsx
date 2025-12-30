import { useEffect, useRef } from "react"

declare global {
  interface Window {
    twttr?: any
  }
}

/* ---------- YouTube helper ---------- */
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

function ContentRenderer({
  content,
  onDelete,
}: {
  content: any
  onDelete: () => void
}) {
  const tweetRef = useRef<HTMLDivElement | null>(null)
  const renderedRef = useRef(false) // 👈 prevents double embed

  /* ---------- TWITTER / X ---------- */
  useEffect(() => {
    if (content.type !== "tweet") return
    if (!tweetRef.current) return
    if (renderedRef.current) return // 👈 STOP duplicate render

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

  /* ---------- YOUTUBE ---------- */
  if (content.type === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(content.value)
    if (!embedUrl) return <p className="text-red-400">Invalid YouTube link</p>

    return (
      <div className="relative group">
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-lg"
          allowFullScreen
        />

        <DeleteButton onDelete={onDelete} />
      </div>
    )
  }

  /* ---------- TWEET ---------- */
  if (content.type === "tweet") {
    return (
      <div className="relative group bg-slate-900 rounded-xl p-3">
        <div
          ref={tweetRef}
          className="flex justify-center"
        />

        <DeleteButton onDelete={onDelete} />
      </div>
    )
  }

  /* ---------- LINK ---------- */
  if (content.type === "link") {
    return (
      <div className="relative group">
        <a
          href={content.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline break-all"
        >
          {content.value}
        </a>

        <DeleteButton onDelete={onDelete} />
      </div>
    )
  }

  /* ---------- NOTE ---------- */
  return (
    <div className="relative group bg-slate-800 rounded-lg p-3">
      <p className="text-slate-300 whitespace-pre-wrap">
        {content.value}
      </p>

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
        text-xs bg-red-600 hover:bg-red-700
        px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        transition
      "
    >
      Delete
    </button>
  )
}

export default ContentRenderer
