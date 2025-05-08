import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', phoneNumber: '',role: 'customer' });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      Swal.fire({
        icon: 'success',
        title: 'Register Successfully',
        text: 'Your account has been created successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message || 'An unknown error occurred',
      });
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="+15551234567"
            required
            value={form.phoneNumber}
            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
