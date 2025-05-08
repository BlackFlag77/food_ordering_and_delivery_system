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
    }
  };

  return (
    <>
      {/* Dark backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed z-50 top-[9rem] left-1/2 w-full max-w-md max-h-[70vh] overflow-y-auto -translate-x-1/2 bg-white rounded-xl shadow-xl p-6 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-[var(--primary-dark)] mb-6">Edit User</h2>
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="john@gmail.com"
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
              placeholder="+15551234567"
              required
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]"
            >
              <option value="customer">Customer</option>
              <option value="restaurant_admin">Restaurant Admin</option>
              <option value="delivery_personnel">Delivery Person</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
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


// import React, { useState } from 'react';
// import api from '../api/axios';
// import Swal from 'sweetalert2';

// export default function EditUserModal({ user, onClose, onSaved }) {
//   if (!user) return null;

//   const [form, setForm] = useState({
//     name: user.name || '',
//     email: user.email || '',
//     phoneNumber: user.phoneNumber || '',
//     role: user.role || 'customer'
//   });

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.patch(`/users/${user._id}`, form);
//       Swal.fire({
//         icon: 'success',
//         title: 'User Updated',
//         text: 'The user has been updated successfully.',
//         timer: 2000,
//         showConfirmButton: false
//       });
//       onSaved();
//     } catch (err) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: err.response?.data?.message || err.message,
//         confirmButtonText: 'OK'
//       });
//       //alert(err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <>
//       <div className="backdrop" onClick={onClose} />
//       <div className="modal">
//         <h3>Edit User</h3>
//         <form onSubmit={submit}>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               required
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               required
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Phone Number</label>
//             <input
//               type="tel"
//               placeholder="+15551234567"
//               required
//               value={form.phoneNumber}
//               onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
//             />
//           </div>


//           <div className="form-group">
//             <label>Role</label>
//             <select
//               value={form.role}
//               onChange={(e) => setForm({ ...form, role: e.target.value })}
//             >
//               <option value="customer">Customer</option>
//               <option value="restaurant_admin">Restaurant Admin</option>
//               <option value="delivery_personnel">Delivery Person</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           <button type="submit">Save</button>{' '}
//           <button type="button" onClick={onClose}>Cancel</button>
//         </form>
//       </div>
//     </>
//   );
// }
