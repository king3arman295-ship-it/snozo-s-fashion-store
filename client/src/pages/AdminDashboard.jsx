import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

const API = API_URL

function AdminDashboard() {

    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [editId, setEditId] = useState(null)

    // ✅ IMAGE URL SUPPORT
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image: ""
    })

    const [analytics, setAnalytics] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0
    })

    // =========================
    // FETCH DATA
    // =========================
    const fetchData = async () => {
        try {

            const productsRes = await axios.get(`${API}/products`)
            const ordersRes = await axios.get(`${API}/orders`)

            setProducts(productsRes.data)

            const sortedOrders = [...ordersRes.data].reverse()
            setOrders(sortedOrders)

            setAnalytics({
                totalOrders: sortedOrders.length,
                totalRevenue: sortedOrders.reduce(
                    (acc, order) =>
                        (order.status || "Pending") !== "Cancelled"
                            ? acc + Number(order.totalPrice || 0)
                            : acc,
                    0
                ),
                totalProducts: productsRes.data.length
            })

        } catch (err) {
            console.log("Fetch error:", err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        fetchData()

        const interval = setInterval(fetchData, 5000)

        return () => clearInterval(interval)

    }, [])

    // =========================
    // ADD / UPDATE PRODUCT
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            // ✅ SIMPLE JSON INSTEAD OF FILE UPLOAD
            const productData = {
                name: form.name,
                price: form.price,
                category: form.category,
                description: form.description,
                image: form.image
            }

            if (editId) {

                await axios.put(
                    `${API}/products/${editId}`,
                    productData
                )

            } else {

                await axios.post(
                    `${API}/products`,
                    productData
                )
            }

            // RESET
            setForm({
                name: "",
                price: "",
                category: "",
                description: "",
                image: ""
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

            await axios.delete(`${API}/products/${id}`)

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
            image: product.image || ""
        })

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // =========================
    // ORDER STATUS UPDATE
    // =========================
    const updateOrderStatus = async (id, status) => {

        try {

            await axios.put(
                `${API}/orders/${id}`,
                { status }
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

            await axios.delete(`${API}/orders/${id}`)

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
    // STATUS COLORS
    // =========================
    const getStatusColor = (status) => {

        switch (status) {

            case "Confirmed":
                return "text-blue-400"

            case "Shipped":
                return "text-indigo-400"

            case "Delivered":
                return "text-green-400"

            case "Cancelled":
                return "text-red-400"

            default:
                return "text-yellow-400"
        }
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

    return (

        <div className="min-h-screen bg-black text-white p-4 md:p-8">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

                <h1 className="text-3xl md:text-4xl font-bold">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

                <div className="bg-gray-900 p-6 rounded-2xl">
                    <h3>Total Orders</h3>

                    <p className="text-4xl mt-2">
                        {analytics.totalOrders}
                    </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl">
                    <h3>Revenue</h3>

                    <p className="text-4xl text-green-400 mt-2">
                        Rs {analytics.totalRevenue}
                    </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl">
                    <h3>Products</h3>

                    <p className="text-4xl mt-2">
                        {analytics.totalProducts}
                    </p>
                </div>

            </div>

            {/* PRODUCT FORM */}
            <div className="bg-gray-900 p-6 rounded-2xl mb-10">

                <h2 className="text-2xl mb-5">
                    {editId ? "Edit Product" : "Add Product"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        className="w-full p-3 rounded text-black"
                        placeholder="Product Name"
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
                        className="w-full p-3 rounded text-black"
                        placeholder="Price"
                        type="number"
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
                        className="w-full p-3 rounded text-black"
                        placeholder="Category"
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
                        className="w-full p-3 rounded text-black"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value
                            })
                        }
                        required
                    />

                    {/* ✅ IMAGE URL INPUT */}
                    <input
                        className="w-full p-3 rounded text-black"
                        placeholder="Paste Image URL"
                        value={form.image}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                image: e.target.value
                            })
                        }
                        required
                    />

                    {/* IMAGE PREVIEW */}
                    {form.image && (
                        <img
                            src={form.image}
                            alt="Preview"
                            className="w-40 h-40 object-cover rounded-xl"
                        />
                    )}

                    <button className="bg-white text-black px-5 py-2 rounded font-bold">
                        {editId ? "Update Product" : "Add Product"}
                    </button>

                </form>

            </div>

            {/* PRODUCTS */}
            <div>

                <h2 className="text-2xl mb-5">
                    Products
                </h2>

                <div className="space-y-4">

                    {products.map((p) => (

                        <div
                            key={p._id}
                            className="bg-gray-900 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-5"
                        >

                            <div className="flex gap-4 items-center">

                                <img
                                    src={
                                        p.image?.startsWith("http")
                                            ? p.image
                                            : `${API_URL}${p.image}`
                                    }
                                    className="w-24 h-24 rounded-xl object-cover"
                                    alt={p.name}
                                />

                                <div>

                                    <h3 className="text-xl font-bold">
                                        {p.name}
                                    </h3>

                                    <p className="text-green-400">
                                        Rs {p.price}
                                    </p>

                                    <p className="text-gray-400">
                                        {p.category}
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-3 items-center">

                                <button
                                    onClick={() => editProduct(p)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteProduct(p._id)}
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
            <div className="mt-14">

                <h2 className="text-2xl mb-5">
                    Orders
                </h2>

                <div className="space-y-5">

                    {orders.map((o) => {

                        const status = o.status || "Pending"

                        return (

                            <div
                                key={o._id}
                                className="bg-gray-900 p-5 rounded-2xl"
                            >

                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">

                                    <div>

                                        <p className="font-bold text-lg">
                                            {o.customerName}
                                        </p>

                                        <p className="text-gray-400">
                                            {o.email}
                                        </p>

                                    </div>

                                    <div className="text-left md:text-right">

                                        <p className="text-green-400 font-bold">
                                            Rs {o.totalPrice}
                                        </p>

                                        <span className={`font-bold ${getStatusColor(status)}`}>
                                            {status}
                                        </span>

                                    </div>

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-3 flex-wrap">

                                    <button
                                        onClick={() => updateOrderStatus(o._id, "Confirmed")}
                                        className="bg-blue-600 px-3 py-2 rounded"
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        onClick={() => updateOrderStatus(o._id, "Shipped")}
                                        className="bg-indigo-600 px-3 py-2 rounded"
                                    >
                                        Ship
                                    </button>

                                    <button
                                        onClick={() => updateOrderStatus(o._id, "Delivered")}
                                        className="bg-green-600 px-3 py-2 rounded"
                                    >
                                        Deliver
                                    </button>

                                    <button
                                        onClick={() => updateOrderStatus(o._id, "Cancelled")}
                                        className="bg-orange-600 px-3 py-2 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => deleteOrder(o._id)}
                                        className="bg-red-700 px-3 py-2 rounded"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        )
                    })}

                </div>

            </div>

        </div>
    )
}

export default AdminDashboard