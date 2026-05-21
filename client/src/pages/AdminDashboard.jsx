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

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image: null
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
                        order.status !== "Cancelled"
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
    // PRODUCT ADD / UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const fd = new FormData()

            fd.append("name", form.name)
            fd.append("price", form.price)
            fd.append("category", form.category)
            fd.append("description", form.description)

            if (form.image) fd.append("image", form.image)

            if (editId) {
                await axios.put(`${API}/products/${editId}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            } else {
                await axios.post(`${API}/products`, fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            }

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
            await axios.delete(`${API}/products/${id}`)
            fetchData()
        } catch (err) {
            console.log(err)
        }
    }

    const editProduct = (product) => {
        setEditId(product._id)

        setForm({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: null
        })

        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // =========================
    // ORDER STATUS UPDATE
    // =========================
    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`${API}/orders/${id}`, { status })
            fetchData()
        } catch (err) {
            console.log(err)
        }
    }

    const deleteOrder = async (id) => {
        try {
            await axios.delete(`${API}/orders/${id}`)
            fetchData()
        } catch (err) {
            console.log(err)
        }
    }

    const logout = () => {
        localStorage.removeItem("adminToken")
        navigate("/")
    }

    // =========================
    // STATUS COLOR FUNCTION
    // =========================
    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed": return "text-blue-400"
            case "Shipped": return "text-indigo-400"
            case "Delivered": return "text-green-400"
            case "Cancelled": return "text-red-400"
            default: return "text-yellow-400"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading Dashboard...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>

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
                    <h3>Total Orders</h3>
                    <p className="text-4xl">{analytics.totalOrders}</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl">
                    <h3>Revenue</h3>
                    <p className="text-4xl text-green-400">
                        Rs {analytics.totalRevenue}
                    </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl">
                    <h3>Products</h3>
                    <p className="text-4xl">{analytics.totalProducts}</p>
                </div>

            </div>

            {/* PRODUCT FORM */}
            <div className="bg-gray-900 p-6 rounded-xl mb-10">

                <h2 className="text-2xl mb-5">
                    {editId ? "Edit Product" : "Add Product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input className="w-full p-3 text-black"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input className="w-full p-3 text-black"
                        placeholder="Price"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                    />

                    <input className="w-full p-3 text-black"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    />

                    <textarea className="w-full p-3 text-black"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                    />

                    <input
                        type="file"
                        onChange={(e) =>
                            setForm({ ...form, image: e.target.files[0] })
                        }
                    />

                    <button className="bg-white text-black px-5 py-2 rounded">
                        {editId ? "Update" : "Add"}
                    </button>

                </form>
            </div>

            {/* PRODUCTS */}
            <div>
                <h2 className="text-2xl mb-5">Products</h2>

                {products.map((p) => (
                    <div key={p._id} className="bg-gray-900 p-4 flex justify-between mb-3">

                        <div className="flex gap-4 items-center">

                            <img
                                src={
                                    p.image?.startsWith("http")
                                        ? p.image
                                        : `${API_URL}${p.image}`
                                }
                                className="w-20 h-20 object-cover"
                                alt={p.name}
                            />

                            <div>
                                <h3>{p.name}</h3>
                                <p>Rs {p.price}</p>
                                <p>{p.category}</p>
                            </div>

                        </div>

                        <div className="flex gap-3">

                            <button onClick={() => editProduct(p)} className="bg-yellow-500 px-3">
                                Edit
                            </button>

                            <button onClick={() => deleteProduct(p._id)} className="bg-red-600 px-3">
                                Delete
                            </button>

                        </div>

                    </div>
                ))}
            </div>

            {/* ORDERS (FIXED STATUS UI) */}
            <div className="mt-10">
                <h2 className="text-2xl mb-5">Orders</h2>

                {orders.map((o) => {

                    const status = o.status || "Pending"

                    return (
                        <div key={o._id} className="bg-gray-900 p-5 mb-3 rounded-xl">

                            <div className="flex justify-between mb-2">

                                <div>
                                    <p><b>{o.customerName}</b></p>
                                    <p className="text-gray-400">{o.email}</p>
                                </div>

                                <span className={`font-bold ${getStatusColor(status)}`}>
                                    {status}
                                </span>

                            </div>

                            <p className="text-green-400 mb-3">
                                Rs {o.totalPrice}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex gap-3 flex-wrap">

                                <button onClick={() => updateOrderStatus(o._id, "Confirmed")} className="bg-blue-600 px-3 py-1 rounded">
                                    Confirm
                                </button>

                                <button onClick={() => updateOrderStatus(o._id, "Shipped")} className="bg-indigo-600 px-3 py-1 rounded">
                                    Ship
                                </button>

                                <button onClick={() => updateOrderStatus(o._id, "Delivered")} className="bg-green-600 px-3 py-1 rounded">
                                    Deliver
                                </button>

                                <button onClick={() => updateOrderStatus(o._id, "Cancelled")} className="bg-orange-600 px-3 py-1 rounded">
                                    Cancel
                                </button>

                                <button onClick={() => deleteOrder(o._id)} className="bg-red-600 px-3 py-1 rounded">
                                    Delete
                                </button>

                            </div>

                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default AdminDashboard