import React, { useState } from 'react';
import restaurantApi from '../api/restaurantApi';
import FileUpload from './FileUpload';

export default function CreateMenuItemModal({ restaurantId, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    imageUrl: '',
    isAvailable: true
  });

  const submit = async e => {
    e.preventDefault();
    try {
      if (!form.category) {
        form.category = 'main';
      }
      
      const res = await restaurantApi.post(
        `/restaurants/${restaurantId}/menu`,
        { 
          ...form, 
          price: parseFloat(form.price),
          category: form.category.toLowerCase()
        }
      );
      onCreated(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleImageUpload = (imageUrl) => {
    setForm({ ...form, imageUrl });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Menu Item</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={submit} className="menu-item-form">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Enter item name"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              placeholder="Describe the item"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
                <option value="side">Side Dish</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Item Image</label>
            <FileUpload 
              onUploadComplete={handleImageUpload}
              currentImageUrl={form.imageUrl}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
              />
              <span>Available</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Item</button>
          </div>
        </form>
      </div>
    </>
  );
}
