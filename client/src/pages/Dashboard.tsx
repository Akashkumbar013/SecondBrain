import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import BrainCard from "../components/BrainCard"
import CreateBrainModal from "../components/CreateBrainModal"
import AddContentModal from "../components/AddContentModal"
import api from "../services/api"

function Dashboard() {
  const [brains, setBrains] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [activeBrain, setActiveBrain] = useState<any>(null)

  const [showCreateBrain, setShowCreateBrain] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)

  // Fetch all brains
  const fetchBrains = async () => {
    try {
      setLoading(true)
      const res = await api.get("/brains")
      setBrains(res.data)
    } catch (err) {
      console.error("Failed to fetch brains", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrains()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar (shows username + logout) */}
        <Navbar />

        {/* Content */}
        <div className="p-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-6"
          >
            Your Brains 🧠
          </motion.h1>

          {/* Loading */}
          {loading && (
            <p className="text-slate-400">Loading brains...</p>
          )}

          {/* Empty state */}
          {!loading && brains.length === 0 && (
            <p className="text-slate-400">
              No brains yet. Create your first one 🚀
            </p>
          )}

          {/* Brains Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brains.map((brain) => (
              <BrainCard
                key={brain._id}
                brain={brain}
                isActive={activeBrain?._id === brain._id}
                onSelect={() => setActiveBrain(brain)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Create Brain Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateBrain(true)}
        className="fixed bottom-6 left-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
      >
        + Create Brain
      </motion.button>

      {/* Add Content Button (Top Right) */}
      <motion.button
        whileHover={{ scale: 1.07}}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!activeBrain) {
            alert("Please select a brain first")
            return
          }
          setShowAddContent(true)
        }}
        className="fixed top-12 right-5 z-40 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold"
      >
        + Add Content
      </motion.button>

      {/* Create Brain Modal */}
      {showCreateBrain && (
        <CreateBrainModal
          onClose={() => setShowCreateBrain(false)}
          onCreated={fetchBrains}
        />
      )}

      {/* Add Content Modal (NEW SAFE VERSION) */}
      {showAddContent && (
        <AddContentModal
          brains={brains}
          activeBrain={activeBrain}
          onClose={() => setShowAddContent(false)}
          onAdded={() => setShowAddContent(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
