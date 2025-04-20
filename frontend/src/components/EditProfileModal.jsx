import React, { useState } from 'react';
import api from '../api/axios';

export default function EditProfileModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '',
    role: user.role || ''
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      // Make sure backend returns updated user
      const res = await api.patch(`/users/${user._id}`, payload);

      // Send updated user to ProfilePage
      onUpdated(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <h3>Edit Profile</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>New Password (optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value={form.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              readOnly
            />
          </div>

          <button type="submit">Save</button>{' '}
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </>
  );
}
