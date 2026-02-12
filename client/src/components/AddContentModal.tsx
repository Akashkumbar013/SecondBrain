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
          <option value="tweet">tweet</option>
          <option value="video">Video (File/Link)</option>
          <option value="image">Image</option>
          <option value="instagram">Instagram</option>
          <option value="pdf">PDF</option>
          <option value="doc">Doc / Word</option>
          <option value="text">Note</option>
          <option value="link">Link</option>
        </select>

        {/* Content Value or Upload */}
        {["image", "video", "pdf", "doc"].includes(type) ? (
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setValue("")}
                className={`text-xs px-2 py-1 rounded ${!value || value.startsWith("http") ? "bg-indigo-600" : "bg-slate-700"}`}
              >
                Upload File
              </button>
              <button
                onClick={() => setValue("")}
                className={`text-xs px-2 py-1 rounded ${value && !value.startsWith("http") ? "bg-indigo-600" : "bg-slate-700"} opacity-50 cursor-not-allowed`}
              >
                Or Paste Link (Below)
              </button>
            </div>

            <input
              type="file"
              accept={
                type === "image" ? "image/*" :
                  type === "video" ? "video/*" :
                    type === "pdf" ? "application/pdf" :
                      ".doc,.docx,application/msword"
              }
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return

                const formData = new FormData()
                formData.append("file", file)

                try {
                  setLoading(true)
                  const res = await api.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                  })
                  // Handle both old and new response formats
                  const url = res.data.url || res.data.data?.url
                  if (url) {
                    setValue(url)
                  } else {
                    throw new Error("No URL returned from server")
                  }
                } catch (err: any) {
                  console.error("Upload failed", err)
                  const errorMsg = err.response?.data?.message || "Upload failed. Please try again."
                  alert(errorMsg)
                } finally {
                  setLoading(false)
                }
              }}
              className="w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700
                    cursor-pointer bg-slate-700 rounded p-2
                  "
            />
            {value && (
              <p className="text-xs text-green-400 mt-1 truncate">
                Uploaded: {value.split('/').pop()}
              </p>
            )}
          </div>
        ) : null}

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            type === "youtube" ? "Paste YouTube Link" :
              type === "tweet" ? "Paste Tweet Link" :
                type === "instagram" ? "Paste Instagram Link" :
                  "Paste link or write note"
          }
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
