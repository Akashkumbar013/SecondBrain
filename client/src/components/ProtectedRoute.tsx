import { type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { auth } from "../utils/auth"

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation()

    // Check if user is authenticated using cookies
    if (!auth.isAuthenticated()) {
        // Clear any invalid/partial auth data
        auth.clearAuth()

        // Redirect to login, preserving the attempted URL
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
