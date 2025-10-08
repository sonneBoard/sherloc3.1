import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 16 }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div 
      className="flex items-center gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((starValue) => (
        <motion.button
          key={starValue}
          type="button"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          disabled={readonly}
          className={`transition-colors duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          whileHover={readonly ? {} : { scale: 1.1 }}
          whileTap={readonly ? {} : { scale: 0.95 }}
        >
          <FiStar
            size={size}
            className={`transition-colors duration-200 ${
              starValue <= displayRating
                ? 'text-accent-gold fill-accent-gold'
                : 'text-text-secondary'
            }`}
            fill={starValue <= displayRating ? 'currentColor' : 'none'}
          />
        </motion.button>
      ))}
      {readonly && rating > 0 && (
        <span className="ml-2 text-sm text-text-secondary">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
