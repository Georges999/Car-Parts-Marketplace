import { useState, useEffect } from 'react';

const PartForm = ({ part, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    partNumber: '',
    price: '',
    retailPrice: '',
    stockQuantity: 1,
    inStock: true,
    images: [],
    specifications: {},
    weight: {
      value: '',
      unit: 'lbs'
    },
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'in'
    },
    compatibility: []
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [compatVehicle, setCompatVehicle] = useState({
    make: '',
    model: '',
    yearStart: '',
    yearEnd: '',
    trim: '',
    engine: ''
  });
  
  // Initialize form with part data if in edit mode
  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name || '',
        description: part.description || '',
        category: part.category || '',
        subcategory: part.subcategory || '',
        brand: part.brand || '',
        partNumber: part.partNumber || '',
        price: part.price || '',
        retailPrice: part.retailPrice || '',
        stockQuantity: part.stockQuantity || 1,
        inStock: part.inStock !== undefined ? part.inStock : true,
        images: part.images || [],
        specifications: part.specifications || {},
        weight: part.weight || { value: '', unit: 'lbs' },
        dimensions: part.dimensions || { length: '', width: '', height: '', unit: 'in' },
        compatibility: part.compatibility || []
      });
    }
    
    // Fetch categories
    fetchCategories();
  }, [part]);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/parts/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.partNumber) newErrors.partNumber = 'Part number is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
    if (formData.retailPrice && isNaN(formData.retailPrice)) newErrors.retailPrice = 'Retail price must be a valid number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'inStock') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'images') {
      // Handle file uploads
      setFormData({
        ...formData,
        images: files
      });
    } else if (name.startsWith('weight.') || name.startsWith('dimensions.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleCompatibilityChange = (e) => {
    const { name, value } = e.target;
    setCompatVehicle({
      ...compatVehicle,
      [name]: value
    });
  };
  
  const addCompatibility = () => {
    // Validate compatibility data
    if (!compatVehicle.make || !compatVehicle.model || !compatVehicle.yearStart || !compatVehicle.yearEnd) {
      return;
    }
    
    const newCompatibility = [...formData.compatibility, { ...compatVehicle }];
    setFormData({
      ...formData,
      compatibility: newCompatibility
    });
    
    // Reset the form
    setCompatVehicle({
      make: '',
      model: '',
      yearStart: '',
      yearEnd: '',
      trim: '',
      engine: ''
    });
  };
  
  const removeCompatibility = (index) => {
    const newCompatibility = [...formData.compatibility];
    newCompatibility.splice(index, 1);
    setFormData({
      ...formData,
      compatibility: newCompatibility
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1950; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="part-form">
        <h3>{part ? 'Edit Part' : 'Add New Part'}</h3>
        
        <div className="form-section">
          <h4>Basic Information</h4>
          
          <div className="form-group">
            <label htmlFor="name">Part Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="error-text">{errors.category}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="4"
            ></textarea>
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h4>Part Details</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={errors.brand ? 'error' : ''}
              />
              {errors.brand && <div className="error-text">{errors.brand}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="partNumber">Part Number *</label>
              <input
                type="text"
                id="partNumber"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                className={errors.partNumber ? 'error' : ''}
              />
              {errors.partNumber && <div className="error-text">{errors.partNumber}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Pricing & Inventory</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <div className="error-text">{errors.price}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="retailPrice">Retail Price ($)</label>
              <input
                type="number"
                id="retailPrice"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.retailPrice ? 'error' : ''}
              />
              {errors.retailPrice && <div className="error-text">{errors.retailPrice}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stockQuantity">Quantity</label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <label htmlFor="inStock">In Stock</label>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Vehicle Compatibility</h4>
          
          <div className="compatibility-list">
            {formData.compatibility.map((compat, index) => (
              <div className="compatibility-item" key={index}>
                <span>
                  {compat.make} {compat.model} ({compat.yearStart}-{compat.yearEnd})
                  {compat.trim && ` ${compat.trim}`}
                  {compat.engine && ` ${compat.engine}`}
                </span>
                <button
                  type="button"
                  className="btn-icon delete"
                  onClick={() => removeCompatibility(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="compatibility-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="make">Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={compatVehicle.make}
                  onChange={handleCompatibilityChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={compatVehicle.model}
                  onChange={handleCompatibilityChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="yearStart">Year Start</label>
                <select
                  id="yearStart"
                  name="yearStart"
                  value={compatVehicle.yearStart}
                  onChange={handleCompatibilityChange}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map((year) => (
                    <option key={`start-${year}`} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="yearEnd">Year End</label>
                <select
                  id="yearEnd"
                  name="yearEnd"
                  value={compatVehicle.yearEnd}
                  onChange={handleCompatibilityChange}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map((year) => (
                    <option key={`end-${year}`} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trim">Trim (Optional)</label>
                <input
                  type="text"
                  id="trim"
                  name="trim"
                  value={compatVehicle.trim}
                  onChange={handleCompatibilityChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="engine">Engine (Optional)</label>
                <input
                  type="text"
                  id="engine"
                  name="engine"
                  value={compatVehicle.engine}
                  onChange={handleCompatibilityChange}
                />
              </div>
            </div>
            
            <button
              type="button"
              className="btn-secondary"
              onClick={addCompatibility}
            >
              Add Compatibility
            </button>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Images</h4>
          
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleChange}
              multiple
              accept="image/*"
            />
          </div>
          
          {formData.images && formData.images.length > 0 && (
            <div className="image-preview">
              <p>{formData.images.length} image(s) selected</p>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {part ? 'Update Part' : 'Add Part'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartForm;