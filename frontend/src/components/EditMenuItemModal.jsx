import React, { useState } from 'react';
import restaurantApi from '../api/restaurantApi';

export default function EditMenuItemModal({ restaurantId, item, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: item.name,
    description: item.description,
    price: item.price.toString(),
    isAvailable: item.isAvailable
  });

  

  const submit = async e => {
    e.preventDefault();
    try {
        await restaurantApi.patch(
               `/restaurants/${restaurantId}/menu/${item._id}`,
        {
          ...form,
          price: parseFloat(form.price),
        }
      );
      onUpdated();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <h3>Edit Menu Item</h3>
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
          <button type="submit">Save</button>{' '}
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </>
  );
}
