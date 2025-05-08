import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import swal from 'sweetalert2';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ nameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      swal.fire({
              icon: 'success',
              title: 'Login Successfully',
              text: 'You have logged in successfully!',
              timer: 2000,
              showConfirmButton: false
            });

    } catch (err) {
      swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: err.message || 'An unknown error occurred',
            });
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      
      <form onSubmit={onSubmit}>
      <br></br>
        <div className="form-group">
        <label>Username or Email</label>
          <input
            required
            value={form.nameOrEmail}
            onChange={e => setForm({ ...form, nameOrEmail: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        </div>
        <button type="submit">{loading?'…':'Login'}</button>
      </form>
    </div>
  );
}
