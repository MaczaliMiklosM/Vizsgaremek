import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import './CheckOut.css';

const steps = ['Shipping', 'Payment', 'Summary'];

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData({ ...formData, cardNumber: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const isValidLuhn = (number) => {
    const digits = number.split('').reverse().map(Number);
    const sum = digits.reduce((acc, digit, idx) => {
      if (idx % 2 === 1) {
        const dbl = digit * 2;
        return acc + (dbl > 9 ? dbl - 9 : dbl);
      }
      return acc + digit;
    }, 0);
    return sum % 10 === 0;
  };

  const validateShipping = () => {
    const { name, email, address, city, zip } = formData;
    if (!name || !email || !address || !city || !zip) {
      return 'Please fill out all shipping fields.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (isNaN(zip)) return 'ZIP code must be a number.';
    return '';
  };

  const validatePayment = () => {
    if (!formData.paymentMethod) return 'Please select a payment method.';
    if (formData.paymentMethod === 'credit') {
      const digitsOnly = formData.cardNumber.replace(/\D/g, '');
      if (digitsOnly.length < 14 || digitsOnly.length > 19) {
        return 'Credit card number must be between 14 and 19 digits.';
      }
      if (!isValidLuhn(digitsOnly)) {
        return 'Invalid credit card number.';
      }

      const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryDateRegex.test(formData.expiryDate)) {
        return 'Invalid expiry date. Format should be MM/YY.';
      }

      if (formData.cvv.length !== 3) {
        return 'CVV must be 3 digits.';
      }
    }
    return '';
  };

  const handleNext = () => {
    let validationError = '';
    if (step === 0) validationError = validateShipping();
    else if (step === 1) validationError = validatePayment();

    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      if (step < steps.length - 1) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePayment = () => {
    alert('Payment Successful! Redirecting to home page...');
    navigate('/');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="checkout-step">
            <h2>Shipping Information</h2>
            {['name', 'email', 'address', 'city', 'zip'].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
              />
            ))}
            {error && <p className="form-error">{error}</p>}
            <button onClick={handleNext}>Next</button>
          </div>
        );
      case 1:
        return (
          <div className="checkout-step">
            <h2>Payment Method</h2>
            <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod}>
              <option value="">Select Payment Method</option>
              <option value="credit">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            {formData.paymentMethod === 'credit' && (
              <>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleExpiryChange}
                  maxLength={5}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </>
            )}
            {error && <p className="form-error">{error}</p>}
            <div className="button-group">
              <button onClick={handleBack}>Back</button>
              <button onClick={handleNext}>Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.zip}</p>
            <p><strong>Payment:</strong> {formData.paymentMethod}</p>
            <div className="button-group">
              <button onClick={handleBack}>Back</button>
              <button onClick={handlePayment}>Pay Now</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <RequireAuth>
        <div className="container">
      <Header />
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-steps">
          {steps.map((label, index) => (
            <div key={index} className="checkout-step-indicator">
              <div className={`checkout-step-circle ${index <= step ? 'active' : ''}`}>{index + 1}</div>
              <div className={`checkout-step-label ${index <= step ? 'active' : ''}`}>{label}</div>
              {index < steps.length - 1 && (
                <div className={`checkout-step-line ${index < step ? 'active' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
      <Footer />
    </div>
    </RequireAuth>
  
  );
};

export default Checkout;
