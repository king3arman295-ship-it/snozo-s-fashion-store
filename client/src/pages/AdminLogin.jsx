import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

    // =========================
    // NO FLICKER CHECK
    // =========================
    useEffect(() => {

        const token =
            localStorage.getItem("adminToken")

        if (token) {

            navigate("/admin")

        }

    }, [])

    // =========================
    // LOGIN
    // =========================
    const handleLogin = async (e) => {

        e.preventDefault()

        setLoading(true)

        setError("")

        try {

            const res = await axios.post(

                "http://localhost:5000/api/admin/login",

                {
                    email,
                    password
                }

            )

            // SAVE TOKEN
            localStorage.setItem(
                "adminToken",
                res.data.token
            )

            // SAVE ADMIN
            localStorage.setItem(
                "admin",
                JSON.stringify(res.data.admin)
            )

            // CLEAN REDIRECT
            window.location.href = "/admin"

        } catch (err) {

            console.log(err)

            setError(

                err.response?.data?.message ||

                "Login failed"
            )

        }

        setLoading(false)

    }

    return (

        <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">

            <div className="bg-gray-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border border-gray-700">

                <h1 className="text-4xl font-black text-center mb-8">

                    Admin Login

                </h1>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full p-4 rounded-xl bg-black border border-gray-700 outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full p-4 rounded-xl bg-black border border-gray-700 outline-none"
                        required
                    />

                    {error && (

                        <div className="bg-red-600 p-3 rounded-xl text-center">

                            {error}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-300 transition"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>

            </div>

        </div>

    )
}