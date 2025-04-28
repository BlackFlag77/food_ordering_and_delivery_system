// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const nav = useNavigate();

  // on first render, grab token + decode
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      // we signed { user: { id, role } } on the backend
      const { user: u } = jwtDecode(token);
      return u;
    } catch {
      // malformed / expired token
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    // redirect by role
    switch (res.data.user.role) {
      case 'customer':          return nav('/customer');
      case 'restaurant_admin':  return nav('/restaurant');
      case 'delivery_personnel':return nav('/delivery');
      case 'admin':             return nav('/admin/users');
      default:                  return nav('/');
    }
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
    nav('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Remove the automatic navigation
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
