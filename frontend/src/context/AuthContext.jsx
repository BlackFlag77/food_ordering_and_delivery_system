// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Create AuthContext to hold user info and raw JWT
export const AuthContext = createContext();

// Consumer hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const nav = useNavigate();

  // 1) Lazy-load token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // 2) Derive user from token on mount, catch bad tokens
  const [user, setUser] = useState(() => {
    if (!token) return null;
    try {
      const { user: u } = jwtDecode(token);
      return { id: u.id, role: u.role, name: u.name };
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  });

  // 3) Sync token localStorage & update user whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const { user: u } = jwtDecode(token);
      setUser({ id: u.id, role: u.role, name: u.name });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // 4) Actions
  const login = async (data) => {
    try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    switch (res.data.user.role) {
      case 'customer':           return nav('/customer');
      case 'restaurant_admin':   return nav('/restaurant');
      case 'delivery_personnel': return nav('/delivery');
      case 'admin':              return nav('/admin/users');
      default:                   return nav('/');
    }
      } catch (err) {
        const message = err.response?.data?.message || 'Login failed';
        throw new Error(message); // Send it to the component for SweetAlert
      }
  };

  const register = async (data) => {
    try {
      await api.post('/auth/register', data);
      nav('/login');
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed';
      throw new Error(message); // So SweetAlert can show it
    }
  };

  const logout = () => {
    try {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    nav('/login');
  } catch (err) {
    const message = err?.response?.data?.message || 'Logout failed';
    throw new Error(message); // So SweetAlert can show it
  }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
