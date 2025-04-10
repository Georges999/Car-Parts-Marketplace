import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

const VehicleProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    engine: '',
    transmission: '',
    modifications: '',
    notes: ''
  });

  // This would actually fetch from your API in a real implementation
  useEffect(() => {
    // Simulating API call with timeout
    const fetchVehicles = async () => {
      // In a real app, you would fetch from your API
      const mockVehicles = [
        {
          id: 'v1',
          make: 'Toyota',
          model: 'Camry',
          year: '2018',
          trim: 'SE',
          engine: '2.5L 4-Cylinder',
          transmission: 'Automatic',
          modifications: 'Cold air intake, Aftermarket exhaust',
          notes: 'Regular maintenance at Toyota dealership',
          image: '/assets/toyota-camry.jpg'
        },
        {
          id: 'v2',
          make: 'Honda',
          model: 'Civic',
          year: '2020',
          trim: 'Sport',
          engine: '1.5L Turbocharged',
          transmission: 'CVT',
          modifications: 'None',
          notes: 'Oil changed every 5,000 miles',
          image: '/assets/honda-civic.jpg'
        }
      ];
      
      setTimeout(() => {
        setVehicles(mockVehicles);
      }, 500);
    };
    
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      trim: '',
      engine: '',
      transmission: '',
      modifications: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    
    
    const newVehicle = {
      id: `v${Date.now()}`, 
      ...formData,
     
      image: `/assets/${formData.make.toLowerCase()}-placeholder.jpg`
    };
    
    setVehicles([...vehicles, newVehicle]);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setFormData(vehicle);
    setShowAddForm(true);
  };

  const handleUpdateVehicle = (e) => {
    e.preventDefault();
    
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === editingVehicleId ? { ...vehicle, ...formData } : vehicle
    );
    
    setVehicles(updatedVehicles);
    setShowAddForm(false);
    setEditingVehicleId(null);
    resetForm();
  };

  const handleDeleteVehicle = (id) => {
    // In a real app, you would send a delete request to your API
    const confirmed = window.confirm('Are you sure you want to remove this vehicle?');
    if (confirmed) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingVehicleId(null);
    resetForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="vehicle-profile-page auth-required">
        <div className="container">
          <div className="auth-message">
            <h2>Sign In Required</h2>
            <p>You need to be signed in to manage your vehicle profiles.</p>
            <div className="auth-buttons">
  <Link to="/login" className="auth-button">Sign In</Link>
  <Link to="/register" className="auth-button-secondary">Create Account</Link>
</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Vehicle Profiles</h1>
          <p>Manage your vehicles for accurate part recommendations</p>
        </div>

        {!showAddForm && (
          <button className="add-vehicle-btn" onClick={() => setShowAddForm(true)}>
            <span className="add-icon">+</span> Add a New Vehicle
          </button>
        )}
        
        {showAddForm && (
          <div className="vehicle-form-container">
            <h2>{editingVehicleId ? 'Edit Vehicle' : 'Add a New Vehicle'}</h2>
            <form onSubmit={editingVehicleId ? handleUpdateVehicle : handleAddVehicle} className="vehicle-details-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="make">Make*</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="model">Model*</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="year">Year*</label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="trim">Trim</label>
                  <input
                    type="text"
                    id="trim"
                    name="trim"
                    value={formData.trim}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="engine">Engine</label>
                  <input
                    type="text"
                    id="engine"
                    name="engine"
                    value={formData.engine}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="transmission">Transmission</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                    <option value="DCT">Dual-Clutch</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="modifications">Modifications (Optional)</label>
                <textarea
                  id="modifications"
                  name="modifications"
                  value={formData.modifications}
                  onChange={handleInputChange}
                  placeholder="List any modifications made to your vehicle..."
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional information about your vehicle..."
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingVehicleId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
                <button type="button" className="cancel-btn" onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {vehicles.length > 0 ? (
          <div className="vehicles-grid">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-image">
                  <img src={vehicle.image || '/assets/car-placeholder.jpg'} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                </div>
                <div className="vehicle-info">
                  <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  {vehicle.trim && <p className="vehicle-trim">{vehicle.trim} Trim</p>}
                  <div className="vehicle-specs">
                    {vehicle.engine && <span>{vehicle.engine}</span>}
                    {vehicle.transmission && <span> • {vehicle.transmission}</span>}
                  </div>
                  
                  {(vehicle.modifications || vehicle.notes) && (
                    <div className="vehicle-notes-preview">
                      {vehicle.modifications && <p><strong>Mods:</strong> {vehicle.modifications}</p>}
                      {vehicle.notes && <p><strong>Notes:</strong> {vehicle.notes}</p>}
                    </div>
                  )}
                  
                  <div className="vehicle-actions">
                    <Link to={`/search?vehicle=${vehicle.id}`} className="find-parts-btn">
                      Find Compatible Parts
                    </Link>
                    <div className="edit-actions">
                      <button onClick={() => handleEditVehicle(vehicle)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteVehicle(vehicle.id)} className="delete-btn">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-vehicles">
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h3>No Vehicles Added Yet</h3>
              <p>Add your first vehicle to get personalized part recommendations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleProfile;