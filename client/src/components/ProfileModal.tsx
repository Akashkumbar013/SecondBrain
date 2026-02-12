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
            // Handle both old and new response formats
            const photoUrl = uploadRes.data.url || uploadRes.data.data?.url

            if (!photoUrl) {
                throw new Error("No URL returned from server")
            }

            // 2. Update User Profile
            await api.put(`/users/${user._id}`, {
                profilePicture: photoUrl,
            })

            // 3. Refresh
            onUpdate()
        } catch (err: any) {
            console.error("Failed to upload profile picture", err)
            const errorMsg = err.response?.data?.message || "Failed to update profile picture. Please try again."
            alert(errorMsg)
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

                {/* Delete Account Button */}
                <div className="px-8 pb-6 w-full flex justify-center">
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                try {
                                    await api.delete(`/users/${user._id}`)
                                    localStorage.removeItem("token")
                                    localStorage.removeItem("user")
                                    window.location.href = "/login"
                                } catch (error) {
                                    console.error(error)
                                    alert("Failed to delete account")
                                }
                            }
                        }}
                        className="text-red-500 hover:text-red-400 text-sm font-medium hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete Account
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default ProfileModal
