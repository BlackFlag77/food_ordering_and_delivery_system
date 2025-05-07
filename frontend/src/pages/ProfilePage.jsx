import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    api.get('/users/me')
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error('Profile load failed:', err.response?.data || err.message);
        alert('Could not load profile.');
      });
  }, []);

  const del = async () => {
    const result = await Swal.fire({
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
        const userId = user._id || user.id;
        await api.delete(`/users/${userId}`);
        Swal.fire({
          icon: 'success',
          title: 'User Deleted',
          text: 'The user has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          logout();
        }, 2000); // reload user list
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete user.',
        });
      }
    }
  };

  // const del1 = async () => {
  //   if (confirm('Delete account?')) {
  //     await api.delete(`/users/${user.id}`);
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Account Deleted ',
  //       text: 'Your account has been deleted successfully.',
  //       timer: 2000,
  //       showConfirmButton: false
  //     });
  //     // Logout after account deletion
  //     logout();
  //   }
  // };

  const handleUpdate = (updatedUser) => {
    setProfile(updatedUser);     
    setShowEditModal(false);     
  };

  if (!profile) {
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
      <p><small>Joined: {new Date(profile.createdAt).toLocaleString()}</small></p>

      <button onClick={() => setShowEditModal(true)}>Edit Profile</button>{' '}
      <button onClick={del}>Delete Account</button>

      {showEditModal && (
        <EditProfileModal
          user={profile}
          onClose={() => setShowEditModal(false)}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}
