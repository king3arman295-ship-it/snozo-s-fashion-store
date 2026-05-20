import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

function Cart() {

  const navigate = useNavigate()

 const {
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} = useContext(CartContext)

  // =========================
  // TOTAL PRICE
  // =========================
  const totalPrice = cartItems.reduce(
    (total, item) => {

      const price = Number(
        String(item.price)
          .replace("Rs", "")
          .replace("$", "")
          .trim()
      )

      return total + (price * item.quantity)

    },
    0
  )

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (

        <div className="bg-gray-900 p-10 rounded-3xl text-center">
          <p className="text-2xl text-gray-400">
            Cart is empty
          </p>
        </div>

      ) : (

        <div className="space-y-6">

          {cartItems.map((item) => (

            <div
              key={item._id}
              className="bg-gray-900 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6"
            >

              {/* PRODUCT INFO */}
              <div className="flex items-center gap-6">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-2xl"
                />

                <div>
                  <h2 className="text-2xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Rs {item.price}
                  </p>
                </div>

              </div>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-4">

                <button
                 onClick={() => decreaseQuantity(item._id)}
                  className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full text-xl"
                >
                  -
                </button>

                <span className="text-2xl font-bold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full text-xl"
                >
                  +
                </button>

              </div>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl"
              >
                Remove
              </button>

            </div>

          ))}

          {/* TOTAL SECTION */}
          <div className="bg-white text-black p-8 rounded-3xl mt-10">

            <h2 className="text-4xl font-bold">
              Total:
              <span className="ml-3 text-green-600">
                Rs {totalPrice}
              </span>
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 bg-black text-white px-10 py-4 rounded-full text-lg hover:bg-gray-800 transition"
            >
              Proceed To Checkout
            </button>

          </div>

        </div>

      )}

    </div>

  )
}

export default Cart