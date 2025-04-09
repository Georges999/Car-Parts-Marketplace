import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext';

const PartSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    make: '',
    model: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    compatibleOnly: true,
    sortBy: 'relevance'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showSymptomSearch, setShowSymptomSearch] = useState(false);
  const [commonSymptoms, setCommonSymptoms] = useState([]);

  // Categories for filter sidebar
  const categories = [
    { id: 'engine', name: 'Engine Parts', count: 1240 },
    { id: 'brakes', name: 'Brakes', count: 856 },
    { id: 'suspension', name: 'Suspension', count: 742 },
    { id: 'electrical', name: 'Electrical', count: 1123 },
    { id: 'transmission', name: 'Transmission', count: 589 },
    { id: 'cooling', name: 'Cooling System', count: 678 },
    { id: 'body', name: 'Body Parts', count: 932 },
    { id: 'interior', name: 'Interior', count: 1050 }
  ];

  // Car make options
  const carMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan'];
  
  // Common symptoms for symptom-based search
  const symptoms = [
    { id: 'brakes-squeaking', name: 'Brakes squeaking', category: 'Brakes' },
    { id: 'car-shaking', name: 'Car shaking when braking', category: 'Brakes/Suspension' },
    { id: 'engine-overheat', name: 'Engine overheating', category: 'Cooling' },
    { id: 'hard-start', name: 'Hard to start engine', category: 'Electrical/Engine' },
    { id: 'knocking-noise', name: 'Knocking noise from engine', category: 'Engine' },
    { id: 'rough-idle', name: 'Rough idle', category: 'Engine/Fuel System' },
    { id: 'vibration', name: 'Vibration when accelerating', category: 'Engine/Transmission' },
    { id: 'ac-not-cold', name: 'AC not blowing cold air', category: 'Climate Control' }
  ];

  // Parse query parameters on component mount or when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParams = {
      query: params.get('q') || '',
      category: params.get('category') || '',
      make: params.get('make') || '',
      model: params.get('model') || '',
      year: params.get('year') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      inStock: params.get('inStock') === 'true',
      compatibleOnly: params.get('compatibleOnly') !== 'false',
      sortBy: params.get('sortBy') || 'relevance'
    };
    
    setSearchParams(queryParams);
    
    // Build active filters list
    const newActiveFilters = [];
    if (queryParams.category) newActiveFilters.push({ type: 'category', value: queryParams.category });
    if (queryParams.make) newActiveFilters.push({ type: 'make', value: queryParams.make });
    if (queryParams.model) newActiveFilters.push({ type: 'model', value: queryParams.model });
    if (queryParams.year) newActiveFilters.push({ type: 'year', value: queryParams.year });
    if (queryParams.minPrice || queryParams.maxPrice) {
      const priceRange = [];
      if (queryParams.minPrice) priceRange.push(`$${queryParams.minPrice}`);
      if (queryParams.maxPrice) priceRange.push(`$${queryParams.maxPrice}`);
      newActiveFilters.push({ type: 'price', value: priceRange.join(' - ') });
    }
    if (queryParams.inStock) newActiveFilters.push({ type: 'inStock', value: 'In Stock Only' });
    
    setActiveFilters(newActiveFilters);
    
    // Set symptom search mode if query looks like a symptom
    const symptomKeywords = ['noise', 'sound', 'squeak', 'vibration', 'shaking', 'leaking', 'overheating'];
    if (queryParams.query && symptomKeywords.some(keyword => queryParams.query.toLowerCase().includes(keyword))) {
      setShowSymptomSearch(true);
      // Filter relevant symptoms based on query
      setCommonSymptoms(symptoms.filter(s => 
        s.name.toLowerCase().includes(queryParams.query.toLowerCase()) ||
        s.category.toLowerCase().includes(queryParams.query.toLowerCase())
      ));
    } else {
      setShowSymptomSearch(false);
    }

    // Fetch search results
    fetchSearchResults(queryParams);
  }, [location.search]);

  // Fetch user's saved vehicles if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, you would fetch from your API
      const mockVehicles = [
        {
          id: 'v1',
          make: 'Toyota',
          model: 'Camry',
          year: '2018',
          trim: 'SE'
        },
        {
          id: 'v2',
          make: 'Honda',
          model: 'Civic',
          year: '2020',
          trim: 'Sport'
        }
      ];
      
      setUserVehicles(mockVehicles);
      
      // Check if we have a vehicle parameter in URL
      const params = new URLSearchParams(location.search);
      const vehicleId = params.get('vehicle');
      if (vehicleId) {
        const vehicle = mockVehicles.find(v => v.id === vehicleId);
        if (vehicle) {
          setSelectedVehicle(vehicle);
        }
      }
    }
  }, [isAuthenticated, location.search]);

  // Simulate fetching search results
  const fetchSearchResults = (params) => {
    setLoading(true);
    
    // In a real app, this would be an API call with the search parameters
    setTimeout(() => {
      // Mock data with various compatibility statuses
      const mockResults = [
        {
          id: '1',
          name: 'Premium Brake Pads',
          image: '/assets/brake-pads.jpg',
          price: 79.99,
          originalPrice: 99.99,
          rating: 4.8,
          reviewCount: 156,
          category: 'Brakes',
          brand: 'StopTech',
          sellers: [
            { name: 'AutoZone', price: 79.99, inStock: true },
            { name: 'O\'Reilly Auto Parts', price: 84.99, inStock: true },
            { name: 'Advanced Auto Parts', price: 89.99, inStock: false }
          ],
          compatibility: {
            status: 'compatible',
            message: 'Fits your 2018 Toyota Camry SE'
          },
          mechanicRecommended: true,
          description: 'High-performance ceramic brake pads for optimal stopping power and reduced brake dust.'
        },
        {
          id: '2',
          name: 'Performance Oil Filter',
          image: '/assets/oil-filter.jpg',
          price: 12.99,
          originalPrice: 14.99,
          rating: 4.6,
          reviewCount: 89,
          category: 'Engine',
          brand: 'K&N',
          sellers: [
            { name: 'AutoZone', price: 12.99, inStock: true },
            { name: 'Amazon', price: 14.99, inStock: true }
          ],
          compatibility: {
            status: 'universal',
            message: 'Universal fit - Compatible with most vehicles'
          },
          mechanicRecommended: true,
          description: 'High-flow oil filter designed to provide excellent filtration and engine protection.'
        },
        {
          id: '3',
          name: 'LED Headlight Set',
          image: '/assets/headlights.jpg',
          price: 129.99,
          originalPrice: 149.99,
          rating: 4.3,
          reviewCount: 42,
          category: 'Lighting',
          brand: 'Sylvania',
          sellers: [
            { name: 'Amazon', price: 129.99, inStock: true },
            { name: 'eBay', price: 124.99, inStock: true },
            { name: 'AutoZone', price: 139.99, inStock: false }
          ],
          compatibility: {
            status: 'needs-verification',
            message: 'May fit your vehicle - Needs verification'
          },
          mechanicRecommended: false,
          description: 'Ultra-bright LED headlight set for improved visibility and modern appearance.'
        },
        {
          id: '4',
          name: 'Air Filter',
          image: '/assets/air-filter.jpg',
          price: 24.99,
          originalPrice: 29.99,
          rating: 4.7,
          reviewCount: 112,
          category: 'Engine',
          brand: 'FRAM',
          sellers: [
            { name: 'O\'Reilly Auto Parts', price: 24.99, inStock: true },
            { name: 'AutoZone', price: 26.99, inStock: true },
            { name: 'Walmart', price: 22.99, inStock: false }
          ],
          compatibility: {
            status: 'incompatible',
            message: 'Does not fit your vehicle'
          },
          mechanicRecommended: true,
          description: 'Engine air filter that helps protect engine components by preventing dirt and debris from entering the engine.'
        }
      ];
      
      setSearchResults(mockResults);
      setLoading(false);
    }, 800);
  };

  // Update URL with new search parameters
  const updateSearchParams = (newParams) => {
    const updatedParams = { ...searchParams, ...newParams };
    
    // Remove empty params to keep URL clean
    const cleanParams = {};
    Object.keys(updatedParams).forEach(key => {
      if (updatedParams[key] !== '' && updatedParams[key] !== false) {
        cleanParams[key] = updatedParams[key];
      }
    });
    
    const queryString = new URLSearchParams(cleanParams).toString();
    navigate(`/search?${queryString}`);
  };

  // Filter removal handler
  const handleRemoveFilter = (filter) => {
    const newParams = { ...searchParams };
    
    switch (filter.type) {
      case 'category':
        newParams.category = '';
        break;
      case 'make':
        newParams.make = '';
        break;
      case 'model':
        newParams.model = '';
        break;
      case 'year':
        newParams.year = '';
        break;
      case 'price':
        newParams.minPrice = '';
        newParams.maxPrice = '';
        break;
      case 'inStock':
        newParams.inStock = false;
        break;
      default:
        break;
    }
    
    updateSearchParams(newParams);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const newParams = {
      query: searchParams.query,
      category: '',
      make: '',
      model: '',
      year: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'relevance'
    };
    
    updateSearchParams(newParams);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    updateSearchParams({ [name]: updatedValue });
  };

  // Handle price filter change
  const handlePriceFilter = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const minPrice = formData.get('minPrice');
    const maxPrice = formData.get('maxPrice');
    
    updateSearchParams({
      minPrice,
      maxPrice
    });
  };

  // Handle selecting a symptom for symptom-based search
  const handleSymptomSelect = (symptom) => {
    updateSearchParams({
      query: symptom.name,
      category: symptom.category.split('/')[0]
    });
  };

  // Handle selecting a vehicle for compatibility filtering
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    updateSearchParams({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      compatibleOnly: true
    });
  };

  return (
    <div className="part-search-page">
      <div className="container">
        <div className="search-header">
          <h1>{searchParams.query ? `Search results for "${searchParams.query}"` : 'Browse Parts'}</h1>
          <p>{searchResults.length} parts found</p>
        </div>
        
        {showSymptomSearch && commonSymptoms.length > 0 && (
          <div className="symptom-search-box">
            <h3>Are you experiencing any of these issues?</h3>
            <div className="symptoms-list">
              {commonSymptoms.map(symptom => (
                <button 
                  key={symptom.id}
                  className="symptom-btn"
                  onClick={() => handleSymptomSelect(symptom)}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
            <p className="symptom-tip">
              <span className="tip-icon">💡</span> 
              Selecting a specific symptom helps us recommend the right parts
            </p>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="active-filters">
            <div className="filter-tags">
              {activeFilters.map((filter, index) => (
                <div key={index} className="filter-tag">
                  <span>{filter.type}: {filter.value}</span>
                  <button onClick={() => handleRemoveFilter(filter)} className="remove-filter">×</button>
                </div>
              ))}
            </div>
            <button onClick={clearAllFilters} className="clear-filters">Clear All</button>
          </div>
        )}
        
        <div className="search-content">
          <div className="filter-sidebar">
            {isAuthenticated && userVehicles.length > 0 && (
              <div className="filter-section">
                <h3>Your Vehicles</h3>
                <div className="vehicles-filter">
                  {userVehicles.map(vehicle => (
                    <button
                      key={vehicle.id}
                      className={`vehicle-filter-btn ${selectedVehicle && selectedVehicle.id === vehicle.id ? 'active' : ''}`}
                      onClick={() => handleVehicleSelect(vehicle)}
                    >
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </button>
                  ))}
                </div>
                {selectedVehicle && (
                  <div className="compatibility-toggle">
                    <label>
                      <input
                        type="checkbox"
                        name="compatibleOnly"
                        checked={searchParams.compatibleOnly}
                        onChange={handleFilterChange}
                      />
                      <span>Show compatible parts only</span>
                    </label>
                  </div>
                )}
              </div>
            )}
            
            {!selectedVehicle && (
              <div className="filter-section">
                <h3>Vehicle</h3>
                <div className="filter-group">
                  <label htmlFor="make">Make</label>
                  <select
                    id="make"
                    name="make"
                    value={searchParams.make}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Makes</option>
                    {carMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="model">Model</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    placeholder="Enter model"
                    value={searchParams.model}
                    onChange={handleFilterChange}
                    disabled={!searchParams.make}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    name="year"
                    value={searchParams.year}
                    onChange={handleFilterChange}
                    disabled={!searchParams.model}
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="filter-section">
              <h3>Categories</h3>
              <ul className="category-filter">
                {categories.map(category => (
                  <li key={category.id}>
                    <label>
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={searchParams.category === category.id}
                        onChange={handleFilterChange}
                      />
                      <span>{category.name}</span>
                      <span className="count">({category.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <form onSubmit={handlePriceFilter} className="price-filter">
                <div className="price-inputs">
                  <div className="price-input">
                    <label htmlFor="minPrice">Min</label>
                    <div className="input-with-prefix">
                      <span>$</span>
                      <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        placeholder="0"
                        value={searchParams.minPrice}
                        onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <span className="price-separator">-</span>
                  <div className="price-input">
                    <label htmlFor="maxPrice">Max</label>
                    <div className="input-with-prefix">
                      <span>$</span>
                      <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        placeholder="999+"
                        value={searchParams.maxPrice}
                        onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="apply-price">Apply</button>
              </form>
            </div>

            <div className="filter-section">
              <h3>Availability</h3>
              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={searchParams.inStock}
                  onChange={handleFilterChange}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          <div className="search-results">
            <div className="results-header">
              <div className="sort-options">
                <label htmlFor="sortBy">Sort By:</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={searchParams.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-results">
                <div className="loader"></div>
                <p>Finding the best parts for you...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="no-results">
                <h3>No results found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="results-grid">
                {searchResults.map(part => (
                  <div key={part.id} className="result-card">
                    {part.compatibility && (
                      <div className={`compatibility-badge ${part.compatibility.status}`}>
                        {part.compatibility.status === 'compatible' && '✓ Compatible'}
                        {part.compatibility.status === 'incompatible' && '✕ Not Compatible'}
                        {part.compatibility.status === 'needs-verification' && '? Needs Verification'}
                        {part.compatibility.status === 'universal' && '✓ Universal Fit'}
                      </div>
                    )}
                    {part.originalPrice > part.price && (
                      <div className="discount-badge">
                        {Math.round((part.originalPrice - part.price) / part.originalPrice * 100)}% OFF
                      </div>
                    )}
                    {part.mechanicRecommended && (
                      <div className="mechanic-badge">
                        <span>👨‍🔧</span> Mechanic's Choice
                      </div>
                    )}
                    <div className="result-image">
                      <img src={part.image} alt={part.name} />
                    </div>
                    <div className="result-info">
                      <h3><Link to={`/parts/${part.id}`}>{part.name}</Link></h3>
                      <div className="result-meta">
                        <span className="brand">{part.brand}</span>
                        <span className="category">{part.category}</span>
                      </div>
                      <div className="result-rating">
                        <div className="stars">
                          <span className="star-rating" style={{ '--rating': part.rating }}></span>
                        </div>
                        <span className="review-count">({part.reviewCount})</span>
                      </div>
                      <div className="result-price">
                        <span className="current-price">${part.price.toFixed(2)}</span>
                        {part.originalPrice > part.price && (
                          <span className="original-price">${part.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      {part.sellers.length > 1 && (
                        <div className="result-sellers">
                          <span className="sellers-count">Available at {part.sellers.length} sellers</span>
                          <div className="sellers-preview">
                            {part.sellers.slice(0, 2).map((seller, idx) => (
                              <div key={idx} className="seller">
                                <span className="seller-name">{seller.name}</span>
                                <span className="seller-price">${seller.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedVehicle && part.compatibility && (
                        <div className="compatibility-message">
                          <span className={`icon ${part.compatibility.status}`}>
                            {part.compatibility.status === 'compatible' && '✓'}
                            {part.compatibility.status === 'incompatible' && '✕'}
                            {part.compatibility.status === 'needs-verification' && '?'}
                            {part.compatibility.status === 'universal' && '✓'}
                          </span>
                          {part.compatibility.message}
                        </div>
                      )}
                      <div className="result-actions">
                        <Link to={`/parts/${part.id}`} className="view-details">View Details</Link>
                        <button className="add-to-cart">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartSearch;