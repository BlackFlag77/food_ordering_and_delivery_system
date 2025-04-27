// src/pages/CustomerOrders.jsx
import React, { useEffect, useState } from 'react';
import orderApi from '../api/orderApi';
import OrderCard from '../components/OrderCard';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error('Failed to fetch orders', err);
        alert('Could not load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container"><p>Loading your orders…</p></div>;
  }

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map(o => <OrderCard key={o._id} order={o} />)
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
}
