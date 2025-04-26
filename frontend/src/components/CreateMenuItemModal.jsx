import React, { useState } from 'react';
import restaurantApi from '../api/restaurantApi';

export default function CreateMenuItemModal({ restaurantId, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true
  });

  

  const submit = async e => {
    e.preventDefault();
    try {
        const res = await restaurantApi.post(
                    `/restaurants/${restaurantId}/menu`,
                    { ...form, price: parseFloat(form.price) }
                 );
                  // Pass the new item back
                  onCreated(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <h3>Add Menu Item</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
              />{' '}
              Available
            </label>
          </div>
          <button type="submit">Create</button>{' '}
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </>
  );
}
