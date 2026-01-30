import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../services/api"

function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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

      localStorage.setItem("token", res.data.token)

      const redirectUrl = searchParams.get("redirect")
      navigate(redirectUrl || "/dashboard")
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account ✨
        </h1>

        <p className="text-center text-gray-400 text-sm mb-8">
          Start building your second brain
        </p>

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
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 outline-none focus:border-indigo-500 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 outline-none focus:border-indigo-500 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 outline-none focus:border-indigo-500 text-white"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold disabled:opacity-60 transition-colors"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-600" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-600" />
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold border border-gray-600 transition-colors"
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
          Continue with Google
        </a>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
