const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const userModel = require('./user.model');
require('dotenv').config()

const admin_username = process.env.admin_username;
const admin_password = process.env.admin_password;

const adminSchema = mongoose.Schema({
  username: { type: String, required: true, default: admin_username},
  password: { type: String, required: true, default: admin_password},
  role: {type:String, enum: ['admin'], default: 'admin'}
})
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  subcategories: [subCategorySchema]
})
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
  country: {type: String},
  size: {type: String},
  color: {type:String},
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product-category',
      required: true
    }
  ],
  productBox: {type: String},
  keyFeatures: {type: String},
  discountPercentage: {type:Number},
  rating: [ratingSchema],
  createdAt: {type:Date, default: Date.now}
})


let saltRounds = 10
adminSchema.pre('save', function(next){
  if (!this.isModified('password')) return next();
  bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
    if(err){
      return next(err);
    } else {
      this.password = hashedPassword;
      next();
    }
  })
})

adminSchema.methods.validatePassword = function(password, callback){
  bcrypt.compare(password, this.password, (err, isMatch) =>{
    if(err){
      console.log("There is an error while validating the password", err);
      return callback(err);
    }
    if(isMatch){
      console.log("Password matches");
      return callback(null, true);      
    }else{
      console.log("Password does not match");
      return callback(null, false);      
    }
  })
}

const adminModel = mongoose.model('admin-registration', adminSchema)
const categoryModel = mongoose.model('product-category', categorySchema)
const productModel = mongoose.model('product', productSchema)

module.exports = { adminModel, categoryModel, productModel}