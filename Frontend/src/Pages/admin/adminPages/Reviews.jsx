const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState } from 'react';
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

  const handleDeleteReview = async (productId, userId) => {
    try {
      // This would require a backend endpoint to delete a specific review
      // For now, we'll show a placeholder implementation
      toast.info('Delete functionality requires backend endpoint');
      
      // You would call an API like:
      // await axios.delete(`${API_URL}/${ADMIN_ROUTE}/product/${productId}/review/${userId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setDeleteConfirm({ show: false, productId: null, userId: null });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <TiStar
        key={i}
        size={16}
        className={i < rating ? 'text-[#FBC02D]' : 'text-[#D7DBEC]'}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full flex flex-col gap-4">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="font-bold text-[#131523] text-[24px]">Product Reviews</h1>
            <p className="text-[14px] text-[#5A607F]">Manage customer feedback and ratings</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-[6px] px-4 py-2 shadow">
            <TiStar size={20} className="text-[#FBC02D]" />
            <span className="text-[16px] font-bold text-[#131523]">{getAverageRating()}</span>
            <span className="text-[14px] text-[#5A607F]">Average Rating</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-[6px] p-4">
            <p className="text-[14px] text-[#5A607F]">Total Reviews</p>
            <p className="text-[20px] font-bold text-[#131523]">{reviews.length}</p>
          </div>
          <div className="bg-white shadow rounded-[6px] p-4">
            <p className="text-[14px] text-[#5A607F]">5 Star Reviews</p>
            <p className="text-[20px] font-bold text-[#06A561]">{reviews.filter(r => r.rating === 5).length}</p>
          </div>
          <div className="bg-white shadow rounded-[6px] p-4">
            <p className="text-[14px] text-[#5A607F]">4 Star Reviews</p>
            <p className="text-[20px] font-bold text-[#FF9500]">{reviews.filter(r => r.rating === 4).length}</p>
          </div>
          <div className="bg-white shadow rounded-[6px] p-4">
            <p className="text-[14px] text-[#5A607F]">Low Star Reviews</p>
            <p className="text-[20px] font-bold text-[#F0142F]">{reviews.filter(r => r.rating <= 3).length}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-[6px] p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2 bg-[#F5F6FA] rounded-[6px] px-3 py-2">
            <FiSearch size={20} className="text-[#5A607F]" />
            <input
              type="text"
              placeholder="Search by product, customer, or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none flex-1 text-[14px]"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[#F5F6FA] border border-[#D7DBEC] rounded-[6px] px-4 py-2 text-[14px] cursor-pointer"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <span className="text-[14px] text-[#5A607F]">
            {filteredReviews.length} of {reviews.length} reviews
          </span>
        </div>

        {/* Reviews List */}
        <div className="bg-white shadow rounded-[6px] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#5A607F]">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-[#5A607F]">
              No reviews found. {searchTerm && 'Try adjusting your search filters.'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredReviews.map((review, index) => (
                <div key={index} className="p-4 hover:bg-[#F5F6FA] transition-colors">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-[6px] bg-[#F5F6FA] overflow-hidden">
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
                        <div className="flex-1">
                          <h3 className="font-bold text-[#131523] text-[14px]">{review.productName}</h3>
                          <p className="text-[12px] text-[#5A607F]">
                            Reviewed by <span className="font-semibold">{review.userName}</span>
                          </p>
                          <p className="text-[12px] text-[#5A607F]">{review.userEmail}</p>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ show: true, productId: review.productId, userId: review.userId })}
                          className="flex-shrink-0 text-[#F0142F] hover:bg-[#FFE0E0] p-2 rounded-[6px] transition-colors"
                          title="Delete review"
                        >
                          <FaRegTrashCan size={18} />
                        </button>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">{getRatingStars(review.rating)}</div>
                        <span className="text-[12px] font-semibold text-[#131523]">{review.rating}.0</span>
                      </div>

                      {/* Feedback */}
                      {review.feedback && (
                        <p className="text-[13px] text-[#5A607F] mt-2 line-clamp-2">{review.feedback}</p>
                      )}

                      {/* Date */}
                      <p className="text-[11px] text-[#A0A8BC] mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-[6px]">
          <div className="bg-white rounded-[6px] p-6 max-w-sm mx-4">
            <h2 className="text-[18px] font-bold text-[#131523] mb-2">Delete Review?</h2>
            <p className="text-[14px] text-[#5A607F] mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm({ show: false, productId: null, userId: null })}
                className="px-4 py-2 rounded-[6px] border border-[#D7DBEC] text-[#131523] hover:bg-[#F5F6FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReview(deleteConfirm.productId, deleteConfirm.userId)}
                className="px-4 py-2 rounded-[6px] bg-[#F0142F] text-white hover:bg-[#D90000] transition-colors"
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

export default Reviews;
