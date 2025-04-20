import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function DeliveryDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(()=>{
    api.get(`/users/${user.id}/deliveries`)
      .then(r=>setData(r.data))
      .catch(console.error);
  },[user.id]);

  return (
    <div className="container">
      <h2>Delivery Dashboard</h2>
      {data ? (
        <pre>{JSON.stringify(data,null,2)}</pre>
      ) : <p>Loading…</p>}
    </div>
  );
}
