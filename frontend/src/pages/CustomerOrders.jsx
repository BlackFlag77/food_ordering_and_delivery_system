import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';
import OrderCard from '../components/OrderCard';
import {
  RefreshIcon,
  ExclamationCircleIcon,
  ShoppingBagIcon,
  ArrowRightIcon
} from '@heroicons/react/outline';

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

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order._id !== orderId));
  };
  const handleUpdateOrder = (updatedOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-gray-600 text-lg">
        <div className="animate-spin inline-block mr-2">
          <RefreshIcon className="w-6 h-6 text-green-500" />
        </div>
        Fetching your recent orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="flex justify-center mb-4">
          <ExclamationCircleIcon className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong.</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center gap-1 mb-5">
      <div className="w-full flex flex-col items-center mt-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <ShoppingBagIcon className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-[var(--primary-dark)]">My Orders</h2>
        </div>
        <p className="text-gray-600 text-sm text-center max-w-md">
          View the status of your recent orders and take further action if needed.
        </p>
      </div>
      </div>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} onDelete={handleDeleteOrder} onUpdate={handleUpdateOrder} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 shadow-lg rounded-xl">
          <div className="flex justify-center mb-4">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl font-medium text-gray-700 mb-2">
            You haven't placed any orders yet.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Browse restaurants and start your food journey.
          </p>
          <button
            onClick={() => navigate('/customer/restaurants')}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow"
          >
            <span>Browse Restaurants</span>
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
