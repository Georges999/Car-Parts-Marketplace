import { useState, useEffect } from 'react';

const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    trim: '',
    engine: '',
    transmission: '',
    modifications: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const currentYear = new Date().getFullYear();
  
  // Initialize form with vehicle data if in edit mode
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || currentYear,
        trim: vehicle.trim || '',
        engine: vehicle.engine || '',
        transmission: vehicle.transmission || '',
        modifications: vehicle.modifications || '',
        notes: vehicle.notes || ''
      });
    }
  }, [vehicle, currentYear]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Generate year options from 1900 to current year + 1
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1900; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="vehicle-form">
        <h3>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="make">Make *</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className={errors.make ? 'error' : ''}
            />
            {errors.make && <div className="error-text">{errors.make}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model *</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={errors.model ? 'error' : ''}
            />
            {errors.model && <div className="error-text">{errors.model}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={errors.year ? 'error' : ''}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.year && <div className="error-text">{errors.year}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="trim">Trim</label>
            <input
              type="text"
              id="trim"
              name="trim"
              value={formData.trim}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="engine">Engine</label>
            <input
              type="text"
              id="engine"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="transmission">Transmission</label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
              <option value="DCT">DCT (Dual-Clutch)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="modifications">Modifications</label>
          <textarea
            id="modifications"
            name="modifications"
            value={formData.modifications}
            onChange={handleChange}
            placeholder="List any modifications to your vehicle"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes about your vehicle"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;