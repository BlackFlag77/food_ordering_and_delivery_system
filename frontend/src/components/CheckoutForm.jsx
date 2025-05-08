import React, { useContext, useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CheckoutForm() {
  const { orderId } = useParams();
  const stripe      = useStripe();
  const elements    = useElements();
  const navigate    = useNavigate();
  const { token }   = useContext(AuthContext);

  const [orderName, setOrderName]   = useState('');
  const [error, setError]           = useState('');
  const [isProcessing, setProcessing] = useState(false);

  // 1) Fetch order details to get a display name
  useEffect(() => {
    if (!token) return;
    axios.get(
      `${import.meta.env.VITE_ORDER_SERVICE_URL}/orders/${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      const o = res.data;
      // Prefer restaurantName; otherwise join item names
      setOrderName(o.items.map(i => i.name).join(', ') || 'your order');

    })
    .catch(err => {
      console.error('Failed to load order:', err);
      setOrderName('your order');
    });
  }, [orderId, token]);

  // 2) Handle form submission exactly as before
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError('');
    setProcessing(true);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/payments'
      },
      redirect: 'if_required'
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await axios.patch(
          `${import.meta.env.VITE_PAYMENT_SERVICE_URL}/${paymentIntent.id}/status`,
          { status: paymentIntent.status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (patchErr) {
        console.error('Failed to patch status:', patchErr);
      }
      navigate('/payments');
    } else {
      setError(`Payment ${paymentIntent.status}.`);
      setProcessing(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Your payment for <strong>{orderName}</strong>
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <PaymentElement
            options={{ layout: 'tabs' }}
            onChange={e => {
              if (e.error) setError(e.error.message);
              else setError('');
            }}
          />
        </div>

        {error && (
          <div style={{
            color: '#b00020',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: isProcessing ? '#999' : '#508D4E',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? 'Processing…' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}
