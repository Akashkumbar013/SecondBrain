import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"
import AddContentModal from "../components/AddContentModal"

function BrainPage() {
  const { id } = useParams()
  const [contents, setContents] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)

  const fetchContent = async () => {
    const res = await api.get(`/content/${id}`)
    setContents(res.data)
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => setShowAdd(true)}
        className="bg-indigo-600 px-4 py-2 rounded mb-6"
      >
        + Add Content
      </button>

      {contents.map((c) => (
        <div key={c._id} className="bg-slate-800 p-4 rounded mb-3">
          <p className="text-sm text-slate-400">{c.type}</p>
          <p>{c.value}</p>
        </div>
      ))}

      {showAdd && (
        <AddContentModal
          brainId={id}
          onClose={() => setShowAdd(false)}
          onAdded={fetchContent}
        />
      )}
    </div>
  )
}

export default BrainPage
