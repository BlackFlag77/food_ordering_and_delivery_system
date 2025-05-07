// src/pages/Payments.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const headerCell = {
  borderBottom: '2px solid #ddd',
  padding: '0.5rem',
  textAlign: 'left',
  backgroundColor: '#f9f9f9'
};
const cell = {
  padding: '0.75rem'
};

export default function Payments() {
  const { token } = useContext(AuthContext);
  const [payments, setPayments]   = useState([]);
  const [isLoading, setLoading]   = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // 1) fetch your payments
        const { data: pays } = await axios.get(
          `${import.meta.env.VITE_PAYMENT_SERVICE_URL}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2) enrich each with a friendly orderName
        const enriched = await Promise.all(pays.map(async p => {
          try {
            const { data: order } = await axios.get(
              `${import.meta.env.VITE_ORDER_SERVICE_URL}/api/orders/${p.orderId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            // prefer restaurantName if present, else join item names
            const orderName = order.restaurantName
              || order.items.map(i => i.name).join(', ');
            return { ...p, orderName };
          } catch {
            return { ...p, orderName: 'Unknown Order' };
          }
        }));

        setPayments(enriched);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  if (isLoading) return <p style={{ textAlign: 'center' }}>Loading payments…</p>;
  if (error)     return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Payments</h2>

      {payments.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerCell}>Order</th>
              <th style={headerCell}>Stripe ID</th>
              <th style={headerCell}>Amount ($)</th>
              <th style={headerCell}>Status</th>
              <th style={headerCell}>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={cell}>{p.orderName}</td>
                <td style={cell}>{p.stripeId}</td>
                <td style={cell}>{p.amount}</td>
                <td style={{ ...cell, textTransform: 'capitalize' }}>
                  {p.status.replace(/_/g, ' ')}
                </td>
                <td style={cell}>
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
