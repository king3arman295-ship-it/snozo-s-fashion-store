import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"
import { Link } from "react-router-dom"

function Shop() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")

    // 🛒 CART
    const { addToCart } = useContext(CartContext)

    // ❤️ WISHLIST
    const { wishlist, toggleWishlist } = useContext(WishlistContext)

    // FETCH PRODUCTS
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products")
            setProducts(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // CATEGORIES
    const categories = [
        "all",
        ...new Set(products.map((p) => p.category))
    ]

    // FILTER PRODUCTS
    const filtered = products.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase())

        const matchCategory =
            category === "all" || p.category === category

        return matchSearch && matchCategory
    })

    // LOADING UI
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl animate-pulse tracking-widest">
                    Loading Premium Collection...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 md:px-8 py-8">

            {/* HEADER */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-6xl font-black tracking-widest">
                    SHOP COLLECTION
                </h1>
                <p className="text-gray-400 text-sm md:text-lg mt-2">
                    Premium Fashion • Streetwear • Modern Style
                </p>
            </div>

            {/* SEARCH */}
            <div className="flex justify-center mb-6 sticky top-0 z-10 bg-black py-3">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-[500px] p-3 rounded-xl bg-gray-900 border border-gray-700 outline-none focus:border-white transition"
                />
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex gap-2 overflow-x-auto justify-start md:justify-center mb-10 px-2">
                {categories.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-full capitalize text-sm md:text-base transition whitespace-nowrap ${
                            category === c
                                ? "bg-white text-black scale-105"
                                : "bg-gray-900 hover:bg-gray-800"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

                {filtered.map((product) => {

                    const isWishlisted = wishlist.find(
                        (item) => item._id === product._id
                    )

                    return (
                        <div
                            key={product._id}
                            className="bg-gray-900 rounded-2xl overflow-hidden group relative shadow-lg hover:shadow-white/10 hover:-translate-y-2 transition duration-300"
                        >

                            {/* ❤️ WISHLIST */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md p-2 rounded-full hover:scale-125 transition duration-300"
                            >
                                {isWishlisted ? "❤️" : "🤍"}
                            </button>

                            {/* IMAGE */}
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={`http://localhost:5000/uploads/${product.image}`}
                                    alt={product.name}
                                    className="h-64 md:h-80 w-full object-cover group-hover:scale-105 transition duration-500"
                                />
                            </Link>

                            {/* INFO */}
                            <div className="p-5">

                                <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">
                                    {product.category}
                                </p>

                                <h2 className="text-2xl font-bold mb-2">
                                    {product.name}
                                </h2>

                                <p className="text-green-400 text-xl font-semibold">
                                    Rs {product.price}
                                </p>

                                {/* RATING */}
                                <div className="flex items-center gap-2 mb-4 mt-2">
                                    <div className="text-yellow-400 text-lg">
                                        {"⭐".repeat(
                                            Math.round(product.averageRating || 0)
                                        )}
                                    </div>

                                    <span className="text-gray-400 text-sm">
                                        ({product.averageRating?.toFixed(1) || "0.0"})
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm line-clamp-2 mb-5">
                                    {product.description}
                                </p>

                                {/* BUTTONS */}
                                <div className="flex gap-3">

                                    <Link
                                        to={`/product/${product._id}`}
                                        className="flex-1 text-center border border-white py-2 rounded-xl hover:bg-white hover:text-black transition"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={() => {
                                            addToCart(product)
                                            alert("Added To Cart 🛒")
                                        }}
                                        className="flex-1 bg-white text-black py-2 rounded-xl font-bold active:scale-95 transition"
                                    >
                                        Add
                                    </button>

                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>

            {/* EMPTY STATE */}
            {filtered.length === 0 && (
                <div className="text-center text-gray-500 mt-20 text-xl">
                    No products found
                </div>
            )}

        </div>
    )
}

export default Shop