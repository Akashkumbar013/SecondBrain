import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../services/api"
import ContentRenderer from "./ContentRenderer"

interface Brain {
  _id: string
  title: string
}

interface BrainCardProps {
  brain: Brain
  isActive: boolean
  onSelect: () => void
}

function BrainCard({ brain, isActive, onSelect }: BrainCardProps) {
  const [open, setOpen] = useState(false)
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch contents only when expanded
  const fetchContents = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/content/${brain._id}`)
      setContents(res.data)
    } catch (err) {
      console.error("Failed to fetch contents", err)
    } finally {
      setLoading(false)
    }
  }

  // Toggle open + select brain
  const toggleOpen = () => {
    onSelect()

    if (!open && contents.length === 0) {
      fetchContents()
    }

    setOpen((prev) => !prev)
  }

  // Delete content
  const deleteContent = async (contentId: string) => {
    try {
      await api.delete(`/content/${contentId}`)
      setContents((prev) => prev.filter((c) => c._id !== contentId))
    } catch (err) {
      console.error("Failed to delete content", err)
      alert("Failed to delete content")
    }
  }

  return (
    <div
      className={`
        bg-slate-800 rounded-xl p-4 transition-all cursor-pointer
        ${isActive ? "ring-2 ring-indigo-500" : "hover:bg-slate-700"}
      `}
    >
      {/* Header */}
      <div
        onClick={toggleOpen}
        className="flex justify-between items-center select-none"
      >
        <h3 className="text-lg font-semibold text-white">
          {brain.title}
        </h3>
        <span className="text-slate-400 text-xl">
          {open ? "−" : "+"}
        </span>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {loading && (
              <p className="text-slate-400 text-sm">Loading...</p>
            )}

            {!loading && contents.length === 0 && (
              <p className="text-slate-400 text-sm">
                No content added yet
              </p>
            )}

            {contents.map((content) => (
              <ContentRenderer
                key={content._id}
                content={content}
                onDelete={() => deleteContent(content._id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BrainCard
