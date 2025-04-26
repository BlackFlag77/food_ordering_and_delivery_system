import React, { useEffect, useState, useContext } from 'react';
import restaurantApi from '../api/restaurantApi';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { data: restaurants } = await restaurantApi.get('/restaurants');
        const responses = await Promise.all(
          restaurants.map(r =>
            restaurantApi.get(`/restaurants/${r._id}/menu`)
          )
        );
        const items = responses.flatMap(res => res.data);
        setMenuItems(items);
      } catch (err) {
        console.error('Error loading menu items:', err.response || err);
        alert('Could not load menu items');
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [user.id]);

  const orderItem = async item => {
    if (!item.isAvailable) return;
    try {
      await api.post('/orders', {
        restaurantId: item.restaurant,
        itemId: item._id,
        quantity: 1
      });
      alert(`Ordered: ${item.name}`);
    } catch (err) {
      console.error('Order error:', err.response || err);
      alert('Could not place order');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading menu…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Available Menu</h2>
      {menuItems.length > 0 ? (
        <div className="menu-grid">
          {menuItems.map(item => (
            <div
              key={item._id}
              className={`menu-card ${item.isAvailable ? '' : 'unavailable'}`}
            >
              <span
                className={`badge ${item.isAvailable ? 'available' : 'unavailable'}`}
              >
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <h4>{item.name}</h4>
              <p>{item.description || 'No description.'}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              <button
                disabled={!item.isAvailable}
                onClick={() => orderItem(item)}
              >
                {item.isAvailable ? 'Order Now' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No items available right now.</p>
      )}
    </div>
  );
}
