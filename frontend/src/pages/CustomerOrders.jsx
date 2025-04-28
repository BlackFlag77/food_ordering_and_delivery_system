// src/pages/CustomerOrders.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';
import OrderCard from '../components/OrderCard';
import '../styles/CustomerOrders.css';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.message || 'Could not load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/customer/restaurants')}>
            Browse Restaurants
          </button>
        </div>
      )}
    </div>
  );
}
