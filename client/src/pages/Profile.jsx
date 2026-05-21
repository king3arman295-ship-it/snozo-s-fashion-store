import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../config"

function Profile() {

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async (email) => {
    try {
      const res = await axios.get(`${API_URL}/orders`)

      const userOrders = res.data.filter(
        (order) => order.email === email
      )

      setOrders(userOrders.reverse())

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {

    const loadProfile = async () => {
      try {

        const storedUser = JSON.parse(localStorage.getItem("user"))

        if (!storedUser) {
          setLoading(false)
          return
        }

        setUser(storedUser)
        await fetchOrders(storedUser.email)

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()

    const interval = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      if (storedUser?.email) fetchOrders(storedUser.email)
    }, 3000)

    return () => clearInterval(interval)

  }, [])

  const cancelOrder = async (id) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status: "Cancelled" })
      fetchOrders(user.email)
    } catch (err) {
      console.log(err)
    }
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
        Loading Profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Please login first
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-16">

      {/* USER */}
      <div className="mb-16">
        <h1 className="text-6xl font-black mb-5">My Profile</h1>

        <div className="bg-gray-900 p-6 rounded-3xl max-w-2xl">
          <p className="text-2xl font-bold">{user.name}</p>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* ORDERS */}
      <div>
        <h2 className="text-4xl font-bold mb-8">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-gray-500 text-xl">No orders found</div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => {

              const status = order.status || "Pending"

              return (
                <div key={order._id} className="bg-gray-900 p-6 rounded-3xl">

                  {/* HEADER */}
                  <div className="flex justify-between mb-6">

                    <div>
                      <p className="font-bold text-green-400">
                        Rs {order.totalPrice}
                      </p>

                      <p className="text-sm text-gray-400">
                        {order.paymentMethod}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {order._id}
                      </p>
                    </div>

                    {/* STATUS BADGE */}
                    <div>
                      <span className={`px-4 py-2 rounded-full bg-black border ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>

                  </div>

                  {/* ITEMS */}
                  <div className="space-y-2 mb-5">
                    {order.cartItems?.map((item, i) => (
                      <div key={i} className="flex justify-between bg-black p-3 rounded-xl">
                        <p>{item.name}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* CANCEL */}
                  {status !== "Delivered" && status !== "Cancelled" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-600 px-5 py-2 rounded-xl"
                    >
                      Cancel Order
                    </button>
                  )}

                </div>
              )
            })}

          </div>
        )}
      </div>

    </div>
  )
}

export default Profile