// src/components/AppHeader.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AppHeader.css';
import swal from 'sweetalert2';

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
      swal.fire({
        icon: 'success',
        title: 'Logged out successfully',
        text: 'You have been logged out.',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsMobileMenuOpen(false);
      // Only navigate to home if we're not already there
      if (location.pathname !== '/') {
        navigate('/');
      }
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Logout failed',
        text: error.response?.data?.message || error.message,
        showConfirmButton: true,
      }); 
      //console.error('Logout failed:', error);
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
        <Link  className="logo">
          <span>🍽️</span> FoodDelivery
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
         {!user && (
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
          )}
          {user?.role === 'customer'&&!isHomePage && !isLoginPage && !isRegisterPage && !isAdminRetaurantspage &&(
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
              
              {user.role === 'customer' && (
                <Link 
                  to="/payments" 
                  className={`nav-link ${isActive('/payments') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Payment
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
                  to="/admin/users" 
                  className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              <Link 
                className="nav-link" 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
                </Link>
                
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={user.name}
                  className="
                    relative
                    flex items-center justify-center
                    w-12 h-12
                    bg-gradient-to-br from-green-600 to-green-800
                    rounded-full
                    text-white text-xl font-semibold
                    shadow-lg
                    ring-2 ring-white ring-offset-2 ring-offset-green-800
                    transition-transform duration-200 ease-out
                    hover:scale-110 hover:shadow-2xl
                    ml-4
                  "
                >
                  {user.name?.trim()?.[0]?.toUpperCase() || '?'}

                  {/* online-status dot */}
                  <span className="
                    absolute bottom-0 right-0
                    w-3 h-3
                    bg-green-400
                    border-2 border-white
                    rounded-full
                  " />
                </Link>
              
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
