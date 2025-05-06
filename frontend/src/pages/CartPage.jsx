import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import orderApi from '../api/orderApi';


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
      await loadCart();
    } catch {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      await orderApi.delete(`/carts/${menuItemId}?restaurantId=${restaurantId}`);
      await loadCart();
    } catch {
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await orderApi.delete(`/carts?restaurantId=${restaurantId}`);
      await loadCart();
    } catch {
      alert('Failed to clear cart');
    }
  };

  const placeOrder = async () => {
    try {
      await orderApi.post('/orders', { restaurantId });
      alert('Order placed successfully!');
      navigate('/customer/orders');
    } catch (err) {
      console.error('Order Error:', err.response?.data);
      alert(err.response?.data?.message || 'Order failed');
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
