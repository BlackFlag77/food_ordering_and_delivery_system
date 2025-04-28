// src/components/AppHeader.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AppHeader.css';

const AppHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      // Only navigate to home if we're not already there
      if (location.pathname !== '/') {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isCustomerOrdersPage = location.pathname === '/customer/orders';
  const isCustomerRestaurantsPage = location.pathname === '/customer/restaurants';
  const isAdminRetaurantspage =location.pathname ==='/restaurant';

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span>🍽️</span> FoodDelivery
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {!isCustomerOrdersPage && !isCustomerRestaurantsPage && (
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              )}
          {!isHomePage && !isLoginPage && !isRegisterPage && !isAdminRetaurantspage &&(
            <>
              
              <Link 
                to="/customer/restaurants" 
                className={`nav-link ${isActive('/customer/restaurants') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Restaurants
              </Link>
            </>
          )}
          
          {user ? (
            <>
              {user.role === 'customer' && (
                <Link 
                  to="/customer/orders" 
                  className={`nav-link ${isActive('/customer/orders') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              {user.role === 'restaurant' && (
                <Link 
                  to="/restaurant/dashboard" 
                  className={`nav-link ${isActive('/restaurant/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Restaurant Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button 
                className="nav-link" 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
