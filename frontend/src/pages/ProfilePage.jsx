import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';

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
    if (confirm('Delete account?')) {
      await api.delete(`/users/${user.id}`);
      logout();
    }
  };

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
