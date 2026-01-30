import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import BrainCard from "../components/BrainCard"
import CreateBrainModal from "../components/CreateBrainModal"
import AddContentModal from "../components/AddContentModal"
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

interface Brain {
    _id: string
    title: string
    isPublic?: boolean
    createdAt: string
}

function Dashboard({ filter }: DashboardProps) {
    const { brainId } = useParams()
    const navigate = useNavigate()

    const [brains, setBrains] = useState<Brain[]>([])
    const [loading, setLoading] = useState(true)
    const [activeBrain, setActiveBrain] = useState<Brain | null>(null)

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
            console.log("Fetched brains:", res.data) // Debug: check if isPublic is present
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

    // Original useEffect removed in favor of unified one above

    // Reload when creating content
    const handleContentAdded = () => {
        setShowAddContent(false)
        if (filter) fetchFilteredContent()
        else fetchBrains() // Technically content is inside a brain, so simple fetchBrains doesn't update inside content
        // But if we are in filtered view, we want to refresh.
    }

    // Delete content from filtered view
    // Delete content from filtered view
    const deleteFilteredContent = async (id: string) => {
        try {
            await api.delete(`/content/${id}`)
            setFilteredContent((prev: ContentItem[]) => prev.filter(c => c._id !== id))
        } catch (err) {
            console.error("Failed to delete", err)
        }
    }

    // Effect to handle data fetching based on route/props
    useEffect(() => {
        const loadData = async () => {
            if (filter) {
                // Filter view
                await fetchFilteredContent()
                setActiveBrain(null)
            } else if (brainId) {
                // Specific Brain View
                setLoadingFilter(true)
                try {
                    const res = await api.get(`/content/${brainId}`)
                    setFilteredContent(res.data)

                    // Also need to know which brain it is for the title
                    // Ideally we would fetch brain details, but for now we might look it up in brains list if available
                    // or separate fetch. Let's do a quick fetch of all brains to populate sidebar and find title
                    if (brains.length === 0) await fetchBrains()

                    const currentBrain = brains.find(b => b._id === brainId)
                    if (currentBrain) setActiveBrain(currentBrain)

                } catch (err) {
                    console.error("Failed to load brain content", err)
                } finally {
                    setLoadingFilter(false)
                }
            } else {
                // Default Dashboard (Brains list)
                setActiveBrain(null)
                await fetchBrains()
            }
        }
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, brainId])

    // Dynamic Page Title
    let pageTitle = "Your Brains 🧠"
    if (filter) {
        pageTitle = `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`
    } else if (brainId) {
        const found = brains.find(b => b._id === brainId)
        pageTitle = found ? `${found.title}` : "Brain Content"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

            <div className="flex min-h-screen">

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
                        <h1 className="text-2xl font-bold mb-6">
                            {pageTitle}
                        </h1>

                        {/* CONTENT GRID VIEW (Filtered OR Specific Brain) */}
                        {(filter || brainId) && (
                            <>
                                {loadingFilter && <p className="text-slate-300">Loading content...</p>}
                                {!loadingFilter && filteredContent.length === 0 && (
                                    <p className="text-slate-400">No content found here.</p>
                                )}
                                <div className="flex flex-wrap items-start gap-6">
                                    {filteredContent.map(content => (
                                        <div key={content._id} className="relative group">
                                            <ContentRenderer content={content} onDelete={() => deleteFilteredContent(content._id)} />
                                            {/* Date overlay or subtle display below */}
                                            <div className="absolute -bottom-5 right-1 text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {new Date(content.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* BRAINS LIST VIEW (Default Dashboard only) */}
                        {(!filter && !brainId) && (
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
                <button
                    onClick={() => setShowCreateBrain(true)}
                    className="fixed bottom-6 left-6 z-20 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg font-semibold transition-colors"
                >
                    + Create Brain
                </button>
            )}

            {/* Modals */}
            {showCreateBrain && (
                <CreateBrainModal
                    onClose={() => setShowCreateBrain(false)}
                    onCreated={() => {
                        fetchBrains()
                        // Dispatch event for sidebar to update
                        window.dispatchEvent(new Event('brain-created'))
                    }}
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
