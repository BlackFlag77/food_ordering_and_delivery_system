import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = jwtDecode(token);
      setUser({ id: payload.user.id, role: payload.user.role });
    }
  }, []);

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    const { user: u } = res.data;
    setUser(u);
    // redirect by role
    switch (u.role) {
      case 'customer': nav('/customer'); break;
      case 'restaurant_admin': nav('/restaurant'); break;
      case 'delivery_personnel': nav('/delivery'); break;
      case 'admin': nav('/admin/users'); break;
      default: nav('/');
    }
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
    nav('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    nav('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
