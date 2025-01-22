import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FormStyles.css"; // Az új CSS importálása

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    console.log(formData); // Helyettesítsd valódi bejelentkezési logikával
  };

  return (
    <div className="sign-in-wrapper">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="input-box button">
          <input type="submit" value="Sign In" className="submit-button" />
        </div>
        <div className="text">
          <h3>
            Don't have an account? <Link to="/signup">Register now</Link>
          </h3>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
