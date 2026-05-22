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
// SAFE MONGODB CONNECTION (FIXED)
// =========================
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  try {
    // already connected
    if (cached.conn) {
      return cached.conn;
    }

    // reuse existing promise
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI);
    }

    cached.conn = await cached.promise;

    console.log("MongoDB Connected");

    return cached.conn;

  } catch (err) {
    console.log("MongoDB Error:", err.message);
  }
}

// =========================
// DB MIDDLEWARE (IMPORTANT FIX)
// =========================
const ensureDB = async (req, res, next) => {
  await connectDB();
  next();
};

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
// API ROUTES (NOW SAFE)
// =========================
app.use("/api/products", ensureDB, productRoutes);
app.use("/api/orders", ensureDB, orderRoutes);
app.use("/api/auth", ensureDB, authRoutes);
app.use("/api/admin", ensureDB, adminRoutes);
app.use("/api/chat", ensureDB, chatRoutes);

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
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// =========================
// EXPORT FOR VERCEL
// =========================
module.exports = app;

// =========================
// LOCAL SERVER ONLY
// =========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}