// ✅ Módosított Checkout.js - backend-alapú rendelés, collection frissítés frontend nélkül

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
    name: '', email: '', address: '', country: '', phone: '', paymentMethod: 'cash'
  });
  const [user, setUser] = useState(null);
  const cart = JSON.parse(localStorage.getItem('basket')) || [];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/management/adminuser/get-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => console.error("❌ Failed to fetch profile:", err));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || '', email: user.email || '',
        address: user.address || '', country: user.country || '',
        phone: user.phone_number || '', paymentMethod: 'cash'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateShipping = () => {
    const { name, email, address, country, phone } = formData;
    if (!name || !email || !address || !country || !phone) return 'Please fill out all shipping fields.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (isNaN(phone)) return 'Phone number must be valid.';
    return '';
  };

  const handleNext = () => {
    const validationError = step === 0 ? validateShipping() : '';
    if (validationError) setError(validationError);
    else { setError(''); if (step < steps.length - 1) setStep(step + 1); }
  };

  const handleBack = () => step > 0 && setStep(step - 1);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const requestBody = {
      userId: user.id,
      shippingAddress: formData.address,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1,
        unitPrice: Math.round(item.price)
      }))
    };

    try {
      const res = await fetch('/api/orders/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) throw new Error('Order failed');

      // 🔁 Töröljük a megvásárolt termékeket a wishlistből is
      for (const item of cart) {
        await fetch('/api/wishlist/removeWishlistItem', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.id, productId: item.id })
        });
      }

      localStorage.removeItem('basket');
      alert('Order placed! Redirecting to Collection...');
      navigate('/collection');
    } catch (err) {
      console.error('Order error:', err);
      setError('Order failed. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="checkout-step">
            <h2>Shipping Information</h2>
            {[ 'name', 'email', 'address', 'country', 'phone' ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
              />
            ))}
            <button onClick={() => setFormData({
              ...formData,
              name: user.full_name,
              email: user.email,
              address: user.address,
              country: user.country,
              phone: user.phone_number
            })}>Use Profile Info</button>
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
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Address:</strong> {formData.address}</p>
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

  if (!user) return <p>Loading user data...</p>;

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