import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:5000/api"

export default function AdminDashboard() {

    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])

    const [loading, setLoading] = useState(true)

    const [editId, setEditId] = useState(null)

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image: null
    })

    // =========================
    // ANALYTICS
    // =========================
    const [analytics, setAnalytics] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0
    })

    // =========================
    // LOAD DATA
    // =========================
    const fetchData = async () => {

        try {

            const productsRes = await axios.get(
                `${API}/products`
            )

            const ordersRes = await axios.get(
                `${API}/orders`
            )

            // PRODUCTS
            setProducts(productsRes.data)

            // ORDERS (NEWEST FIRST)
            const sortedOrders =
                ordersRes.data.reverse()

            setOrders(sortedOrders)

            // ANALYTICS
            setAnalytics({

                totalOrders:
                    sortedOrders.length,

                totalRevenue:
                    sortedOrders.reduce(

                        (acc, order) =>

                            order.status !== "Cancelled"
                                ? acc + Number(order.totalPrice || 0)
                                : acc,

                        0
                    ),

                totalProducts:
                    productsRes.data.length
            })

        } catch (err) {

            console.log(err)

        } finally {

            setLoading(false)

        }
    }

    // =========================
    // AUTO REFRESH
    // =========================
    useEffect(() => {

        fetchData()

        const interval = setInterval(() => {

            fetchData()

        }, 3000)

        return () => clearInterval(interval)

    }, [])

    // =========================
    // ADD / UPDATE PRODUCT
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const fd = new FormData()

            fd.append("name", form.name)
            fd.append("price", form.price)
            fd.append("category", form.category)
            fd.append("description", form.description)

            if (form.image) {

                fd.append("image", form.image)

            }

            // UPDATE PRODUCT
            if (editId) {

                await axios.put(
                    `${API}/products/${editId}`,
                    fd,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                )

            }

            // ADD PRODUCT
            else {

                await axios.post(
                    `${API}/products`,
                    fd,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                )

            }

            // RESET
            setForm({
                name: "",
                price: "",
                category: "",
                description: "",
                image: null
            })

            setEditId(null)

            fetchData()

        } catch (err) {

            console.log(err)

            alert("Failed to save product")

        }
    }

    // =========================
    // DELETE PRODUCT
    // =========================
    const deleteProduct = async (id) => {

        try {

            await axios.delete(
                `${API}/products/${id}`
            )

            fetchData()

        } catch (err) {

            console.log(err)

        }
    }

    // =========================
    // EDIT PRODUCT
    // =========================
    const editProduct = (product) => {

        setEditId(product._id)

        setForm({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: null
        })

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // =========================
    // UPDATE ORDER STATUS
    // =========================
    const updateOrderStatus = async (
        id,
        status
    ) => {

        try {

            await axios.put(
                `${API}/orders/${id}`,
                {
                    status
                }
            )

            fetchData()

        } catch (err) {

            console.log(err)

        }
    }

    // =========================
    // DELETE ORDER
    // =========================
    const deleteOrder = async (id) => {

        try {

            await axios.delete(
                `${API}/orders/${id}`
            )

            fetchData()

        } catch (err) {

            console.log(err)

        }
    }

    // =========================
    // LOGOUT
    // =========================
    const logout = () => {

        localStorage.removeItem("adminToken")

        navigate("/")
    }

    // =========================
    // LOADING
    // =========================
    if (loading) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                Loading Dashboard...

            </div>

        )
    }

    // =========================
    // UI
    // =========================
    return (

        <div className="min-h-screen bg-black text-white p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">
                    Admin Dashboard
                </h1>

                <button
                    onClick={logout}
                    className="bg-red-600 px-5 py-2 rounded-lg"
                >
                    Logout
                </button>

            </div>

            {/* ANALYTICS */}
            <div className="grid md:grid-cols-3 gap-5 mb-10">

                <div className="bg-gray-900 p-6 rounded-2xl">

                    <h3 className="text-gray-400 mb-2">
                        Total Orders
                    </h3>

                    <p className="text-4xl font-bold">
                        {analytics.totalOrders}
                    </p>

                </div>

                <div className="bg-gray-900 p-6 rounded-2xl">

                    <h3 className="text-gray-400 mb-2">
                        Revenue
                    </h3>

                    <p className="text-4xl font-bold text-green-400">
                        Rs {analytics.totalRevenue}
                    </p>

                </div>

                <div className="bg-gray-900 p-6 rounded-2xl">

                    <h3 className="text-gray-400 mb-2">
                        Products
                    </h3>

                    <p className="text-4xl font-bold">
                        {analytics.totalProducts}
                    </p>

                </div>

            </div>

            {/* PRODUCT FORM */}
            <div className="bg-gray-900 p-6 rounded-xl mb-10">

                <h2 className="text-2xl font-bold mb-5">

                    {editId
                        ? "Edit Product"
                        : "Add Product"}

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full p-3 rounded text-black"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full p-3 rounded text-black"
                        value={form.price}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price: e.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        className="w-full p-3 rounded text-black"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category: e.target.value
                            })
                        }
                        required
                    />

                    <textarea
                        placeholder="Description"
                        className="w-full p-3 rounded text-black"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="file"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                image: e.target.files[0]
                            })
                        }
                    />

                    <div className="flex gap-3">

                        <button
                            className="bg-white text-black px-5 py-2 rounded-lg font-bold"
                        >

                            {editId
                                ? "Update Product"
                                : "Add Product"}

                        </button>

                        {editId && (

                            <button
                                type="button"
                                onClick={() => {

                                    setEditId(null)

                                    setForm({
                                        name: "",
                                        price: "",
                                        category: "",
                                        description: "",
                                        image: null
                                    })
                                }}
                                className="bg-gray-600 px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* PRODUCTS */}
            <div className="mb-12">

                <h2 className="text-2xl font-bold mb-5">
                    Products
                </h2>

                <div className="space-y-4">

                    {products.map((p) => (

                        <div
                            key={p._id}
                            className="bg-gray-900 p-4 rounded-xl flex justify-between items-center"
                        >

                            <div className="flex gap-4 items-center">

                                <img
                                    src={`http://localhost:5000${p.image}`}
                                    alt={p.name}
                                    className="w-20 h-20 object-cover rounded"
                                />

                                <div>

                                    <h3 className="text-xl font-semibold">
                                        {p.name}
                                    </h3>

                                    <p className="text-gray-400">
                                        Rs {p.price}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {p.category}
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => editProduct(p)}
                                    className="bg-yellow-500 px-4 py-2 rounded-lg"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteProduct(p._id)
                                    }
                                    className="bg-red-600 px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* ORDERS */}
            <div>

                <h2 className="text-2xl font-bold mb-5">
                    Orders
                </h2>

                <div className="space-y-4">

                    {orders.map((o) => (

                        <div
                            key={o._id}
                            className="bg-gray-900 p-5 rounded-xl"
                        >

                            <p>
                                <span className="font-bold">
                                    Customer:
                                </span>
                                {" "}
                                {o.customerName}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Email:
                                </span>
                                {" "}
                                {o.email}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Phone:
                                </span>
                                {" "}
                                {o.phone}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Total:
                                </span>
                                {" "}
                                <span className="text-green-400">
                                    Rs {o.totalPrice}
                                </span>
                            </p>

                            <p>
                                <span className="font-bold">
                                    Payment:
                                </span>
                                {" "}
                                {o.paymentMethod}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Status:
                                </span>
                                {" "}

                                <span
                                    className={`font-bold
                                        ${
                                            o.status === "Pending"
                                                ? "text-yellow-400"
                                                : ""
                                        }

                                        ${
                                            o.status === "Confirmed"
                                                ? "text-blue-400"
                                                : ""
                                        }

                                        ${
                                            o.status === "Shipped"
                                                ? "text-indigo-400"
                                                : ""
                                        }

                                        ${
                                            o.status === "Delivered"
                                                ? "text-green-400"
                                                : ""
                                        }

                                        ${
                                            o.status === "Cancelled"
                                                ? "text-red-400"
                                                : ""
                                        }
                                    `}
                                >
                                    {o.status}
                                </span>

                            </p>

                            {/* ITEMS */}
                            <div className="mt-5 space-y-3">

                                {o.cartItems?.map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-black p-4 rounded-lg flex justify-between"
                                    >

                                        <div>

                                            <p className="font-semibold">
                                                {item.name}
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                Qty: {item.quantity}
                                            </p>

                                        </div>

                                        <p className="text-green-400">
                                            Rs {item.price}
                                        </p>

                                    </div>

                                ))}

                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 mt-5 flex-wrap">

                                <button
                                    onClick={() =>
                                        updateOrderStatus(
                                            o._id,
                                            "Confirmed"
                                        )
                                    }
                                    className="bg-blue-600 px-4 py-2 rounded-lg"
                                >
                                    Confirm
                                </button>

                                <button
                                    onClick={() =>
                                        updateOrderStatus(
                                            o._id,
                                            "Shipped"
                                        )
                                    }
                                    className="bg-indigo-600 px-4 py-2 rounded-lg"
                                >
                                    Ship
                                </button>

                                <button
                                    onClick={() =>
                                        updateOrderStatus(
                                            o._id,
                                            "Delivered"
                                        )
                                    }
                                    className="bg-green-600 px-4 py-2 rounded-lg"
                                >
                                    Deliver
                                </button>

                                <button
                                    onClick={() =>
                                        updateOrderStatus(
                                            o._id,
                                            "Cancelled"
                                        )
                                    }
                                    className="bg-orange-600 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() =>
                                        deleteOrder(o._id)
                                    }
                                    className="bg-red-600 px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}