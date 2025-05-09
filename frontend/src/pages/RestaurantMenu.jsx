import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import orderApi from '../api/orderApi';
import { AuthContext } from '../context/AuthContext';
import RestaurantCoverImage from '../components/RestaurantCoverImage';
import RestaurantLogo from '../components/RestaurantLogo';
import AddToCartModal from '../components/AddToCartModal';
import Swal from 'sweetalert2';
import {
  RefreshIcon,
  ClockIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  LocationMarkerIcon,
  PhoneIcon,
  MailIcon,
} from '@heroicons/react/outline';
import { motion } from 'framer-motion';

export default function RestaurantMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showFormItem, setShowFormItem] = useState(null);
  const [formQty, setFormQty] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadCart = async () => {
    try {
      const { data } = await orderApi.get(`/carts?restaurantId=${restaurantId}`);
      setCart(data.items || data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const loadRestaurantAndMenu = useCallback(async () => {
    try {
      setLoading(true);
      const { data: restaurantData } = await restaurantApi.get(`/restaurants/${restaurantId}`);

      const localData = localStorage.getItem(`restaurant_${restaurantId}`);
      let processed = restaurantData;

      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          processed = {
            ...restaurantData,
            logoUrl: parsed.logoUrl || restaurantData.logoUrl,
            coverImageUrl: parsed.coverImageUrl || restaurantData.coverImageUrl,
          };
        } catch (e) {
          console.error('Local storage parse error:', e);
        }
      }

      setRestaurant(processed);
      const { data: menuData } = await restaurantApi.get(`/restaurants/${restaurantId}/menu`);
      setMenuItems(menuData);
      await loadCart();
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Load error:', err);
      setError('Unable to load restaurant info. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    loadRestaurantAndMenu();
  }, [loadRestaurantAndMenu]);

  useEffect(() => {
    const interval = setInterval(() => loadRestaurantAndMenu(), 30000);
    return () => clearInterval(interval);
  }, [loadRestaurantAndMenu]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderApi.post('/carts', {
        restaurantId,
        menuItemId: showFormItem._id,
        quantity: formQty,
      });
      await loadCart();
      setShowFormItem(null);
      setFormQty(1);
      Swal.fire({
        icon: 'success',
        title: 'Added to cart!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Add to Cart Failed',
        text: err?.message || 'Unknown error',
      });
    }
  };

  const handleGoToCart = async () => {
    try {
      await orderApi.post('/carts', {
        restaurantId,
        menuItemId: showFormItem._id,
        quantity: formQty,
      });
      navigate(`/customer/cart?restaurantId=${restaurantId}`);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Cart Error',
        text: err?.message || 'Unknown error',
      });
    }
  };

  if (loading && !restaurant) {
    return <div className="text-center py-20 text-gray-500">Loading restaurant menu...</div>;
  }

  if (error && !restaurant) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/customer/restaurants')} className="text-green-600 underline">
          ← Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-4">
        <button
          className="flex items-center bg-green-600 gap-2 text-white font-medium hover:underline"
          onClick={() => navigate('/customer/restaurants')}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Restaurants
        </button>
      </div>

      {/* Header Section */}
      <section className="bg-green-50 rounded-xl shadow-md p-6 mb-8 space-y-6">
        {/* Cover Image */}
        <RestaurantCoverImage
          coverImageUrl={restaurant.coverImageUrl}
          restaurantName={restaurant.name}
        />

        {/* Logo + Details Block */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mt-4">
          <RestaurantLogo logoUrl={restaurant.logoUrl} restaurantName={restaurant.name} />

          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-extrabold text-green-800">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.description || 'No description provided.'}</p>

            {/* Contact & Location */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
              {restaurant.address && (
                <div className="flex items-center gap-2">
                  <LocationMarkerIcon className="w-4 h-4 text-green-500" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-green-500" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.email && (
                <div className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-green-500" />
                  <span>{restaurant.email}</span>
                </div>
              )}
            </div>

            {/* Operational Status & Tags */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <span className={`px-2 py-0.5 rounded-full font-medium ${restaurant.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                {restaurant.availability ? 'Open Now' : 'Currently Closed'}
              </span>
              <span className="text-black-500 italic">{restaurant.cuisine || 'Various Cuisine'}</span>
              <span className="text-black-500">Min Order Amount: {restaurant.minimumOrderAmount || 0}</span>
              <span className="text-black-500">Delivery Fee: ${restaurant.deliveryFee || 0}</span>
              <span className="text-black-500">Tax: {restaurant.taxRate || 0}%</span>
              <span className="text-black-500">Radius: {restaurant.deliveryRadius || 5} km</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 border-t text-sm text-black-500">
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button
            onClick={loadRestaurantAndMenu}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </section>


      {/* Menu Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
        <div className="w-full flex justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <h3 className="text-xl font-semibold text-green-800">Menu</h3>
            </div>
          </div>
          <button
            onClick={() => navigate(`/customer/cart?restaurantId=${restaurantId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            View Cart
          </button>
        </div>

        {menuItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 bg-green-50 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`p-4 border rounded-2xl shadow-sm hover:shadow-md transition duration-300 ${
                  item.isAvailable ? '' : 'opacity-60'
                }`}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-xl mb-3" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-xl mb-3 text-3xl">
                    🍽️
                  </div>
                )}
                <div className="text-sm">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mt-1">{item.name}</h4>
                <p className="text-gray-600 text-sm mb-1">{item.description || 'No description.'}</p>
                <span className="text-xs text-gray-400">{item.category || 'General'}</span>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-green-700 font-semibold">${item.price.toFixed(2)}</span>
                  <button
                    disabled={!item.isAvailable}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-300"
                    onClick={() => {
                      const existing = cart.find(ci => ci.menuItemId === item._id);
                      setFormQty(existing ? existing.quantity : 1);
                      setShowFormItem(item);
                    }}
                  >
                    {cart.find(ci => ci.menuItemId === item._id) ? 'Update' : 'Add'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16">
            No menu items available at the moment.
          </div>
        )}
      </section>

      <AddToCartModal
        item={showFormItem}
        quantity={formQty}
        setQuantity={setFormQty}
        onCancel={() => setShowFormItem(null)}
        onAddToCart={handleFormSubmit}
        onGoToCart={handleGoToCart}
      />
    </div>
  );
}
