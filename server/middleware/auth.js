const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      })
    }

    // ✅ HANDLE:
    // "Bearer TOKEN"
    // OR plain token

    let token = authHeader

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()

  } catch (err) {

    console.log(err)

    return res.status(401).json({
      message: "Invalid token"
    })
  }
}