import React from 'react';
import {
  ShoppingCartIcon,
  XIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/solid';

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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCartIcon className="w-6 h-6 text-green-600" />
            Add {item.name} to the Cart
          </h3>
        </div>

        <form onSubmit={onAddToCart} className="space-y-6">
          {/* Quantity Stepper */}
          <div>
            <label className="block text-sm font-medium text-gray-900 text-center mb-1">Quantity</label>
            <div className="flex items-center justify-center border rounded-md overflow-hidden w-max mx-auto shadow">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >
                <MinusIcon className="w-5 h-5 text-gray-700" />
              </button>
              <div className="px-6 py-2 text-lg font-medium text-gray-800 bg-white w-16 text-center">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >
                <PlusIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-3 mt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Add
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              <XIcon className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={onGoToCart}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <ArrowRightIcon className="w-5 h-5" />
              Go to Cart
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
