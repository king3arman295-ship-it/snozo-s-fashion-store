import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { API_URL } from "../config"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const loginUser = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { email, password }
      )

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      )

      localStorage.setItem("token", res.data.token)

      alert("Login successful ✔")
      navigate("/profile")

    } catch (err) {
      alert(err.response?.data?.message || "Login failed")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <form
        onSubmit={loginUser}
        className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
      >

        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          placeholder="Email"
          className="w-full p-3 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-white text-black p-3 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>

      </form>
    </div>
  )
}