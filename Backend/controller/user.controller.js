const userModel = require("../model/user.model");
const AdminOrder = require("../model/adminOrder.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const axios = require('axios')
dotenv.config()


const greetingUser = async (req, res) => {
  const { confirmPassword, ...userData } = req.body;
  const rawEmail = req.body.email;

  if (!rawEmail || typeof rawEmail !== 'string') {
    return res.status(400).json({ message: 'Invalid email input.' });
  }

  const email = rawEmail.trim().toLowerCase();

  try {
    const emailCheck = await axios.get('http://apilayer.net/api/check', {
      params: {
        access_key: process.env.EMAIL_CHECK_ACCESS_KEY,
        email,
        smtp: 1,
        format: 1,
      },
    });

    const { format_valid, smtp_check, mx_found } = emailCheck.data;
    const isValid = format_valid && smtp_check && mx_found;

    if (!isValid) {
      return res.status(400).json({
        valid: false,
        message: 'Email appears invalid or undeliverable.',
        reasons: { format_valid, smtp_check, mx_found },
      });
    }

    const form = new userModel(userData);

    try {
      await form.save();  

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS_TO_SEND_CODE,
          pass: process.env.PASSWORD_TO_EMAIL_ADDRESS_TO_SEND_CODE,
        },
      });

      const htmlContent = welcomeEmail(req.body);

      const info = await transporter.sendMail({
        from: "Fastcart Online Store",
        to: email,
        subject: "Registration Successful ✅",
        html: htmlContent,
      });

      return res.status(201).json({
        status: true,
        message: 'User registered successfully.',
        data: userData,
      });

    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: "Duplicate field: email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }

  } catch (error) {
    console.error("Error in greetingUser:", error?.response?.data || error.message || error);
    return res.status(500).json({ message: "Something went wrong during email verification or registration." });
  }
};


