import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import restaurantApi from '../api/restaurantApi';
import placeholderFood from '../assets/placeholder-food.jpg';
import Swal from 'sweetalert2';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
} from '@heroicons/react/solid';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const [cartRes, menuRes] = await Promise.all([
        orderApi.get(`/carts?restaurantId=${restaurantId}`),
        restaurantApi.get(`/restaurants/${restaurantId}/menu`)
      ]);
      const cartItems = cartRes.data.items || cartRes.data;
      const menuItems = menuRes.data;

      const enriched = cartItems.map(cartItem => {
        const match = menuItems.find(mi => mi._id.toString() === cartItem.menuItemId.toString());
        return {
          ...cartItem,
          image: match?.imageUrl ||placeholderFood
        };
      });
      setCart(enriched);
    } catch (err) {
      console.error('Failed to load cart or menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    if (quantity < 1) return removeItem(menuItemId);
    try {
      await orderApi.patch(`/carts/${menuItemId}?restaurantId=${restaurantId}`, { quantity });
      await loadCart();
    } catch {
      Swal.fire('Error', 'Failed to update quantity.', 'error');
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      await orderApi.delete(`/carts/${menuItemId}?restaurantId=${restaurantId}`);
      Swal.fire('Success', 'Item removed from cart.', 'success');
      await loadCart();
    } catch {
      Swal.fire('Error', 'Failed to remove item.', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await orderApi.delete(`/carts?restaurantId=${restaurantId}`);
      Swal.fire('Success', 'Cart cleared successfully.', 'success');
      await loadCart();
    } catch {
      Swal.fire('Error', 'Failed to clear cart.', 'error');
    }
  };

  const placeOrder = async () => {
    try {
      await orderApi.post('/orders', { restaurantId });
      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Make the payment to confirm your order.',
      });
      navigate('/customer/orders');
    } catch (err) {
      Swal.fire('Order Failed', err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredCart = cart.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center py-10 text-gray-500">Loading cart…</p>;

  return (
    
    <div
      className="max-w-5xl mx-auto rounded-lg p-8 shadow-lg animate-fade-in"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(199, 255, 153, 0.75), rgba(192, 247, 170, 0.75))`
      }}
    >

        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold text-[var(--primary-dark)] mb-2 inline-flex items-center gap-2 justify-center">
            <ShoppingCartIcon className="w-7 h-7 text-green-600" />
            My Cart
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Review your selected items before placing the order.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md relative">
        <input
          type="text"
          placeholder="Search items in cart..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] focus:border-transparent text-sm"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"
            />
          </svg>
        </div>
      </div>


        {filteredCart.length === 0 ? (
          <div className="text-center text-black-500 py-12">
            <p className="text-lg font-semibold">Your cart is currently empty.</p>
            <p className="text-sm text-black-400">Browse the restaurant menu to add your favorite dishes.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {filteredCart.map(item => (
                <div key={item.menuItemId} className="flex bg-white shadow rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover border-r"
                  />
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        <MinusIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        <PlusIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="flex items-center gap-2 px-4 py-2 text-base font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition ml-auto"
                      >
                        <TrashIcon className="w-5 h-5" />
                        Delete Item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="mt-10 bg-gray-50 border-t pt-6 rounded-lg shadow-inner px-6 py-6 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-lg font-semibold">Cart Total</p>
                <p className="text-2xl text-green-700 font-extrabold">${calculateTotal().toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <em>***Delivery charges may apply at the time of payment.</em>
                </p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-gray-300 text-gray-700 border rounded hover:bg-gray-400 transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={placeOrder}
                  className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
                >
                  Place Order
                </button>
              </div>
            </div>
          </>
        )}

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm text-black- rounded hover:bg-green hover:text-white transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Restaurant
          </button>
          <p className="text-xs text-gray-700 mt-1">
            Want to explore more dishes? Return to the menu.
          </p>
        </div>
      </div>
    
  );
}
