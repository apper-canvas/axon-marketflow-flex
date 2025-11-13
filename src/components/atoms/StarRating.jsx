import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ 
  rating = 0, 
  maxStars = 5, 
  size = "w-5 h-5", 
  interactive = false, 
  onRatingChange = null,
  className = "",
  showNumber = false,
  precision = 0.5 // For display purposes, allows half stars
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const currentRating = interactive ? (hoveredRating || selectedRating) : rating;

  const handleStarClick = (starValue) => {
    if (!interactive) return;
    setSelectedRating(starValue);
    onRatingChange?.(starValue);
  };

  const handleStarHover = (starValue) => {
    if (!interactive) return;
    setHoveredRating(starValue);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoveredRating(0);
  };

  const getStarType = (starIndex) => {
    const starValue = starIndex + 1;
    
    if (currentRating >= starValue) {
      return "filled";
    } else if (currentRating >= starValue - 0.5) {
      return "half";
    } else {
      return "empty";
    }
  };

  const getStarColor = (starIndex) => {
    const starType = getStarType(starIndex);
    
    if (starType === "filled") {
      return "text-yellow-400 fill-yellow-400";
    } else if (starType === "half") {
      return "text-yellow-400 fill-yellow-400";
    } else if (interactive && hoveredRating > starIndex) {
      return "text-yellow-400 fill-yellow-400";
    } else {
      return "text-gray-300 fill-gray-300";
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className={cn(
          "flex items-center",
          interactive && "cursor-pointer"
        )}
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxStars)].map((_, index) => (
          <div
            key={index}
            className={cn(
              "relative transition-colors duration-150",
              interactive && "hover:scale-110"
            )}
            onClick={() => handleStarClick(index + 1)}
            onMouseEnter={() => handleStarHover(index + 1)}
          >
            <ApperIcon 
              name="Star" 
              className={cn(
                size,
                getStarColor(index),
                "transition-all duration-150"
              )}
            />
          </div>
        ))}
      </div>
      
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {currentRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;