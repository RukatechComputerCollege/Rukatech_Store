const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  ratingGrade: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = mongoose.Schema({
  name: {type:String, required: true, trim: true},
  description: {type:String, required: true},
  price: {type: Number, required:true},
  discountprice: {type: Number},
  image: {type: [String], required: true},
  inventory: {type:Number},
  weight: {type: Number},
  region: {type: String},
  condition: {type: String, enum: ['new', 'used', 'refurbished']},
  processor: {type: String},
  ram: {type: String},
  storage: {type: String},
  storageType: {type: String},
  displaySize: {type: String},
  graphicsCardMemory: {type: String},
  numberOfCores: {type: String},
  operatingSystem: {type: String},
  brand: {type: String},
  model: {type: String},
  battery: {type: String},
  openToNegotiation: {type: Boolean, default: false},
  size: {type: String},
  color: {type:String},
  category: { type: String, enum: ['laptops', 'monitors', 'phones', 'tablets', 'accessories', 'processors'], required: true },
  productBox: {type: String},
  features: {type: String},
  discountPercentage: {type:Number},
  rating: [ratingSchema],
  type: {type: String},
  createdAt: {type:Date, default: Date.now}
})

const productModel = mongoose.model('product', productSchema)
module.exports = productModel