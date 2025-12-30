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
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Enter brain name")
      return
    }

    try {
      setLoading(true)
      await api.post("/brains", { title })
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
      <div className="bg-slate-800 p-6 rounded-xl w-[360px] text-white">
        <h2 className="text-xl font-bold mb-4">
          Create New Brain 🧠
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brain name (e.g. Web Dev, DSA)"
          className="w-full p-2 mb-4 rounded bg-slate-700"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 bg-indigo-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateBrainModal
