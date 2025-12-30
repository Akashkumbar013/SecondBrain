import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type UserType = {
  email?: string
  name?: string
}

function Navbar({ onAddContent }: { onAddContent?: () => void }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserType | null>(null)

  // Load user safely from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err)
      setUser(null)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="h-14 px-6 flex justify-between items-center border-b border-slate-700 bg-slate-900">
      
      {/* Left side (reserved for future breadcrumbs / title) */}
      <div />

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        
        {/* Add Content */}
        {onAddContent && (
          <button
            onClick={onAddContent}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold text-sm whitespace-nowrap"
          >
            + Add Content
          </button>
        )}

        {/* User Display */}
        <span className="text-slate-300 text-sm whitespace-nowrap">
          👋 {user?.email || user?.name || "User"}
        </span>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar
