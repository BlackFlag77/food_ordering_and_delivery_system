import React, { useState, useEffect } from 'react';
import restaurantApi from '../api/restaurantApi';
import FileUpload from './FileUpload';

export default function RestaurantSettings({ restaurant, onUpdate }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: '',
    phone: '',
    email: '',
    openingHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' }
    },
    deliveryRadius: 5, // in kilometers
    minimumOrderAmount: 10,
    deliveryFee: 2,
    taxRate: 8.5, // percentage
    logoUrl: '',
    coverImageUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState('general');

  // Initialize form with restaurant data
  useEffect(() => {
    if (restaurant) {
      setForm(prevForm => ({
        ...prevForm,
        name: restaurant.name || '',
        description: restaurant.description || '',
        cuisine: restaurant.cuisine || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        openingHours: restaurant.openingHours || prevForm.openingHours,
        deliveryRadius: restaurant.deliveryRadius || 5,
        minimumOrderAmount: restaurant.minimumOrderAmount || 10,
        deliveryFee: restaurant.deliveryFee || 2,
        taxRate: restaurant.taxRate || 8.5,
        logoUrl: restaurant.logoUrl || '',
        coverImageUrl: restaurant.coverImageUrl || ''
      }));
    }
  }, [restaurant]);

  // Check for pending changes in local storage
  useEffect(() => {
    if (restaurant && restaurant._id) {
      try {
        const pendingChangesStr = localStorage.getItem(`restaurant_pending_changes_${restaurant._id}`);
        if (pendingChangesStr) {
          const pendingChanges = JSON.parse(pendingChangesStr);
          
          // Check if the pending changes are less than 24 hours old
          const timestamp = new Date(pendingChanges.timestamp);
          const now = new Date();
          const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            // Apply the pending changes to the form, but preserve any existing image URLs
            // This prevents the "Previously saved changes" message from overriding image uploads
            const currentLogoUrl = form.logoUrl;
            const currentCoverImageUrl = form.coverImageUrl;
            
            setForm(prevForm => ({
              ...prevForm,
              ...pendingChanges.data,
              // Preserve the current image URLs if they exist
              logoUrl: currentLogoUrl || pendingChanges.data.logoUrl || prevForm.logoUrl,
              coverImageUrl: currentCoverImageUrl || pendingChanges.data.coverImageUrl || prevForm.coverImageUrl
            }));
            
            // Only show the message if there are non-image changes
            const hasNonImageChanges = Object.keys(pendingChanges.data).some(key => 
              key !== 'logoUrl' && key !== 'coverImageUrl' && 
              pendingChanges.data[key] !== form[key]
            );
            
            if (hasNonImageChanges) {
              setMessage({
                type: 'info',
                text: 'Previously saved changes have been loaded. These changes will be sent to the server when it becomes available.'
              });
            }
          } else {
            // Remove old pending changes
            localStorage.removeItem(`restaurant_pending_changes_${restaurant._id}`);
          }
        }
      } catch (error) {
        console.error('Error loading pending changes:', error);
      }
    }
  }, [restaurant]);

  // Set up periodic check for backend availability
  useEffect(() => {
    if (!restaurant || !restaurant._id) return;

    const checkBackendAndSync = async () => {
      try {
        // Try to make a simple API call to check if the backend is available
        await restaurantApi.get(`/restaurants/${restaurant._id}`);
        
        // If we get here, the backend is available
        // Check if we have pending changes to sync
        const pendingChangesStr = localStorage.getItem(`restaurant_pending_changes_${restaurant._id}`);
        if (pendingChangesStr) {
          const pendingChanges = JSON.parse(pendingChangesStr);
          
          // Try to sync the pending changes
          try {
            const { data } = await restaurantApi.put(
              `/restaurants/${restaurant._id}`,
              pendingChanges.data
            );
            
            // If successful, update the UI and remove the pending changes
            onUpdate(data);
            localStorage.removeItem(`restaurant_pending_changes_${restaurant._id}`);
            
            // Show a success message
            setMessage({
              type: 'success',
              text: 'Your previously saved changes have been successfully synced with the server!'
            });
          } catch (syncError) {
            console.error('Error syncing pending changes:', syncError);
            
            // Provide more specific error messages based on the error type
            if (syncError.response && syncError.response.status === 404) {
              // setMessage({
              //   type: 'warning',
              //   text: 'Backend service is currently unavailable (404 Not Found). Your changes will remain in local storage until the server is available.'
              // });
            } else {
              setMessage({
                type: 'warning',
                text: 'Could not sync changes with the server. Your changes will remain in local storage until the server is available.'
              });
            }
          }
        }
      } catch (error) {
        // Backend is still unavailable, do nothing
        console.log('Backend is still unavailable');
        
        // Check if we have pending changes
        const pendingChangesStr = localStorage.getItem(`restaurant_pending_changes_${restaurant._id}`);
        if (pendingChangesStr) {
          const pendingChanges = JSON.parse(pendingChangesStr);
          
          // Show a message about the pending changes
          setMessage({
            type: 'info',
            text: 'You have unsaved changes in local storage. These will be sent to the server when it becomes available.'
          });
        }
      }
    };

    // Check every 5 minutes
    const intervalId = setInterval(checkBackendAndSync, 5 * 60 * 1000);
    
    // Also check immediately
    checkBackendAndSync();
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [restaurant, onUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setForm(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleLogoUpload = (imageUrl) => {
    // Update the form state
    setForm(prev => ({
      ...prev,
      logoUrl: imageUrl
    }));
    
    // Clear any existing messages to prevent confusion
    setMessage({ type: '', text: '' });
    
    // Immediately update the UI with the new image
    const updatedRestaurant = {
      ...restaurant,
      logoUrl: imageUrl
    };
    onUpdate(updatedRestaurant);
  };

  const handleCoverImageUpload = (imageUrl) => {
    console.log('Cover image uploaded:', imageUrl);
    
    // Update the form state
    setForm(prev => ({
      ...prev,
      coverImageUrl: imageUrl
    }));
    
    // Clear any existing messages to prevent confusion
    setMessage({ type: '', text: '' });
    
    // Immediately update the UI with the new image
    const updatedRestaurant = {
      ...restaurant,
      coverImageUrl: imageUrl
    };
    
    // Force update the restaurant in the parent component
    onUpdate(updatedRestaurant);
    
    // Also update the restaurant in local storage directly
    try {
      const restaurantKey = `restaurant_${restaurant._id}`;
      localStorage.setItem(restaurantKey, JSON.stringify(updatedRestaurant));
      console.log('Saved restaurant to local storage:', updatedRestaurant);
    } catch (error) {
      console.error('Error saving restaurant to local storage:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Create a copy of the form data to modify
      const formDataToSubmit = { ...form };
      
      // Check if restaurant ID exists
      if (!restaurant || !restaurant._id) {
        throw new Error('Restaurant ID is missing. Please refresh the page and try again.');
      }
      
      try {
        // Make the API call to update the restaurant
        const { data } = await restaurantApi.put(
          `/restaurants/${restaurant._id}`,
          formDataToSubmit
        );
        
        // If successful, update with the response data
        onUpdate(data);
        
        // Check if we're using mock data (indicated by the presence of updatedAt)
        if (data.updatedAt) {
          setMessage({ 
            type: 'info', 
            text: 'Restaurant settings updated successfully using mock data (backend unavailable).' 
          });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Restaurant settings updated successfully!' 
          });
        }
        
        // Clear any pending changes from local storage
        localStorage.removeItem(`restaurant_pending_changes_${restaurant._id}`);
      } catch (apiError) {
        console.error('API error updating restaurant settings:', apiError);
        
        // If the API call fails, still update the UI with the form data
        // This ensures the UI reflects the changes even if the backend is not available
        const updatedRestaurant = {
          ...restaurant,
          ...formDataToSubmit
        };
        
        onUpdate(updatedRestaurant);
        
        // Save the changes to local storage for persistence
        try {
          localStorage.setItem(
            `restaurant_pending_changes_${restaurant._id}`, 
            JSON.stringify({
              data: formDataToSubmit,
              timestamp: new Date().toISOString()
            })
          );
        } catch (storageError) {
          console.error('Error saving to local storage:', storageError);
        }
        
        // Provide more specific error messages based on the error type
        if (apiError.response && apiError.response.status === 404) {
          // setMessage({ 
          //   type: 'warning', 
          //   text: 'Backend service is currently unavailable (404 Not Found). Your changes have been saved locally and will be applied to the UI. They will be sent to the server when it becomes available again.' 
          // });
        } else {
          setMessage({ 
            type: 'warning', 
            text: 'Restaurant settings updated in the UI, but could not be saved to the server. Changes have been saved locally and will be sent when the server is available.' 
          });
        }
      }
    } catch (err) {
      console.error('Error updating restaurant settings:', err);
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to update restaurant settings. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="settings-section-content">
      <div className="form-group">
        <label>Restaurant Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label>Cuisine Type</label>
        <input
          type="text"
          name="cuisine"
          value={form.cuisine}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Restaurant Logo</label>
          <FileUpload 
            onUploadComplete={handleLogoUpload}
            currentImageUrl={form.logoUrl}
          />
        </div>
        
        <div className="form-group">
          <label>Cover Image</label>
          <FileUpload 
            onUploadComplete={handleCoverImageUpload}
            currentImageUrl={form.coverImageUrl}
          />
        </div>
      </div>
    </div>
  );

  const renderHoursSettings = () => (
    <div className="settings-section-content">
      <div className="opening-hours-grid">
        {Object.entries(form.openingHours).map(([day, hours]) => (
          <div key={day} className="day-hours">
            <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
            <div className="time-inputs">
              <div className="form-group">
                <label>Open</label>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Close</label>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeliverySettings = () => (
    <div className="settings-section-content">
      <div className="form-group">
        <label>Delivery Radius (km)</label>
        <input
          type="number"
          name="deliveryRadius"
          value={form.deliveryRadius}
          onChange={handleChange}
          min="1"
          max="50"
        />
      </div>
      
      <div className="form-group">
        <label>Minimum Order Amount ($)</label>
        <input
          type="number"
          name="minimumOrderAmount"
          value={form.minimumOrderAmount}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="form-group">
        <label>Delivery Fee ($)</label>
        <input
          type="number"
          name="deliveryFee"
          value={form.deliveryFee}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="form-group">
        <label>Tax Rate (%)</label>
        <input
          type="number"
          name="taxRate"
          value={form.taxRate}
          onChange={handleChange}
          min="0"
          max="100"
          step="0.1"
        />
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h3>Restaurant Settings</h3>
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
      
      <div className="settings-navigation">
        <button 
          className={`nav-btn ${activeSection === 'general' ? 'active' : ''}`}
          onClick={() => setActiveSection('general')}
        >
          General
        </button>
        <button 
          className={`nav-btn ${activeSection === 'hours' ? 'active' : ''}`}
          onClick={() => setActiveSection('hours')}
        >
          Opening Hours
        </button>
        <button 
          className={`nav-btn ${activeSection === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveSection('delivery')}
        >
          Delivery Settings
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="settings-form">
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'hours' && renderHoursSettings()}
        {activeSection === 'delivery' && renderDeliverySettings()}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 