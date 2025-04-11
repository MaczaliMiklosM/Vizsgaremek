import { useEffect } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import countries from '/src/data/countries.json';
import axios from 'axios';
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
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      fullName, email, phoneNumber, address, country, password, confirmPassword,
    } = formData;

    if (isSignUp) {
      if (Object.values({ fullName, email, phoneNumber, address, country, password, confirmPassword }).some(val => !val)) {
        return alert('Please fill out all fields.');
      }
      if (password !== confirmPassword) return alert('Passwords do not match!');
      if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        return alert('Password must be at least 10 characters long, include a special character, a number and an uppercase letter.');
      }

      const payload = {
        name: fullName,
        email,
        password,
        phoneNumber,
        address,
        country
      };

      try {
        await axios.post('/api/auth/register', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('Registration successful! You can now sign in.');
        setIsSignUp(false);
      } catch (error) {
        console.error("❌ Registration error:", error);
        alert('Registration failed: ' + (error.response?.data?.message || error.message));
      }
    } else {
      try {
        const response = await axios.post('/api/api/auth/login', { email, password }, {
          headers: { 'Content-Type': 'application/json' },
        });

        const { token, statusCode } = response.data;

        if (!token || statusCode !== 200) {
          return alert('Invalid email or password!');
        }

        localStorage.setItem('token', token);

        // 🔐 Fetch user profile to get role and id
        const profileResponse = await axios.get('/api/api/adminuser/get-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = profileResponse.data.user;
        const role = user?.role || user?.authorities?.[0]?.authority || 'USER';

        // 💾 Save everything including user ID
        localStorage.setItem('user', JSON.stringify({
          email,
          role,
          id: user?.id
        }));

        onClose();

        if (role === 'ADMIN') {
          window.location.hash = '#/admin';
        } else {
          window.location.hash = '#/profile';
        }
      } catch (error) {
        console.error("❌ Login error:", error);
        alert('Login failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const renderInputPair = (leftField, rightField) => (
    <div className="input-pair">
      {[leftField, rightField].map((field) => (
        <div className="input-box" key={field}>
          <input
            type={field === 'email' ? 'email' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
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
              {renderInputPair("phoneNumber", "address")}
              <div className="input-box">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="" disabled>Select Country</option>
                  {countries.map((country, i) => (
                    <option key={i} value={country}>{country}</option>
                  ))}
                </select>
              </div>
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
            {isSignUp && formData.password && (
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Strength: {passwordStrength}
              </p>
            )}
          </div>

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
      </div>
    </div>
  );
};

export default AuthModal;
