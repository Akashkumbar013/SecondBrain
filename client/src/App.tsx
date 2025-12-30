import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import BrainPage from "./pages/BrainPage"
import Explore from "./pages/Explore"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/brain/:id" element={<BrainPage />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  )
}

export default App
