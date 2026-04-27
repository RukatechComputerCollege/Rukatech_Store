const userModel = require("../model/user.model");
const mongoose = require("mongoose");

const trackOrder = async (req, res) =>{
  const { id } = req.params;
  console.log(id);
  
  try{
    const user = await userModel.findOne(
      { "productOrder.flutterwaveResponse.transaction_id": Number(id) },   // search inside nested products
      { "productOrder.$": 1, firstname: 1, lastname: 1, email: 1 } 
    );
    if (!user) {
      console.log("Order not found");
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