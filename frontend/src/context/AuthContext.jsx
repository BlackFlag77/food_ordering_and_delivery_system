import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Create AuthContext to hold user info and raw JWT	export const AuthContext = createContext();
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const nav = useNavigate();
  // State for decoded user (id & role)
  const [user, setUser]   = useState(null);
  // State for raw JWT
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Decode token to user whenever it changes
  useEffect(() => {
    if (token) {
      const { user: payloadUser } = jwtDecode(token);
      setUser({ id: payloadUser.id, role: payloadUser.role });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    // Store token and user
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    // Redirect by role
    switch (res.data.user.role) {
      case 'customer':
        nav('/customer');
        break;
      case 'restaurant_admin':
        nav('/restaurant');
        break;
      case 'delivery_personnel':
        nav('/delivery');
        break;
      case 'admin':
        nav('/admin/users');
        break;
      default:
        nav('/');
    }
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
    nav('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    nav('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
