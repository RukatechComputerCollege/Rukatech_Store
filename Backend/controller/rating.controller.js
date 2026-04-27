const { productModel } = require("../model/admin.model");
const userModel = require("../model/user.model");

const rateProduct = async (req, res) => {
    console.log(req.body);
    
  try {
    const { productId } = req.params;
    const { ratingGrade, feedback } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!ratingGrade || ratingGrade < 1 || ratingGrade > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already rated this product
    const existingRating = product.rating.find(r => r.user.toString() === userId);

    if (existingRating) {
      // Update existing rating
      existingRating.ratingGrade = ratingGrade;
      existingRating.feedback = feedback;
    } else {
      // Add new rating
      product.rating.push({
        user: userId,
        ratingGrade,
        feedback
      });
    }

    await product.save();

    res.status(200).json({
      message: "Rating saved successfully",
      product
    });

  } catch (err) {
    console.error("Error rating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).select("rating");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.rating.length === 0) {
      return res.json({ averageRating: 0, totalrating: 0 });
    }

    const total = product.rating.reduce((sum, r) => sum + r.ratingGrade, 0);
    const average = total / product.rating.length;

    res.json({
      averageRating: average.toFixed(1),
      totalrating: product.rating.length,
    });
  } catch (err) {
    console.error("Error fetching average rating:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { rateProduct, getAverageRating };
