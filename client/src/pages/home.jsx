import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { Link } from "react-router-dom"

export default function Home() {

    const { addToCart } = useContext(CartContext)

    const products = [
        {
            _id: "p1",
            name: "Black Hoodie",
            price: 3500,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        },
        {
            _id: "p2",
            name: "White Essential Tee",
            price: 1200,
            image: "https://images.unsplash.com/photo-1520975958225-5f61f2b7e7c2"
        },
        {
            _id: "p3",
            name: "Denim Jacket",
            price: 5000,
            image: "https://images.unsplash.com/photo-1520975682031-a2c9a4c1b5e2"
        }
    ]

    return (

        <div className="min-h-screen bg-black text-white">

            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-center text-center px-6 py-28">

                <h1 className="text-7xl font-extrabold tracking-[0.3em]">
                    SNOZO'S
                </h1>

                <p className="text-gray-400 mt-6 text-lg max-w-xl">
                    A premium streetwear experience crafted for modern fashion.
                </p>

                <div className="mt-10 flex gap-4">

                    <Link
                        to="/shop"
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 duration-300 inline-block"
                    >
                        Shop Now
                    </Link>
                    <Link
                        to="/shop"
                        className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-black duration-300 inline-block"
                    >
                        Explore
                    </Link>

                </div>

            </div>

            {/* FEATURED SECTION TITLE */}
            <div className="px-10 mb-6">
                <h2 className="text-2xl font-light tracking-widest text-gray-300">
                    FEATURED PIECES
                </h2>
            </div>

            {/* PRODUCT STRIP (LUXURY STYLE HORIZONTAL FEEL) */}
            <div className="px-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">

                {products.map((p) => (

                    <div
                        key={p._id}
                        className="group bg-[#0f0f0f] rounded-2xl overflow-hidden hover:scale-[1.02] transition duration-300"
                    >

                        <div className="overflow-hidden">

                            <img
                                src={p.image}
                                className="h-72 w-full object-cover group-hover:scale-110 transition duration-500"
                            />

                        </div>

                        <div className="p-5">

                            <h3 className="text-xl font-semibold tracking-wide">
                                {p.name}
                            </h3>

                            <p className="text-gray-400 mt-1">
                                Rs {p.price}
                            </p>

                            <button
                                onClick={() =>
                                    addToCart({
                                        _id: p._id,
                                        name: p.name,
                                        price: p.price,
                                        image: p.image
                                    })
                                }
                                className="mt-5 w-full bg-white text-black py-2 rounded-full font-medium hover:bg-gray-300 transition"
                            >
                                Add to Cart
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    )
}