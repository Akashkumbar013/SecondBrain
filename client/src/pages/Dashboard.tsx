import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import BrainCard from "../components/BrainCard"
import CreateBrainModal from "../components/CreateBrainModal"
import AddContentModal from "../components/AddContentModal"
import LightPillar from "../components/LightPillar"
import api from "../services/api"
import ContentRenderer from "../components/ContentRenderer"

interface DashboardProps {
  filter?: "text" | "video" | "tweet" | "link"
}

interface ContentItem {
  _id: string
  type: string
  value: string
  brainId: {
    _id: string
    title: string
  }
  createdAt: string
}

function Dashboard({ filter }: DashboardProps) {
  const [brains, setBrains] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBrain, setActiveBrain] = useState<any>(null)

  // Filtered Content State
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [loadingFilter, setLoadingFilter] = useState(false)

  const [showCreateBrain, setShowCreateBrain] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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

  const fetchFilteredContent = async () => {
    if (!filter) return
    try {
      setLoadingFilter(true)
      // Map 'video' to multiple types if needed (youtube + video)
      let typeQuery = filter
      if (filter === 'video') {
        // Backend might need to handle 'video' to include 'youtube'
        // Or we handle it here by passing ?type=video (and backend handles logic)
        // For now, let's assume 'video' sends 'video'. If backend is strict, we might need adjustments.
        // Let's rely on backend 'getAllUserContent' to handle 'type' strictly for now.
        // If we have 'youtube' type, we need to ask backend to support comma separated or fix backend.
        // FIX: Let's assume most are 'youtube'.
      }

      const res = await api.get(`/content/all?type=${filter}`)
      setFilteredContent(res.data)
    } catch (err) {
      console.error("Failed to fetch filtered content", err)
    } finally {
      setLoadingFilter(false)
    }
  }

  useEffect(() => {
    if (filter) {
      fetchFilteredContent()
    } else {
      fetchBrains()
    }
  }, [filter])

  // Reload when creating content
  const handleContentAdded = () => {
    setShowAddContent(false)
    if (filter) fetchFilteredContent()
    else fetchBrains() // Technically content is inside a brain, so simple fetchBrains doesn't update inside content
    // But if we are in filtered view, we want to refresh.
  }

  // Delete content from filtered view
  const deleteFilteredContent = async (id: string) => {
    try {
      await api.delete(`/content/${id}`)
      setFilteredContent(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      console.error("Failed to delete", err)
    }
  }

  const pageTitle = filter
    ? `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`
    : "Your Brains 🧠"

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
        <Sidebar
          mobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">

          {/* Navbar */}
          <Navbar
            onAddContent={() => setShowAddContent(true)}
            onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Page Content */}
          <div className="p-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold mb-6"
            >
              {pageTitle}
            </motion.h1>

            {/* FILTERED VIEW */}
            {filter && (
              <>
                {loadingFilter && <p className="text-slate-300">Loading {filter}s...</p>}
                {!loadingFilter && filteredContent.length === 0 && (
                  <p className="text-slate-400">No {filter}s found.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredContent.map(content => (
                    <div key={content._id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <ContentRenderer content={content} onDelete={() => deleteFilteredContent(content._id)} />
                      <div className="mt-2 text-xs text-slate-500 text-right">
                        in {content.brainId?.title || 'Unknown Brain'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* BRAINS VIEW (Default) */}
            {!filter && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Create Brain Button - Only show on Dashboard main view */}
      {!filter && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateBrain(true)}
          className="fixed bottom-6 left-6 z-20 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
        >
          + Create Brain
        </motion.button>
      )}

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
          onAdded={handleContentAdded}
        />
      )}
    </div>
  )
}

export default Dashboard
