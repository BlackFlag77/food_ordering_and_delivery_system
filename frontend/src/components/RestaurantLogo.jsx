import React from 'react';

export default function RestaurantLogo({ 
  logoUrl, 
  restaurantName, 
  className = '', 
  size = '80px',
  placeholderText = '🍽️'
}) {
  // Check if the logoUrl is a data URL or a regular URL
  const isValidImageUrl = logoUrl && (
    logoUrl.startsWith('http') || 
    logoUrl.startsWith('data:image')
  );

  return (
    <div 
      className={`restaurant-logo ${className}`} 
      style={{ 
        width: size, 
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isValidImageUrl ? (
        <img 
          src={logoUrl} 
          alt={`${restaurantName || 'Restaurant'} logo`} 
          className="logo-image"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
      ) : (
        <div className="placeholder-logo" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '1.5rem',
          width: '100%',
          height: '100%'
        }}>
          <span style={{ fontSize: '2rem' }}>{placeholderText}</span>
        </div>
      )}
    </div>
  );
} 