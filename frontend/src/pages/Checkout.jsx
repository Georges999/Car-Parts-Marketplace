import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    savePayment: false
  });

  useEffect(() => {
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    

    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      const mockCart = [
        {
          id: '1',
          name: 'Brake Pads',
          price: 39.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100',
          seller: 'AutoZone'
        },
        {
          id: '2',
          name: 'Oil Filter',
          price: 12.99,
          quantity: 2,
          image: 'https://via.placeholder.com/100',
          seller: 'Bosch'
        }
      ];
      
      setCart(mockCart);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cart');
      setLoading(false);
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.07;
  };
  
  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99; 
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setOrderPlaced(true);
        setOrderId('ORD-' + Math.floor(100000 + Math.random() * 900000));
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to place order');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="loading">Loading checkout information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-confirmation">
            <div className="confirmation-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Order Confirmed!</h1>
            <p>Your order #{orderId} has been placed successfully.</p>
            <p>A confirmation email has been sent to your email address.</p>
            
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>${calculateShipping().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="next-steps">
              <p>What would you like to do next?</p>
              <div className="confirmation-actions">
                <Link to="/dashboard/orders" className="btn-primary">View Order</Link>
                <Link to="/search" className="btn-secondary">Continue Shopping</Link>
              </div>
              
              <div className="review-prompt">
                <p>After receiving your items, don't forget to come back and leave a review!</p>
                <p>Reviews help other shoppers make informed decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-name">Review Cart</div>
          </div>
          <div className="progress-divider"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-name">Shipping</div>
          </div>
          <div className="progress-divider"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-name">Payment</div>
          </div>
          <div className="progress-divider"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-name">Confirm</div>
          </div>
        </div>
        
        <div className="checkout-content">
          {step === 1 && (
            <div className="checkout-cart">
              <h2>Review Your Cart</h2>
              
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty.</p>
                  <Link to="/search" className="btn-primary">Browse Parts</Link>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    <div className="cart-header">
                      <span className="col-product">Product</span>
                      <span className="col-price">Price</span>
                      <span className="col-quantity">Quantity</span>
                      <span className="col-total">Total</span>
                    </div>
                    
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="col-product">
                          <div className="product-info">
                            <div className="product-image">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="product-details">
                              <h4>{item.name}</h4>
                              <p>Seller: {item.seller}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-price">${item.price.toFixed(2)}</div>
                        
                        <div className="col-quantity">
                          <div className="quantity-selector">
                            <button className="quantity-btn"
                              disabled={item.quantity <= 1}
                              onClick={() => {/* Decrease quantity logic */}}
                            >-</button>
                            <span>{item.quantity}</span>
                            <button className="quantity-btn"
                              onClick={() => {/* Increase quantiy logic */}}
                            >+</button>
                          </div>
                        </div>
                        
                        <div className="col-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-actions">
                    <Link to="/search" className="btn-text">
                      <i className="fas fa-arrow-left"></i> Continue Shopping
                    </Link>
                    
                    <button className="btn-primary" onClick={nextStep}>
                      Proceed to Shipping <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div className="checkout-shipping">
              <h2>Shipping Information</h2>
              
              <form className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={prevStep}>
                    Back to Cart
                  </button>
                  <button type="button" className="btn-primary" onClick={nextStep}>
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {step === 3 && (
            <div className="checkout-payment">
              <h2>Payment Method</h2>
              
              <form className="payment-form">
                <div className="payment-options">
                  <div className="payment-option active">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      defaultChecked
                    />
                    <label htmlFor="creditCard">
                      <i className="far fa-credit-card"></i> Credit/Debit Card
                    </label>
                  </div>
                </div>
                
                <div className="card-details">
                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiration Date (MM/YY)</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="XXX"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id="savePayment"
                      name="savePayment"
                      checked={paymentInfo.savePayment}
                      onChange={handlePaymentChange}
                    />
                    <label htmlFor="savePayment">
                      Save card for future purchases
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={prevStep}>
                    Back to Shipping
                  </button>
                  <button type="button" className="btn-primary" onClick={nextStep}>
                    Review Order
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {step === 4 && (
            <div className="checkout-confirm">
              <h2>Review Your Order</h2>
              
              <div className="review-sections">
                <div className="review-section">
                  <div className="section-header">
                    <h3>Items</h3>
                    <button className="btn-text" onClick={() => setStep(1)}>
                      Edit
                    </button>
                  </div>
                  
                  <div className="review-items">
                    {cart.map((item) => (
                      <div key={item.id} className="review-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Seller: {item.seller}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="review-section">
                  <div className="section-header">
                    <h3>Shipping</h3>
                    <button className="btn-text" onClick={() => setStep(2)}>
                      Edit
                    </button>
                  </div>
                  
                  <div className="shipping-details">
                    <p><strong>Address:</strong></p>
                    <p>
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}
                    </p>
                    <p><strong>Phone:</strong> {shippingInfo.phone}</p>
                  </div>
                </div>
                
                <div className="review-section">
                  <div className="section-header">
                    <h3>Payment</h3>
                    <button className="btn-text" onClick={() => setStep(3)}>
                      Edit
                    </button>
                  </div>
                  
                  <div className="payment-details">
                    <p><i className="far fa-credit-card"></i> Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                    <p>Name on card: {paymentInfo.cardName}</p>
                  </div>
                </div>
              </div>
              
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>${calculateShipping().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Order Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-actions">
                <button className="btn-secondary" onClick={prevStep}>
                  Back to Payment
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {(step === 1 || step === 2 || step === 3) && (
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>${calculateShipping().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Order Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;