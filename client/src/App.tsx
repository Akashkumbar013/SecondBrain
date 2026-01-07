import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Explore from "./pages/Explore"
import AuthSuccess from "./pages/AuthSuccess";
import PublicBrainView from "./pages/PublicBrainView";

function App() {
  return (
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
  )
}

export default App
