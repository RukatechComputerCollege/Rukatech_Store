const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema({
  flutterwaveResponse: mongoose.Schema.Types.Mixed,
  products: [orderProductSchema],
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
  
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  secondemail: { type: String, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String },
  phonenumber2: { type: String },
  profilePic: { type: String },
  registrationDate: { type: Date, default: Date.now },
  country: { type: String },
  state: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  billingfirstname: { type: String },
  billinglastname: { type: String },
  billingemail: { type: String },
  billingphonenumber: { type: String },
  billingcountry: { type: String },
  billingstate: { type: String },
  billingcity: { type: String },
  billingzipcode: { type: String },
  billingcompanyname: { type: String },
  billingaddress: { type: String },

  shippingfirstname: { type: String },
  shippinglastname: { type: String },
  shippingemail: { type: String },
  shippingphonenumber: { type: String },
  shippingcountry: { type: String },
  shippingstate: { type: String },
  shippingcity: { type: String },
  shippingzipcode: { type: String },
  shippingcompanyname: { type: String },
  shippingaddress: { type: String },

  productOrder: [orderSchema],
});


let saltRounds = 10
userSchema.pre('save', function(next){
  if (!this.isModified('password')) return next()
  bcrypt.hash(this.password, saltRounds, (err, hashedPassword)=>{
    if(err){
      return next(err)
    }else{
      this.password = hashedPassword
      next();
    }
  })
})

userSchema.methods.validatePassword = function(password, callback) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    if (isMatch) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  });
}


const userModel = mongoose.model("User_Registration", userSchema)

module.exports = userModel