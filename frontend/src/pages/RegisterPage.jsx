// src/components/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import {
  UserAddIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      Swal.fire({
        icon: 'success',
        title: 'Welcome aboard!',
        text: 'Your account has been created.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message || 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const slideInLeft = { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8 } };
  const slideInRight = { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8 } };

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8 max-w-5xl w-full">
        {/* Hero Panel (desktop only) */}
        <motion.div
          {...slideInLeft}
          className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-700 to-green-600 text-white p-16 relative overflow-hidden rounded-2xl h-full"
        >
          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>

          <UserAddIcon className="h-24 w-24 mb-6 animate-pulse" />
          <h1 className="text-5xl font-extrabold mb-4">Join FoodDelivery</h1>
          <p className="text-lg mb-8 max-w-md">
            Sign up and unlock fresh menus, lightning-fast delivery, and exclusive offers right at your fingertips.
          </p>

          <ul className="space-y-4 mb-8">
            {['Easy ordering', 'Real-time tracking', 'Secure payments'].map(text => (
              <li key={text} className="flex items-center">
                <CheckIcon className="h-6 w-6 mr-3 text-green-300" />
                <span className="font-medium">{text}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-white text-green-700 font-semibold rounded-full shadow-lg hover:bg-green-50 transition"
          >
            Already have an account?
          </Link>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          {...slideInRight}
          className="flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl h-full"
        >
          <div className="relative w-full max-w-md bg-white bg-opacity-80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl">
            {/* Floating Accent */}
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-600 opacity-20 rounded-full"></div>

            {/* Header */}
            <div className="text-center mb-8">
              <UserAddIcon className="mx-auto h-14 w-14 text-green-600" />
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                It only takes a couple of minutes to get started.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {[
                { id: 'name', label: 'Full Name', type: 'text', icon: <UserIcon className="h-5 w-5 text-gray-400" />, placeholder: 'Jane Doe' },
                { id: 'email', label: 'Email address', type: 'email', icon: <MailIcon className="h-5 w-5 text-gray-400" />, placeholder: 'you@example.com' },
                { id: 'phoneNumber', label: 'Phone Number', type: 'tel', icon: <PhoneIcon className="h-5 w-5 text-gray-400" />, placeholder: '+1 (555) 123-4567' },
                { id: 'password', label: 'Password', type: 'password', icon: <LockClosedIcon className="h-5 w-5 text-gray-400" />, placeholder: '••••••••' }
              ].map(({ id, label, type, icon, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</span>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      required
                      disabled={loading}
                      value={form[id]}
                      onChange={e => setForm({ ...form, [id]: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 rounded-lg text-white text-lg font-semibold ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition`}
                >
                  {loading ? (
                    <ArrowRightIcon className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <>
                      Register
                      <ArrowRightIcon className="ml-2 h-6 w-6" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
