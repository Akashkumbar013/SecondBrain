import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import ShareBrainModal from "./ShareBrainModal"
import api from "../services/api"

interface Brain {
    _id: string
    title: string
    isPublic?: boolean
}

interface BrainCardProps {
    brain: Brain
    isActive: boolean
    onSelect: () => void
    onDelete?: () => void
}

function BrainCard({ brain, isActive, onSelect, onDelete }: BrainCardProps) {
    const navigate = useNavigate()
    const [showShareModal, setShowShareModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleClick = () => {
        onSelect()
        navigate(`/brain/${brain._id}`)
    }

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowShareModal(true)
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            setDeleting(true)
            await api.delete(`/brains/${brain._id}`)
            setShowDeleteConfirm(false)

            // Trigger refresh
            if (onDelete) {
                onDelete()
            } else {
                // Fallback: dispatch event for parent components to listen
                window.dispatchEvent(new Event('brain-deleted'))
                navigate('/dashboard')
            }
        } catch (err) {
            console.error("Failed to delete brain:", err)
            alert("Failed to delete brain")
        } finally {
            setDeleting(false)
        }
    }

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDeleteConfirm(false)
    }

    return (
        <>
            <motion.div
                layout
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                className={`
                    group relative overflow-hidden rounded-xl cursor-pointer w-full
                    transition-all duration-300
                    ${isActive ? "ring-1 ring-indigo-500 bg-black" : "hover:bg-black/80"}
                `}
            >
                {/* Main Card Background - Pure Black / Very Dark */}
                <div className={`
                    bg-black/60 backdrop-blur-sm border border-white/10 
                    rounded-xl p-4 h-full flex items-center justify-between
                    group-hover:border-white/20 transition-colors
                `}>
                    <div className="flex items-center gap-3">
                        {/* Blue Dot */}
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />

                        <h3 className="text-base font-medium text-slate-200 group-hover:text-white transition-colors capitalize">
                            {brain.title}
                        </h3>

                        {/* Privacy Badge */}
                        <span className="text-xs opacity-60">
                            {brain.isPublic ? "🌐" : "🔒"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Share Button for Public Brains */}
                        {brain.isPublic && (
                            <button
                                onClick={handleShare}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded"
                                title="Share this brain"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                            </button>
                        )}

                        {/* Delete Button */}
                        <button
                            onClick={handleDeleteClick}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/20 rounded"
                            title="Delete this brain"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>

                        {/* Down Arrow / Chevron */}
                        <div className="text-slate-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Share Modal */}
            {showShareModal && (
                <ShareBrainModal
                    brainId={brain._id}
                    brainTitle={brain.title}
                    onClose={() => setShowShareModal(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={handleCancelDelete}>
                    <div className="bg-slate-800 p-6 rounded-xl w-[400px] text-white" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>⚠️</span>
                            Delete Brain?
                        </h2>

                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete <span className="font-bold text-white">"{brain.title}"</span>?
                            <br /><br />
                            <span className="text-red-400 font-medium">This will also delete all content within this brain.</span>
                            <br />
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCancelDelete}
                                disabled={deleting}
                                className="flex-1 bg-slate-600 px-4 py-2 rounded hover:bg-slate-500 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-colors disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default BrainCard
