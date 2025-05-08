import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import restaurantApi from '../api/restaurantApi';
import placeholderImage from '../assets/placeholder-food.jpg';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  LocationMarkerIcon,
  StatusOnlineIcon,
  CollectionIcon,
  ExternalLinkIcon
} from '@heroicons/react/solid';

export default function OrderDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data: orderData } = await orderApi.get(`/orders/${id}`);
        setOrder(orderData);

        if (orderData.restaurantId) {
          try {
            const { data: restaurant } = await restaurantApi.get(`/restaurants/${orderData.restaurantId}`);
            setRestaurantInfo(restaurant);
          } catch (err) {
            console.warn('Could not fetch restaurant info:', err.response?.data || err.message);
            setRestaurantInfo(null);
          }
        }
      } catch (err) {
        console.error('Failed to load order', err);
        alert('Could not load order');
        nav(-1);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, nav]);

  const statusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-500 inline" />;
      case 'CONFIRMED':
        return <CheckCircleIcon className="w-5 h-5 text-green-600 inline" />;
      case 'CANCELLED':
        return <XCircleIcon className="w-5 h-5 text-red-500 inline" />;
      default:
        return null;
    }
  };

  if (loading || !order) {
    return <div className="text-center py-10 text-gray-600 text-lg">Loading your order...</div>;
  }

  return (
    <div
      className="max-w-4xl mx-auto px-6 py-10 shadow-2xl rounded-2xl backdrop-blur-md border border-white/30 animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, rgba(199, 255, 153, 0.75), rgba(192, 247, 170, 0.75))',
      }}
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-green-700 flex items-center gap-2 mb-1">
            <CollectionIcon className="w-8 h-8 text-green-600" />
            Order #{order._id.slice(-6)}
          </h1>
          <p className="text-sm text-gray-500">Placed successfully. Thank you for ordering with us!</p>
        </div>
        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-105"
        >
          <ArrowLeftIcon className="w-5 h-5 text-white" />
          Go Back
        </button>

      </div>

      <hr className="mb-8" />

      {/* Restaurant Details */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Restaurant Information</h2>
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-2 text-[1rem]">
          <p><strong>Name:</strong> {restaurantInfo?.name || 'N/A'}</p>
          <p className="flex items-center gap-1">
            <LocationMarkerIcon className="w-5 h-5 text-gray-500" />
            <span><strong>Address:</strong> {restaurantInfo?.address || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-1">
            <StatusOnlineIcon className="w-5 h-5 text-gray-500" />
            <span>
              <strong>Availability:</strong>{' '}
              {restaurantInfo?.availability
                ? <span className="text-green-600 font-semibold">Open Now</span>
                : <span className="text-red-500 font-semibold">Currently Closed</span>}
            </span>
          </p>
          {restaurantInfo && (
            <p className="pt-2">
              <Link
                to={`/customer/restaurant/${order.restaurantId}`}
                className="inline-flex items-center text-green-600 hover:text-green-800 hover:underline text-sm"
              >
                <ExternalLinkIcon className="w-4 h-4 mr-1" />
                View Full Menu
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Order Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-2 text-[1rem]">
          <p>
            <strong>Status:</strong> {statusIcon(order.status)}{' '}
            <span className="capitalize font-medium">{order.status.toLowerCase()}</span>
          </p>
          <p>
            <strong>Total Price:</strong>{' '}
            <span className="text-green-700 font-bold text-lg">${order.total.toFixed(2)}</span>
          </p>
          
        </div>
      </section>

      {/* Ordered Items */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Items in Your Order</h2>
        <ul className="space-y-5">
          {order.items.map((i) => (
            <li key={i.menuItemId} className="flex items-center bg-white rounded-lg shadow p-4 border">
              <img
                src={i.image || placeholderImage}
                alt={i.name}
                onError={(e) => (e.target.src = placeholderImage)}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="ml-6 flex flex-col justify-between">
                <p className="text-lg font-semibold text-gray-800">{i.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: <span className="font-medium">{i.quantity}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Unit Price: ${i.price.toFixed(2)} |{' '}
                  <span className="text-gray-800 font-semibold">
                    Subtotal: ${(i.price * i.quantity).toFixed(2)}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
