const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// ADMIN LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK ENV VARIABLES
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      return res.status(500).json({
        message: "Admin environment variables missing"
      });
    }

    // EMAIL CHECK
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        message: "Invalid admin email"
      });
    }

    // PASSWORD CHECK
    const validPassword = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // TOKEN
    const token = jwt.sign(
      {
        role: "admin",
        email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      admin: {
        email
      }
    });

  } catch (err) {

    console.log("ADMIN LOGIN ERROR:", err);

    res.status(500).json({
      message: "Admin login failed"
    });

  }
});

module.exports = router;