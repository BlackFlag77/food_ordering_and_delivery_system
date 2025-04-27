import React, { useEffect, useState, useContext } from 'react';
import restaurantApi from '../api/restaurantApi';
import orderApi      from '../api/orderApi';       // <-- order service client
import { AuthContext } from '../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Ordering form state
  const [orderingItem, setOrderingItem] = useState(null);
  const [orderQty,     setOrderQty]     = useState(1);
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { data: restaurants } = await restaurantApi.get('/restaurants');
        const responses = await Promise.all(
          restaurants.map(r =>
            restaurantApi.get(`/restaurants/${r._id}/menu`)
          )
        );
        setMenuItems(responses.flatMap(r => r.data));
      } catch (err) {
        console.error('Error loading menu items:', err);
        alert('Could not load menu items');
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [user.id]);

  const openOrderForm = item => {
    setOrderingItem(item);
    setOrderQty(1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await orderApi.post('/orders', {
        restaurantId: orderingItem.restaurant,
        items: [{ menuItemId: orderingItem._id, quantity: orderQty }]
      });
      alert(`Order placed: ${orderingItem.name} ×${orderQty}`);
      setOrderingItem(null);
    } catch (err) {
      console.error('Order error:', err.response || err);
      alert(err.response?.data?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
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
                onClick={() => openOrderForm(item)}
              >
                {item.isAvailable ? 'Order Now' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No items available right now.</p>
      )}

      {orderingItem && (
        <>
          <div className="backdrop" onClick={() => setOrderingItem(null)} />
          <div className="modal">
            <h3>Order: {orderingItem.name}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={orderQty}
                  onChange={e => setOrderQty(Math.max(1, +e.target.value))}
                />
              </div>
              <p>
                Subtotal: ${ (orderingItem.price * orderQty).toFixed(2) }
              </p>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Placing…' : `Place Order ($${(orderingItem.price * orderQty).toFixed(2)})`}
              </button>{' '}
              <button type="button" onClick={() => setOrderingItem(null)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
