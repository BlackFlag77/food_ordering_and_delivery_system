import React from 'react';
import '../styles/index.css';

export default function AddToCartModal({
  item,
  quantity,
  setQuantity,
  onCancel,
  onAddToCart,
  onGoToCart
}) {
  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <h3>Add {item.name} to Cart</h3>
        <form onSubmit={onAddToCart}>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary">Add</button>
            <button type="button" onClick={onCancel} className="btn btn-danger">Cancel</button>
            <button type="button" onClick={onGoToCart} className="btn btn-secondary">Go to Cart</button>
          </div>
        </form>
      </div>
    </div>
  );
}
