import React, { useState } from 'react';
import api from '../api/axios';
import swal from 'sweetalert2';

export default function EditProfileModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    role: user.role || ''
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        role: form.role
      };

  
      // Make sure backend returns updated user
      const res = await api.patch(`/users/${user._id}`, payload);
      swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });

      // Send updated user to ProfilePage
      onUpdated(res.data.user);
    } catch (err) {
      swal.fire({
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
            <label>Phone Number</label>
            <input
              type="tel"
              required
              value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
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
