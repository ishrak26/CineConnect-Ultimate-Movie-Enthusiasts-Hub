import React, { useState } from 'react'

function SetPrice({ onPriceChange }) {
  const [priceRange, setPriceRange] = useState({
    minPrice: 100,
    maxPrice: 1000,
  })

  const handlePriceChange = (value, type) => {
    const newPriceRange = { ...priceRange, [type]: Number(value) }
    setPriceRange(newPriceRange)
    onPriceChange(newPriceRange)
  }

  return (
    <div className="mt-5 px-2">
      <h2 className="font-bold text-white-100">Select Price Range</h2>

      <div className="mt-3">
        <label className="text-gray-500 text-[15px]">Min Price:</label>
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min="0"
          max="1000" // Adjust max value as needed
          value={priceRange.minPrice}
          onChange={(e) => handlePriceChange(e.target.value, 'minPrice')}
        />
        <span className="text-gray-500 text-[15px]">
          Tk {priceRange.minPrice}
        </span>
      </div>

      <div className="mt-3">
        <label className="text-gray-500 text-[15px]">Max Price:</label>
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min="0"
          max="5000" // Adjust max value as needed
          value={priceRange.maxPrice}
          onChange={(e) => handlePriceChange(e.target.value, 'maxPrice')}
        />
        <span className="text-gray-500 text-[15px]">
          Tk {priceRange.maxPrice}
        </span>
      </div>
    </div>
  )
}

export default SetPrice
