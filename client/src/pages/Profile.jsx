import { useEffect, useState } from "react"
import axios from "axios"

function Profile() {

  const [user, setUser] = useState(null)

  const [orders, setOrders] = useState([])

  const [loading, setLoading] = useState(true)

  // =========================
  // FETCH USER ORDERS
  // =========================
  const fetchOrders = async (email) => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/orders"
      )

      const userOrders = res.data.filter(

        (order) =>

          order.email === email

      )

      // NEWEST FIRST
      setOrders(userOrders.reverse())

    } catch (err) {

      console.log(err)

    }
  }

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {

    const loadProfile = async () => {

      try {

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        )

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

    // =========================
    // AUTO REFRESH EVERY 3 SEC
    // =========================
    const interval = setInterval(() => {

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      )

      if (storedUser?.email) {

        fetchOrders(storedUser.email)

      }

    }, 3000)

    return () => clearInterval(interval)

  }, [])

  // =========================
  // CANCEL ORDER
  // =========================
  const cancelOrder = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        {
          status: "Cancelled"
        }
      )

      // REFRESH
      fetchOrders(user.email)

    } catch (err) {

      console.log(err)

    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading Profile...

      </div>

    )
  }

  // =========================
  // NO USER
  // =========================
  if (!user) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Please login first

      </div>

    )
  }

  return (

    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-16">

      {/* USER INFO */}
      <div className="mb-16">

        <h1 className="text-6xl font-black mb-5">
          My Profile
        </h1>

        <div className="bg-gray-900 p-6 rounded-3xl max-w-2xl">

          <p className="text-2xl font-bold mb-3">
            {user.name}
          </p>

          <p className="text-gray-400 mb-2">
            {user.email}
          </p>

        </div>

      </div>

      {/* ORDERS */}
      <div>

        <h2 className="text-4xl font-bold mb-8">
          My Orders
        </h2>

        {orders.length === 0 ? (

          <div className="text-gray-500 text-xl">
            No orders found
          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-gray-900 p-6 rounded-3xl"
              >

                {/* ORDER HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-6">

                  <div>

                    <p className="text-lg mb-2">
                      <span className="font-bold">
                        Total:
                      </span>
                      {" "}
                      <span className="text-green-400">
                        Rs {order.totalPrice}
                      </span>
                    </p>

                    <p className="text-lg mb-2">
                      <span className="font-bold">
                        Payment:
                      </span>
                      {" "}
                      {order.paymentMethod}
                    </p>

                    <p className="text-sm text-gray-500">
                      Order ID:
                      {" "}
                      {order._id}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div>

                    <p className="text-lg">

                      <span className="font-bold">
                        Status:
                      </span>

                      {" "}

                      <span
                        className={`font-bold
                          ${
                            order.status === "Pending"
                              ? "text-yellow-400"
                              : ""
                          }

                          ${
                            order.status === "Confirmed"
                              ? "text-blue-400"
                              : ""
                          }

                          ${
                            order.status === "Shipped"
                              ? "text-indigo-400"
                              : ""
                          }

                          ${
                            order.status === "Delivered"
                              ? "text-green-400"
                              : ""
                          }

                          ${
                            order.status === "Cancelled"
                              ? "text-red-400"
                              : ""
                          }
                        `}
                      >
                        {order.status}
                      </span>

                    </p>

                  </div>

                </div>

                {/* ITEMS */}
                <div className="space-y-3 mb-6">

                  {order.cartItems?.map((item, i) => (

                    <div
                      key={i}
                      className="flex justify-between bg-black p-4 rounded-xl"
                    >

                      <div>

                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <p className="text-green-400">
                        Rs {item.price}
                      </p>

                    </div>

                  ))}

                </div>

                {/* BUTTON */}
                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (

                  <button
                    onClick={() =>
                      cancelOrder(order._id)
                    }
                    className="bg-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                  >
                    Cancel Order
                  </button>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}

export default Profile