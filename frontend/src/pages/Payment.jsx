// src/pages/Payments.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Payments() {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data: pays } = await axios.get(
          `${import.meta.env.VITE_PAYMENT_SERVICE_URL}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const enriched = await Promise.all(
          pays.map(async (p) => {
            try {
              const { data: order } = await axios.get(
                `${import.meta.env.VITE_ORDER_SERVICE_URL}/orders/${p.orderId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return {
                ...p,
                orderName:
                  order.restaurantName ||
                  order.items.map((i) => i.name).join(', '),
              };
            } catch {
              return { ...p, orderName: 'Unknown Order' };
            }
          })
        );
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

  if (isLoading)
    return (
      <div className="flex justify-center py-16 text-gray-600">
        Loading payments…
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center py-16 text-red-500">
        {error}
      </div>
    );

  // map status to badge colors
  const statusClasses = {
    pending:       'bg-yellow-100 text-yellow-800',
    confirmed:     'bg-green-100 text-green-800',
    preparing:     'bg-green-100 text-green-800',
    ready:         'bg-green-100 text-green-800',
    'picked-up':   'bg-blue-100 text-blue-800',
    delivered:     'bg-blue-100 text-blue-800',
    cancelled:     'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Your Payments
      </h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-600">No payments yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((p) => {
            const key = p.status.toLowerCase().replace(/_/g, '-');
            const badge = statusClasses[key] || 'bg-gray-100 text-gray-800';
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow p-6 transform hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {p.orderName}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
                  >
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div>
                    <span className="font-medium">Amount:</span>{' '}
                    ${p.amount.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
