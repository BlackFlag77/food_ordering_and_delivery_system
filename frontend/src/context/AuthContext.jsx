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
    console.log(" Logged in as role:", u.role);
    setUser(u);
    // redirect by role

       switch (u.role) {
           case 'customer':
             return nav('/customer');
           case 'restaurant_admin':
             return nav('/restaurant');
           case 'delivery_personnel':
             return nav('/delivery');
           case 'admin':
             return nav('/admin/users');
           default:
             return nav('/');
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
