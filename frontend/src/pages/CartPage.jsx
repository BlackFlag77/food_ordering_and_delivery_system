import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import Swal from 'sweetalert2';


export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  const loadCart = async () => {
    try {
      const { data } = await orderApi.get(`/carts?restaurantId=${restaurantId}`);
      setCart(data.items || data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      if (quantity < 1) return removeItem(menuItemId);
      await orderApi.patch(`/carts/${menuItemId}?restaurantId=${restaurantId}`, { quantity });
      await Swal.fire({
        icon: 'success',
        title: 'Quantity Updated',
        text: 'The quantity has been updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      await loadCart();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update quantity. Please try again.',
      });
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      await orderApi.delete(`/carts/${menuItemId}?restaurantId=${restaurantId}`);
      await Swal.fire({
        icon: 'success',
        title: 'Item Removed',
        text: 'The item has been removed from your cart.',
        timer: 2000,
        showConfirmButton: false
      });
      await loadCart();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Remove Failed',
        text: 'Failed to remove item. Please try again.',
      });
    }
  };

  const clearCart = async () => {
    try {
      await orderApi.delete(`/carts?restaurantId=${restaurantId}`);
      await Swal.fire({
        icon: 'success',
        title: 'Cart Cleared',
        text: 'Your cart has been cleared successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      await loadCart();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Clear Failed',
        text: 'Failed to clear cart. Please try again.',
      });
    }
  };

  const placeOrder = async () => {
    try {
      await orderApi.post('/orders', { restaurantId });
      Swal.fire({
              icon: 'success',
              title: 'Order Placed successfully',
              text: 'Your order has been placed successfully! Make payment to confirm your order.',
              showConfirmButton: true
            });
      navigate('/customer/orders');
      } catch (err) {
        Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: err.response?.data?.message || 'An unknown error occurred',
              });
      }
    };

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.menuItemId}>
                {item.name} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}>+</button>
                <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}>-</button>
                <button onClick={() => removeItem(item.menuItemId)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ${calculateTotal().toFixed(2)}</p>
          <button onClick={placeOrder}>Place Order</button>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}
