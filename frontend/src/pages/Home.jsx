import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
  });


  const popularMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan'];
  
  const featuredParts = [
    {
      id: '1',
      name: 'Premium Brake Pads',
      image: '/assets/brake-pads.jpg',
      price: 79.99,
      rating: 4.8,
      category: 'Brakes',
      compatibleWith: ['Toyota Camry', 'Honda Accord', 'Nissan Altima']
    },
    {
      id: '2',
      name: 'Performance Oil Filter',
      image: '/assets/oil-filter.jpg',
      price: 24.99,
      rating: 4.6,
      category: 'Engine',
      compatibleWith: ['Most vehicles']
    },
    {
      id: '3',
      name: 'LED Headlight Set',
      image: '/assets/headlights.jpg',
      price: 129.99,
      rating: 4.7,
      category: 'Lighting',
      compatibleWith: ['Ford F-150', 'Chevrolet Silverado', 'RAM 1500']
    },
    {
      id: '4',
      name: 'High-Flow Air Filter',
      image: '/assets/air-filter.jpg',
      price: 39.99,
      rating: 4.5,
      category: 'Engine',
      compatibleWith: ['Most vehicles']
    }
  ];

  const categories = [
    { name: 'Engine', icon: '🔧', count: 1240 },
    { name: 'Brakes', icon: '🛑', count: 856 },
    { name: 'Suspension', icon: '🔄', count: 742 },
    { name: 'Electrical', icon: '⚡', count: 1123 },
    { name: 'Transmission', icon: '⚙️', count: 589 },
    { name: 'Cooling', icon: '❄️', count: 678 },
    { name: 'Body Parts', icon: '🚗', count: 932 },
    { name: 'Interior', icon: '💺', count: 1050 }
  ];


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };


  const handleVehicleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?make=${vehicleData.make}&model=${vehicleData.model}&year=${vehicleData.year}`);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find the Right Parts for Your Vehicle</h1>
          <p>Intelligent compatibility checks ensure perfect fit, every time</p>
          
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search parts or describe symptoms (e.g., 'brakes squeaking')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
          
          <div className="popular-searches">
            <span>Popular:</span>
            <a href="/search?q=oil%20filter">Oil Filters</a>
            <a href="/search?q=brake%20pads">Brake Pads</a>
            <a href="/search?q=headlights">Headlights</a>
            <a href="/search?q=spark%20plugs">Spark Plugs</a>
          </div>
        </div>
      </section>

      <section className="vehicle-selector-section">
        <div className="container">
          <div className="section-header">
            <h2>Find Parts For Your Vehicle</h2>
            <p>Select your vehicle for personalized results</p>
          </div>

          <div className="vehicle-finder">
            <form onSubmit={handleVehicleSearch} className="vehicle-form">
              <div className="form-group">
                <label htmlFor="make">Make</label>
                <select 
                  id="make" 
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                  required
                >
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Audi">Audi</option>
                  <option value="Nissan">Nissan</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="model">Model</label>
                <select 
                  id="model" 
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                  required
                  disabled={!vehicleData.make}
                >
                  <option value="">Select Model</option>
                  {vehicleData.make === 'Toyota' && (
                    <>
                      <option value="Camry">Camry</option>
                      <option value="Corolla">Corolla</option>
                      <option value="RAV4">RAV4</option>
                      <option value="Highlander">Highlander</option>
                    </>
                  )}
        
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select 
                  id="year" 
                  value={vehicleData.year}
                  onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
                  required
                  disabled={!vehicleData.model}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="find-parts-btn">Find Parts</button>
            </form>

            <div className="popular-vehicles">
              <h4>Popular Makes</h4>
              <div className="make-logos">
                {popularMakes.map(make => (
                  <div key={make} className="make-logo" onClick={() => setVehicleData({...vehicleData, make})}>
                    <div className="logo-circle">{make.charAt(0)}</div>
                    <span>{make}</span>
                  </div>
                ))}
              </div>
              <div className="save-vehicle-prompt">
                <Link to="/vehicle-profile" className="save-vehicle-link">
                  <i className="fas fa-plus-circle"></i> Save your vehicles for faster searches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="featured-parts-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Parts</h2>
            <Link to="/search" className="view-all-link">View All</Link>
          </div>

          <div className="parts-carousel">
            {featuredParts.map(part => (
              <div key={part.id} className="part-card">
                <div className="part-image">
                  <img src={part.image} alt={part.name} />
                  <div className="part-rating">
                    <span>★</span> {part.rating}
                  </div>
                </div>
                <div className="part-info">
                  <h3>{part.name}</h3>
                  <p className="part-price">${part.price.toFixed(2)}</p>
                  <p className="part-category">{part.category}</p>
                  <div className="part-compatibility">
                    <span className="compatibility-icon">✓</span>
                    <span>Compatible with {part.compatibleWith.length} vehicles</span>
                  </div>
                  <Link to={`/parts/${part.id}`} className="view-details-btn">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
          </div>

          <div className="categories-grid">
            {categories.map(category => (
              <Link key={category.name} to={`/search?category=${category.name}`} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
                <p>{category.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How CarPartsHub Works</h2>
            <p>The smart way to find the right parts for your vehicle</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-icon">1</div>
              <h3>Enter Your Vehicle</h3>
              <p>Add your vehicle details or save multiple vehicle profiles for quick access</p>
            </div>

            <div className="step">
              <div className="step-icon">2</div>
              <h3>Find Parts</h3>
              <p>Search by part name or describe symptoms you're experiencing</p>
            </div>

            <div className="step">
              <div className="step-icon">3</div>
              <h3>Check Compatibility</h3>
              <p>Our system automatically checks if parts will fit your specific vehicle</p>
            </div>

            <div className="step">
              <div className="step-icon">4</div>
              <h3>Compare Options</h3>
              <p>Read mechanic-verified reviews and compare prices across sellers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container">
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <div>
                <h4>Verified Compatibility</h4>
                <p>Parts guaranteed to fit your vehicle</p>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <div>
                <h4>Secure Shopping</h4>
                <p>Verified sellers and secure transactions</p>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon">🛠️</span>
              <div>
                <h4>Expert Advice</h4>
                <p>Mechanic-verified reviews and tips</p>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon">💰</span>
              <div>
                <h4>Best Prices</h4>
                <p>Compare prices across multiple sellers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;