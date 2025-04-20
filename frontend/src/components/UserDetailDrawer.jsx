import React, { useState } from 'react';
import api from '../api/axios';

export default function UserDetailDrawer({ user, onClose, onUpdated }) {
  const [role, setRole] = useState(user.role);

  const save = async () => {
    await api.patch(`/users/${user._id}`, { role });
    onUpdated();
  };

  return (
    <>
      <div className="backdrop" onClick={onClose}/>
      <div className="drawer">
        <h3>User Details</h3>
        <p><strong>ID:</strong> {user._id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="restaurant_admin">Restaurant Admin</option>
            <option value="delivery_personnel">Delivery Person</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button onClick={save}>Save Role</button>{' '}
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
}
