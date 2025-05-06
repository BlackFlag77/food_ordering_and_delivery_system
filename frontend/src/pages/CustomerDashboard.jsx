import React, { useEffect, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function CustomerDashboard() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to restaurants list
    navigate('/customer/restaurants');
  }, [navigate]);

  return (
    <div className="container">
      <div className="loading-spinner">Redirecting to restaurants...</div>

    </div>
  );
}
