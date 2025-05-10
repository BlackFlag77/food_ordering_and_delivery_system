import React, {
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react';
import restaurantApi from '../api/restaurantApi';
import orderApi from '../api/orderApi';
import { AuthContext } from '../context/AuthContext';
import CreateMenuItemModal from '../components/CreateMenuItemModal';
import EditMenuItemModal from '../components/EditMenuItemModal';
import RestaurantSettings from '../components/RestaurantSettings';
import RestaurantCoverImage from '../components/RestaurantCoverImage';
import RestaurantLogo from '../components/RestaurantLogo';
import { useNavigate } from 'react-router-dom';
import './RestaurantDashboard.css';

export default function RestaurantDashboard() {
  const { user } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    popularItems: []
  });
  const navigate = useNavigate();
  const [orderFilter, setOrderFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const refreshOrders = async () => {
    try {
      const data = await restaurantApi.getOrders(restaurant._id);
      setOrders(data);
      // Check if we're using mock data (data will have updatedAt if it's mock data)
      setIsUsingMockData(data.some(order => order.updatedAt));
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Keep existing orders if the API fails
    }
  };

  const refreshMenu = async () => {
    try {
      const { data } = await restaurantApi.get(`/restaurants/${restaurant._id}/menu`);
      setMenuItems(data);
      // Check if we're using mock data (data will have updatedAt if it's mock data)
      setIsUsingMockData(data.some(item => item.updatedAt));
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Keep existing menu items if the API fails
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // First get the restaurant data
        const restaurantResponse = await restaurantApi.get('/restaurants');
        let restaurantData = restaurantResponse.data.find(r => r.userId === user.id) || null;
        
        // Check if we have a more up-to-date version in local storage
        if (restaurantData && restaurantData._id) {
          try {
            const localRestaurantKey = `restaurant_${restaurantData._id}`;
            const localRestaurantStr = localStorage.getItem(localRestaurantKey);
            
            if (localRestaurantStr) {
              const localRestaurant = JSON.parse(localRestaurantStr);
              console.log('Found restaurant in local storage:', localRestaurant);
              
              // Merge the local data with the server data, prioritizing local data for image URLs
              restaurantData = {
                ...restaurantData,
                ...localRestaurant,
                // Ensure we keep the server's _id and userId
                _id: restaurantData._id,
                userId: restaurantData.userId
              };
              
              console.log('Using merged restaurant data:', restaurantData);
            }
          } catch (error) {
            console.error('Error loading restaurant from local storage:', error);
          }
        }
        
        setRestaurant(restaurantData);
        
        if (restaurantData) {
          // Only try to load these if we have a restaurant
          try {
            const menuResponse = await restaurantApi.get(`/restaurants/${restaurantData._id}/menu`);
            setMenuItems(menuResponse.data || []);
          } catch (error) {
            console.error('Error loading menu items:', error);
            // Set empty menu items instead of showing an error
            setMenuItems([]);
        }
          
          try {
            const statsResponse = await restaurantApi.get(`/restaurants/${restaurantData._id}/stats`);
            setStats(statsResponse.data || {
              totalOrders: 0,
              todayOrders: 0,
              totalRevenue: 0,
              averageRating: 0,
              popularItems: []
            });
          } catch (error) {
            console.error('Error loading stats:', error);
            // Set default stats instead of showing an error
            setStats({
              totalOrders: 0,
              todayOrders: 0,
              totalRevenue: 0,
              averageRating: 0,
              popularItems: []
            });
          }
          
          try {
            const ordersResponse = await restaurantApi.getOrders(restaurantData._id);
            setOrders(ordersResponse || []);
          } catch (error) {
            console.error('Error loading orders:', error);
            // Set empty orders instead of showing an error
            setOrders([]);
          }
        }
      } catch (error) {
        console.error('Error loading restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.id]);

  const handleCreateRestaurant = async (formData) => {
    try {
      const { data: newRestaurant } = await restaurantApi.post('/restaurants', formData);
      setRestaurant(newRestaurant);
      await refreshMenu();
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const newAvailability = !restaurant.availability;
      
      // Update the restaurant in the backend
      const { data: updatedRestaurant } = await restaurantApi.patch(
        `/restaurants/${restaurant._id}/availability`,
        { availability: newAvailability }
      );

      // Update the restaurant state
      setRestaurant(updatedRestaurant);

      // Save to local storage to persist the change
      const localRestaurantKey = `restaurant_${restaurant._id}`;
      const localRestaurant = {
        ...restaurant,
        availability: newAvailability
      };
      localStorage.setItem(localRestaurantKey, JSON.stringify(localRestaurant));

      // Show success message
      console.log(`Restaurant is now ${newAvailability ? 'open' : 'closed'}`);
    } catch (error) {
      console.error('Error updating availability:', error);
      // Revert the toggle if the update fails
      setRestaurant(prev => ({
        ...prev,
        availability: !prev.availability
      }));
    }
  };

  const handleCreateMenuItem = async (formData) => {
    try {
      // Add default category if not provided
      if (!formData.category) {
        formData.category = 'Main Course';
      }
      
      const { data: newItem } = await restaurantApi.post(
        `/restaurants/${restaurant._id}/menu`,
        formData
      );
      setMenuItems(prev => [...prev, newItem]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  const handleEditMenuItem = async (formData) => {
    try {
      // Ensure category is preserved if not changed
      if (!formData.category && editItem.category) {
        formData.category = editItem.category;
      }
      
      const { data: updatedItem } = await restaurantApi.put(
        `/restaurants/${restaurant._id}/menu/${editItem._id}`,
        formData
      );
      setMenuItems(prev => prev.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
      setShowCreateModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await restaurantApi.delete(
          `/restaurants/${restaurant._id}/menu/${itemId}`
        );
        setMenuItems(prev => prev.filter(item => item._id !== itemId));
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      let newStatus;
      switch (action) {
        case 'confirm':
          newStatus = 'CONFIRMED';
          break;
        case 'prepare':
          newStatus = 'PREPARING';
          break;
        case 'ready':
          newStatus = 'READY';
          break;
        case 'cancel':
          newStatus = 'CANCELLED';
          break;
        default:
          return;
      }

      // Update the order status using the order service API
      const response = await orderApi.patch(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update the orders list with the new status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? response.data : order
        )
      );

      // Show success message
      alert(`Order ${orderId.slice(-6)} has been ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const handleUpdateRestaurant = async (updatedRestaurant) => {
    // Always update the restaurant state in the UI
    setRestaurant(updatedRestaurant);
    
    // Try to refresh related data, but don't fail if endpoints don't exist
    try {
      // Refresh menu items
      const menuResponse = await restaurantApi.get(`/restaurants/${updatedRestaurant._id}/menu`);
      setMenuItems(menuResponse.data);
      
      // Check if we're using mock data
      if (menuResponse.data && menuResponse.data.length > 0 && !menuResponse.data[0].createdAt) {
        console.log('Using mock menu data (backend unavailable)');
      }
    } catch (error) {
      console.error('Error refreshing menu:', error);
      // Continue execution even if this fails
    }
    
    try {
      // Refresh stats - handle 404 gracefully
      const statsResponse = await restaurantApi.get(`/restaurants/${updatedRestaurant._id}/stats`);
      setStats(statsResponse.data || {
        totalOrders: 0,
        todayOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        popularItems: []
      });
      
      // Check if we're using mock data
      if (statsResponse.data && statsResponse.data.totalOrders === 42) {
        console.log('Using mock stats data (backend unavailable)');
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
      
      // Provide more specific error messages based on the error type
      if (error.response && error.response.status === 404) {
        console.log('Stats endpoint not found (404). Using existing stats data.');
        // Keep the existing stats data
      } else {
        console.log('Error refreshing stats. Using existing stats data.');
      }
      
      // If stats endpoint doesn't exist, just keep the current stats
    }
    
    try {
      // Refresh orders - handle 404 gracefully
      const ordersResponse = await restaurantApi.getOrders(updatedRestaurant._id);
      setOrders(ordersResponse || []);
      
      // Check if we're using mock data
      if (ordersResponse && ordersResponse.length > 0 && ordersResponse[0]._id === '1') {
        console.log('Using mock orders data (backend unavailable)');
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      // Continue execution even if this fails
    }
  };

  if (loading) {
    return (
      <div className="restaurant-dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-dashboard">
        <div className="create-restaurant-card">
        <h2>Create Your Restaurant</h2>
          <form onSubmit={(e) => {
          e.preventDefault();
            const formData = new FormData(e.target);
            handleCreateRestaurant({
              name: formData.get('name'),
              description: formData.get('description'),
              cuisine: formData.get('cuisine'),
              address: formData.get('address')
            });
        }}>
          <div className="form-group">
              <label htmlFor="name">Restaurant Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter restaurant name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                required
                placeholder="Describe your restaurant"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cuisine">Cuisine Type</label>
              <input
                type="text"
                id="cuisine"
                name="cuisine"
                required
                placeholder="e.g., Italian, Indian, Chinese"
              />
          </div>
          <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                placeholder="Enter restaurant address"
              />
          </div>
            <button type="submit" className="submit-btn">Create Restaurant</button>
        </form>
        </div>
      </div>
    );
  }

  const renderDashboardTab = () => (
    <>
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="restaurant-info">
          <div className="restaurant-title">
            <RestaurantLogo 
              logoUrl={restaurant.logoUrl}
              restaurantName={restaurant.name}
              size="60px"
            />
            <h1>{restaurant.name}</h1>
          </div>
          <p>{restaurant.description}</p>
          <span className="cuisine-badge">{restaurant.cuisine}</span>
        </div>
        <div className="availability-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={restaurant.availability}
              onChange={handleToggleAvailability}
            />
            <span className="toggle-slider"></span>
          </label>
          <span>{restaurant.availability ? 'Open' : 'Closed'}</span>
        </div>
      </div>

      {/* Restaurant Cover Image */}
      <RestaurantCoverImage 
        coverImageUrl={restaurant.coverImageUrl}
        restaurantName={restaurant.name}
        height="250px"
      />

      {/* Stats Section */}
      <div className="restaurant-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Today's Orders</h3>
          <div className="value">{stats.todayOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="value">${stats.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="value">{stats.averageRating.toFixed(1)} ⭐</div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="menu-section">
        <div className="menu-header">
          <h3>Popular Items</h3>
        </div>
        {stats.popularItems && stats.popularItems.length > 0 ? (
          <div className="popular-items-grid">
            {stats.popularItems.map(item => (
              <div key={item._id} className="popular-item-card">
                <div className="popular-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">{item.name.charAt(0)}</div>
                  )}
                </div>
                <div className="popular-item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{ width: `${(item.orderCount / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                  <span className="order-count">{item.orderCount} orders</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No popular items data available yet.</p>
        )}
      </div>
    </>
  );

  const renderMenuTab = () => (
    <div className="menu-section">
      <div className="menu-header">
        <h3>Menu Items</h3>
        <button 
          className="add-item-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+</span> Add Menu Item
        </button>
      </div>

        {menuItems.length > 0 ? (
        <div className="menu-grid">
              {menuItems.map(item => (
            <div key={item._id} className="menu-item-card">
              <div className="menu-item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="placeholder-image">{item.name.charAt(0)}</div>
                )}
              </div>
              <div className="menu-item-content">
                <div className="menu-item-header">
                  <h4 className="menu-item-name">{item.name}</h4>
                  <span className="menu-item-price">${item.price.toFixed(2)}</span>
                </div>
                <p className="menu-item-description">{item.description}</p>
                <div className="menu-item-category">
                  <span className="category-badge">
                    {item.category ? 
                      item.category.charAt(0).toUpperCase() + item.category.slice(1) : 
                      'Main Course'}
                  </span>
                </div>
                <div className="menu-item-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditItem(item);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteMenuItem(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-menu">
          <p>No menu items yet. Click "Add Menu Item" to get started!</p>
        </div>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div className="orders-section">
      <div className="orders-header">
        <h3>Recent Orders</h3>
        <div className="order-filters">
          <select 
            className="filter-select"
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                  {order.customerId && (
                    <div className="customer-info">
                      <span className="customer-name">{order.customerId.name}</span>
                      <span className="customer-email">{order.customerId.email}</span>
                    </div>
                  )}
                </div>
                <div className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item._id} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">${order.total.toFixed(2)}</span>
                </div>
                <div className="order-actions">
                  {order.status === 'PENDING' && (
                    <>
                      <button 
                        className="action-btn confirm-btn"
                        onClick={() => handleOrderAction(order._id, 'confirm')}
                      >
                        Confirm
                      </button>
                      <button 
                        className="action-btn cancel-btn"
                        onClick={() => handleOrderAction(order._id, 'cancel')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <>
                      <button 
                        className="action-btn prepare-btn"
                        onClick={() => handleOrderAction(order._id, 'prepare')}
                      >
                        Prepare
                      </button>
                      <button 
                        className="action-btn cancel-btn"
                        onClick={() => handleOrderAction(order._id, 'cancel')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'PREPARING' && (
                    <>
                      <button 
                        className="action-btn ready-btn"
                        onClick={() => handleOrderAction(order._id, 'ready')}
                      >
                        Ready
                      </button>
                      <button 
                        className="action-btn cancel-btn"
                        onClick={() => handleOrderAction(order._id, 'cancel')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'READY' && (
                    <div className="ready-status">
                      <span className="ready-badge">Ready for Pickup</span>
                    </div>
                  )}
                  {order.status === 'PICKED_UP' && (
                    <div className="picked-up-status">
                      <span className="picked-up-badge">Order Picked Up</span>
                    </div>
                  )}
                  {order.status === 'DELIVERED' && (
                    <div className="delivered-status">
                      <span className="delivered-badge">Order Delivered</span>
                    </div>
                  )}
                  {order.status === 'CANCELLED' && (
                    <div className="cancelled-status">
                      <span className="cancelled-badge">Order Cancelled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-orders">
          <p>No orders yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="restaurant-dashboard">
      {isUsingMockData && (
        <div className="mock-data-banner">
          <p>⚠️ Using mock data - Backend API is unavailable</p>
        </div>
      )}
      {/* Tabs Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'menu' && renderMenuTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'settings' && (
          <RestaurantSettings 
            restaurant={restaurant} 
            onUpdate={handleUpdateRestaurant} 
          />
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateMenuItemModal
          restaurantId={restaurant._id}
          onClose={() => setShowCreateModal(false)}
          onCreated={newItem => {
            setShowCreateModal(false);
            setMenuItems(prev => [...prev, newItem]);
          }}
        />
      )}

      {showEditModal && editItem && (
        <EditMenuItemModal
          restaurantId={restaurant._id}
          item={editItem}
          onClose={() => {
            setShowEditModal(false);
            setEditItem(null);
          }}
          onUpdated={async () => {
            setShowEditModal(false);
            setEditItem(null);
            await refreshMenu();
          }}
        />
      )}
    </div>
  );
}
