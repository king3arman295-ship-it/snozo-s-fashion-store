const jwt = require("jsonwebtoken")

const userAuth = (req, res, next) => {

  try {

    const authHeader = req.header("Authorization")

    if (!authHeader) {
      return res.status(401).json({
        message: "No token"
      })
    }

    // ✅ HANDLE BOTH FORMATS
    let token = authHeader

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    }

    const decoded = jwt.verify(
      token,
      "USER_SECRET_KEY"
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

module.exports = userAuth