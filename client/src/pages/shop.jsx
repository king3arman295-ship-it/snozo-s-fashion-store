import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"
import { Link } from "react-router-dom"
import { API_URL } from "../config"

function Shop() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")

    const { addToCart } = useContext(CartContext)
    const { wishlist, toggleWishlist } = useContext(WishlistContext)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/products`)
            setProducts(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        "all",
        ...new Set(products.map((p) => p.category))
    ]

    const filtered = products.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase())

        const matchCategory =
            category === "all" || p.category === category

        return matchSearch && matchCategory
    })

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
                    className="w-full md:w-[500px] p-3 rounded-xl bg-gray-900 border border-gray-700 outline-none"
                />
            </div>

            {/* CATEGORY */}
            <div className="flex gap-2 overflow-x-auto justify-start md:justify-center mb-10 px-2">
                {categories.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-full capitalize ${
                            category === c
                                ? "bg-white text-black"
                                : "bg-gray-900"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* PRODUCTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filtered.map((product) => {

                    const isWishlisted = wishlist.find(
                        (item) => item._id === product._id
                    )

                    return (
                        <div
                            key={product._id}
                            className="bg-gray-900 rounded-2xl overflow-hidden relative"
                        >

                            {/* WISHLIST */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full"
                            >
                                {isWishlisted ? "❤️" : "🤍"}
                            </button>

                            {/* IMAGE FIXED */}
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={`${API_URL}${product.image}`}
                                    alt={product.name}
                                    className="h-64 w-full object-cover"
                                />
                            </Link>

                            <div className="p-5">

                                <p className="text-gray-500 text-sm uppercase">
                                    {product.category}
                                </p>

                                <h2 className="text-2xl font-bold">
                                    {product.name}
                                </h2>

                                <p className="text-green-400 text-xl">
                                    Rs {product.price}
                                </p>

                                <div className="flex gap-3 mt-4">

                                    <Link
                                        to={`/product/${product._id}`}
                                        className="flex-1 text-center border border-white py-2 rounded-xl"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={() => {
                                            addToCart(product)
                                            alert("Added To Cart 🛒")
                                        }}
                                        className="flex-1 bg-white text-black py-2 rounded-xl"
                                    >
                                        Add
                                    </button>

                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>

            {/* EMPTY */}
            {filtered.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    No products found
                </div>
            )}

        </div>
    )
}

export default Shop