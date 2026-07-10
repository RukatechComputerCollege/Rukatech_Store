
const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const AdminOrder = require('../model/adminOrder.model');
const dotenv = require('dotenv');

dotenv.config();

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP;
const BASE_URL = process.env.BASE_URL;

/**
 * POST /user/order/order-whatsapp
 * 
 * Expected body format:
 * {
 *   "userId": "user_id_here",
 *   "cart": [
 *     {
 *       "productId": "prod_123",
 *       "name": "Wireless Mouse",
 *       "price": 25.99,
 *       "quantity": 2,
 *       "image": "http://localhost:5173/images/mouse.jpg",
 *       "productLink": "http://localhost:5173/store/mouse"
 *     }
 *   ]
 * }
 */
router.post('/order-whatsapp', async (req, res) => {
  try {
    const { cart, userId } = req.body;
    let customerInfo = {};

    // Validate cart
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty or invalid'
      });
    }

    // Validate each cart item
    for (const item of cart) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each cart item must have name, price, and quantity'
        });
      }
    }

    // Fetch user info from database
    if (userId) {
      const user = await User.findById(userId).lean();
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Build customer info from user's billing details (use shipping if available)
      customerInfo = {
        name: `${user.shippingfirstname || user.billingfirstname || user.firstname} ${user.shippinglastname || user.billinglastname || user.lastname}`,
        email: user.shippingemail || user.billingemail || user.email,
        phone: user.shippingphonenumber || user.billingphonenumber || user.phonenumber,
        address: user.shippingaddress || user.billingaddress || user.address,
        country: user.shippingcountry || user.billingcountry || user.country,
        state: user.shippingstate || user.billingstate || user.state,
        city: user.shippingcity || user.billingcity,
        zipCode: user.shippingzipcode || user.billingzipcode,
        companyName: user.shippingcompanyname || user.billingcompanyname
      };
    } else {
      // If no userId, expect customerInfo in body
      customerInfo = req.body.customerInfo;
    }

    // Validate customer info
    if (!customerInfo || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required. Login or provide customerInfo.'
      });
    }

    // Calculate subtotal and total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;
    const transactionId = generateOrderId();

    // Save to AdminOrder collection (for admin tracking)
    const adminOrder = new AdminOrder({
      transactionId: transactionId,
      userId: userId || null,
      userEmail: customerInfo.email,
      userName: customerInfo.name,
      products: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        productLink: item.productLink || `${BASE_URL}/store/${item.name}`
      })),
      billingDetails: {
        firstname: customerInfo.name?.split(' ')[0] || '',
        lastname: customerInfo.name?.split(' ').slice(1).join(' ') || '',
        address: customerInfo.address || '',
        country: customerInfo.country || '',
        state: customerInfo.state || '',
        city: customerInfo.city || '',
        zipcode: customerInfo.zipCode || '',
        email: customerInfo.email || '',
        phone: customerInfo.phone || ''
      },
      subtotal: subtotal,
      orderStatus: 'received'
    });

    await adminOrder.save();

    // Build the WhatsApp message
    const message = buildOrderMessage(cart, customerInfo, transactionId, subtotal);
    
    // Encode message for WhatsApp URL
    const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

    // Optional: Also save to user's productOrder array
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          productOrder: {
            products: cart.map(item => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            })),
            billingDetails: adminOrder.billingDetails,
            subtotal: subtotal,
            orderStatus: 'received',
            createdAt: new Date(),
            flutterwaveResponse: { 
              transaction_id: transactionId,
              paymentMethod: 'whatsapp_order'
            }
          }
        }
      });
    }

    res.json({
      success: true,
      whatsappLink,
      orderSummary: {
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        total,
        orderId: transactionId
      }
    });

  } catch (error) {
    console.error('WhatsApp order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process order'
    });
  }
});

/**
 * Build WhatsApp message using your exact structure
 */
function buildOrderMessage(cart, customerInfo, orderId, subtotal) {
  let message = '';
  
  // Header
  message += '🛒 *NEW ORDER RECEIVED*\n';
  message += '━━━━━━━━━━━━━━━━━━\n\n';
  
  // Order ID
  message += `🔢 *Order ID:* ${orderId}\n\n`;

  // Order Items
  message += '📦 *ORDER ITEMS:*\n\n';
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    
    message += `*Item ${index + 1}:* ${item.name}\n`;
    message += `├─ 💰 Price: ₦${item.price.toLocaleString()}\n`;
    message += `├─ 📊 Quantity: ${item.quantity}\n`;
    message += `├─ 💳 Subtotal: ₦${itemTotal.toLocaleString()}\n`;
    
    // Product link for admin to view - ensure product name is properly encoded
    let productUrl;
    
    if (item.productLink) {
      // If productLink is relative (starts with /), extract the product name and re-encode it
      if (item.productLink.startsWith('/store/')) {
        // Extract the product name part after /store/
        const productName = item.productLink.replace('/store/', '');
        // Decode first (in case it's already partially encoded), then re-encode to be safe
        const decodedName = decodeURIComponent(productName);
        productUrl = `${BASE_URL}/store/${encodeURIComponent(decodedName)}`;
      } else if (item.productLink.startsWith('/')) {
        productUrl = `${BASE_URL}${item.productLink}`;
      } else {
        productUrl = item.productLink;
      }
    } else {
      // Build URL with encoded product name
      productUrl = `${BASE_URL}/store/${encodeURIComponent(item.name)}`;
    }
    
    message += `└─ 🔗 *View Product:* ${productUrl}\n`;
    
    // Product image
    // if (item.image) {
    //   message += `   🖼️ *Image:* ${item.image}\n`;
    // }
    
    message += '\n';
  });

  // Order Summary
  message += '━━━━━━━━━━━━━━━━━━\n';
  message += '💰 *ORDER SUMMARY*\n';
  message += '━━━━━━━━━━━━━━━━━━\n';
  
  const total = subtotal;
  
  message += `Subtotal: ₦${subtotal.toLocaleString()}\n`;
  message += `*TOTAL: ₦${total.toLocaleString()}*\n\n`;

  // Customer Details (from user's billing/shipping info)
  message += '━━━━━━━━━━━━━━━━━━\n';
  message += '👤 *CUSTOMER DETAILS*\n';
  message += '━━━━━━━━━━━━━━━━━━\n';
  
  if (customerInfo.name) message += `Name: ${customerInfo.name}\n`;
  if (customerInfo.email) message += `Email: ${customerInfo.email}\n`;
  if (customerInfo.phone) message += `Phone: ${customerInfo.phone}\n`;
  
  if (customerInfo.address) {
    message += `\n📍 *Shipping Address:*\n`;
    message += `${customerInfo.address}\n`;
    if (customerInfo.city) message += `City: ${customerInfo.city}\n`;
    if (customerInfo.state) message += `State: ${customerInfo.state}\n`;
    if (customerInfo.zipCode) message += `ZIP: ${customerInfo.zipCode}\n`;
    if (customerInfo.country) message += `Country: ${customerInfo.country}\n`;
    if (customerInfo.companyName) message += `Company: ${customerInfo.companyName}\n`;
  }
  
  message += '\n';

  // Order Metadata
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'long'
  });
  
  message += `📅 Order Date: ${timestamp}\n`;
  message += `📊 Order Status: Pending\n\n`;
  
  // Quick admin links
  message += `⚡ *Admin Actions:*\n`;
  message += `📋 View all orders: ${BASE_URL}/superadmin-8f3a2/orders\n`;

  return message;
}

/**
 * Generate unique order ID
 */
function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

module.exports = router;