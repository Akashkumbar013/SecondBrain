import { useState, useRef } from "react"
import { motion } from "framer-motion"
import api from "../services/api"

interface ProfileModalProps {
    user: any
    onClose: () => void
    onUpdate: () => void
}

function ProfileModal({ user, onClose, onUpdate }: ProfileModalProps) {
    const [activeTab, setActiveTab] = useState("details") // details | edit
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        try {
            setUploading(true)
            // 1. Upload File
            const uploadRes = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            const photoUrl = uploadRes.data.url

            // 2. Update User Profile
            await api.put(`/users/${user._id}`, {
                profilePicture: photoUrl,
            })

            // 3. Refresh
            onUpdate()
        } catch (err) {
            console.error("Failed to upload profile picture", err)
            alert("Failed to update profile picture")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1f2e] border border-slate-700/50 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8 -mt-16 flex flex-col items-center">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-[#1a1f2e] bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Edit Overlay */}
                        <div
                            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center text-white text-xs font-semibold">
                                <span className="text-xl mb-1">📷</span>
                                <span>Change</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </div>

                    {/* User Info */}
                    <div className="text-center mt-4">
                        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                        <p className="text-slate-400 text-sm mb-4">{user.email}</p>

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            <span>Free Plan</span>
                        </div>
                    </div>

                    {/* Status */}
                    {uploading && (
                        <p className="mt-4 text-indigo-400 text-sm animate-pulse">Uploading...</p>
                    )}

                </div>
            </motion.div>
        </div>
    )
}

export default ProfileModal
