import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import api from "../services/api"
import ContentRenderer from "../components/ContentRenderer"
import LightPillar from "../components/LightPillar"

interface Brain {
    _id: string
    title: string
    userId: {
        name: string
        email: string
    }
    createdAt: string
}

interface ContentItem {
    _id: string
    type: string
    value: string
    createdAt: string
}

function PublicBrainView() {
    const { brainId } = useParams()
    const [brain, setBrain] = useState<Brain | null>(null)
    const [content, setContent] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchPublicBrain = async () => {
            try {
                setLoading(true)

                // Fetch brain info
                const brainRes = await api.get(`/brains/public/${brainId}`)
                setBrain(brainRes.data)

                // Fetch content
                const contentRes = await api.get(`/content/public/${brainId}`)
                setContent(contentRes.data)
            } catch (err: any) {
                console.error("Failed to fetch public brain:", err)
                setError(err.response?.data?.message || "Failed to load public brain")
            } finally {
                setLoading(false)
            }
        }

        if (brainId) {
            fetchPublicBrain()
        }
    }, [brainId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p>Loading brain...</p>
                </div>
            </div>
        )
    }

    if (error || !brain) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">🔒 {error || "Brain not found"}</p>
                    <p className="text-slate-400">This brain is either private or doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(circle at center, #0b1020 0%, #020617 60%, #000000 100%)",
                }}
            />

            {/* Light Pillar */}
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

            {/* Content */}
            <div className="relative z-10 min-h-screen">
                <div className="max-w-6xl mx-auto p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🌐</span>
                                        <h1 className="text-3xl font-bold">{brain.title}</h1>
                                    </div>
                                    <p className="text-slate-400">
                                        Shared by {brain.userId.name || brain.userId.email}
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Created {new Date(brain.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                                    Public Brain
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Content ({content.length})</h2>

                        {content.length === 0 ? (
                            <p className="text-slate-400 text-center py-12">
                                This brain doesn't have any content yet.
                            </p>
                        ) : (
                            <div className="flex flex-wrap items-start gap-6">
                                {content.map((item) => (
                                    <div key={item._id} className="relative group">
                                        <ContentRenderer
                                            content={item}
                                            onDelete={() => { }} // No delete for public view
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicBrainView
