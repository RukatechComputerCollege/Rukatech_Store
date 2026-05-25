const User = require('../model/user.model');
const Order = require('../model/adminOrder.model');

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP;
const BASE_URL = process.env.BASE_URL || 'http://rukatechstore.com';

const whatsAppOrder = async (req, res) => {
    try {
        const { cart, customerInfo, userId } = req.body;
        let finalCustomerInfo = customerInfo;

        // Validate cart 
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cart is empty or invalid' });
        }

        // Validate each cart item has required fields
        for (const item of cart) {
            if (!item.productId || !item.name || !item.quantity || !item.price) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Each cart item must have productId, name, quantity, and price' });
            }
        }

        // Fetch user details if userId is provided
        if (userId) {
            try {
            const user = await User.findById(userId)
            .select('firstname lastname email phone')
            .lean();

            if(!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' });
            }
             // Merge user details with provided customerInfo, giving precedence to provided info
            finalCustomerInfo = {
                firstname: customerInfo.firstname || user.firstname,
                lastname: customerInfo.lastname || user.lastname,
                email: customerInfo.email || user.email,
                phone: customerInfo.phone || user.phone,
                address: customerInfo.address || user.address,
                state: customerInfo.state || user.state,
                city: customerInfo.city || user.city,
                country: customerInfo.country || user.country,
                zipcode: customerInfo.zipcode || user.zipcode,
            };
        }catch (dbError) {
            console.error('Database error while fetching user:', dbError);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error while fetching user details' 
            });
        }
    }
    // Validate finalCustomerInfo has required fields
    if (!finalCustomerInfo.firstname || !finalCustomerInfo.lastname || !finalCustomerInfo.email || !finalCustomerInfo.phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Customer information must include firstname, lastname, email, and phone' 
        });
    }

    //Build WhatsApp message
    const message = buildOrderMessage(cart, finalCustomerInfo);

    // Encode message for URL
    const encodedMessage = `http://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

    // Calculate order summary
    const orderSummary = calculateOrderSummary(cart);


    // Log the order details (for debugging)
    console.log('Order Summary:', orderSummary);
    console.log('Customer Info:', finalCustomerInfo);
    console.log('WhatsApp Link:', encodedMessage);

    // Optional: Save order to database
    if(process.env.SAVE_ORDERS_TO_DB === 'true') {
        try {
        const newOrder = new Order({
        products: cart,
        billingDetails: finalCustomerInfo,
        subtotal: orderSummary.subtotal,
    });
        await newOrder.save();
    }catch (saveError) {
        console.error('Error saving order to database:', saveError);
        return res.status(500).json({ 
            success: false, 
            message: 'Error saving order to database' 
        });
    }
}
    return res.status(200).json({
        success: true,
        message: 'Order processed successfully',
        whatsappLink: encodedMessage
    });
    } catch (error) {
        console.error('Error processing order:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing the order'
        });
    }
};


function buildOrderMessage(cart, customerInfo) {
    let message = '';

    //Header
    message += '*NEW ORDER RECEIVED*\n';
    message += '*____________________*\n';

    // Order Items with details
    message += '\n*Order Items:*\n\n';

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Item heder with number 
        message += `*Item ${index + 1}. ${item.name}*\n`;

        // Item details
        message += `   - Quantity: ${item.quantity}\n`;
        message += `   - Price: $${item.price.toFixed(2)}\n`;
        message += `   - Total: $${itemTotal.toFixed(2)}\n`;

        // Add product link if available
        if (item.productLink) {
            message += `   - 🔗 Product Link: ${item.productLink}\n`;
        } else if (item.productId) {
            message += `   - 🔗 Product Link: ${BASE_URL}/products/${item.productId}\n`;
        }

        // Product image link if available
        if (item.image) {
            message += `   - 🖼️ Image: ${item.image}\n`;
        }

        message += '\n'; // Add extra line after each item for better readability
    });

    // Order Summary
  message += '━━━━━━━━━━━━━━━━━━\n';
  message += '💰 *ORDER SUMMARY*\n';
  message += '━━━━━━━━━━━━━━━━━━\n';
  
  const tax = subtotal * 0.1; // 10% tax (adjust as needed)
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100 (adjust as needed)
  const total = subtotal + tax + shipping;
  
  message += `Subtotal: $${subtotal.toFixed(2)}\n`;
  message += `Tax (10%): $${tax.toFixed(2)}\n`;
  message += `Shipping: ${shipping === 0 ? 'FREE 🚚' : '$' + shipping.toFixed(2)}\n`;
  message += `*TOTAL: $${total.toFixed(2)}*\n\n`;

  // Customer Information
  if (customerInfo && Object.keys(customerInfo).length > 0) {
    message += '━━━━━━━━━━━━━━━━━━\n';
    message += '👤 *CUSTOMER DETAILS*\n';
    message += '━━━━━━━━━━━━━━━━━━\n';
    
    if (customerInfo.name) message += `Name: ${customerInfo.name}\n`;
    if (customerInfo.email) message += `Email: ${customerInfo.email}\n`;
    if (customerInfo.phone) message += `Phone: ${customerInfo.phone}\n`;
    
    if (customerInfo.address) {
      message += `\n📍 *Shipping Address:*\n${customerInfo.address}\n`;
      if (customerInfo.city) message += `City: ${customerInfo.city}\n`;
      if (customerInfo.state) message += `State: ${customerInfo.state}\n`;
      if (customerInfo.zipCode) message += `ZIP: ${customerInfo.zipCode}\n`;
      if (customerInfo.country) message += `Country: ${customerInfo.country}\n`;
    }
    
    message += '\n';
  }

  // Order Metadata
  const orderId = generateOrderId();
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'long'
  });
  
  message += '━━━━━━━━━━━━━━━━━━\n';
  message += `📅 Order Date: ${timestamp}\n`;
  message += `🔢 Order ID: ${orderId}\n`;
  
  // Admin direct links
  message += `\n⚡ *Quick Actions:*\n`;
  message += `📋 View all orders: ${BASE_URL}/admin/orders\n`;
  message += `🖥️ Admin Dashboard: ${BASE_URL}/admin\n`;

  return message;
}




module.exports = whatsAppOrder;