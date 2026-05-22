import { useContext } from "react"
import { CartContext } from "./context/CartContext"

import {
  Routes,
  Route,
  Link
} from "react-router-dom"

import Home from "./pages/home"
import Shop from "./pages/shop"
import Cart from "./pages/cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Wishlist from "./pages/Wishlist"
import ProductDetails from "./pages/ProductDetails"
import TrackOrder from "./pages/TrackOrder"
import Profile from "./pages/Profile"
import AdminOrders from "./pages/AdminOrders"
import AdminAddProduct from "./pages/AdminAddProduct"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"

function App() {

  const { cartItems } = useContext(CartContext) || {
    cartItems: []
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  )

  return (

    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 bg-gray-900 border-b border-gray-800 gap-3 md:gap-0">

        <h1 className="text-xl md:text-2xl font-bold tracking-widest">
          SNOZO'S
        </h1>

        {/* NAV LINKS */}
        <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-6 text-sm md:text-base text-gray-300">

          <Link className="hover:text-white" to="/">
            Home
          </Link>

          <Link className="hover:text-white" to="/shop">
            Shop
          </Link>

          <Link className="hover:text-white" to="/cart">
            Cart ({cartCount})
          </Link>

          <Link className="hover:text-white" to="/login">
            Login
          </Link>

          <Link className="hover:text-white" to="/register">
            Register
          </Link>

          <Link className="hover:text-white" to="/wishlist">
            Wishlist
          </Link>

          <Link className="hover:text-white" to="/track-order">
            Track Order
          </Link>

          <Link className="hover:text-white" to="/profile">
            Profile
          </Link>

          {/* ADMIN */}
          <Link
            className="hover:text-white font-bold text-red-400"
            to="/admin"
          >
            Admin
          </Link>

        </div>

      </nav>

      {/* ROUTES */}
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />

        {/* ADMIN */}
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>

    </div>
  )
}

export default App