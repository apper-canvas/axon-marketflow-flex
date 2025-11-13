import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDateTime } from "@/utils/formatters";
import { reviewService } from "@/services/api/reviewService";
import { cn } from "@/utils/cn";
import StarRating from "@/components/atoms/StarRating";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const ReviewList = ({ 
  productId = null, 
  buyerId = null, 
  className = "",
  showProductInfo = false,
  maxReviews = null 
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId, buyerId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      
      let reviewData;
      if (productId) {
        reviewData = await reviewService.getByProductId(productId);
      } else if (buyerId) {
        reviewData = await reviewService.getByBuyerId(buyerId);
      } else {
        reviewData = await reviewService.getAll();
      }
      
      // Apply max reviews limit if specified
      if (maxReviews && reviewData.length > maxReviews) {
        reviewData = reviewData.slice(0, maxReviews);
      }
      
      setReviews(reviewData);
    } catch (err) {
      setError("Failed to load reviews");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId);
      // Update local state
      setReviews(prev => prev.map(review => 
        review.Id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadReviews} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Empty
        icon="MessageSquare"
        title="No Reviews Yet"
        description={
          productId 
            ? "Be the first to review this product!" 
            : "No reviews found."
        }
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {reviews.map((review, index) => (
        <motion.div
          key={review.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          {/* Review Header */}
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
                  <span className="text-sm text-gray-500">
                    {formatDateTime(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            {showProductInfo && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Product #{review.productId}</p>
              </div>
            )}
          </div>

          {/* Review Content */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {/* Review Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleMarkHelpful(review.Id)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
            
            {review.updatedAt !== review.createdAt && (
              <p className="text-xs text-gray-500">
                Updated {formatDateTime(review.updatedAt)}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;