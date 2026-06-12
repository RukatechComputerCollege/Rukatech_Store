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
    const { productId } = req.params;
    const product = await productModel.findById(productId).select("rating");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.rating.length === 0) {
      return res.json({ averageRating: 0, totalRating: 0 });
    }

    const total = product.rating.reduce((sum, r) => sum + r.ratingGrade, 0);
    const average = total / product.rating.length;

    res.json({
      averageRating: average.toFixed(1),
      totalRating: product.rating.length,
    });
  } catch (err) {
    console.error("Error fetching average rating:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await productModel.findById(productId).select("rating name").populate({
      path: "rating.user",
      select: "firstname lastname email",
      model: "User_Registration"
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Sort reviews by date (newest first)
    const sortedReviews = product.rating.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      productName: product.name,
      totalReviews: sortedReviews.length,
      reviews: sortedReviews.map(review => {
        const userData = review.user || {};
        const firstName = userData.firstname || "";
        const lastName = userData.lastname || "";
        const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : "Anonymous";
        
        return {
          id: review._id,
          user: {
            id: userData._id,
            name: fullName,
            email: userData.email || "No email"
          },
          rating: review.ratingGrade,
          feedback: review.feedback,
          createdAt: review.createdAt
        };
      })
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Find all products that this user has rated
    const products = await productModel
      .find({ "rating.user": userId })
      .select("_id name image rating");

    const userReviews = [];
    
    products.forEach(product => {
      const userRatings = product.rating.filter(
        r => String(r.user) === String(userId)
      );
      
      userRatings.forEach(rating => {
        userReviews.push({
          productId: product._id,
          productName: product.name,
          productImage: product.image[0],
          rating: rating.ratingGrade,
          feedback: rating.feedback,
          createdAt: rating.createdAt,

        });
      });
    });

    // Sort by date (newest first)
    userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      totalReviews: userReviews.length,
      reviews: userReviews
    });
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { rateProduct, getAverageRating, getProductReviews, getUserReviews };
