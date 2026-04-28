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

module.exports = adminModel