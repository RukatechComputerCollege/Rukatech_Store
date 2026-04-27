const mongoose = require('mongoose')

const adminOrderSchema = new mongoose.Schema({
  transactionId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Registration"
  },
  userEmail: String,
  userName: String,

  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],

  billingDetails: {
    firstname: String,
    lastname: String,
    address: String,
    country: String,
    state: String,
    city: String,
    zipcode: String,
    email: String,
    phone: String,
  },

  subtotal: Number,
  orderStatus: {
    type: String,
    enum: ["received", "packaging", "on_the_road", "delivered", "cancelled"],
    default: "received"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const AdminOrder = mongoose.model('AdminOrder', adminOrderSchema)
module.exports = AdminOrder