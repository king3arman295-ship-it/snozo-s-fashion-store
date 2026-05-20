const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// =========================
// IMPORT ROUTES
// =========================
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const chatRoutes = require("./routes/chatRoutes")

// =========================
// CORS
// =========================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)

// =========================
// BODY PARSER
// =========================
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// =========================
// STATIC FOLDER
// =========================
app.use("/uploads", express.static("uploads"))

// =========================
// DATABASE CONNECTION
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected")
  })
  .catch((err) => {
    console.log("MongoDB Error:", err)
  })

// =========================
// HOME ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("API running...")
})

// =========================
// API ROUTES
// =========================

// PRODUCTS
app.use("/api/products", productRoutes)

// ORDERS
app.use("/api/orders", orderRoutes)

// USER AUTH
app.use("/api/auth", authRoutes)

// ADMIN AUTH
app.use("/api/admin", adminRoutes)

// CHAT FEATURE
app.use("/api/chat", chatRoutes)

// =========================
// 404 ROUTE
// =========================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  })
})

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})