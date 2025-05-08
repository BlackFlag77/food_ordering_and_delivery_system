import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import CreateUserModal from '../../components/CreateUserModal';
import EditUserModal from '../../components/EditUserModal';
import UserDetailDrawer from '../../components/UserDetailDrawer';
import { AuthContext } from '../../context/AuthContext';
import swal from 'sweetalert2';

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
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        swal.fire({
          icon: 'success',
          title: 'User Deleted',
          text: 'The user has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        fetch(); // reload user list
      } catch (err) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete user.',
        });
      }
    }
  };

  return (
    <div className="container">
      <h2>Manage Users</h2>
      <button onClick={onCreate}>Create User</button>

      <div className="form-group" style={{ marginTop: '1em' }}>
        <input
          type="text"
          placeholder="Search by name, email, phone or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5em', width: '100%', maxWidth: '400px' }}
        />
      </div>

      <table style={{ width: '100%', marginTop: '1em', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone Number</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u._id} style={{ borderTop: '1px solid #ddd' }}>
              <td onClick={() => setDrawerUser(u)} style={{ cursor: 'pointer' }}>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phoneNumber}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => onEdit(u)}>Edit</button>{' '}
                <button onClick={() => onDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetch();
          }}
        />
      )}

      {/* Edit Modal */}
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

      {/* Drawer */}
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
