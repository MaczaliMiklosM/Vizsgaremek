import { useEffect } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import countries from '/src/data/countries.json';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    dialCode: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'country') {
      const selected = countries.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        country: selected.name,
        dialCode: selected.dial_code
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === 'password') updatePasswordStrength(value);
  };

  const updatePasswordStrength = (pwd) => {
    const strong = pwd.length >= 10 && /[!@#$%^&*(),.?":{}|<>]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd);
    const medium = pwd.length >= 8;
    setPasswordStrength(strong ? 'Strong' : medium ? 'Medium' : 'Weak');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      fullName, email, phoneNumber, address, country, dialCode, password, confirmPassword
    } = formData;
  
    if (isSignUp) {
      if (Object.values({ fullName, email, phoneNumber, address, country, dialCode, password, confirmPassword }).some(val => !val)) {
        return toast.error('Please fill out all fields.');
      }
      if (password !== confirmPassword) return toast.error('Passwords do not match!');
      if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        return toast.error('Password must be at least 10 characters, contain special char, number and uppercase.');
      }
  
      try {
        // ✅ FIXED: helyes email ellenőrzés
        const check = await axios.get(`/api/management/check-email?email=${email}`);
        if (check.data === true) return toast.error("This email is already registered.");
  
        const payload = {
          name: fullName,
          email,
          password,
          phoneNumber: dialCode + phoneNumber,
          address,
          country
        };
  
        await axios.post('/api/management/auth/register', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
  
        toast.success('Registration successful! You can now sign in.');
        setIsSignUp(false);
      } catch (error) {
        console.error("Registration error:", error);
        toast.error('Registration failed: ' + (error.response?.data?.message || error.message));
      }
    } else {
      try {
        const response = await axios.post('/api/management/auth/login', { email, password });
        const { token, statusCode } = response.data;
    
        if (!token || statusCode !== 200) return toast.error('Invalid email or password!');
    
        localStorage.setItem('token', token);
    
        const profileResponse = await axios.get('/api/management/adminuser/get-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const user = profileResponse.data.user;
        const role = user?.role || user?.authorities?.[0]?.authority || 'USER';
    
        localStorage.setItem('user', JSON.stringify({
          email,
          role,
          id: user?.id
        }));
    
        toast.success("Login successful!");
    
        setTimeout(() => {
          onClose();
          window.location.hash = role === 'ADMIN' ? '#/admin' : '#/';
        }, 1200); // kis várakozás a toastnak
      } catch (error) {
        console.error("Login error:", error);
        toast.error('Login failed: ' + (error.response?.data?.message || error.message));
      }
    }
    
  };
  

  const renderInputPair = (left, right) => (
    <div className="input-pair">
      {[left, right].map((field) => (
        field === 'phoneNumber' ? (
          <div className="input-box" key={field}>
            <div className="phone-wrapper">
              <span className="prefix">{formData.dialCode || '+XX'}</span>
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="phone-input"
                required
              />
            </div>
          </div>
        ) : (
          <div className="input-box" key={field}>
            <input
              type={field === 'email' ? 'email' : 'text'}
              placeholder={field === 'fullName' ? 'Full Name' : field === 'address' ? 'Address' : field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        )
      ))}
    </div>
  );

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-tabs">
          <button className={isSignUp ? 'active' : ''} onClick={() => setIsSignUp(true)}>Sign Up</button>
          <button className={!isSignUp ? 'active' : ''} onClick={() => setIsSignUp(false)}>Log In</button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp ? (
            <>
              {renderInputPair("fullName", "email")}
              <div className="input-box">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="" disabled>Select Country</option>
                  {countries.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              {renderInputPair("phoneNumber", "address")}
            </>
          ) : (
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          )}

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {isSignUp && formData.password && (
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
              Strength: {passwordStrength}
            </p>
          )}

          {isSignUp && (
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          )}

          <div className="input-box button">
            <input type="submit" value={isSignUp ? 'Sign Up' : 'Sign In'} className="submit-button" />
          </div>
        </form>

                  <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            closeButton={false}   
          />
                  
      </div>
    </div>
  );
};

export default AuthModal;
