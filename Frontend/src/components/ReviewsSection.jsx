import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";

const ReviewsSection = ({ productId, averageRating, totalRating }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/product/${productId}/reviews`
      );
      const sortedReviews = sortReviews(response.data.reviews || []);
      setReviews(sortedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const sortReviews = (reviewList) => {
    const reviewsCopy = [...reviewList];

    if (sortBy === "newest") {
      return reviewsCopy.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "highest") {
      return reviewsCopy.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      return reviewsCopy.sort((a, b) => a.rating - b.rating);
    }
    return reviewsCopy;
  };

  useEffect(() => {
    if (reviews.length > 0) {
      setReviews(sortReviews(reviews));
    }
  }, [sortBy]);

  if (loading) {
    return <p className="text-center py-8">Loading reviews...</p>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Reviews Header */}
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[20px] font-bold text-[#191C1F]">
          Customer Reviews
        </h2>

        {/* Rating Summary */}
        {totalRating > 0 && (
          <div className="w-full flex flex-col md:flex-row gap-6 md:gap-12">
            {/* Overall Rating */}
            <div className="flex flex-col gap-3 md:w-auto">
              <div className="flex items-end gap-2">
                <span className="text-[32px] font-bold text-[#191C1F]">
                  {averageRating}
                </span>
                <span className="text-[14px] text-[#475156]">out of 5</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <AiFillStar
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(parseFloat(averageRating))
                        ? "text-[#FA8232]"
                        : "text-[#E4E7E9]"
                    }
                  />
                ))}
              </div>
              <p className="text-[12px] text-[#5F6C72]">
                Based on {totalRating} review{totalRating !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex flex-col gap-2 md:flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length;
                const percentage =
                  totalRating > 0 ? ((count / totalRating) * 100).toFixed(0) : 0;

                return (
                  <div
                    key={rating}
                    className="flex items-center gap-2 text-[12px]"
                  >
                    <span className="w-[30px] text-[#5F6C72]">{rating} star{rating !== 1 ? 's' : ''}</span>
                    <div className="w-[100px] h-[8px] bg-[#E4E7E9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FA8232]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-[40px] text-[#5F6C72]">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sort Options */}
        {reviews.length > 0 && (
          <div className="w-full border-t border-[#E4E7E9] pt-4 flex gap-2 flex-wrap">
            <span className="text-[12px] text-[#5F6C72] font-semibold">
              Sort by:
            </span>
            {["newest", "highest", "lowest"].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1 rounded-full text-[12px] transition-all ${
                  sortBy === option
                    ? "bg-[#FA8232] text-white"
                    : "bg-[#F2F4F5] text-[#5F6C72] hover:bg-[#E4E7E9]"
                }`}
              >
                {option === "newest"
                  ? "Newest"
                  : option === "highest"
                    ? "Highest Rating"
                    : "Lowest Rating"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full border border-[#E4E7E9] rounded-[4px] p-4 flex flex-col gap-3"
            >
              {/* Reviewer Info */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-[14px] text-[#191C1F]">
                    {review.user.name}
                  </p>
                  <p className="text-[12px] text-[#5F6C72]">
                    {review.user.email}
                  </p>
                </div>
                <span className="text-[12px] text-[#5F6C72]">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Rating Stars */}
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

              {/* Review Text */}
              <p className="text-[14px] text-[#475156] leading-relaxed">
                {review.feedback}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-8 border border-[#E4E7E9] rounded-[4px]">
          <p className="text-[14px] text-[#5F6C72]">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
