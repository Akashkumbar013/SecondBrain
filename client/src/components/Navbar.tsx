import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ProfileModal from "./ProfileModal"
import api from "../services/api"

type UserType = {
  _id: string
  email?: string
  name?: string
  profilePicture?: string
}

function Navbar({ onAddContent }: { onAddContent?: () => void }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserType | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Load user data
  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Fetch latest data from server
        if (parsedUser._id) {
          const res = await api.get(`/users/${parsedUser._id}`)
          setUser(res.data)
          localStorage.setItem("user", JSON.stringify(res.data))
        }
      }
    } catch (err) {
      console.error("Failed to load user", err)
      setUser(null)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-20 px-8 flex justify-between items-center bg-slate-950/30 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-40"
      >

        {/* Left side */}
        <div className="flex items-center gap-4">
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-6">

          {/* Add Content */}
          {onAddContent && (
            <button
              onClick={onAddContent}
              className="
                  group relative bg-indigo-600 hover:bg-indigo-500 
                  px-5 py-2.5 rounded-xl font-semibold text-sm 
                  transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                  flex items-center gap-2
              "
            >
              <span>+</span>
              <span>Add Content</span>
            </button>
          )}

          {/* Divider */}
          <div className="h-6 w-px bg-slate-700/50" />

          {/* User Profile */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-indigo-500 transition-colors flex items-center justify-center overflow-hidden shadow-inner">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200 leading-none group-hover:text-indigo-400 transition-colors">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none mt-1">
                Free Plan
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Profile Modal */}
      {isProfileOpen && user && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onUpdate={loadUser}
        />
      )}
    </>
  )
}

export default Navbar
