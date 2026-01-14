import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

// Lazy load all pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Explore = lazy(() => import("./pages/Explore"))
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"))
const PublicBrainView = lazy(() => import("./pages/PublicBrainView"))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="text-white text-xl">Loading...</div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brain/:brainId" element={<Dashboard />} />
        <Route path="/notes" element={<Dashboard filter="text" />} />
        <Route path="/videos" element={<Dashboard filter="video" />} />
        <Route path="/tweets" element={<Dashboard filter="tweet" />} />
        <Route path="/links" element={<Dashboard filter="link" />} />
        <Route path="/explore" element={<Explore />} />
        {/* Public brain route - no auth required */}
        <Route path="/public/brain/:brainId" element={<PublicBrainView />} />
      </Routes>
    </Suspense>
  )
}

export default App
