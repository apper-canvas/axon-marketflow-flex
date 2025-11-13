import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { reviewService } from "@/services/api/reviewService";
import StarRating from "@/components/atoms/StarRating";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const ReviewForm = ({ 
  productId, 
  buyerId = 1001, // Mock buyer ID
  buyerName = "John Doe", 
  buyerEmail = "john@example.com",
  onReviewSubmitted = null,
  onCancel = null,
  className = ""
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!rating) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!comment.trim()) {
      newErrors.comment = "Please write a review";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    
    try {
      const reviewData = {
        productId,
        buyerId,
        buyerName,
        buyerEmail,
        rating,
        comment: comment.trim()
      };

      const newReview = await reviewService.create(reviewData);
      
      toast.success("Review submitted successfully!");
      
      // Reset form
      setRating(0);
      setComment("");
      setErrors({});
      
      onReviewSubmitted?.(newReview);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(0);
    setComment("");
    setErrors({});
    onCancel?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white border border-gray-200 rounded-lg p-6", className)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Write a Review</h3>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={setRating}
              size="w-8 h-8"
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600">
                ({rating} star{rating !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-lg",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              "resize-none transition-colors",
              errors.comment && "border-red-300 focus:ring-red-500 focus:border-red-500"
            )}
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment ? (
              <p className="text-sm text-red-600">{errors.comment}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {comment.length}/1000 characters (minimum 10)
              </p>
            )}
          </div>
        </div>

        {/* Reviewer Info Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Review will be posted as:</h4>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {buyerName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{buyerName}</p>
              <p className="text-xs text-gray-600">Verified Purchase</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;