import { Navigate, useLocation } from "react-router-dom"

const AdminRoute = ({ children }) => {

  const token = localStorage.getItem("adminToken")
  const location = useLocation()

  // IMPORTANT: block render immediately
  if (!token) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />
  }

  return children
}

export default AdminRoute