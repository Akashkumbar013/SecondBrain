import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import LightPillar from "../components/LightPillar"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/login", {
        email,
        password,
      })

      // Save JWT
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-indigo-500/30 flex items-center justify-center">

      {/* 🌑 BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1f35] via-[#020617] to-black opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* 🌌 LIGHT PILLAR */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-50">
        <LightPillar
          topColor="#6366f1"
          bottomColor="#000000"
          intensity={1}
          rotationSpeed={0.1}
          glowAmount={0.005}
          pillarWidth={4}
          pillarHeight={0.6}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[380px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Second Brain 🧠
        </h1>

        <p className="text-center text-slate-300 text-sm mb-8">
          Organize what you learn. Remember forever.
        </p>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

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
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <div className="my-4 flex items-center gap-2 opacity-50">
          <div className="h-px flex-1 bg-slate-600" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-600" />
        </div>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-2 rounded-lg font-semibold border border-white/10 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </motion.a>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
