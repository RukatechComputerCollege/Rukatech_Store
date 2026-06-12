import React, { useEffect, useContext, useState } from "react";
import { UserAccountContext } from "./UserContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";

const ReviewPage = () => {
  const { userData } = useContext(UserAccountContext);
  const [userOrders, setUserOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (userData) {
      setUserOrders(userData.productOrder || []);
      fetchUserReviews();
    }
  }, [userData]);

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${API_URL}/user/reviews/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get all purchased products with their review status
  const getPurchasedProducts = () => {
    const products = [];
    userOrders.forEach((order) => {
      order.products.forEach((product) => {
        // Check if product already has a review from this user
        const hasReview = userReviews.some(
          (review) => String(review.productId) === String(product.productId)
        );
        products.push({
          ...product,
          hasReview,
          orderId: order.flutterwaveResponse?.transaction_id,
        });
      });
    });
    return products;
  };

  const handleSubmitReview = async (productId) => {
    if (!formData.feedback.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      await axios.put(
        `${API_URL}/user/product/${productId}/rate`,
        {
          ratingGrade: formData.rating,
          feedback: formData.feedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form and refresh reviews
      setFormData({ rating: 5, feedback: "" });
      setShowForm(null);
      fetchUserReviews();
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      feedback: review.feedback,
    });
    setShowForm(review.productId);
  };

  const purchasedProducts = getPurchasedProducts();

  if (loading) {
    return <p className="text-center py-8">Loading reviews...</p>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="w-full md:w-2/3 flex flex-col gap-2">
        <h1 className="font-bold text-[20px] text-[#191C1F]">
          My Reviews & Ratings
        </h1>
        <p className="text-[#475156] text-[14px]">
          Share your feedback on products you've purchased. Your reviews help
          other customers make informed decisions.
        </p>
      </div>

      {/* Write Reviews Section */}
      <div className="w-full rounded-[4px] border border-[#E4E7E9]">
        <div className="w-full flex flex-col gap-4">
          <h2
            style={{ padding: "15px" }}
            className="w-full border-b-1 font-bold border-[#E4E7E9] text-[14px] text-[#191C1F]"
          >
            WRITE A REVIEW
          </h2>

          {purchasedProducts.length === 0 ? (
            <div style={{ padding: "15px" }} className="text-center py-8">
              <p className="text-[#475156]">
                You haven't purchased any products yet.
              </p>
            </div>
          ) : (
            <div style={{ padding: "15px" }} className="w-full flex flex-col gap-4">
              {purchasedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="w-full border border-[#E4E7E9] rounded-[4px] p-4 flex flex-col gap-4"
                >
                  {/* Product Info */}
                  <div className="w-full flex gap-4">
                    <img
                      src={product.image || "https://via.placeholder.com/80"}
                      alt={product.name}
                      className="w-[80px] h-[80px] object-cover rounded-[4px]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-[#191C1F]">
                          {product.name}
                        </h3>
                        <p className="text-[12px] text-[#475156]">
                          Order #{product.orderId}
                        </p>
                      </div>
                      {product.hasReview && (
                        <p className="text-[12px] text-[#2DB224] font-semibold">
                          ✓ Review submitted
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Review Form */}
                  {showForm === product.productId ? (
                    <div className="w-full border-t border-[#E4E7E9] pt-4 flex flex-col gap-3">
                      {/* Rating */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-semibold text-[#191C1F]">
                          Rating
                        </label>
                        <select
                          value={formData.rating}
                          onChange={(e) =>
                            setFormData({ ...formData, rating: parseInt(e.target.value) })
                          }
                          className="border border-[#E4E7E9] rounded-[4px] p-2 text-[14px] focus:outline-none focus:border-[#2DA5F3]"
                        >
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                              {"★".repeat(rating)}
                              {"☆".repeat(5 - rating)} {rating} Star Rating
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Feedback */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-semibold text-[#191C1F]">
                          Your Review
                        </label>
                        <textarea
                          value={formData.feedback}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feedback: e.target.value,
                            })
                          }
                          className="w-full border border-[#E4E7E9] rounded-[4px] p-3 text-[14px] focus:outline-none focus:border-[#2DA5F3] resize-none"
                          rows="4"
                          placeholder="Share your experience with this product..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setShowForm(null);
                            setFormData({ rating: 5, feedback: "" });
                            setEditingReview(null);
                          }}
                          className="px-4 py-2 border border-[#E4E7E9] rounded-[4px] text-[#475156] hover:bg-[#F2F4F5] transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitReview(product.productId)}
                          className="px-4 py-2 bg-[#FA8232] text-white rounded-[4px] hover:bg-[#f98f48] transition-all font-semibold"
                        >
                          {editingReview ? "Update" : "Publish"} Review
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (product.hasReview) {
                          const review = userReviews.find(
                            (r) => String(r.productId) === String(product.productId)
                          );
                          handleEditReview(review);
                        } else {
                          setShowForm(product.productId);
                          setFormData({ rating: 5, feedback: "" });
                        }
                      }}
                      className="w-full py-2 border border-[#2DA5F3] text-[#2DA5F3] rounded-[4px] hover:bg-[#D5EDFD] transition-all font-semibold text-[14px]"
                    >
                      {product.hasReview ? "Edit Review" : "Write a Review"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Reviews Section */}
      {userReviews.length > 0 && (
        <div className="w-full rounded-[4px] border border-[#E4E7E9]">
          <div className="w-full flex flex-col gap-4">
            <h2
              style={{ padding: "15px" }}
              className="w-full border-b-1 font-bold border-[#E4E7E9] text-[14px] text-[#191C1F]"
            >
              MY REVIEWS ({userReviews.length})
            </h2>

            <div style={{ padding: "15px" }} className="w-full flex flex-col gap-4">
              {userReviews.map((review) => (
                <div
                  key={review.productId}
                  className="w-full border border-[#E4E7E9] rounded-[4px] p-4 flex flex-col gap-3"
                >
                  {/* Review Header */}
                  <div className="w-full flex gap-4 justify-between items-start">
                    <div className="flex-1 flex gap-4">
                      <img
                        src={
                          review.productImage || "https://via.placeholder.com/60"
                        }
                        alt={review.productName}
                        className="w-[60px] h-[60px] object-cover rounded-[4px]"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#191C1F] text-[14px]">
                          {review.productName}
                        </h3>
                        <div className="flex gap-2 items-center mt-1">
                          {/* Stars */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <AiFillStar
                                key={star}
                                size={16}
                                className={
                                  star <= review.rating
                                    ? "text-[#FA8232]"
                                    : "text-[#E4E7E9]"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[12px] text-[#5F6C72]">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditReview(review)}
                      className="p-2 text-[#2DA5F3] hover:bg-[#D5EDFD] rounded-[4px] transition-all"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  </div>

                  {/* Review Content */}
                  <p className="text-[14px] text-[#475156] leading-relaxed">
                    {review.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