const welcomeEmail = (user) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 10px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #2d2d2d;">Welcome to Fastcart, ${user.firstname}!</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for creating an account with us. 🎉<br />
          You're now part of a growing community of smart shoppers and savvy sellers.
        </p>

        <p style="font-size: 16px; color: #333;">
          Here's what you can do on Fastcart:
          <ul style="padding-left: 20px; color: #333;">
            <li>🛍️ Explore top trending products at great prices</li>
            <li>💳 Shop securely with multiple payment options</li>
            <li>🚚 Track your orders and manage deliveries</li>
            <li>📱 Seamless experience across web and mobile</li>
          </ul>
        </p>

        <p style="font-size: 16px; color: #333;">
          Ready to get started? Just log in and start shopping!
        </p>

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://fastcart-ecommerce-web-app.vercel.app" style="background-color: #ff6600; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Visit Fastcart
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          If you didn’t sign up for Fastcart, please ignore this email or contact our support team.
        </p>

        <p style="font-size: 14px; color: #888;">
          — The Fastcart Team
        </p>
      </div>
    </div>
  `;
};

const userLogin = (req, res) => {
  const { password } = req.body;
  

  userModel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "This email is not registered" });
      }

      user.validatePassword(password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: "Error validating password" });
        }

        if (!isMatch) {
          return res.status(401).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        const { password, ...userWithoutPassword } = user._doc;

        res.status(200).json({
          status: true,
          message: 'User Login Successfully',
          data: userWithoutPassword,
          token
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
};

const changePassword = async (req, res) =>{
  const { id } = req.params;
  const {currentpassword, newpassword} = req.body;
  try{
    const user = await userModel.findById(id);
    if(!user){
      return res.status(404).json({ error: 'user not found'});
    }

    user.validatePassword(currentpassword, async (err, isMatch) => {
      if(err){
        return res.status(500).json({ error: "Server error while validating password" });
      }
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = newpassword;

      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    })
  }
  catch (err) {
    console.error("Error during password change:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try{
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(404).json({
        message: 'The email as not been registered'
      })
    }
    const resetToken = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const resetUrl = `https://fastcartonlinestore.vercel.app/reset-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS_TO_SEND_CODE,
        pass: process.env.PASSWORD_TO_EMAIL_ADDRESS_TO_SEND_CODE
      }
    })

    const emailContent = ResetPasswordEmail(user, resetUrl)

    const passwordReset = await transporter.sendMail({
      from: 'Fastcart Online Store',
      to: email,
      subject: 'Password Reset Link',
      html: emailContent
    })
    
    res.status(200).json({
      status: true,
      message: 'Password reset link sent', 
      resetUrl
    })
    
  }
  catch(err){
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

const ResetPasswordEmail = (user, resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 10px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h1 style="color: black;">Reset Password</h1>
        <h2 style="color: #2d2d2d;">Hi ${user.firstname},</h2>
        <p style="font-size: 16px; color: #333;">
          Tap the button below to reset your fastcart account password.
          <br />
          if you didn't request a new password, you can safely delete this email.
          your password will expire within 15 minutes
        </p>
        <a style="font-size: 16px; color: white; padding: 10px 30px; border-radius: 4px; background-color: #FA8232;" href="${resetUrl}">Reset Password</a>
        <p style="font-size: 16px; color: #333;">
          If that doesn't work, copy and paste the following following link into your browser
          <br />
          ${resetUrl}
        </p>

        <p style="font-size: 14px; color: #888;">
          — The Fastcart Team
        </p>
      </div>
    </div>
  `;
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const {confirmPassword, password } = req.body;

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if(!user){
      return res.status(404).json({ message: 'User no found' })
    }

    user.password = password;
    
    await user.save()

    res.status(200).json({ status: true, message: "Password reset successful" });
  }
  catch (err) {
    console.error("Reset password error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link has expired" });
    }
    res.status(400).json({ message: "Invalid reset link" });
  }
}
  
const userDashboard = (req, res) =>{
  let token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, process.env.JWT_SECRET, (err, result) =>{
    if(err){
      res.send({
        status: false,
        message: 'token invalid',
        data: err
      })
    }else{
      userModel.findOne({email: result.email})
      .then((user) => {
        if(user){
          const { password, ...newUser } = user.toObject()
          res.send({
            status: true,
            message: 'token is valid',
            data: newUser
          })
        }
      })
      .catch((err) =>{
      })
    }
  })
}
const editUser = async (req, res) => {
  const { id } = req.params;
  const {firstname, lastname, email, phonenumber, phonenumber2, secondemail, country, state, zipcode } = req.body
  try{
    const updatedUser = await userModel.findByIdAndUpdate(id, 
      { firstname, lastname, email, phonenumber, phonenumber2, secondemail, country, state, zipcode },
      {new: true, runValidators: true}
    )
    if(!updatedUser){
       return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ 
      message: "User updated successfully", 
      user: updatedUser 
    });
  }
  catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
const billingDetails = async (req, res) =>{
  const { id } = req.params;
  const { billingfirstname, billinglastname, billingcompanyname, billingaddress, billingcountry, billingstate, billingcity, billingzipcode, billingemail, billingphonenumber } = req.body
  try{
    const billingData = await userModel.findByIdAndUpdate(id,
      {billingfirstname, billinglastname, billingcompanyname, billingaddress, billingcountry, billingstate, billingcity, billingzipcode, billingemail, billingphonenumber},
      {new: true, runValidators: true}
    )
    if(!billingData){
      return res.status(404).json({ error: 'User not found'})
    }
    
    res.status(200).json({
      message: "Billing Details added successfully",
      data: billingData
    });
  }
  catch(err){
    console.error("Error updating billing data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
const shippingDetails = async (req, res) =>{
  const { id } = req.params;
  const { shippingfirstname, shippinglastname, shippingcompanyname, shippingaddress, shippingcountry, shippingstate, shippingcity, shippingzipcode, shippingemail, shippingphonenumber } = req.body
  try{
    const shippingData = await userModel.findByIdAndUpdate(id,
      {shippingfirstname, shippinglastname, shippingcompanyname, shippingaddress, shippingcountry, shippingstate, shippingcity, shippingzipcode, shippingemail, shippingphonenumber},
      {new: true, runValidators: true}
    )
    if(!shippingData){
      return res.status(404).json({ error: 'User not found'}) 
    }
    
    res.status(200).json({
      message: "shipping Details added successfully",
      data: shippingData
    });
  }
  catch(err){
    console.error("Error updating shipping data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
const orderDetails = async (req, res) => {
  const { id } = req.params;
  const { flutterwaveResponse, cartItems, billingDetails, subtotal } = req.body;

  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const order = {
      flutterwaveResponse,
      products: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: typeof item.discountprice === 'number' ? item.discountprice : item.price,
        quantity: item.quantity,
        image: item.image?.[0],
      })),
      billingDetails,
      subtotal,
      createdAt: new Date(),
    };

    user.productOrder.push(order);
    await user.save();

    const adminOrder = new AdminOrder({
      transactionId: flutterwaveResponse?.transaction_id || 'N/A',
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstname} ${user.lastname}`,
      products: order.products,
      billingDetails,
      subtotal,
      createdAt: order.createdAt,
    });

    await adminOrder.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS_TO_SEND_CODE,
        pass: process.env.PASSWORD_TO_EMAIL_ADDRESS_TO_SEND_CODE,
      },
    });

    const htmlContent = generateEmailHTML(user, order)

    const info = await transporter.sendMail({
      from: "Fastcart Online Store @fastcastonlinestore@store.com",
      to: user.email,
      subject: "Your Order Confirmation from Fastcart 🛒",
      text: `Thank you for your purchase, ${user.firstname}!`,
      html: htmlContent,
    });

    res.status(200).json({ message: 'Order saved successfully', orderId: adminOrder._id });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Failed to save order' });
  }
};

const generateEmailHTML = (user, order) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
      <h2 style="color: #2d2d2d;">Thank you for your purchase, ${user.firstname}!</h2>
      <p>Your order with the transaction id: ${order.flutterwaveResponse?.transaction_id} has been placed successfully. Here are the details:</p>
      <h3 style="color: #444;">Order Summary</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${order.products.map(item => `
          <div>
            <img src="${item.image}" alt='product-image'/>
            <strong>${item.name}</strong> — ${item.quantity || 1} x ₦${item.price.toLocaleString()}
          </div>`).join('')}
      </div>
      <p><strong>Subtotal:</strong> ₦${order.subtotal.toLocaleString()}</p>
      <p><strong>Transaction ID:</strong> ${order.flutterwaveResponse?.transaction_id || 'N/A'}</p>
      <hr/>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p style="color: #888;">Fastcart Online Store</p>
    </div>
  `;
};

module.exports = {
  greetingUser,
  userLogin,
  userDashboard,
  editUser,
  billingDetails,
  shippingDetails,
  changePassword,
  orderDetails,
  forgotPassword,
  resetPassword
}