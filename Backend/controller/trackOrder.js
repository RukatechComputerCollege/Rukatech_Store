const userModel = require("../model/user.model");
const mongoose = require("mongoose");

const trackOrder = async (req, res) =>{
  const { id } = req.params;
  const { email } = req.query;
  
  // Clean up the ID - remove any whitespace
  const cleanId = id.trim();
  console.log("Tracking order ID:", cleanId, "Email:", email);
  
  try{
    // Try to match as both string and number (for Flutterwave numeric IDs)
    const user = await userModel.findOne(
      { 
        $or: [
          { "productOrder.flutterwaveResponse.transaction_id": cleanId },  // String match
          { "productOrder.flutterwaveResponse.transaction_id": Number(cleanId) }  // Number match
        ],
        email: email
      },
      { "productOrder.$": 1, firstname: 1, lastname: 1, email: 1 } 
    );
    
    if (!user) {
      console.log("Order not found for ID:", cleanId, "Email:", email);
      return res.status(404).json({ message: "Order not found" });
    }
    
    const order = user.productOrder[0];

    res.status(200).json({
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      order,
    });

    console.log("Order found:", order);
    
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { trackOrder };