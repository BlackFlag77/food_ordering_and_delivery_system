// src/components/OrderCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <h4>Order #{order._id.slice(-6)}</h4>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <Link to={`/orders/${order._id}`}>View Details</Link>
    </div>
  );
}
