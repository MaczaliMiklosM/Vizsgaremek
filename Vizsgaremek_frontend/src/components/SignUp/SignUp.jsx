import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FormStyles.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
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
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
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
              type="password"
              placeholder="Create Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
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
            <h3>
              Already have an account? <Link to="/signin">Sign in now</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
