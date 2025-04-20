import React, { useState } from 'react';
import api from '../api/axios';

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'customer',
    password: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      onCreated();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <h3>Create User</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="restaurant_admin">Restaurant Admin</option>
              <option value="delivery_personnel">Delivery Person</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit">Create</button>{' '}
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </>
  );
}
