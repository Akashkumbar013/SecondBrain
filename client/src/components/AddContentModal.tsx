import { useState } from "react"
import { motion } from "framer-motion"
import api from "../services/api"

function AddContentModal({ brains, activeBrain, onClose, onAdded }: any) {
  const [selectedBrainId, setSelectedBrainId] = useState(
    activeBrain?._id || ""
  )
  const [type, setType] = useState("youtube")
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!selectedBrainId) {
      alert("Please select a brain")
      return
    }

    if (!value.trim()) {
      alert("Please enter content")
      return
    }

    try {
      setLoading(true)
      await api.post("/content", {
        type,
        value,
        brainId: selectedBrainId,
      })
      onAdded()
      onClose()
    } catch (err) {
      console.error("Failed to add content", err)
      alert("Failed to add content")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 p-6 rounded-xl w-[380px] text-white"
      >
        <h2 className="text-xl font-bold mb-1">Add Content</h2>

        {/* Brain Indicator */}
        <p className="text-sm text-slate-400 mb-4">
          Adding to:
        </p>

        <select
          value={selectedBrainId}
          onChange={(e) => setSelectedBrainId(e.target.value)}
          className="w-full mb-4 bg-slate-700 p-2 rounded"
        >
          <option value="">Select Brain</option>
          {brains.map((brain: any) => (
            <option key={brain._id} value={brain._id}>
              {brain.title}
            </option>
          ))}
        </select>

        {/* Content Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 bg-slate-700 p-2 rounded"
        >
          <option value="youtube">YouTube</option>
          <option value="tweet">Tweet</option>
          <option value="text">Note</option>
          <option value="link">Link</option>
        </select>

        {/* Content Value */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste link or write note"
          className="w-full mb-4 p-2 rounded bg-slate-700 outline-none"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 bg-slate-600 hover:bg-slate-500 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AddContentModal
