import React, { useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { XIcon } from '@heroicons/react/outline';

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'customer',
    password: '',
    phoneNumber: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      Swal.fire({
        icon: 'success',
        title: 'User Created',
        text: 'The user has been created successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      onCreated();
    } catch (err) {
      Swal.fire({
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
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-50 top-[9rem] left-1/2 w-full max-w-md max-h-[70vh] overflow-y-auto -translate-x-1/2 bg-white rounded-xl shadow-lg p-6">
        
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-[var(--primary-dark)] mb-6">
            Create New User
          </h2>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="johnDoeExamlpe@gmail.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="+15551234567"
                required
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-white shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
              >
                <option value="customer">Customer</option>
                <option value="restaurant_admin">Restaurant Admin</option>
                <option value="delivery_personnel">Delivery Personnel</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder='********'
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
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
                Create
              </button>
            </div>
          </form>
        </div>
      
    </>
  );
}
