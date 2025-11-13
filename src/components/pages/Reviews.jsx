import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { reviewService } from "@/services/api/reviewService";
import { cn } from "@/utils/cn";
import StarRating from "@/components/atoms/StarRating";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import ReviewList from "@/components/molecules/ReviewList";
import ReviewForm from "@/components/molecules/ReviewForm";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [filterRating, setFilterRating] = useState(parseInt(searchParams.get('rating')) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || "newest");
  const [showWriteReview, setShowWriteReview] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filterRating) params.set('rating', filterRating.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchTerm, filterRating, sortBy, setSearchParams]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const reviewData = await reviewService.getAll();
      setReviews(reviewData);
    } catch (err) {
      setError("Failed to load reviews. Please try again.");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowWriteReview(false);
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterRating && review.rating !== filterRating) return false;
      if (searchTerm && !review.comment.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !review.buyerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to load reviews"
        message={error}
        onRetry={loadReviews}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Reviews</h1>
            <p className="text-gray-600">
              See what customers are saying about our products
            </p>
          </div>
          
          <Button
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Write Review
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
              </div>
              <ApperIcon name="MessageSquare" className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {reviews.length > 0 
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                  <StarRating 
                    rating={reviews.length > 0 
                      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                      : 0
                    } 
                    size="w-4 h-4" 
                  />
                </div>
              </div>
              <ApperIcon name="Star" className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-gray-800">
                  {reviews.filter(r => r.rating === 5).length}
                </p>
              </div>
              <ApperIcon name="Award" className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Write Review Form */}
      {showWriteReview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <ReviewForm
            productId={1} // Default product for demo
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowWriteReview(false)}
          />
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Reviews
            </label>
            <Input
              type="text"
              placeholder="Search by comment or reviewer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Reviews ({filteredAndSortedReviews.length})
          </h2>
        </div>
        
        <div className="space-y-4">
          {filteredAndSortedReviews.map((review, index) => (
            <motion.div
              key={review.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {review.buyerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{review.buyerName}</h4>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <ApperIcon name="CheckCircle2" className="w-4 h-4" />
                          <span className="text-xs font-medium">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size="w-4 h-4" />
                      <span className="text-sm text-gray-500">Product #{review.productId}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                  <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reviews;