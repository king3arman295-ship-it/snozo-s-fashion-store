import { Navigate } from "react-router-dom"

export default function AdminProtectedRoute({ children }) {

    const token = localStorage.getItem("adminToken")

    // IMPORTANT: show nothing until check is done (prevents flicker)
    if (token === null) {
        return <Navigate to="/admin-login" replace />
    }

    return children
}