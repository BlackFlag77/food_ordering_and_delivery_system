import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { AuthContext } from '../context/AuthContext';
import RestaurantCoverImage from '../components/RestaurantCoverImage';

export default function RestaurantsList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Function to load restaurants
  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await restaurantApi.get('/restaurants');
      
      // Process the restaurants data to include any local storage updates
      const processedRestaurants = data.map(restaurant => {
        // Check if we have updated data in local storage
        const localRestaurantKey = `restaurant_${restaurant._id}`;
        const localRestaurantData = localStorage.getItem(localRestaurantKey);
        
        if (localRestaurantData) {
          try {
            const localData = JSON.parse(localRestaurantData);
            // Merge the local data with the API data, prioritizing local data for image URLs
            return {
              ...restaurant,
              logoUrl: localData.logoUrl || restaurant.logoUrl,
              coverImageUrl: localData.coverImageUrl || restaurant.coverImageUrl
            };
          } catch (e) {
            console.error('Error parsing local restaurant data:', e);
          }
        }
        
        return restaurant;
      });
      
      setRestaurants(processedRestaurants);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading restaurants:', err.response || err);
      setError('Could not load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Set up periodic refresh (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadRestaurants();
    }, 30000); // 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [loadRestaurants]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/customer/restaurant/${restaurantId}`);
  };

  const handleRefresh = () => {
    loadRestaurants();
  };

  if (loading && restaurants.length === 0) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading restaurants...</div>
      </div>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={handleRefresh}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="restaurants-header">
        <h2>Available Restaurants</h2>
        <div className="restaurants-actions">
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {restaurants.length > 0 ? (
        <div className="restaurants-grid">
          {restaurants.map(restaurant => (
            <div 
              key={restaurant._id} 
              className="restaurant-card"
              onClick={() => handleRestaurantClick(restaurant._id)}
            >
              <div className="restaurant-image">
                <RestaurantCoverImage 
                  coverImageUrl={restaurant.coverImageUrl}
                  restaurantName={restaurant.name}
                  height="160px"
                  placeholderText="🍽️"
                />
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description || 'No description available.'}</p>
                <div className="restaurant-meta">
                  <span className={`status-badge ${restaurant.availability ? 'open' : 'closed'}`}>
                    {restaurant.availability ? 'Open' : 'Closed'}
                  </span>
                  <span className="cuisine-type">{restaurant.cuisine || 'Various'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No restaurants available at the moment.</p>
        </div>
      )}
    </div>
  );
} 