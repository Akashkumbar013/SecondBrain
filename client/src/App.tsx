import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Explore from "./pages/Explore"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Dashboard filter="text" />} />
      <Route path="/videos" element={<Dashboard filter="video" />} />
      <Route path="/tweets" element={<Dashboard filter="tweet" />} />
      <Route path="/links" element={<Dashboard filter="link" />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  )
}

export default App
