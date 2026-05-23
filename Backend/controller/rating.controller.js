const productModel = require("../model/productModel");
const userModel = require("../model/user.model");

const rateProduct = async (req, res) => {
    try {
    const { productId } = req.params;
    const { ratingGrade, feedback } = req.body;
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Validate inputs
    if (!ratingGrade || ratingGrade < 1 || ratingGrade > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure user has purchased this product
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hasPurchased = user.productOrder.some(order =>
      order.products.some(p => String(p.productId) === String(productId))
    );

    if (!hasPurchased) {
      return res.status(403).json({ message: "You can only rate products you have purchased" });
    }

    // Check if user already rated this product
    const existingRating = product.rating.find(r => String(r.user) === String(userId));

    if (existingRating) {
      existingRating.ratingGrade = ratingGrade;
      existingRating.feedback = feedback;
    } else {
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
