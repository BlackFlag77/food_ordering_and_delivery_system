import React, { useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function EditUserModal({ user, onClose, onSaved }) {
  if (!user) return null;

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    role: user.role || 'customer'
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/users/${user._id}`, form);
      Swal.fire({
        icon: 'success',
        title: 'User Updated',
        text: 'The user has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      onSaved();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || err.message,
        confirmButtonText: 'OK'
      });
      //alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <h3>Edit User</h3>
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
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+15551234567"
              required
              value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
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

          <button type="submit">Save</button>{' '}
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </>
  );
}
