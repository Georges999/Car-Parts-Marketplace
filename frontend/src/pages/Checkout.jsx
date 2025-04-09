import { useState } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [step, setStep] = useState(1);
  
  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <p>This is a placeholder for the checkout page.</p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    </div>
  );
};

export default Checkout;