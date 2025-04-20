import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="container">
      <h2>Welcome to FoodiePortal</h2>
      <p>Order food, manage deliveries, and more—all in one place.</p>
      <Link to="/register"><button>Get Started</button></Link>
    </div>
  );
}
