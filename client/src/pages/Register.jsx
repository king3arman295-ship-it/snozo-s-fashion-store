import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const registerUser = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      )

      alert("Account created ✔")

      navigate("/login")

    } catch (err) {

      alert(err.response?.data?.error || "Register failed")

    }

    setLoading(false)

  }

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <form
        onSubmit={registerUser}
        className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
      >

        <h1 className="text-3xl font-bold text-center">
          Register
        </h1>

        <input
          placeholder="Name"
          className="w-full p-3 text-black rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="text-center text-sm">
          Already have account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>

      </form>

    </div>

  )

}