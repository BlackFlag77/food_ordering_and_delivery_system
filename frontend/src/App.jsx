import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppHeader from './components/AppHeader';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import UserListPage from './pages/Admin/UserListPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppHeader />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['customer']} />}>
            <Route path="customer" element={<CustomerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={['restaurant_admin']} />}>
            <Route path="restaurant" element={<RestaurantDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={['delivery_personnel']} />}>
            <Route path="delivery" element={<DeliveryDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="admin/users" element={<UserListPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
