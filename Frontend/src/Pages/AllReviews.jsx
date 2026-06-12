import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import Loader from "../components/Loader";

const AllReviews = () => {
  const { name } = useParams();
  const location = useLocation();
  const productId = location.state?.productId;

  const API_URL = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const decodedProductName = name ? decodeURIComponent(name) : "Product";

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return; // Wait for productId from state
    }
    fetchReviewsAndRating();
  }, [productId]);

  const fetchReviewsAndRating = async () => {
    try {
      setLoading(true);

      // Fetch reviews
      const reviewsRes = await axios.get(
        `${API_URL}/user/product/${productId}/reviews`
      );
      const reviewsData = reviewsRes.data.reviews || [];
      setReviews(reviewsData);

      // Fetch average rating
      const ratingRes = await axios.get(
        `${API_URL}/user/product/${productId}/average-rating`
      );
      setAverageRating(parseFloat(ratingRes.data.averageRating) || 0);
      setTotalRating(ratingRes.data.totalRating || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortReviews = (reviewList) => {
    const sorted = [...reviewList];

    if (sortBy === "newest") {
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "highest") {
      return sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      return sorted.sort((a, b) => a.rating - b.rating);
    }
    return sorted;
  };

  const sortedReviews = sortReviews(reviews);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  if (!productId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-[16px] text-[#5F6C72] font-medium mb-2">
            Product ID not found
          </p>
          <p className="text-[14px] text-[#5F6C72]">
            Please click "See All" from a product page to view reviews.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50" style={{ padding: "3% 6%" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#191C1F] mb-2">
          Customer Reviews for {decodedProductName}
        </h1>
        <p className="text-[14px] text-[#5F6C72]">
          All verified customer reviews and ratings
        </p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-[#E4E7E9]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-semibold text-[#5F6C72]">
              OVERALL RATING
            </span>
            <div className="flex items-end gap-2">
              <span className="text-[48px] font-bold text-[#191C1F]">
                {averageRating}
              </span>
              <span className="text-[16px] text-[#475156]">out of 5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <AiFillStar
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(averageRating)
                      ? "text-[#FA8232]"
                      : "text-[#E4E7E9]"
                  }
                />
              ))}
            </div>
            <p className="text-[12px] text-[#5F6C72] font-medium">
              Based on {totalRating} review{totalRating !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-[14px] font-semibold text-[#5F6C72]">
              RATING DISTRIBUTION
            </span>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage =
                totalRating > 0 ? ((count / totalRating) * 100).toFixed(0) : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-[12px] text-[#5F6C72] font-medium w-[60px]">
                    {rating} star{rating !== 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 h-[8px] bg-[#E4E7E9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FA8232]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-[#5F6C72] font-medium w-[40px] text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-[#E4E7E9]">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-[14px] font-semibold text-[#191C1F]">
            Sort by:
          </span>
          {["newest", "highest", "lowest"].map((option) => (
            <button
              key={option}
              onClick={() => {
                setSortBy(option);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all ${
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
      </div>

      {/* Reviews List */}
      {paginatedReviews.length > 0 ? (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-[#E4E7E9] hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-[16px] text-[#191C1F] mb-1">
                    {review.user?.name || "Anonymous"}
                  </h3>
                  <p className="text-[12px] text-[#5F6C72]">
                    {review.user?.email || "No email"}
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
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <AiFillStar
                    key={star}
                    size={18}
                    className={
                      star <= review.rating
                        ? "text-[#FA8232]"
                        : "text-[#E4E7E9]"
                    }
                  />
                ))}
                <span className="ml-2 text-[12px] font-semibold text-[#191C1F]">
                  {review.rating} out of 5
                </span>
              </div>

              {/* Review Text */}
              <p className="text-[14px] text-[#475156] leading-relaxed mb-4">
                {review.feedback}
              </p>

              {/* Verified Badge */}
              <div className="flex items-center gap-1 text-[12px] text-[#2DA5F3] font-medium">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                VERIFIED PURCHASE
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-[#E4E7E9] text-center">
          <p className="text-[16px] text-[#5F6C72] font-medium">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium text-[14px] transition-all ${
              currentPage === 1
                ? "bg-[#F2F4F5] text-[#C0C5CB] cursor-not-allowed"
                : "bg-[#F2F4F5] text-[#475156] hover:bg-[#E4E7E9]"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and adjacent pages
              const showPage =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1;

              if (!showPage && page !== 2 && page !== totalPages - 1) {
                return null;
              }

              if (page === 2 && currentPage > 3) {
                return (
                  <span key="ellipsis-start" className="px-2 py-2 text-[#5F6C72]">
                    ...
                  </span>
                );
              }

              if (page === totalPages - 1 && currentPage < totalPages - 2) {
                return (
                  <span key="ellipsis-end" className="px-2 py-2 text-[#5F6C72]">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-medium text-[14px] transition-all ${
                    currentPage === page
                      ? "bg-[#FA8232] text-white"
                      : "bg-[#F2F4F5] text-[#475156] hover:bg-[#E4E7E9]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium text-[14px] transition-all ${
              currentPage === totalPages
                ? "bg-[#F2F4F5] text-[#C0C5CB] cursor-not-allowed"
                : "bg-[#F2F4F5] text-[#475156] hover:bg-[#E4E7E9]"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Results Info */}
      <div className="mt-6 text-center text-[12px] text-[#5F6C72]">
        Showing {startIndex + 1} to {Math.min(startIndex + reviewsPerPage, sortedReviews.length)} of{" "}
        {sortedReviews.length} reviews
      </div>
    </div>
  );
};

export default AllReviews;
