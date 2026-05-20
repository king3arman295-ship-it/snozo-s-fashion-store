const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  customerName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  cartItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    default: "cod"
  },

  transactionId: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    default: "Pending"
  }

},
{
  timestamps: true
})

module.exports = mongoose.model(
  "Order",
  orderSchema
)