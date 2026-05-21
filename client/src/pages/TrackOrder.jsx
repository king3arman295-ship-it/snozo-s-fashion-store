import { useState } from "react"
import axios from "axios"
import { API_URL } from "../config"

export default function TrackOrder() {

  const [email, setEmail] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const searchOrders = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const res = await axios.get(
        `${API_URL}/orders/user/${email}`
      )

      setOrders(res.data)

    } catch (err) {

      console.log(err)
      alert("No orders found")

    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Track Your Orders
      </h1>

      {/* SEARCH */}
      <form
        onSubmit={searchOrders}
        className="bg-gray-900 p-6 rounded-2xl mb-10"
      >

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded text-black mb-4"
          required
        />

        <button className="bg-white text-black px-6 py-3 rounded font-bold">
          {loading ? "Searching..." : "Track Orders"}
        </button>

      </form>

      {/* ORDERS */}
      <div className="space-y-6">

        {orders.map((o) => (

          <div
            key={o._id}
            className="bg-gray-900 p-6 rounded-2xl"
          >

            <div className="flex justify-between items-center">

              <div>

                <p><b>Order ID:</b> {o._id}</p>
                <p><b>Total:</b> Rs {o.totalPrice}</p>
                <p><b>Payment:</b> {o.paymentMethod}</p>

              </div>

              <div>

                <span className="bg-green-500 px-4 py-2 rounded-full">
                  {o.status}
                </span>

              </div>

            </div>

            {/* ITEMS */}
            <div className="mt-5">

              <h3 className="font-bold mb-2">
                Items
              </h3>

              {o.cartItems?.map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between border-b border-gray-700 py-2"
                >

                  <p>{item.name}</p>

                  <p>
                    {item.quantity} × Rs {item.price}
                  </p>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}