import { useContext } from "react"
import { WishlistContext } from "../context/WishlistContext"
import { CartContext } from "../context/CartContext"

export default function Wishlist() {

  const {
    wishlist,
    toggleWishlist
  } = useContext(WishlistContext)

  const { addToCart } =
    useContext(CartContext)

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        Wishlist
      </h1>

      {wishlist.length === 0 ? (

        <p>No wishlist items yet</p>

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          {wishlist.map((product) => (

            <div
              key={product._id}
              className="bg-gray-900 rounded-3xl overflow-hidden"
            >

              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                className="w-full h-72 object-cover"
              />

              <div className="p-5">

                <h2 className="text-2xl font-bold">
                  {product.name}
                </h2>

                <p className="text-green-400 mb-5">
                  Rs {product.price}
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-white text-black py-3 rounded-xl"
                  >
                    Add To Cart
                  </button>

                  <button
                    onClick={() =>
                      toggleWishlist(product)
                    }
                    className="px-4 bg-red-500 rounded-xl"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}