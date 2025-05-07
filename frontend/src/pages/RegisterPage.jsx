import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'customer',phoneNumber: '' });

  const onSubmit = e => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Role</label>
          <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="customer">Customer</option>
            <option value="restaurant_admin">Restaurant Admin</option>
            <option value="delivery_personnel">Delivery Person</option>
          </select>
        </div>
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
