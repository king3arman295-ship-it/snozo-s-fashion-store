import { useState, useContext } from "react"
import axios from "axios"
import { CartContext } from "../context/CartContext"

function Checkout() {

  const { cartItems, clearCart } =
    useContext(CartContext)

  const [customerName, setCustomerName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [phone, setPhone] =
    useState("")

  const [address, setAddress] =
    useState("")

  const [paymentMethod, setPaymentMethod] =
    useState("cod")

  const [transactionId, setTransactionId] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState("")

  // =========================
  // SAFE TOTAL CALCULATION
  // =========================
  const totalPrice = cartItems.reduce(

    (acc, item) => {

      const price = Number(
        String(item.price)
          .replace("Rs", "")
          .replace("$", "")
          .trim()
      )

      return acc + (price * item.quantity)

    },

    0

  )

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async (e) => {

    e.preventDefault()

    setLoading(true)

    setMessage("")

    try {

      // =========================
      // ORDER DATA
      // =========================

                    const loggedInUser = JSON.parse(
  localStorage.getItem("user")
)

const orderData = {

  user: loggedInUser?._id,

  customerName:
    customerName ||
    loggedInUser?.name,

  email:
    email ||
    loggedInUser?.email,

  phone,

  address,

  cartItems: cartItems,

  totalPrice,

  paymentMethod,

  transactionId

}
      // =========================
      // SEND ORDER
      // =========================
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      )

      console.log(res.data)

      setMessage("Order placed successfully ✔")

      clearCart()

      // =========================
      // RESET FORM
      // =========================
      setCustomerName("")
      setEmail("")
      setPhone("")
      setAddress("")
      setTransactionId("")
      setPaymentMethod("cod")

    } catch (error) {

      console.log(error)

      setMessage("Order failed ❌")

    }

    setLoading(false)

  }

  return (

    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">

      <div className="bg-gray-900 w-full max-w-2xl p-8 rounded-3xl shadow-2xl border border-gray-700">

        <h1 className="text-5xl font-bold mb-8 text-center">
          Checkout
        </h1>

        <form
          onSubmit={placeOrder}
          className="space-y-5"
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white text-black outline-none"
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white text-black outline-none"
            required
          />

          {/* PHONE */}
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white text-black outline-none"
            required
          />

          {/* ADDRESS */}
          <textarea
            placeholder="Delivery Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white text-black outline-none"
            rows="4"
            required
          />

          {/* PAYMENT METHOD */}
          <div>

            <label className="block mb-2 text-lg font-semibold">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-white text-black outline-none"
            >

              <option value="cod">
                Cash On Delivery
              </option>

              <option value="jazzcash">
                JazzCash
              </option>

              <option value="easypaisa">
                Easypaisa
              </option>

            </select>

          </div>

          {/* JAZZCASH */}
          {paymentMethod === "jazzcash" && (

            <div className="bg-black p-4 rounded-xl border border-green-500">

              <p className="text-green-400 font-bold">
                Send payment to:
              </p>

              <p>
                JazzCash: 03XX-XXXXXXX
              </p>

            </div>

          )}

          {/* EASYPAISA */}
          {paymentMethod === "easypaisa" && (

            <div className="bg-black p-4 rounded-xl border border-green-500">

              <p className="text-green-400 font-bold">
                Send payment to:
              </p>

              <p>
                Easypaisa: 03XX-XXXXXXX
              </p>

            </div>

          )}

          {/* TRANSACTION ID */}
          {paymentMethod !== "cod" && (

            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) =>
                setTransactionId(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-white text-black outline-none"
              required
            />

          )}

          {/* TOTAL */}
          <div className="bg-black p-5 rounded-xl border border-gray-700">

            <h2 className="text-3xl font-bold">

              Total:

              <span className="text-green-400 ml-3">
                Rs {totalPrice}
              </span>

            </h2>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition"
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>

          {/* MESSAGE */}
          {message && (

            <div className="bg-green-500 text-white p-4 rounded-xl text-center">

              {message}

            </div>

          )}

        </form>

      </div>

    </div>

  )

}

export default Checkout