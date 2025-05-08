import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import CreateUserModal from '../../components/CreateUserModal';
import EditUserModal from '../../components/EditUserModal';
import UserDetailDrawer from '../../components/UserDetailDrawer';
import { AuthContext } from '../../context/AuthContext';
import swal from 'sweetalert2';
import { PlusIcon, PencilAltIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/outline';

export default function UserListPage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [drawerUser, setDrawerUser] = useState(null);
  const [search, setSearch] = useState('');

  const fetch = () => {
    api.get('/users')
      .then(r => setUsers(r.data))
      .catch(console.error);
  };

  useEffect(fetch, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phoneNumber?.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const onCreate = () => setShowCreateModal(true);

  const onEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const onDelete = async (id) => {
    const result = await swal.fire({
      title: 'Delete this user?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetch();
      } catch (err) {
        swal.fire('Error', err.response?.data?.message || 'Failed to delete user.', 'error');
      }
    }
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-700',
    customer: 'bg-green-100 text-green-700',
    restaurant_admin: 'bg-yellow-100 text-yellow-800',
    delivery_personnel: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-8 w-8 text-[var(--primary-dark)]" />
          <h1 className="text-3xl font-extrabold text-[var(--primary-dark)] tracking-tight">
            Manage Users
          </h1>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          <PlusIcon className="h-5 w-5" />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center max-w-lg w-full relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by name, email, phone or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)] transition duration-150"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-[var(--accent)] text-white text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr
                  key={u._id}
                  className="hover:bg-green-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out"
>
                  <td
                    onClick={() => setDrawerUser(u)}
                    className="px-6 py-4 font-medium text-green-700 hover:underline cursor-pointer"
                  >
                    {u.name}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.phoneNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColors[u.role] || 'bg-gray-100 text-gray-800'}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onEdit(u)}
                      className="inline-flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded"
                    >
                      <PencilAltIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(u._id)}
                      className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals & Drawer */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetch();
          }}
        />
      )}
      {editUser && showEditModal && (
        <EditUserModal
          user={editUser}
          onClose={() => {
            setShowEditModal(false);
            setEditUser(null);
          }}
          onSaved={() => {
            setShowEditModal(false);
            setEditUser(null);
            fetch();
          }}
        />
      )}
      {drawerUser && (
        <UserDetailDrawer
          user={drawerUser}
          onClose={() => setDrawerUser(null)}
          onUpdated={() => {
            setDrawerUser(null);
            fetch();
          }}
        />
      )}
    </div>
  );
}
