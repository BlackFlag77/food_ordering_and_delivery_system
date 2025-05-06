// src/components/OrderCard.jsx
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';

const PayNowButton = ({ orderId }) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-primary"
      onClick={() => navigate(`/checkout/${orderId}`)}
    >
      Pay Now
    </button>
  );
};

export default function OrderCard({ order, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderApi.delete(`/orders/${order._id}`);
        onDelete(order._id);
      } catch (error) {
        console.error('Failed to delete order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  return (
    <div className="order-card">
      <h4>Order #{order._id.slice(-6)}</h4>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <div className="order-actions">
        <Link to={`/customer/orders/${order._id}`}>View Details</Link>
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
         {/* New Pay button */}
        {order.status === 'PENDING' && (
          
          <PayNowButton orderId={order._id} />
        )}
      </div>
    </div>
  );
}
