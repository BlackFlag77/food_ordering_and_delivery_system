import React, { useState, useEffect, useContext } from 'react';
import axios                                    from 'axios';
import { useParams }                            from 'react-router-dom';
import { loadStripe }                           from '@stripe/stripe-js';
import { Elements }                             from '@stripe/react-stripe-js';
import { AuthContext }                          from '../context/AuthContext';
import PaymentElementForm                       from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const { orderId } = useParams();
  const { token }   = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // 1) Ask your payment-service to create a PaymentIntent
    axios.post(
      `${import.meta.env.VITE_PAYMENT_SERVICE_URL}/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(r => setClientSecret(r.data.clientSecret))
    .catch(console.error);
  }, [orderId, token]);

  // 2) Don't render the form until we have the clientSecret
  if (!clientSecret) return <p>Loading payment form…</p>;

  // 3) Wrap in Elements, passing the clientSecret option
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentElementForm />
    </Elements>
  );
}
