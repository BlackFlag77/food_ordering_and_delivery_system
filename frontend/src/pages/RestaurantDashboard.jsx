import React, {
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react';
import restaurantApi from '../api/restaurantApi';
import { AuthContext } from '../context/AuthContext';
import CreateMenuItemModal from '../components/CreateMenuItemModal';
import EditMenuItemModal from '../components/EditMenuItemModal';

export default function RestaurantDashboard() {
  const { user } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMenu = useCallback(async () => {
    if (!restaurant?._id) return;
    try {
      const { data: items } = await restaurantApi.get(
        `/restaurants/${restaurant._id}/menu`
      );
      setMenuItems(items);
    } catch (err) {
      console.error('refreshMenu error:', err.response);
      alert('Could not refresh menu');
    }
  }, [restaurant?._id]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: all } = await restaurantApi.get('/restaurants');
        const my = all.find(r => r.userId === user.id) || null;
        setRestaurant(my);
        if (my) {
          const { data: items } = await restaurantApi.get(
            `/restaurants/${my._id}/menu`
          );
          setMenuItems(items);
        }
      } catch (err) {
        console.error('initial load error:', err.response);
        alert('Error loading restaurant data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const toggleAvailability = async () => {
    try {
      const { data: updated } = await restaurantApi.patch(
        `/restaurants/${restaurant._id}/availability`,
        { availability: !restaurant.availability }
      );
      setRestaurant(updated);
    } catch (err) {
      console.error('toggleAvailability error:', err.response);
      alert('Could not update availability');
    }
  };

  if (loading) {
    return <div className="container"><p>Loading…</p></div>;
  }

  if (!restaurant) {
    return (
      <div className="container">
        <h2>Create Your Restaurant</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          const fd = new FormData(e.target);
          try {
            const payload = {
              name: fd.get('name'),
              address: fd.get('address')
            };
            const { data: r } = await restaurantApi.post(
              '/restaurants',
              payload
            );
            setRestaurant(r);
            await refreshMenu();
          } catch (err) {
            console.error('create restaurant error:', err.response);
            alert('Could not create restaurant');
          }
        }}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" />
          </div>
          <button type="submit">Create Restaurant</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Restaurant Info Card */}
      <div className="restaurant-card">
        <h2>{restaurant.name}</h2>
        <p><strong>Address:</strong> {restaurant.address || '—'}</p>
        <p>
          <span
            className={
              `status-badge ${
                restaurant.availability ? 'open' : 'closed'
              }`
            }
          >
            {restaurant.availability ? 'Open' : 'Closed'}
          </span>{' '}
          <button onClick={toggleAvailability}>
            {restaurant.availability ? 'Close' : 'Open'} Now
          </button>
        </p>
      </div>

      {/* Menu Section */}
      <div className="restaurant-card">
        <h3>Menu Items</h3>
        <button onClick={() => setShowCreateModal(true)}>
          + Add Menu Item
        </button>

        {menuItems.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.isAvailable ? 'Yes' : 'No'}</td>
                  <td className="action-buttons">
                    <button onClick={() => setEditItem(item)}>
                      Edit
                    </button>
                    <button onClick={async () => {
                      if (!confirm('Delete this item?')) return;
                      try {
                        await restaurantApi.delete(
                          `/restaurants/${restaurant._id}/menu/${item._id}`
                        );
                        await refreshMenu();
                      } catch (err) {
                        console.error('delete item error:', err.response);
                        alert('Could not delete item');
                      }
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No menu items yet.</p>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateMenuItemModal
          restaurantId={restaurant._id}
          onClose={() => setShowCreateModal(false)}
          onCreated={newItem => {
            setShowCreateModal(false);
            setMenuItems(prev => [...prev, newItem]);
          }}
        />
      )}

      {editItem && (
        <EditMenuItemModal
          restaurantId={restaurant._id}
          item={editItem}
          onClose={() => setEditItem(null)}
          onUpdated={async () => {
            setEditItem(null);
            await refreshMenu();
          }}
        />
      )}
    </div>
  );
}
