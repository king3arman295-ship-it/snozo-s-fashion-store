import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../config"

function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`)
      setOrders(res.data)
    } catch (err) {
      setError("Failed to load orders ❌")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/orders/${id}`, { status })
    fetchOrders()
  }

  const deleteOrder = async (id) => {
    await axios.delete(`${API_URL}/orders/${id}`)
    fetchOrders()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "text-blue-400"
      case "Shipped": return "text-indigo-400"
      case "Delivered": return "text-green-400"
      case "Cancelled": return "text-red-400"
      default: return "text-yellow-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Orders...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">Admin Orders</h1>

      {orders.map((o) => {

        const status = o.status || "Pending"

        return (
          <div key={o._id} className="bg-gray-900 p-6 rounded-2xl mb-6">

            <div className="flex justify-between mb-4">

              <div>
                <p className="font-bold">{o.customerName}</p>
                <p className="text-gray-400">{o.email}</p>
              </div>

              <span className={`px-4 py-1 rounded-full border ${getStatusColor(status)}`}>
                {status}
              </span>

            </div>

            <p className="text-green-400 mb-4">Rs {o.totalPrice}</p>

            {/* ACTIONS */}
            <div className="flex gap-3 flex-wrap">

              <button onClick={() => updateStatus(o._id, "Confirmed")} className="bg-blue-600 px-3 py-1 rounded">
                Confirm
              </button>

              <button onClick={() => updateStatus(o._id, "Shipped")} className="bg-indigo-600 px-3 py-1 rounded">
                Ship
              </button>

              <button onClick={() => updateStatus(o._id, "Delivered")} className="bg-green-600 px-3 py-1 rounded">
                Deliver
              </button>

              <button onClick={() => updateStatus(o._id, "Cancelled")} className="bg-orange-600 px-3 py-1 rounded">
                Cancel
              </button>

              <button onClick={() => deleteOrder(o._id)} className="bg-red-600 px-3 py-1 rounded">
                Delete
              </button>

            </div>

          </div>
        )
      })}

    </div>
  )
}

export default AdminOrders