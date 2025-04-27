// src/components/AppHeader.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AppHeader() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="container header">
      <h1>
        <Link to="/">FoodiePortal</Link>
      </h1>
      <nav className="nav">
        {/*
          Only show “Home” when there is NO role on the user object
          (i.e. not logged in yet, or user.role is undefined/null)
        */}
        {!user?.role && <Link to="/">Home</Link>}

        {user ? (
          <>
            {user.role === 'customer' && <Link to="/customer">Dashboard</Link>}
            {user.role === 'customer' && <Link to="/orders">order</Link>}
            {user.role === 'restaurant_admin' && <Link to="/restaurant">Restaurant</Link>}
            {user.role === 'delivery_personnel' && <Link to="/delivery">Delivery</Link>}
            {user.role === 'admin' && <Link to="/admin/users">Users</Link>}
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
