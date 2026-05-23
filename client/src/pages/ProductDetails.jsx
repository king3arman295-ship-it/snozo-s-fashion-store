import { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"
import { API_URL } from "../config"

function ProductDetails() {

  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState([])

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [user, setUser] = useState("")

  const [loading, setLoading] = useState(true)

  const { addToCart } = useContext(CartContext)
  const { wishlist, toggleWishlist } = useContext(WishlistContext)

  useEffect(() => {
    fetchProduct()
    fetchProducts()
  }, [id])

  // =========================
  // SAFE IMAGE HELPER
  // =========================
  const getImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/500"

    if (img.startsWith("http")) {
      return img
    }

    return `${API_URL}${img}`
  }

  // =========================
  // FETCH SINGLE PRODUCT
  // =========================
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`)

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
      const res = await axios.get(`${API_URL}/products`)
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
        `${API_URL}/products/${id}/review`,
        { user, rating, comment }
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

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Product Not Found
      </div>
    )
  }

  const similarProducts = products.filter(
    (p) =>
      p.category === product.category &&
      p._id !== product._id
  )

  const isWishlisted = wishlist.find(
    (item) => item._id === product._id
  )

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10">

      {/* ================= PRODUCT SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="relative group">

          <img
            src={getImageSrc(product.image)}
            alt={product.name}
            className="rounded-3xl w-full h-[520px] object-cover shadow-2xl group-hover:scale-[1.02] transition duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>

          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 bg-black/70 p-3 rounded-full text-xl hover:scale-110 transition"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>

        </div>

        {/* INFO */}
        <div className="flex flex-col justify-center">

          <h1 className="text-5xl font-extrabold mb-3">
            {product.name}
          </h1>

          <p className="text-green-400 text-4xl font-bold mb-4">
            Rs {product.price}
          </p>

          <p className="text-gray-400 leading-7 mb-6">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() => {
                addToCart(product)
                alert("Added To Cart 🛒")
              }}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              Add To Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="border border-white px-8 py-4 rounded-2xl hover:bg-white hover:text-black transition"
            >
              {isWishlisted ? "Remove Wishlist" : "Wishlist"}
            </button>

          </div>

        </div>

      </div>

      {/* ================= REVIEW SECTION ================= */}
      <div className="mt-20">

        <h2 className="text-3xl font-bold mb-6">
          Customer Reviews
        </h2>

        <form
          onSubmit={submitReview}
          className="bg-gray-900 p-6 rounded-3xl space-y-4 mb-10"
        >

          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 bg-black border border-gray-700 rounded-xl"
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-3 bg-black border border-gray-700 rounded-xl"
          >
            <option value={5}>5 ⭐</option>
            <option value={4}>4 ⭐</option>
            <option value={3}>3 ⭐</option>
            <option value={2}>2 ⭐</option>
            <option value={1}>1 ⭐</option>
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 bg-black border border-gray-700 rounded-xl"
          />

          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold">
            Submit Review
          </button>

        </form>

        <div className="space-y-4">

          {(product.reviews || []).length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            product.reviews.map((r, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-2xl">

                <div className="flex justify-between mb-2">
                  <p className="font-bold">{r.user}</p>
                  <p className="text-yellow-400">
                    {"⭐".repeat(r.rating)}
                  </p>
                </div>

                <p className="text-gray-400">
                  {r.comment}
                </p>

              </div>
            ))
          )}

        </div>

      </div>

      {/* ================= SIMILAR PRODUCTS ================= */}
      <div className="mt-24">

        <h2 className="text-3xl font-bold mb-8">
          Similar Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {similarProducts.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="bg-gray-900 rounded-2xl overflow-hidden hover:-translate-y-2 transition"
            >

              <img
                src={getImageSrc(p.image)}
                className="h-52 w-full object-cover"
                alt={p.name}
              />

              <div className="p-3">
                <p className="font-bold">{p.name}</p>
                <p className="text-green-400">Rs {p.price}</p>
              </div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  )
}

export default ProductDetails