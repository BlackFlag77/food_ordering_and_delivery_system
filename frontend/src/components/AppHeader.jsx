import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AppHeader() {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="container header">
      <h1><Link to="/">FoodiePortal</Link></h1>
      <nav className="nav">
        {user ? (
          <>
            <Link to="/">Home</Link>
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
