const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const userAuth = require("../middleware/userAuth")

// =======================
// REGISTER USER
// =======================
router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    res.json({ message: "User registered" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})


// =======================
// LOGIN USER
// =======================
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" })
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})


// =======================
// UPDATE PROFILE (NEW 🔥)
// =======================
router.put("/:id", userAuth, async (req, res) => {

  try {

    const { name, email } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("-password")

    res.json({
      message: "Profile updated",
      user: updatedUser
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})

module.exports = router