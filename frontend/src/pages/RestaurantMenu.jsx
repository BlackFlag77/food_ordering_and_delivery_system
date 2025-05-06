import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import api from '../api/axios';
import orderApi from '../api/orderApi';  
import { AuthContext } from '../context/AuthContext';
import RestaurantCoverImage from '../components/RestaurantCoverImage';
import RestaurantLogo from '../components/RestaurantLogo';
import AddToCartModal from '../components/AddToCartModal';
import Swal from 'sweetalert2';

export default function RestaurantMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showFormItem, setShowFormItem] = useState(null);
  const [formQty, setFormQty] = useState(1);        


  // UPDATED: Load cart from backend
  const loadCart = async () => {
    try {
      const { data } = await orderApi.get(`/carts?restaurantId=${restaurantId}`);
      setCart(data.items ? data.items : data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  // Function to load restaurant and menu data
  const loadRestaurantAndMenu = useCallback(async () => {
    try {
      setLoading(true);
      // Load restaurant details
      const { data: restaurantData } = await restaurantApi.get(`/restaurants/${restaurantId}`);
      
      // Check if we have updated data in local storage
      const localRestaurantKey = `restaurant_${restaurantId}`;
      const localRestaurantData = localStorage.getItem(localRestaurantKey);
      
      let processedRestaurantData = restaurantData;
      
      if (localRestaurantData) {
        try {
          const localData = JSON.parse(localRestaurantData);
          // Merge the local data with the API data, prioritizing local data for image URLs
          processedRestaurantData = {
            ...restaurantData,
            logoUrl: localData.logoUrl || restaurantData.logoUrl,
            coverImageUrl: localData.coverImageUrl || restaurantData.coverImageUrl
          };
        } catch (e) {
          console.error('Error parsing local restaurant data:', e);
        }
      }
      
      setRestaurant(processedRestaurantData);
      
      // Load menu items
      const { data: menuData } = await restaurantApi.get(`/restaurants/${restaurantId}/menu`);
      setMenuItems(menuData);
      await loadCart();

      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading restaurant or menu:', err.response || err);
      setError('Could not load restaurant information. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Initial load
  useEffect(() => {
    loadRestaurantAndMenu();
  }, [loadRestaurantAndMenu]);

  // Set up periodic refresh (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadRestaurantAndMenu();
    }, 30000); // 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [loadRestaurantAndMenu]);

  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderApi.post('/carts', {
        restaurantId,
        menuItemId: showFormItem._id,
        quantity: formQty
      });
      await loadCart();
      setShowFormItem(null);
      setFormQty(1);
      Swal.fire({
        icon: 'success',
        title: 'Added to cart!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Add to Cart Failed',
        text: err?.message || 'An unknown error occurred',
      });
    }
  };
  
  const handleGoToCart = async () => {
    try {
      await orderApi.post('/carts', {
        restaurantId,
        menuItemId: showFormItem._id,
        quantity: formQty
      });
      navigate(`/customer/cart?restaurantId=${restaurantId}`);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Cart Error',
        text: err?.message || 'An unknown error occurred',
      });
    }
  };

  if (loading && !restaurant) return <div className="container"><p>Loading...</p></div>;
  if (error && !restaurant) return <div className="container"><p>{error}</p></div>;


  // const calculateTotal = () => {
  //   return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  // };

  const handleRefresh = () => {
    loadRestaurantAndMenu();
  };

  if (loading && !restaurant) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading restaurant menu...</div>
      </div>
    );
  }

  if (error && !restaurant) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/customer/restaurants')}>Back to Restaurants</button>
      </div>
    );
  }

  return (
    <div className="container">
      {restaurant && (
        <div className="restaurant-header">
          <button 
            className="back-button" 
            onClick={() => navigate('/customer/restaurants')}
          >
            ← Back to Restaurants
          </button>
          <RestaurantCoverImage 
            coverImageUrl={restaurant.coverImageUrl}
            restaurantName={restaurant.name}
          />
          <div className="restaurant-profile">
            <RestaurantLogo 
              logoUrl={restaurant.logoUrl}
              restaurantName={restaurant.name}
            />
            <div className="restaurant-details">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <div className="restaurant-meta">
                <span className={`status-badge ${restaurant.availability ? 'open' : 'closed'}`}>
                  {restaurant.availability ? 'Open' : 'Closed'}
                </span>
                <span className="cuisine-type">{restaurant.cuisine || 'Various'}</span>
              </div>
            </div>
          </div>
          <div className="restaurant-actions">
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
      )}
      
      <div className="menu-section">
        <h3>Menu</h3>
        <button className="view-cart-btn" onClick={() => navigate(`/customer/cart?restaurantId=${restaurantId}`)}>
          🛒 View Full Cart
        </button>
        
        {menuItems.length > 0 ? (
          <div className="menu-grid">
            {menuItems.map(item => (
              <div
                key={item._id}
                className={`menu-item-card ${item.isAvailable ? '' : 'unavailable'}`}
              >
                <div className="menu-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">🍽️</div>
                  )}
                </div>
                <div className="menu-item-content" >
                  <span className={`badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <h4>{item.name}</h4>
                  <p>{item.description || 'No description.'}</p>
                  <div className="menu-item-category">
                    <span className="category-badge">{item.category || 'General'}</span>
                  </div>
                  <p className="price">${item.price.toFixed(2)}</p>
                  <button
                    disabled={!item.isAvailable}
                    className="btn btn-cart"
                    onClick={() => {
                      const existingItem = cart.find(ci => ci.menuItemId === item._id);
                      setFormQty(existingItem ? existingItem.quantity : 1);
                      setShowFormItem(item);
                    }}
                  >
                    {cart.find(ci => ci.menuItemId === item._id) ? 'Update Cart' : 'Add to Cart'}
                  </button>
 
                </div>
              </div>

              
            ))}
          </div>
        ) : (
          <div className="empty-menu">
            <p>No menu items available right now.</p>
          </div>
        )}
      </div>
      <AddToCartModal
        item={showFormItem}
        quantity={formQty}
        setQuantity={setFormQty}
        onCancel={() => setShowFormItem(null)}
        onAddToCart={(e) => handleFormSubmit(e)}
        onGoToCart={(e) => handleGoToCart(e)}
      />

    </div>
  );
  
} 