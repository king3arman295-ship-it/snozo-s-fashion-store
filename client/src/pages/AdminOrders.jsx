import { useEffect, useState } from "react"
import axios from "axios"

function AdminOrders() {

  const [orders, setOrders] = useState([])

  useEffect(() => {

    fetchOrders()

  }, [])

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/orders"
      )

      setOrders(res.data)

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        Admin Orders
      </h1>

      {orders.length === 0 ? (

        <p className="text-gray-400">
          No orders found
        </p>

      ) : (

        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-gray-900 p-8 rounded-3xl border border-gray-800"
            >

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    {order.customerName}
                  </h2>

                  <p className="text-gray-400">
                    {order.email}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-green-400 text-2xl font-bold">
                    Rs {order.totalPrice}
                  </p>

                </div>

              </div>

              <div className="mb-5">

                <p>
                  <span className="font-bold">
                    Phone:
                  </span>{" "}
                  {order.phone}
                </p>

                <p className="mt-2">
                  <span className="font-bold">
                    Address:
                  </span>{" "}
                  {order.address}
                </p>

              </div>

              <div>

                <h3 className="text-xl font-bold mb-4">
                  Ordered Items
                </h3>

                <div className="space-y-3">

                  {order.items.map((item, index) => (

                    <div
                      key={index}
                      className="bg-black p-4 rounded-2xl flex justify-between"
                    >

                      <p>
                        {item.name}
                      </p>

                      <p>
                        Qty: {item.quantity}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )
}

export default AdminOrders