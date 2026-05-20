const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({

  user: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true
  },

  comment: {
    type: String,
    required: true
  }

})

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  reviews: [reviewSchema],

  averageRating: {
    type: Number,
    default: 0
  }

})

module.exports = mongoose.model(
  "Product",
  productSchema
)