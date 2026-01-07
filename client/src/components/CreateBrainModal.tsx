import { useState } from "react"
import api from "../services/api"

function CreateBrainModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Enter brain name")
      return
    }

    try {
      setLoading(true)
      await api.post("/brains", { title, isPublic })
      onCreated()
      onClose()
    } catch (err) {
      console.error("Create brain failed", err)
      alert("Failed to create brain")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-[400px] text-white">
        <h2 className="text-xl font-bold mb-4">
          Create New Brain 🧠
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brain name (e.g. Web Dev, DSA)"
          className="w-full p-2 mb-4 rounded bg-slate-700"
        />

        {/* Privacy Toggle */}
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isPublic ? "🌐" : "🔒"}</span>
              <span className="font-medium">{isPublic ? "Public" : "Private"}</span>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? "bg-indigo-600" : "bg-slate-600"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {isPublic
              ? "Anyone with the link can view this brain"
              : "Only you can access this brain"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 px-4 py-2 rounded hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 bg-indigo-600 px-4 py-2 rounded disabled:opacity-50 hover:bg-indigo-500 transition-colors"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateBrainModal
