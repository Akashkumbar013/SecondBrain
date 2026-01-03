import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import BrainCard from "../components/BrainCard"
import CreateBrainModal from "../components/CreateBrainModal"
import AddContentModal from "../components/AddContentModal"
import LightPillar from "../components/LightPillar"
import api from "../services/api"

function Dashboard() {
  const [brains, setBrains] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBrain, setActiveBrain] = useState<any>(null)

  const [showCreateBrain, setShowCreateBrain] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)

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
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* 🌑 BASE DARK GRADIENT (IMPORTANT) */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at center, #0b1020 0%, #020617 60%, #000000 100%)",
        }}
      />

      {/* 🌌 LIGHT PILLAR BACKGROUND */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <LightPillar
          topColor="#8B5CF6"
          bottomColor="#3B82F6"
          intensity={1.3}
          rotationSpeed={0.25}
          glowAmount={0.007}
          pillarWidth={3.5}
          pillarHeight={0.55}
          noiseIntensity={0.2}
          interactive={false}
          mixBlendMode="screen"
        />
      </div>

      {/* 🧠 UI LAYER */}
      <div className="relative z-10 flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <Navbar
            onAddContent={() => setShowAddContent(true)}
          />

          {/* Page Content */}
          <div className="p-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold mb-6"
            >
              Your Brains 🧠
            </motion.h1>

            {loading && (
              <p className="text-slate-300">Loading brains...</p>
            )}

            {!loading && brains.length === 0 && (
              <p className="text-slate-400">
                No brains yet. Create your first one 🚀
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
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
      </div>

      {/* Floating Create Brain Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateBrain(true)}
        className="fixed bottom-6 left-6 z-20 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
      >
        + Create Brain
      </motion.button>

      {/* Add Content Button */}


      {/* Modals */}
      {showCreateBrain && (
        <CreateBrainModal
          onClose={() => setShowCreateBrain(false)}
          onCreated={fetchBrains}
        />
      )}

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
