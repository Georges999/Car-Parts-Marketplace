import { useState, useEffect } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';
import VehicleForm from './VehicleForm';

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserVehicles();
  }, [user]);

  const fetchUserVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vehicles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVehicles(data.data);
      } else {
        setError(data.message || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('Network error when fetching vehicles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormVisible(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormVisible(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      setError('Network error when deleting vehicle');
      console.error(err);
    }
  };

  const handleFormSubmit = async (vehicleData) => {
    try {
      let response;
      
      if (editingVehicle) {
        //updRWTE VEHICLE EXISTING
        response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(vehicleData)
        });
      } else {
        // Create new vehicle
        response = await fetch('/api/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(vehicleData)
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        // Refresh vehicles list
        fetchUserVehicles();
        setIsFormVisible(false);
        setEditingVehicle(null);
      } else {
        setError(data.message || 'Failed to save vehicle');
      }
    } catch (err) {
      setError('Network error when saving vehicle');
      console.error(err);
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingVehicle(null);
  };

  if (loading) {
    return <div className="loading">Loading your vehicles...</div>;
  }

  return (
    <div className="vehicle-manager">
      <div className="section-header">
        <h2>My Vehicles</h2>
        <button 
          className="btn-primary" 
          onClick={handleAddVehicle}
          disabled={isFormVisible}
        >
          <i className="fas fa-plus"></i> Add Vehicle
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isFormVisible && (
        <VehicleForm 
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {!isFormVisible && (
        <div className="vehicles-list">
          {vehicles.length === 0 ? (
            <div className="empty-state">
              <p>You haven't added any vehicles yet.</p>
              <button 
                className="btn-secondary"
                onClick={handleAddVehicle}
              >
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="vehicles-grid">
              {vehicles.map((vehicle) => (
                <div className="vehicle-card" key={vehicle.id}>
                  <div className="vehicle-info">
                    <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <div className="vehicle-details">
                      {vehicle.trim && <span>Trim: {vehicle.trim}</span>}
                      {vehicle.engine && <span>Engine: {vehicle.engine}</span>}
                    </div>
                  </div>
                  <div className="vehicle-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => handleEditVehicle(vehicle)}
                      title="Edit Vehicle"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      title="Delete Vehicle"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleManager;