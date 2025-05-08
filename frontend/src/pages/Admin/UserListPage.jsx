import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import CreateUserModal from '../../components/CreateUserModal';
import EditUserModal from '../../components/EditUserModal';
import UserDetailDrawer from '../../components/UserDetailDrawer';
import { AuthContext } from '../../context/AuthContext';
import swal from 'sweetalert2';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';

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
      text: 'This action is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
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

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)]">Manage Users</h1>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded shadow transition"
        >
          <PlusIcon className="h-5 w-5" />
          Create User
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, phone or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border border-[var(--gray-light)] rounded shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent-dark)]"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-[var(--accent)] text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} className="border-t hover:bg-[var(--gray-light)]">
                <td
                  onClick={() => setDrawerUser(u)}
                  className="px-6 py-4 font-semibold text-[var(--primary-dark)] cursor-pointer hover:underline"
                >
                  {u.name}
                </td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.phoneNumber}</td>
                <td className="px-6 py-4 capitalize">{u.role.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="inline-flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded transition"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(u._id)}
                    className="inline-flex items-center px-3 py-1 bg-[var(--danger)] hover:bg-red-700 text-white text-xs font-semibold rounded transition"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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


// import React, { useEffect, useState, useContext } from 'react';
// import api from '../../api/axios';
// import CreateUserModal from '../../components/CreateUserModal';
// import EditUserModal from '../../components/EditUserModal';
// import UserDetailDrawer from '../../components/UserDetailDrawer';
// import { AuthContext } from '../../context/AuthContext';
// import swal from 'sweetalert2';
// import '../../styles/index.css';

// export default function UserListPage() {
//   const { user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [editUser, setEditUser] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [drawerUser, setDrawerUser] = useState(null);
//   const [search, setSearch] = useState('');

//   const fetch = () => {
//     api.get('/users')
//       .then(r => setUsers(r.data))
//       .catch(console.error);
//   };

//   useEffect(fetch, []);

  
//   const filteredUsers = users.filter(u =>
//     u.name.toLowerCase().includes(search.toLowerCase()) ||
//     u.email.toLowerCase().includes(search.toLowerCase()) ||
//     u.phoneNumber?.toLowerCase().includes(search.toLowerCase()) ||
//     u.role.toLowerCase().includes(search.toLowerCase())
//   );
//   const onCreate = () => setShowCreateModal(true);

//   const onEdit = (user) => {
//     setEditUser(user);
//     setShowEditModal(true);
//   };

//   const onDelete = async (id) => {
//     const result = await swal.fire({
//       title: 'Are you sure?',
//       text: 'This action cannot be undone!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });
  
//     if (result.isConfirmed) {
//       try {
//         await api.delete(`/users/${id}`);
//         swal.fire({
//           icon: 'success',
//           title: 'User Deleted',
//           text: 'The user has been deleted successfully.',
//           timer: 2000,
//           showConfirmButton: false
//         });
//         fetch(); // reload user list
//       } catch (err) {
//         swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: err.response?.data?.message || 'Failed to delete user.',
//         });
//       }
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Manage Users</h2>
//       <button onClick={onCreate}>Create User</button>

//       <div className="form-group" style={{ marginTop: '1em' }}>
//         <input
//           type="text"
//           placeholder="Search by name, email, phone or role"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ padding: '0.5em', width: '100%', maxWidth: '400px' }}
//         />
//       </div>

//       <table style={{ width: '100%', marginTop: '1em', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr><th>Name</th><th>Email</th><th>Phone Number</th><th>Role</th><th>Actions</th></tr>
//         </thead>
//         <tbody>
//           {filteredUsers.map(u => (
//             <tr key={u._id} style={{ borderTop: '1px solid #ddd' }}>
//               <td onClick={() => setDrawerUser(u)} style={{ cursor: 'pointer' }}>{u.name}</td>
//               <td>{u.email}</td>
//               <td>{u.phoneNumber}</td>
//               <td>{u.role}</td>
//               <td>
//                 <button onClick={() => onEdit(u)}>Edit</button>{' '}
//                 <button onClick={() => onDelete(u._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Create Modal */}
//       {showCreateModal && (
//         <CreateUserModal
//           onClose={() => setShowCreateModal(false)}
//           onCreated={() => {
//             setShowCreateModal(false);
//             fetch();
//           }}
//         />
//       )}

//       {/* Edit Modal */}
//       {editUser && showEditModal && (
//         <EditUserModal
//           user={editUser}
//           onClose={() => {
//             setShowEditModal(false);
//             setEditUser(null);
//           }}
//           onSaved={() => {
//             setShowEditModal(false);
//             setEditUser(null);
//             fetch();
//           }}
//         />
//       )}

//       {/* Drawer */}
//       {drawerUser && (
//         <UserDetailDrawer
//           user={drawerUser}
//           onClose={() => setDrawerUser(null)}
//           onUpdated={() => {
//             setDrawerUser(null);
//             fetch();
//           }}
//         />
//       )}
//     </div>
//   );
// }
