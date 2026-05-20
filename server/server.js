const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// =========================
// IMPORT ROUTES
// =========================
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");

// =========================
// CORS
// =========================
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// =========================
// BODY PARSER
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// STATIC FILES
// =========================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// DATABASE CONNECTION
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// =========================
// HOME ROUTE
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running successfully"
  });
});

// =========================
// HEALTH CHECK
// =========================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK"
  });
});

// =========================
// API ROUTES
// =========================
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// =========================
// 404 ROUTE
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// =========================
// EXPORT APP FOR VERCEL
// =========================
module.exports = app;

// =========================
// LOCAL SERVER
// =========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}