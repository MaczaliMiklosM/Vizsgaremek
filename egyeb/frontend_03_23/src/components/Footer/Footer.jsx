import React from 'react';
import './Footer.css';
import { Facebook, Instagram, LinkedIn, GitHub, Home, Email, Phone } from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-fullwidth">
      <div className="footer-social">
        <span>Get connected with us on social networks:</span>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><XIcon /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><LinkedIn /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"><GitHub /></a>
        </div>
      </div>

      <div className="footer-wrapper">
        <div className="footer-content">
          <div className="footer-section company">
            <h6>Lux Shop</h6>
            <p>Discover our commitment to providing a safe, transparent platform for collectors and investors of luxury goods.</p>
          </div>

          <div className="footer-sections">
            <div className="footer-section products">
              <h6>Products</h6>
              <ul>
                <li><Link to="/products/women">Women</Link></li>
                <li><Link to="/products/men">Men</Link></li>
                <li><Link to="/products/sneakers">Sneakers</Link></li>
                <li><Link to="/products/accessories">Accessories</Link></li>
              </ul>
            </div>

            <div className="footer-section links">
              <h6>Useful Links</h6>
              <ul>
                <li><Link to="/profile">Your Account</Link></li>
                <li><Link to="/wishlist">Your Wishlist</Link></li>
                <li><Link to="/my-products">Sell Item</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>
            
            <div className="footer-section contact">
              <h6>Contact</h6>
              <ul>
                <li><Home /> 4400, Nyíregyháza Városmajor u. 4</li>
                <li><Email /> support@luxcollect.com</li>
                <li><Phone /> +36 1 234 5678</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        © 2025 Copyright: LuxShop KFT
      </div>
    </footer>
  );
};

export default Footer;
