import React from 'react';

export default function RestaurantCoverImage({ 
  coverImageUrl, 
  restaurantName, 
  className = '', 
  height = '200px',
  placeholderText = '🍽️ Restaurant'
}) {
  // Check if the coverImageUrl is a data URL or a regular URL
  const isValidImageUrl = coverImageUrl && (
    coverImageUrl.startsWith('http') || 
    coverImageUrl.startsWith('data:image')
  );

  return (
    <div 
      className={`restaurant-cover ${className}`} 
      style={{ height }}
    >
      {isValidImageUrl ? (
        <img 
          src={coverImageUrl} 
          alt={`${restaurantName || 'Restaurant'} cover`} 
          className="cover-image"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
      ) : (
        <div className="placeholder-cover" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '1.5rem',
          gap: '0.5rem',
          height: '100%',
          width: '100%'
        }}>
          <span style={{ fontSize: '2.5rem' }}>🍽️</span>
          <span>{placeholderText}</span>
        </div>
      )}
    </div>
  );
} 