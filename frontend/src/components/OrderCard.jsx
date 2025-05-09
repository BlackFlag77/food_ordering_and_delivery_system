import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';
import Swal from 'sweetalert2';
import {
  ClockIcon,
  CreditCardIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/outline';

const PayNowButton = ({ orderId }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/checkout/${orderId}`)}
      className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-base font-semibold rounded-lg shadow hover:bg-blue-700 transition"
    >
      <CreditCardIcon className="w-5 h-5 mr-2" />
      Pay Now
    </button>
  );
};

export default function OrderCard({ order, onDelete, onUpdate }) {
  const handleHardDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Permanently?',
      text: 'Only CANCELLED or DELIVERED orders can be deleted. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        await orderApi.delete(`/orders/${order._id}`);
        Swal.fire({
          icon: 'success',
          title: 'Order Deleted',
          text: 'The order has been permanently deleted.',
          showConfirmButton: false,
          timer: 1500
        });
        onDelete(order._id);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete order',
          text: error?.response?.data?.message || 'This order cannot be deleted yet.',
        });
      }
    }
  };

  const handleSoftDelete = async () => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        const { data: updated } = await orderApi.patch(`/orders/${order._id}/status`, {
          status: 'CANCELLED',
        });

        Swal.fire({
          icon: 'success',
          title: 'Order Cancelled',
          text: 'The order was cancelled successfully.',
          showConfirmButton: false,
          timer: 1500
        });

        onUpdate(updated);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to cancel order',
          text: error?.response?.data?.message || 'An unknown error occurred',
        });
      }
    }
  };

  const getStatusTag = (status) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    const statusStyles = {
      PENDING:    { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: <ClockIcon className="w-5 h-5 mr-2" /> },
      CONFIRMED:  { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Confirmed', icon: <CheckCircleIcon className="w-5 h-5 mr-2" /> },
      PREPARING:  { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Preparing', icon: <ClockIcon className="w-5 h-5 mr-2" /> },
      READY:      { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Ready',     icon: <CheckCircleIcon className="w-5 h-5 mr-2" /> },
      PICKED_UP:  { bg: 'bg-teal-100',   text: 'text-teal-700',   label: 'Picked Up', icon: <CheckCircleIcon className="w-5 h-5 mr-2" /> },
      DELIVERED:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Delivered', icon: <CheckCircleIcon className="w-5 h-5 mr-2" /> },
      CANCELLED:  { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Cancelled', icon: <XCircleIcon className="w-5 h-5 mr-2" /> },
    };

    const style = statusStyles[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      label: status,
      icon: <ClockIcon className="w-5 h-5 mr-2" />
    };

    return (
      <span className={`${base} ${style.bg} ${style.text}`}>
        {style.icon}
        {style.label}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-green-100 via-lime-100 to-green-200 backdrop-blur-md bg-opacity-70 shadow-lg rounded-2xl border border-green-200 hover:shadow-xl transition-all p-6 flex flex-col justify-between">
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xl font-bold text-gray-800">Order : {order._id.slice(-6)}</h4>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>{getStatusTag(order.status)}</div>
        </div>
      </div>

      <div className="mb-5">
        <div className="space-y-2 text-base text-gray-700">
          <p className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            <span><strong>Total:</strong> ${order.total.toFixed(2)} USD</span>
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/customer/orders/${order._id}`}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <EyeIcon className="w-5 h-5 mr-2" />
            View Details
          </Link>

          {order.status === 'PENDING' && (
            <>
              <PayNowButton orderId={order._id} />
              <button
                onClick={handleSoftDelete}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-yellow-700 border border-yellow-300 bg-yellow-50 rounded-md hover:bg-yellow-100 transition"
              >
                <XCircleIcon className="w-5 h-5 mr-2" />
                Cancel Order
              </button>
            </>
          )}

          {['CANCELLED', 'DELIVERED'].includes(order.status) && (
            <button
              onClick={handleHardDelete}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-500 border border-red-600 rounded-md hover:bg-red-600 transition"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Delete Permanently
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
