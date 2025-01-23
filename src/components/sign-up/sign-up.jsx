import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FormStyles.css"; // Az új CSS importálása

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
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
    // Regisztrációs logika itt (pl. validálás és adatküldés)
    console.log(formData);
  };

  return (
    <div className="sign-up-wrapper">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            placeholder="Enter your email"
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
            placeholder="Create password"
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
            placeholder="Confirm password"
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
  );
};

export default SignUp;
