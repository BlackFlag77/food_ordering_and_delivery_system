import React from 'react';

export default function RestaurantCoverImage({ 
  coverImageUrl, 
  restaurantName, 
  className = '', 
  height = '200px',
  placeholderText = 'Restaurant Cover Image'
}) {
  return (
    <div 
      className={`restaurant-cover ${className}`} 
      style={{ height }}
    >
      {coverImageUrl ? (
        <img 
          src={coverImageUrl} 
          alt={`${restaurantName || 'Restaurant'} cover`} 
          className="cover-image"
        />
      ) : (
        <div className="placeholder-cover">
          {placeholderText}
        </div>
      )}
    </div>
  );
} 