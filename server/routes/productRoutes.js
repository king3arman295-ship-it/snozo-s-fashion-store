
const express = require("express")
const router = express.Router()

const Product = require("../models/Product")

const upload = require("../middleware/upload")

// =========================
// GET ALL PRODUCTS
// =========================
router.get("/", async (req, res) => {

  try {

    const products = await Product.find()

    res.json(products)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Failed to fetch products"
    })

  }

})
// =========================
// ADD REVIEW
// =========================
router.post("/:id/review", async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    )

    if (!product) {

      return res.status(404).json({
        message: "Product not found"
      })

    }

    const newReview = {

      user: req.body.user,

      rating: Number(req.body.rating),

      comment: req.body.comment

    }

    product.reviews.push(newReview)

    // CALCULATE AVERAGE RATING
    const total = product.reviews.reduce(

      (acc, item) => acc + item.rating,

      0

    )

    product.averageRating =
      total / product.reviews.length

    await product.save()

    res.json(product)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Failed to add review"
    })

  }

})
// =========================
// ADD PRODUCT
// =========================
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {

    try {

      console.log(req.body)
      console.log(req.file)

      const newProduct = new Product({

        name: req.body.name,

        price: req.body.price,

        category: req.body.category,

        description: req.body.description,

        image: req.file
          ? `/uploads/${req.file.filename}`
          : ""

      })

      await newProduct.save()

      res.status(201).json(newProduct)

    } catch (err) {

      console.log(err)

      res.status(500).json({
        message: "Failed to add product"
      })

    }

  }
)
 // =========================
// UPDATE PRODUCT
// =========================
router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {

    try {

      const product = await Product.findById(
        req.params.id
      )

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        })
      }

      product.name = req.body.name
      product.price = req.body.price
      product.category = req.body.category
      product.description = req.body.description

      if (req.file) {
        product.image = `/uploads/${req.file.filename}`
      }

      await product.save()

      res.json(product)

    } catch (err) {

      console.log(err)

      res.status(500).json({
        message: "Update failed"
      })

    }

  }
)
// =========================
// DELETE PRODUCT
// =========================
router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      message: "Product deleted"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Delete failed"
    })

  }

})

module.exports = router

