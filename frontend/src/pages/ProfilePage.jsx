import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import { PencilAltIcon, TrashIcon} from '@heroicons/react/outline';
import profileBg from '../assets/profile-bg-pattern.png';
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
      title: 'Delete Account?',
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
          title: 'Account Deleted',
          text: 'Your account has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => logout(), 2000);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete account.',
        });
      }
    }
  };

  const handleUpdate = (updatedUser) => {
    setProfile(updatedUser);
    setShowEditModal(false);
  };

  if (!profile) {
    return <div className="text-center py-10 text-gray-600">Loading profile…</div>;
  }

  const initials = profile.name ? profile.name[0].toUpperCase() : '?';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white border border-gray-800 rounded-2xl shadow-2xl p-10 relative overflow-hidden group transition-all hover:shadow-3xl duration-300">
        {/* Decorative Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none z-0"
          style={{ backgroundImage: `url(${profileBg})` }}
        />
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="w-28 h-28 rounded-full bg-[var(--accent-dark)] text-white flex items-center justify-center text-5xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--primary-dark)] mb-2">
              Hello, {profile.name} 👋
            </h1>
            <p className="text-base text-gray-600">
              Welcome back! Keep your info up to date to enjoy a seamless experience.
            </p>
          </div>
        </div>
  
        {/* Divider Accent Line */}
        <div className="h-1 w-32 bg-[var(--primary)] rounded mb-10 relative z-10" />
  
        {/* Profile Info */}
        <h2 className="text-xl font-bold text-gray-700 mb-4 relative z-10">Your Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-800 text-base relative z-10">
          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="font-semibold">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="font-semibold">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="font-semibold">{profile.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full
              ${profile.role === 'admin'
                ? 'bg-red-100 text-red-700'
                : profile.role === 'restaurant_admin'
                ? 'bg-yellow-100 text-yellow-800'
                : profile.role === 'delivery_personnel'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'}
            `}>
              {profile.role.replace('_', ' ')}
            </span>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Joined</p>
            <p className="font-semibold">{new Date(profile.createdAt).toLocaleString()}</p>
          </div>
        </div>
  
        {/* Quote */}
        <div className="mt-8 bg-gray-100 p-4 rounded-md text-base italic text-gray-600 relative z-10">
          “Your profile reflects who you are. Keep it professional, keep it updated.”
        </div>
  
        {/* Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 justify-end relative z-10">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-6 py-2 text-base font-semibold bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            <PencilAltIcon className="w-5 h-5 mr-1 inline" />
            Edit Profile
          </button>
          <button
            onClick={del}
            className="px-6 py-2 text-base font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <TrashIcon className="w-5 h-5 mr-1 inline" />
            Delete Account
          </button>
        </div>
      </div>
  
      {/* Edit Modal */}
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
