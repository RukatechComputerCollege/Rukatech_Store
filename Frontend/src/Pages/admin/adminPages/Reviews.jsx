const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import { TiStar } from 'react-icons/ti';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { CategoryContext } from '../../../CategoryContext';

const Reviews = () => {
  const { allProduct } = useContext(CategoryContext);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, userId: null });
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  // Extract all reviews from products
  useEffect(() => {
    if (allProduct && allProduct.length > 0) {
      setLoading(true);
      const allReviews = [];
      
      allProduct.forEach(product => {
        if (product.rating && Array.isArray(product.rating)) {
          product.rating.forEach(review => {
            allReviews.push({
              productId: product._id,
              productName: product.name,
              productImage: product.image,
              userId: review.user,
              userName: review.userName || 'Anonymous',
              userEmail: review.userEmail || 'No email',
              rating: review.ratingGrade,
              feedback: review.feedback,
              createdAt: review.createdAt || new Date(),
              price: product.price
            });
          });
        }
      });

      // Sort by most recent first
      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(allReviews);
      setLoading(false);
    }
  }, [allProduct]);

  // Filter reviews based on search and rating
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.feedback.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
      
      return matchesSearch && matchesRating;
    });

    setFilteredReviews(filtered);
  }, [searchTerm, ratingFilter, reviews]);

  const handleDeleteReview = useCallback(async (productId, userId) => {
    try {
      toast.info('Delete functionality requires backend endpoint');
      setDeleteConfirm({ show: false, productId: null, userId: null });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  }, []);

  const getRatingStars = useCallback((rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <TiStar
        key={i}
        size={16}
        className={i < rating ? 'text-[#FBC02D]' : 'text-[#D7DBEC]'}
      />
    ));
  }, []);

  const getAverageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const stats = useMemo(() => ({
    total: reviews.length,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    lowStar: reviews.filter(r => r.rating <= 3).length
  }), [reviews]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-6">
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="font-bold text-[#131523] text-lg sm:text-xl md:text-2xl">Product Reviews</h1>
            <p className="text-xs sm:text-sm text-[#5A607F]">Manage customer feedback and ratings</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg sm:rounded-[8px] px-3 sm:px-4 py-2 sm:py-3 shadow w-fit">
            <TiStar size={18} className="text-[#FBC02D] flex-shrink-0" />
            <span className="text-sm sm:text-base font-bold text-[#131523]">{getAverageRating}</span>
            <span className="text-xs sm:text-sm text-[#5A607F]">Avg</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white shadow rounded-lg sm:rounded-[8px] p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-[#5A607F]">Total Reviews</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#131523] mt-1 sm:mt-2">{stats.total}</p>
          </div>
          <div className="bg-white shadow rounded-lg sm:rounded-[8px] p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-[#5A607F]">5 Star</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#06A561] mt-1 sm:mt-2">{stats.fiveStar}</p>
          </div>
          <div className="bg-white shadow rounded-lg sm:rounded-[8px] p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-[#5A607F]">4 Star</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF9500] mt-1 sm:mt-2">{stats.fourStar}</p>
          </div>
          <div className="bg-white shadow rounded-lg sm:rounded-[8px] p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-[#5A607F]">Low Star</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#F0142F] mt-1 sm:mt-2">{stats.lowStar}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg sm:rounded-[8px] p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <div className="flex-1 flex items-center gap-2 bg-[#F5F6FA] rounded-lg sm:rounded-[8px] px-3 py-2 sm:py-3">
            <FiSearch size={18} className="text-[#5A607F] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none flex-1 text-xs sm:text-sm"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[#F5F6FA] border border-[#D7DBEC] rounded-lg sm:rounded-[8px] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <span className="text-xs sm:text-sm text-[#5A607F] whitespace-nowrap">
            {filteredReviews.length}/{stats.total}
          </span>
        </div>

        {/* Reviews List */}
        <div className="bg-white shadow rounded-lg sm:rounded-[8px] overflow-hidden">
          {loading ? (
            <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-[#5A607F]">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-[#5A607F]">
              No reviews found. {searchTerm && 'Try adjusting your search filters.'}
            </div>
          ) : (
            <div className="divide-y max-h-[600px] sm:max-h-[700px] overflow-y-auto">
              {filteredReviews.map((review, index) => (
                <div key={index} className="p-3 sm:p-4 md:p-6 hover:bg-[#F5F6FA] transition-colors">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="w-12 sm:w-16 h-12 sm:h-16 flex-shrink-0 rounded-lg sm:rounded-[8px] bg-[#F5F6FA] overflow-hidden">
                      {review.productImage && (
                        <img
                          src={review.productImage}
                          alt={review.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#131523] text-xs sm:text-sm md:text-base truncate">{review.productName}</h3>
                          <p className="text-xs text-[#5A607F] truncate">
                            By <span className="font-semibold">{review.userName}</span>
                          </p>
                          <p className="text-xs text-[#5A607F] truncate">{review.userEmail}</p>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ show: true, productId: review.productId, userId: review.userId })}
                          className="flex-shrink-0 text-[#F0142F] hover:bg-[#FFE0E0] p-1.5 sm:p-2 rounded-lg sm:rounded-[8px] transition-colors"
                          title="Delete review"
                        >
                          <FaRegTrashCan size={16} />
                        </button>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                        <div className="flex gap-0.5">{getRatingStars(review.rating)}</div>
                        <span className="text-xs sm:text-sm font-semibold text-[#131523]">{review.rating}.0</span>
                      </div>

                      {/* Feedback */}
                      {review.feedback && (
                        <p className="text-xs sm:text-sm text-[#5A607F] mt-1 sm:mt-2 line-clamp-2">{review.feedback}</p>
                      )}

                      {/* Date */}
                      <p className="text-xs text-[#A0A8BC] mt-1 sm:mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-[8px] p-4 sm:p-6 max-w-sm w-full">
            <h2 className="text-base sm:text-lg font-bold text-[#131523] mb-2">Delete Review?</h2>
            <p className="text-xs sm:text-sm text-[#5A607F] mb-4 sm:mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm({ show: false, productId: null, userId: null })}
                className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-[8px] border border-[#D7DBEC] text-xs sm:text-sm text-[#131523] hover:bg-[#F5F6FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReview(deleteConfirm.productId, deleteConfirm.userId)}
                className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-[8px] bg-[#F0142F] text-xs sm:text-sm text-white hover:bg-[#D90000] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Reviews);
