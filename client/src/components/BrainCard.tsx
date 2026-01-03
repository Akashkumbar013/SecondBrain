import { useState } from "react"
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
    <motion.div
      layout
      className={`
        relative overflow-hidden rounded-2xl p-0.5 transition-all duration-300
        ${isActive ? "shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "hover:shadow-lg"}
      `}
    >
      {/* Dynamic Border Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-purple-500/20 to-pink-500/50 opacity-50 ${isActive ? 'opacity-100' : 'group-hover:opacity-80'}`} />

      <div className="relative bg-[#0f111a]/90 backdrop-blur-xl rounded-[15px] h-full overflow-hidden">
        <div
          onClick={toggleOpen}
          className="p-5 flex justify-between items-center cursor-pointer select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
              {brain.title}
            </h3>
          </div>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="text-slate-400 text-xl"
          >
            ▼
          </motion.span>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-slate-700/50 bg-[#0a0c12]/50"
            >
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                  </div>
                )}

                {!loading && contents.length === 0 && (
                  <p className="text-slate-500 text-sm text-center italic">
                    No content captured yet.
                  </p>
                )}

                {contents.map((content) => (
                  <ContentRenderer
                    key={content._id}
                    content={content}
                    onDelete={() => deleteContent(content._id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default BrainCard
