// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';

export default function OrderDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error('Failed to load order', err);
        alert('Could not load order');
        nav(-1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !order) {
    return <div className="container"><p>Loading order…</p></div>;
  }

  return (
    <div className="container">
      <h2>Order Details – #{order._id.slice(-6)}</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map(i => (
          <li key={i.menuItemId}>
            {i.quantity}× {i.name} @ ${i.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <button onClick={() => nav(-1)}>Back</button>
    </div>
  );
}
