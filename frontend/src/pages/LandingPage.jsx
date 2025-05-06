import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>FoodiePortal</h1>
          <p className="hero-subtitle">Your one-stop platform for food ordering and delivery</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="food-icon">🍽️</div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose FoodiePortal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍕</div>
            <h3>Wide Selection</h3>
            <p>Browse menus from hundreds of restaurants in your area</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Get your food delivered quickly by our reliable delivery partners</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Payment</h3>
            <p>Multiple payment options for a seamless checkout experience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Track Orders</h3>
            <p>Real-time tracking of your order from kitchen to doorstep</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Order?</h2>
        <p>Join thousands of satisfied customers who order with FoodiePortal</p>
        <Link to="/register" className="btn-primary">Create Account</Link>
      </div>
    </div>
  );
}
