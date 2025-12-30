import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      })

      // Save JWT
      localStorage.setItem("token", res.data.token)

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account ✨
        </h1>

        <p className="text-center text-slate-300 text-sm mb-8">
          Start building your second brain
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-600 outline-none focus:border-indigo-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-600 outline-none focus:border-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-600 outline-none focus:border-indigo-500"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </motion.button>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
