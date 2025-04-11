import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import './CheckOut.css';

const steps = ['Shipping', 'Summary'];

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
    country: '',
    phone: '',  // Added phone to match the profile data
    paymentMethod: 'cash', // Just cash on delivery option
  });

  const cart = JSON.parse(localStorage.getItem('basket')) || [];
  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => {
    // Fetch user data from localStorage if it exists
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser); // Set user state when data is fetched
  }, []); // Only run once when component mounts

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        zip: user.zip || '',
        country: user.country || '',
        phone: user.phone_number || '', // Map phone number
        paymentMethod: 'cash', // Ensure payment method is set for cash
      });
    }
  }, [user]); // Only run this when user data changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateShipping = () => {
    const { name, email, address, city, zip, country, phone } = formData;
    if (!name || !email || !address || !city || !zip || !country || !phone) {
      return 'Please fill out all shipping fields.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (isNaN(zip)) return 'ZIP code must be a number.';
    if (isNaN(phone)) return 'Phone number must be valid.';
    return '';
  };

  const handleNext = () => {
    let validationError = '';
    if (step === 0) validationError = validateShipping();
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
    // A kosár adatai
    const cart = JSON.parse(localStorage.getItem('basket')) || [];
  
    // Megvásárolt termékek hozzáadása a Collection-hoz
    const existingCollection = JSON.parse(localStorage.getItem('purchasedItems')) || [];
    const updatedCollection = [...existingCollection, ...cart];
  
    // Frissítjük a collection-t a localStorage-ban
    localStorage.setItem('purchasedItems', JSON.stringify(updatedCollection));
  
    // Kosár törlése
    localStorage.removeItem('basket');
  
    alert('Order placed! Redirecting to Collection page...');
    navigate('/collection');  // Átirányítás a Collection oldalra
  };

  const handleUseProfileInfo = () => {
    if (user) {
      setFormData({
        ...formData,
        name: user.full_name,
        email: user.email,
        address: user.address,
        country: user.country,
        phone: user.phone_number, // Added phone number field
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="checkout-step">
            <h2>Shipping Information</h2>
            {['name', 'email', 'address', 'city', 'zip', 'country', 'phone'].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
              />
            ))}
            <button onClick={handleUseProfileInfo}>Use Profile Info</button> {/* Button to load profile data */}
            {error && <p className="form-error">{error}</p>}
            <button onClick={handleNext}>Next</button>
          </div>
        );
      case 1:
        return (
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p> {/* Displaying the phone number */}
            <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.zip}</p>
            <p><strong>Country:</strong> {formData.country}</p>

            <h3>Items in your basket:</h3>
            {cart.length === 0 ? (
              <p>Your basket is empty.</p>
            ) : (
              <div className="basket-items">
                {cart.map((item) => (
                  <div key={item.id} className="basket-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="summary">
              <h3>Order Summary</h3>
              <p><strong>Total:</strong> ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
            </div>
            <div className="button-group">
              <button onClick={handleBack}>Back</button>
              <button onClick={handlePayment}>Place Order</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) return <p>Loading user data...</p>;  // Ensure user data is loaded

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
