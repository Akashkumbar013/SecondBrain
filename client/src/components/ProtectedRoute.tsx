import { type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation()
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    // Check if both token and user data exist
    if (!token || !userStr) {
        // Clear any partial data
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // Redirect to login, preserving the attempted URL
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    // Try to parse user data to ensure it's valid
    try {
        const user = JSON.parse(userStr)
        if (!user || !user.id) {
            // Invalid user data, clear and redirect
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
        }
    } catch (error) {
        // Failed to parse user data, clear and redirect
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
