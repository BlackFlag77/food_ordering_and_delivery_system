// src/controllers/paymentController.js

const axios     = require('axios');
const stripe    = require('stripe')(process.env.STRIPE_SECRET);
const Payment   = require('../models/payment');

exports.processPayment = async (req, res) => {
  try {
    const orderId    = req.params.orderId;
    const authHeader = req.headers.authorization;
    const body       = { status: 'CONFIRMED' };

    // 1) Fetch order
    const { data: order } = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}`,
      { headers: { Authorization: authHeader } }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // 2) Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      customer: order.stripeCustomerId,
      metadata: { orderId, userId: order.customerId }
    });

    // 3) Save payment record
    const payment = await new Payment({
      userId:   order.customerId,
      orderId,
      amount:   order.total,
      currency: 'usd',
      stripeId: paymentIntent.id,
      status:   paymentIntent.status
    }).save();

    // 4) Update order status
    await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}/status`,
      body,
      { headers: { Authorization: authHeader } }
    );

    res.status(200).json({
      success:      true,
      payment,
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error('Payment error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  const payments = await Payment
    .find({ userId: req.user.id, status: 'succeeded' })
    .sort('-createdAt');
  res.json(payments);
};

exports.patchPaymentStatus = async (req, res, next) => {
  try {
    const { piId }   = req.params;   // the Stripe PaymentIntent ID
    const { status } = req.body;     // e.g. "succeeded"
    const authHeader = req.headers.authorization;

    // 1) Update the payment record in Mongo
    const payment = await Payment.findOneAndUpdate(
      { stripeId: piId },
      { status },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    const { data: order } = await axios.get(
            `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.orderId}`,
            { headers: { Authorization: authHeader } }
          );
          const orderName = order.restaurantName
            || order.items.map(i => i.name).join(', ')
            || `#${payment.orderId}`;

    // 2) If it just succeeded, notify via email & WhatsApp
    if (status === 'succeeded') {
      // a) fetch user info
      const { data: user } = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/users/${payment.userId}`,
        { headers: { Authorization: authHeader } }
      );
      const { email, name, phoneNumber } = user;

      // b) prepare messages
      const amount  = (payment.amount);
      const subject = 'Your payment succeeded!';
      const text    = `
Hi ${name || 'Customer'},

We’ve received your payment of $${amount} for order #${orderName}.
Thank you for your purchase!

— The FoodiePortal Team
      `.trim();

      // c) call Notification Service → email
      try {
        await axios.post(
          `${process.env.NOTIFI_SERVICE_URL}/notifications/email`,
          { to: email, subject, text },
          { headers: { Authorization: authHeader } }
        );
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr.message);
      }

      // d) call Notification Service → WhatsApp
      if (phoneNumber) {
        const waBody = `Your payment of $${amount} for order ${orderName} succeeded!`;
        try {
          await axios.post(
            `${process.env.NOTIFI_SERVICE_URL}/notifications/whatsapp`,
            { to: phoneNumber, body: waBody },
            { headers: { Authorization: authHeader } }
          );
        } catch (waErr) {
          console.error('Failed to send WhatsApp message:', waErr.message);
        }
      }
    }

    // 3) return updated payment
    res.json(payment);

  } catch (err) {
    next(err);
  }
};
