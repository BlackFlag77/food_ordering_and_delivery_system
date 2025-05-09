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

      const res = await api.patch(`/users/${user._id}`, payload);
      swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });

      onUpdated(res.data.user);
    } catch (err) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || err.message,
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed z-50 top-[9rem] left-1/2 w-full max-w-md max-h-[70vh] overflow-y-auto -translate-x-1/2 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-[var(--primary-dark)] mb-6">Edit Profile</h2>
        <form onSubmit={submit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
            />
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={form.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md shadow-sm text-gray-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-sm transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
