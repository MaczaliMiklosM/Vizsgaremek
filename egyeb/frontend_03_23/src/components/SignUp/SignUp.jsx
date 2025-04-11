import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FormStyles.css";
import countries from "./countries.JSON"; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      updatePasswordStrength(value);
    }
  };

  const updatePasswordStrength = (password) => {
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCase = /[A-Z]/;

    if (password.length >= 10 && specialChar.test(password) && upperCase.test(password)) {
      setPasswordStrength("Strong");
    } else if (password.length >= 8) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.country || !formData.password || !formData.confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCaseRegex = /[A-Z]/;
    if (formData.password.length < 10 || !specialCharRegex.test(formData.password) || !upperCaseRegex.test(formData.password)) {
      alert("Password must be at least 10 characters long and include at least one special character and one uppercase letter.");
      return;
    }

    console.log(formData);
  };

  return (
    <div className="auth-container">
      <div className="sign-up-wrapper">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-box">
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-box">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
            {formData.password && (
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>Strength: {passwordStrength}</p>
            )}
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-box button">
            <input type="submit" value="Sign Up" className="submit-button" />
          </div>
          <div className="text">
            <h3 color="white">
              Already have an account? <Link to="/signin">Sign in now</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;