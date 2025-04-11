import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import './CheckOut.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: '',
    cardNumber: '',
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePayment = () => {
    alert('Payment Successful! Redirecting to home page...');
    navigate('/');
  };

  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>
        {step === 1 && (
          <div className="checkout-step">
            <h2>Shipping Information</h2>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
            <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
            <button onClick={handleNext}>Next</button>
          </div>
        )}
        {step === 2 && (
          <div className="checkout-step">
            <h2>Payment Method</h2>
            <select name="paymentMethod" onChange={handleChange} required>
              <option value="">Select Payment Method</option>
              <option value="credit">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            {formData.paymentMethod === 'credit' && (
              <input type="text" name="cardNumber" placeholder="Card Number" onChange={handleChange} required />
            )}
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext}>Next</button>
          </div>
        )}
        {step === 3 && (
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.zip}</p>
            <p><strong>Payment:</strong> {formData.paymentMethod}</p>
            <button onClick={handleBack}>Back</button>
            <button onClick={handlePayment}>Pay Now</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
