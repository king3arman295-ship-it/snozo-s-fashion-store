const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields required"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    res.json({
      message: "User created"
    })

  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})


// =========================
// LOGIN (FIXED VERSION)
// =========================
// LOGIN
// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body

    console.log("LOGIN DATA:", email, password)

    const user = await User.findOne({ email })

    console.log("USER FOUND:", user)

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    console.log("PASSWORD MATCH:", isMatch)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      error: err.message
    })

  }

})
module.exports = router