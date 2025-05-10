// src/components/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import swal from 'sweetalert2';
import { motion } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  CodeIcon,
} from '@heroicons/react/outline';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ nameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have logged in successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message || 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center p-8"
    >
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 items-stretch bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Panel */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-green-700 to-green-600 text-white p-8 h-full relative"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>

          <UserIcon className="h-16 w-16 mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-center max-w-xs">
            Sign in to manage your orders, track deliveries, and explore restaurants.
          </p>
        </motion.div>

        {/* Login Form Panel */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col justify-center p-8 bg-gradient-to-br from-green-50 to-white h-full"
        >
          <div className="text-center">
            <UserIcon className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account below</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <CodeIcon className="h-5 w-5 mr-2" />
              GitHub
            </button>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-green-50 to-white text-gray-500">
                Or use your email
              </span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="nameOrEmail" className="block text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="nameOrEmail"
                  name="nameOrEmail"
                  type="text"
                  required
                  disabled={loading}
                  value={form.nameOrEmail}
                  onChange={(e) => setForm({ ...form, nameOrEmail: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={loading}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-green-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full flex justify-center items-center py-2 px-4
                  ${loading
                    ? 'bg-green-200 text-green-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'}
                  border border-transparent text-sm font-medium rounded-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                  transition ease-in-out duration-150
                `}
              >
                {loading ? (
                  <ExclamationCircleIcon className="h-5 w-5 animate-spin text-green-700" />
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <a href="/register" className="font-medium text-green-600 hover:underline">
              Register now
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
