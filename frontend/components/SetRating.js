// Rating.js
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ onRating }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
    if (onRating) {
      onRating(rate);
    }
  };

  return (
    <div className="flex">
        <div className="text-xl text-primary-700 mr-8">Rate this movie   :  </div>
      {[...Array(10)].map((_, i) => {
        const ratingValue = i + 1;

        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRating(ratingValue)}
              className="hidden"
            />
            <FaStar
              className={`cursor-pointer transition-colors ${
                ratingValue <= rating ? 'text-primary-700' : 'text-gray-300'
              }`}
              size="20"
            />
          </label>
        );
      })}
    </div>
  );
};

export default Rating;
