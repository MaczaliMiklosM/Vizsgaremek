import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FormStyles.css";

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
    console.log("Form Data:", formData);
  };

  return (
    <div className="auth-container"> 
      <div className="sign-in-wrapper">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
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
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="text">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="input-box button">
            <input type="submit" value="Sign In" className="submit-button" />
          </div>
          <div className="text">
            <h3>
              Not a member? <Link to="/signup">Register now</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
