import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { AuthContext } from '../context/AuthContext';
import RestaurantCoverImage from '../components/RestaurantCoverImage';
import { RefreshIcon, FireIcon, ClockIcon, SearchIcon, LocationMarkerIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

export default function RestaurantsList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [search, setSearch] = useState('');

  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await restaurantApi.get('/restaurants');
      const processed = data.map(restaurant => {
        const local = localStorage.getItem(`restaurant_${restaurant._id}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            return {
              ...restaurant,
              logoUrl: parsed.logoUrl || restaurant.logoUrl,
              coverImageUrl: parsed.coverImageUrl || restaurant.coverImageUrl,
            };
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
        return restaurant;
      });
      setRestaurants(processed);
      setFilteredRestaurants(processed);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  useEffect(() => {
    const interval = setInterval(() => loadRestaurants(), 30000);
    return () => clearInterval(interval);
  }, [loadRestaurants]);

  useEffect(() => {
    const term = search.toLowerCase().trim();
    setFilteredRestaurants(
      restaurants.filter(r =>
        r.name.toLowerCase().startsWith(term) ||
        (r.cuisine || '').toLowerCase().startsWith(term)
      )
    );
  }, [search, restaurants]);

  const handleClick = (id) => navigate(`/customer/restaurant/${id}`);

  const handleRefresh = () => loadRestaurants();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 bg-gradient-to-r from-green-100 to-white py-10 px-6 rounded-3xl shadow-inner"
      >
        <div className="flex justify-center mb-4">
          <FireIcon className="w-10 h-10 text-green-600 animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold text-green-800 mb-4">Delicious Delivered to You</h1>
        <p className="text-green-700 text-lg max-w-2xl mx-auto">
          Discover the best food from top restaurants near you. Order online and enjoy quick, safe delivery.
        </p>
      </motion.div>

      {/* SEARCH & REFRESH */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or cuisine..."
            className="w-full pl-10 pr-4 py-2 border border-green-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-800"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${
            loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <RefreshIcon className="w-5 h-5" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* LOADING / ERROR / EMPTY STATES */}
      {loading && restaurants.length === 0 ? (
        <div className="flex justify-center items-center h-80 text-gray-500 text-lg">Loading restaurants...</div>
      ) : error && restaurants.length === 0 ? (
        <div className="text-center text-red-600 py-20">
          <p className="mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-green-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75L5.25 14.25m0 0l-4.5-4.5M5.25 14.25l4.5 4.5m13.5-9a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Restaurants Found
          </h3>
          <p className="max-w-md text-sm text-gray-500">
            We couldn't find any restaurants matching your search. Try adjusting your keywords or filters.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
        >
          {filteredRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant._id}
              onClick={() => handleClick(restaurant._id)}
              className="cursor-pointer bg-green-200 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-green-100"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <RestaurantCoverImage
                coverImageUrl={restaurant.coverImageUrl}
                restaurantName={restaurant.name}
                height="160px"
                placeholderText="🍱"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-green-800">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{restaurant.description || 'No description available.'}</p>

                <div className="flex items-center text-gray-500 text-sm gap-1 mb-1">
                  <LocationMarkerIcon className="w-4 h-4" />
                  <span>{restaurant.address || 'No address'}</span>
                </div>

                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-green-700 font-medium">
                    {restaurant.cuisine || 'Various'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>{restaurant.deliveryFee?.toFixed(2) || '0.00'} Delivery</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mt-2">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    restaurant.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <ClockIcon className="w-4 h-4" />
                    {restaurant.availability ? 'Open Now' : 'Closed'}
                  </span>
                  <span className="text-gray-500">Minimum Order Amount {restaurant.minimumOrderAmount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-400 mt-12">
        Last updated at {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}
