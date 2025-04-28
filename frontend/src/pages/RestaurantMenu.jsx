import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import api from '../api/axios';
import orderApi from '../api/orderApi';  
import { AuthContext } from '../context/AuthContext';
import RestaurantCoverImage from '../components/RestaurantCoverImage';
import RestaurantLogo from '../components/RestaurantLogo';

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
  const [showOrderFormItem, setShowOrderFormItem] = useState(null);  // ← ADDED
  const [orderFormQty, setOrderFormQty]       = useState(1);         // ← ADDED

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

  const addToCart = (item) => {
    if (!item.isAvailable) return;
    
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    setShowCart(true);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
    if (cart.length === 1) {
      setShowCart(false);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item._id === itemId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    try {
      // Create an order with multiple items
      const orderItems = cart.map(item => ({
        itemId: item._id,
        quantity: item.quantity
      }));
      
      await api.post('/orders', {
        restaurantId,
        items: orderItems
      });
      
      // Clear cart and show success message
      setCart([]);
      setShowCart(false);
      alert('Order placed successfully!');
      
      // Navigate to orders page
      navigate('/customer/orders');
    } catch (err) {
      console.error('Order error:', err.response || err);
      alert('Could not place order. Please try again.');
    }
  };

  const handleOrderFormSubmit = async e => {
    e.preventDefault();
    if (!showOrderFormItem) return;
    try {
      await orderApi.post('/orders', {
        restaurantId,
        items: [{
          menuItemId: showOrderFormItem._id,
          name:       showOrderFormItem.name,
          quantity:   orderFormQty,
          price:      showOrderFormItem.price
        }]
      });
      alert('Order placed successfully!');
      setShowOrderFormItem(null);
    } catch (err) {
      console.error('Order error:', err.response || err);
      alert('Could not place order. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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
                    className="add-to-cart-btn"
                    disabled={!item.isAvailable || !restaurant.availability}
                    onClick={() => {
                      setShowOrderFormItem(item);
                      setOrderFormQty(1);
                    }}
                  >
                    {!restaurant.availability 
                      ? 'Restaurant Closed' 
                      : item.isAvailable 
                        ? 'Order Now' 
                        : 'Unavailable'}
                  </button>

                  {/* ───── BEAUTIFUL ORDER FORM MODAL ───── */}
                  {showOrderFormItem?._id === item._id && (
                    <div className="order-modal">
                      <form className="order-form-card" onSubmit={handleOrderFormSubmit}>
                        <button
                          type="button"
                          className="close-modal-btn"
                          onClick={() => setShowOrderFormItem(null)}
                        >
                      
                        </button>
                        <h4 className="order-form-title">Order: {item.name}</h4>

                        <div className="quantity-selector">
                          <button
                            type="button"
                            onClick={() => setOrderFormQty(q => Math.max(1, q - 1))}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={orderFormQty}
                            onChange={e => setOrderFormQty(Math.max(1, +e.target.value))}
                          />
                          <button
                            type="button"
                            onClick={() => setOrderFormQty(q => q + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="order-form-actions">
                          <button type="submit" className="btn-primary">
                            make order
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setShowOrderFormItem(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
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
      
      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>Your Order</h3>
            <button className="close-cart-btn" onClick={() => setShowCart(false)}>×</button>
          </div>
          
          {cart.length > 0 ? (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                </div>
                <button 
                  className="place-order-btn"
                  onClick={placeOrder}
                  disabled={!restaurant.availability}
                >
                  {restaurant.availability ? 'Place Order' : 'Restaurant Closed'}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 