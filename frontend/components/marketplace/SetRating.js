// Rating.js
import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'

const Rating = ({ onRating, defaultRating, count }) => {
  // console.log('defaultRating', defaultRating)
  // console.log('count', count)
  const [rating, setRating] = useState(defaultRating)
  // setRating(defaultRating)

  useEffect(() => {
    setRating(defaultRating)
  }, [defaultRating])

  const handleRating = (rate) => {
    setRating(rate)
    if (onRating) {
      onRating(rate)
    }
  }

  return (
    <div className="flex py-3">
      <div className="text-lg text-primary-700 mr-8">Rate this product : </div>
      {[...Array(10)].map((_, i) => {
        const ratingValue = i + 1

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
        )
      })}{' '}
      {count && <span className="ml-5">({count})</span>}
    </div>
  )
}

export default Rating
