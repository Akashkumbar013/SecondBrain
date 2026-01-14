import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation()
    const token = localStorage.getItem("token")

    if (!token) {
        // Redirect to login, preserving the attempted URL
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
