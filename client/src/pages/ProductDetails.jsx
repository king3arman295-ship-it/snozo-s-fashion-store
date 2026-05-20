import { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"

function ProductDetails() {

  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState([])

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [user, setUser] = useState("")

  const [loading, setLoading] = useState(true)

  const { addToCart } = useContext(CartContext)

  const {
    wishlist,
    toggleWishlist
  } = useContext(WishlistContext)

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchProduct()
    fetchProducts()

  }, [id])

  // =========================
  // FETCH SINGLE PRODUCT
  // =========================
  const fetchProduct = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/products"
      )

      const foundProduct = res.data.find(
        (item) => item._id === id
      )

      setProduct(foundProduct)

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)

    }

  }

  // =========================
  // FETCH ALL PRODUCTS
  // =========================
  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/products"
      )

      setProducts(res.data)

    } catch (err) {

      console.log(err)

    }

  }

  // =========================
  // SUBMIT REVIEW
  // =========================
  const submitReview = async (e) => {

    e.preventDefault()

    try {

      await axios.post(
        `http://localhost:5000/api/products/${id}/review`,
        {
          user,
          rating,
          comment
        }
      )

      setComment("")
      setUser("")
      setRating(5)

      fetchProduct()

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

        Loading Product...

      </div>

    )

  }

  // =========================
  // NOT FOUND
  // =========================
  if (!product) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Product Not Found

      </div>

    )

  }

  // =========================
  // SIMILAR PRODUCTS
  // =========================
  const similarProducts = products.filter(

    (p) =>
      p.category === product.category &&
      p._id !== product._id

  )

  // =========================
  // WISHLIST
  // =========================
  const isWishlisted = wishlist.find(
    (item) => item._id === product._id
  )

  // =========================
  // UI
  // =========================
  return (

    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10">

      {/* PRODUCT SECTION */}
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* IMAGE */}
        <div className="relative">

          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="rounded-3xl w-full h-[500px] object-cover"
          />

          {/* WISHLIST */}
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 bg-black/70 p-3 rounded-full text-2xl"
          >

            {isWishlisted ? "❤️" : "🤍"}

          </button>

        </div>

        {/* INFO */}
        <div>

          <p className="uppercase tracking-widest text-gray-500 mb-3">

            {product.category}

          </p>

          <h1 className="text-4xl md:text-5xl font-black mb-4">

            {product.name}

          </h1>

          <p className="text-green-400 text-3xl font-bold mb-5">

            Rs {product.price}

          </p>

          {/* RATING */}
          <div className="flex items-center gap-3 mb-6">

            <div className="text-yellow-400 text-2xl">

              {"⭐".repeat(
                Math.round(product.averageRating || 0)
              )}

            </div>

            <span className="text-gray-400">

              ({product.averageRating?.toFixed(1) || "0.0"})

            </span>

          </div>

          <p className="text-gray-400 leading-8 mb-8">

            {product.description}

          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() => {
                addToCart(product)
                alert("Added To Cart 🛒")
              }}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 duration-300"
            >

              Add To Cart

            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="border border-white px-8 py-4 rounded-2xl hover:bg-white hover:text-black duration-300"
            >

              {isWishlisted
                ? "Remove Wishlist"
                : "Add Wishlist"}

            </button>

          </div>

        </div>

      </div>

      {/* REVIEW SECTION */}
      <div className="mt-20">

        <h2 className="text-3xl font-bold mb-8">

          Customer Reviews

        </h2>

        {/* REVIEW FORM */}
        <form
          onSubmit={submitReview}
          className="bg-gray-900 p-6 rounded-3xl mb-10 space-y-4"
        >

          <input
            type="text"
            placeholder="Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-4 rounded-xl bg-black border border-gray-700"
          />

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-4 rounded-xl bg-black border border-gray-700"
          >

            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>

          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 rounded-xl bg-black border border-gray-700"
          />

          <button className="bg-white text-black px-8 py-3 rounded-xl font-bold">

            Submit Review

          </button>

        </form>

        {/* REVIEW LIST */}
        <div className="space-y-5">

          {product.reviews?.map((r, i) => (

            <div
              key={i}
              className="bg-gray-900 p-5 rounded-2xl"
            >

              <div className="flex justify-between mb-3">

                <h3 className="font-bold">
                  {r.user}
                </h3>

                <div className="text-yellow-400">

                  {"⭐".repeat(r.rating)}

                </div>

              </div>

              <p className="text-gray-400">
                {r.comment}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* SIMILAR PRODUCTS */}
      <div className="mt-24">

        <h2 className="text-3xl font-bold mb-8">

          Similar Products

        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {similarProducts.map((p) => (

            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="bg-gray-900 rounded-3xl overflow-hidden hover:-translate-y-2 duration-300"
            >

              <img
                src={`http://localhost:5000${p.image}`}
                alt={p.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-4">

                <h3 className="text-xl font-bold mb-2">
                  {p.name}
                </h3>

                <p className="text-green-400">
                  Rs {p.price}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>

  )

}

export default ProductDetails