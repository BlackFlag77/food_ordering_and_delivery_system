// src/pages/CustomerDashboard.jsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  
  //const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 Dashboard token is:', token);
    if (!token) {
      // maybe redirect to login
      return;
    }
  
    async function fetchOrders() {
      const resp = await axios.get(
        `${import.meta.env.VITE_ORDER_SERVICE_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(resp.data.filter(o => o.status === 'PENDING'));
    }
    fetchOrders();
  }, []);
  

  return (
    <div className="container">
      <h2>Customer Dashboard</h2>
      <p>Your profile is managed here. Below are your pending orders:</p>

      {orders.length === 0 ? (
        <p>No pending orders to pay for.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total ($)</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Placed At</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.items.map(item => item.name)         // pull out each item.name
          .join(', ')}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {(order.total)}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
  onClick={() => navigate(`/checkout/${order._id}`)}
  style={{ padding: '6px 12px', cursor: 'pointer' }}
>
  Pay
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
