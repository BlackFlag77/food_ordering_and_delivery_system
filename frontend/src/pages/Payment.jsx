import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  CreditCardIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from '@heroicons/react/outline';

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
        setError('Failed to load payment history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <RefreshIcon className="w-6 h-6 animate-spin mb-3 text-green-500" />
        <p>Loading your payment history...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <ExclamationCircleIcon className="w-10 h-10 mb-3" />
        <p>{error}</p>
      </div>
    );

  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    preparing: 'bg-green-100 text-green-800',
    ready: 'bg-green-100 text-green-800',
    'picked-up': 'bg-blue-100 text-blue-800',
    delivered: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <CreditCardIcon className="flex w-10 h-10 text-green-600 mb-2" />
        <h2 className="flex text-3xl font-bold text-[var(--primary-dark)]">Payment History</h2>
        <p className="text-gray-600 text-sm mt-1">
          Here you can review all the payments you've made for your orders.
        </p>
      </div>

      {/* Empty state */}
      {payments.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">You haven’t made any payments yet.</p>
          <p className="text-sm mt-1">Once you place an order and complete a payment, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((p) => {
            const key = p.status.toLowerCase().replace(/_/g, '-');
            const badge = statusClasses[key] || 'bg-gray-100 text-gray-800';

            return (
              <div
                key={p._id}
                className="bg-gradient-to-br from-green-100 via-lime-100 to-green-200 backdrop-blur-md bg-opacity-70 shadow-lg rounded-2xl border border-green-200 hover:shadow-xl transition-all p-6 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{p.orderName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(p.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                  <span><strong>Paid:</strong> ${p.amount.toFixed(2)} USD</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
