import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext';

const PartDetails = () => {
  const { partId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState(null);

  
  useEffect(() => {
   
    const fetchPartDetails = async () => {
      setLoading(true);
      
      setTimeout(() => {

        const mockPart = {
          id: partId,
          name: 'Premium Ceramic Brake Pads',
          brand: 'StopTech',
          sku: 'ST-7891',
          manufacturerPart: 'SC-1234',
          category: 'Brakes',
          subcategory: 'Brake Pads',
          price: 79.99,
          originalPrice: 99.99,
          rating: 4.8,
          reviewCount: 156,
          description: 'High-performance ceramic brake pads designed for optimal stopping power and reduced brake dust. These premium pads offer superior performance in both wet and dry conditions while extending rotor life.',
          features: [
            'Advanced ceramic formulation',
            'Reduced brake dust for cleaner wheels',
            'Chamfered and slotted for reduced noise',
            'Includes wear indicators',
            'Meets or exceeds OEM specifications'
          ],
          specifications: [
            { name: 'Position', value: 'Front' },
            { name: 'Material', value: 'Ceramic' },
            { name: 'Width', value: '4.7 inches' },
            { name: 'Height', value: '2.3 inches' },
            { name: 'Thickness', value: '0.78 inches' },
            { name: 'Weight', value: '2.4 lbs' },
            { name: 'Includes Hardware', value: 'Yes' },
            { name: 'Warranty', value: '3 Years' }
          ],
          compatibility: {
            vehicles: [
              { make: 'Toyota', model: 'Camry', years: '2018-2022', trim: 'All' },
              { make: 'Toyota', model: 'Avalon', years: '2019-2022', trim: 'All' },
              { make: 'Honda', model: 'Accord', years: '2018-2022', trim: 'LX, Sport, EX' }
            ],
            status: 'compatible',
            message: 'Compatible with your 2018 Toyota Camry SE'
          },
          mechanicTips: [
            {
              mechanicName: 'Mike Johnson',
              certification: 'ASE Master Technician',
              tip: 'Make sure to apply brake lubricant to the contact points between the pad and caliper bracket. This reduces noise and extends pad life.',
              image: '/assets/mechanic-tip.jpg'
            },
            {
              mechanicName: 'Sarah Williams',
              certification: 'Toyota Certified Technician',
              tip: 'When installing these pads, check your caliper pins for smooth movement and lubricate them if necessary. Stuck pins can cause uneven pad wear.',
              image: '/assets/mechanic-tip-2.jpg'
            }
          ],
          installationDifficulty: 'Intermediate',
          estimatedInstallTime: '45-60 minutes',
          images: [
            '/assets/brake-pads-1.jpg',
            '/assets/brake-pads-2.jpg',
            '/assets/brake-pads-3.jpg',
            '/assets/brake-pads-4.jpg'
          ],
          sellers: [
            { 
              id: 's1',
              name: 'AutoZone', 
              price: 79.99, 
              rating: 4.7,
              inStock: true, 
              freeShipping: true,
              estimatedDelivery: '1-2 business days',
              condition: 'New'
            },
            { 
              id: 's2',
              name: 'O\'Reilly Auto Parts', 
              price: 84.99, 
              rating: 4.6,
              inStock: true, 
              freeShipping: true,
              estimatedDelivery: '2-3 business days',
              condition: 'New'
            },
            { 
              id: 's3',
              name: 'Advance Auto Parts', 
              price: 89.99, 
              rating: 4.5,
              inStock: false, 
              freeShipping: true,
              estimatedDelivery: '3-5 business days',
              condition: 'New'
            },
            { 
              id: 's4',
              name: 'Amazon', 
              price: 76.99, 
              rating: 4.4,
              inStock: true, 
              freeShipping: true,
              estimatedDelivery: '1-3 business days',
              condition: 'New'
            }
          ],
          reviews: [
            {
              id: 'r1',
              user: 'John D.',
              date: '2023-04-12',
              rating: 5,
              title: 'Excellent performance and no dust!',
              content: 'These brake pads are fantastic. I installed them on my Camry and immediately noticed the improved stopping power. Even after 2000 miles, there\'s virtually no brake dust on my wheels. Highly recommended!',
              helpful: 42,
              vehicle: '2019 Toyota Camry XSE'
            },
            {
              id: 'r2',
              user: 'Sarah M.',
              date: '2023-03-20',
              rating: 5,
              title: 'Better than OEM',
              content: 'Much better than the factory brake pads that came with my car. Installation was straightforward and they\'ve been performing great for the past month.',
              helpful: 28,
              vehicle: '2020 Toyota Avalon'
            },
            {
              id: 'r3',
              user: 'Robert T.',
              date: '2023-02-15',
              rating: 4,
              title: 'Good quality but a bit pricey',
              content: 'The quality is definitely there and the performance is better than stock, but they are a bit on the expensive side. I\'m happy with the purchase though.',
              helpful: 15,
              vehicle: '2018 Honda Accord Sport'
            }
          ],
          relatedParts: [
            {
              id: 'rp1',
              name: 'Premium Brake Rotors',
              image: '/assets/brake-rotors.jpg',
              price: 129.99,
              rating: 4.6
            },
            {
              id: 'rp2',
              name: 'Brake Caliper Lubricant',
              image: '/assets/brake-lubricant.jpg',
              price: 9.99,
              rating: 4.8
            },
            {
              id: 'rp3',
              name: 'Brake Hardware Kit',
              image: '/assets/brake-hardware.jpg',
              price: 19.99,
              rating: 4.7
            },
            {
              id: 'rp4',
              name: 'Brake Cleaner Spray',
              image: '/assets/brake-cleaner.jpg',
              price: 7.99,
              rating: 4.9
            }
          ],
          questions: [
            {
              id: 'q1',
              question: 'Do these pads come with wear indicators?',
              answer: 'Yes, these brake pads include built-in wear indicators that will alert you when they need to be replaced.',
              askedBy: 'Mike R.',
              answeredBy: 'StopTech Support',
              date: '2023-01-10'
            },
            {
              id: 'q2',
              question: 'Are these front or rear brake pads?',
              answer: 'This particular listing is for front brake pads. We also offer rear brake pads with a different part number (ST-7892).',
              askedBy: 'Linda K.',
              answeredBy: 'StopTech Support',
              date: '2023-02-15'
            }
          ]
        };
        
        setPart(mockPart);
        setSelectedSeller(mockPart.sellers[0]);
        setLoading(false);
      }, 800);
    };

    const fetchUserVehicles = () => {

      if (isAuthenticated) {
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
        setSelectedVehicle(mockVehicles[0]);
      }
    };

    fetchPartDetails();
    fetchUserVehicles();
  }, [partId, isAuthenticated]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  const handleAddToCart = () => {

    console.log(`Added ${quantity} ${part.name} from ${selectedSeller.name} to cart`);
   
  };

  const handleBuyNow = () => {
   
    console.log(`Buying ${quantity} ${part.name} from ${selectedSeller.name}`);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="part-details-page loading">
        <div className="container">
          <div className="loader"></div>
          <p>Loading part details...</p>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="part-details-page not-found">
        <div className="container">
          <h2>Part Not Found</h2>
          <p>The part you are looking for could not be found.</p>
          <Link to="/search" className="btn-primary">Browse All Parts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="part-details-page">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> &gt; 
          <Link to="/search">Parts</Link> &gt; 
          <Link to={`/search?category=${part.category}`}>{part.category}</Link> &gt; 
          <span>{part.name}</span>
        </div>

        <div className="part-details-wrapper">

          <div className="part-main">
            <div className="part-gallery">
              <div className="main-image">
                <img src={part.images[selectedImage]} alt={part.name} />
              </div>
              <div className="thumbnail-slider">
                {part.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${part.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="part-info">
              <div className="part-header">
                <h1>{part.name}</h1>
                <div className="part-meta">
                  <span className="brand">by {part.brand}</span>
                  <div className="rating">
                    <div className="stars">
                      <span className="star-rating" style={{ '--rating': part.rating }}></span>
                    </div>
                    <Link to="#reviews" className="review-count">{part.reviewCount} reviews</Link>
                  </div>
                </div>
              </div>

              <div className="part-identification">
                <div className="id-item">
                  <span className="label">SKU:</span>
                  <span className="value">{part.sku}</span>
                </div>
                <div className="id-item">
                  <span className="label">MFR #:</span>
                  <span className="value">{part.manufacturerPart}</span>
                </div>
              </div>

              {isAuthenticated && userVehicles.length > 0 && (
                <div className="part-compatibility">
                  <h3>Compatibility with Your Vehicles</h3>
                  <div className="vehicle-selector">
                    <label htmlFor="vehicle-select">Check for:</label>
                    <select 
                      id="vehicle-select"
                      value={selectedVehicle?.id}
                      onChange={(e) => {
                        const vehicle = userVehicles.find(v => v.id === e.target.value);
                        setSelectedVehicle(vehicle);
                      }}
                    >
                      {userVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedVehicle && (
                    <div className={`compatibility-result ${part.compatibility.status}`}>
                      <span className={`icon ${part.compatibility.status}`}>
                        {part.compatibility.status === 'compatible' && '✓'}
                        {part.compatibility.status === 'incompatible' && '✕'}
                        {part.compatibility.status === 'needs-verification' && '?'}
                        {part.compatibility.status === 'universal' && '✓'}
                      </span>
                      <span className="message">{part.compatibility.message}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="seller-options">
                <h3>Available From</h3>
                <div className="sellers-list">
                  {part.sellers.map(seller => (
                    <div 
                      key={seller.id}
                      className={`seller-option ${selectedSeller?.id === seller.id ? 'selected' : ''} ${!seller.inStock ? 'out-of-stock' : ''}`}
                      onClick={() => seller.inStock && setSelectedSeller(seller)}
                    >
                      <div className="seller-info">
                        <div className="seller-name">{seller.name}</div>
                        <div className="seller-rating">
                          <span className="stars">★</span> {seller.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="seller-price">
                        <span className="price">${seller.price.toFixed(2)}</span>
                        <div className="stock-status">
                          {seller.inStock ? (
                            <span className="in-stock">In Stock</span>
                          ) : (
                            <span className="out-of-stock">Out of Stock</span>
                          )}
                        </div>
                      </div>
                      {selectedSeller?.id === seller.id && (
                        <div className="selected-badge">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="purchase-section">
                <div className="price-display">
                  <div className="current-price">${selectedSeller?.price.toFixed(2)}</div>
                  {part.originalPrice > selectedSeller?.price && (
                    <div className="savings">
                      <span className="original-price">${part.originalPrice.toFixed(2)}</span>
                      <span className="discount">
                        Save ${(part.originalPrice - selectedSeller?.price).toFixed(2)} ({Math.round((part.originalPrice - selectedSeller?.price) / part.originalPrice * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="delivery-info">
                  {selectedSeller?.freeShipping && <span className="free-shipping">Free Shipping</span>}
                  <span className="delivery-estimate">Estimated delivery: {selectedSeller?.estimatedDelivery}</span>
                </div>
                
                <div className="purchase-actions">
                  <div className="quantity-selector">
                    <label htmlFor="quantity">Qty:</label>
                    <div className="quantity-input">
                      <button 
                        className="quantity-btn" 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        id="quantity" 
                        min="1" 
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <button 
                        className="quantity-btn" 
                        onClick={() => setQuantity(q => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="purchase-buttons">
                    <button 
                      className="add-to-cart-btn"
                      onClick={handleAddToCart}
                      disabled={!selectedSeller?.inStock}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="buy-now-btn"
                      onClick={handleBuyNow}
                      disabled={!selectedSeller?.inStock}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="installation-info">
                <div className="info-item">
                  <span className="info-icon">🔧</span>
                  <div className="info-content">
                    <span className="info-label">Installation Difficulty</span>
                    <span className="info-value">{part.installationDifficulty}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <div className="info-content">
                    <span className="info-label">Estimated Install Time</span>
                    <span className="info-value">{part.estimatedInstallTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="part-details-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description & Features
              </button>
              <button 
                className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button 
                className={`tab-btn ${activeTab === 'compatibility' ? 'active' : ''}`}
                onClick={() => setActiveTab('compatibility')}
              >
                Vehicle Compatibility
              </button>
              <button 
                className={`tab-btn ${activeTab === 'mechanic-tips' ? 'active' : ''}`}
                onClick={() => setActiveTab('mechanic-tips')}
              >
                Mechanic Tips
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({part.reviewCount})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                Q&A ({part.questions.length})
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane" id="description">
                  <div className="description-content">
                    <h3>Product Description</h3>
                    <p>{part.description}</p>
                    
                    <h3>Features</h3>
                    <ul className="features-list">
                      {part.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="tab-pane" id="specs">
                  <div className="specs-content">
                    <h3>Technical Specifications</h3>
                    <table className="specs-table">
                      <tbody>
                        {part.specifications.map((spec, index) => (
                          <tr key={index}>
                            <td className="spec-name">{spec.name}</td>
                            <td className="spec-value">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'compatibility' && (
                <div className="tab-pane" id="compatibility">
                  <div className="compatibility-content">
                    <h3>Compatible Vehicles</h3>
                    <table className="compatibility-table">
                      <thead>
                        <tr>
                          <th>Make</th>
                          <th>Model</th>
                          <th>Years</th>
                          <th>Trim Levels</th>
                        </tr>
                      </thead>
                      <tbody>
                        {part.compatibility.vehicles.map((vehicle, index) => (
                          <tr key={index}>
                            <td>{vehicle.make}</td>
                            <td>{vehicle.model}</td>
                            <td>{vehicle.years}</td>
                            <td>{vehicle.trim}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="compatibility-note">
                      <p>
                        <span className="note-icon">ℹ️</span>
                        If your vehicle is not listed, it doesn't necessarily mean this part won't fit.
                        Please contact customer support for verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mechanic-tips' && (
                <div className="tab-pane" id="mechanic-tips">
                  <div className="mechanic-tips-content">
                    <h3>Professional Installation Tips</h3>
                    
                    {part.mechanicTips.map((tip, index) => (
                      <div key={index} className="mechanic-tip-card">
                        <div className="mechanic-profile">
                          <div className="mechanic-avatar">
                            <img src={tip.image} alt={tip.mechanicName} />
                          </div>
                          <div className="mechanic-info">
                            <h4>{tip.mechanicName}</h4>
                            <span className="certification">{tip.certification}</span>
                          </div>
                        </div>
                        <div className="tip-content">
                          <p>{tip.tip}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="diy-note">
                      <h4>DIY Installation Resources</h4>
                      <ul>
                        <li>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            View installation video tutorial
                          </a>
                        </li>
                        <li>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            Download installation instructions (PDF)
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-pane" id="reviews">
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="average-rating">
                        <div className="rating-number">{part.rating.toFixed(1)}</div>
                        <div className="rating-stars">
                          <div className="stars">
                            <span className="star-rating" style={{ '--rating': part.rating }}></span>
                          </div>
                          <span className="total-reviews">{part.reviewCount} reviews</span>
                        </div>
                      </div>
                      
                      <div className="write-review">
                        <button className="write-review-btn">Write a Review</button>
                      </div>
                    </div>
                    
                    <div className="reviews-list">
                      {part.reviews.map(review => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-name">{review.user}</div>
                            <div className="review-date">{review.date}</div>
                          </div>
                          
                          <div className="review-rating">
                            <div className="stars">
                              <span className="star-rating" style={{ '--rating': review.rating }}></span>
                            </div>
                          </div>
                          
                          <h4 className="review-title">{review.title}</h4>
                          <p className="review-content">{review.content}</p>
                          
                          <div className="review-vehicle">
                            <span className="vehicle-icon">🚗</span>
                            <span className="vehicle-info">{review.vehicle}</span>
                          </div>
                          
                          <div className="review-actions">
                            <button className="helpful-btn">
                              <span className="helpful-icon">👍</span>
                              <span className="helpful-text">Helpful ({review.helpful})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="tab-pane" id="questions">
                  <div className="questions-content">
                    <div className="questions-header">
                      <h3>Questions & Answers</h3>
                      <button className="ask-question-btn">Ask a Question</button>
                    </div>
                    
                    <div className="questions-list">
                      {part.questions.map(qa => (
                        <div key={qa.id} className="qa-card">
                          <div className="question-section">
                            <div className="q-icon">Q</div>
                            <div className="question-content">
                              <p className="question-text">{qa.question}</p>
                              <div className="question-meta">
                                <span className="asker">{qa.askedBy}</span>
                                <span className="date">{qa.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="answer-section">
                            <div className="a-icon">A</div>
                            <div className="answer-content">
                              <p className="answer-text">{qa.answer}</p>
                              <div className="answer-meta">
                                <span className="answerer">{qa.answeredBy}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="related-parts-section">
            <h3>Frequently Bought Together</h3>
            <div className="related-parts-grid">
              {part.relatedParts.map(relatedPart => (
                <Link key={relatedPart.id} to={`/parts/${relatedPart.id}`} className="related-part-card">
                  <div className="related-part-image">
                    <img src={relatedPart.image} alt={relatedPart.name} />
                  </div>
                  <div className="related-part-info">
                    <h4>{relatedPart.name}</h4>
                    <div className="related-part-rating">
                      <div className="stars">
                        <span className="star-rating" style={{ '--rating': relatedPart.rating }}></span>
                      </div>
                    </div>
                    <div className="related-part-price">
                      ${relatedPart.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetails;