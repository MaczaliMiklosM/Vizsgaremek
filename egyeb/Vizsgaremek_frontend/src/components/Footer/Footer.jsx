import React from 'react';
import './Footer.css';
import { Facebook, Twitter, Google, Instagram, LinkedIn, GitHub, Home, Email, Phone, Print } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="footer-fullwidth">
      <div className="footer-social">
        <span>Get connected with us on social networks:</span>
        <div className="social-links">
          <a href="#"><Facebook /></a>
          <a href="#"><Twitter /></a>
          <a href="#"><Google /></a>
          <a href="#"><Instagram /></a>
          <a href="#"><LinkedIn /></a>
          <a href="#"><GitHub /></a>
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
                <li><a href="#">Woman</a></li>
                <li><a href="#">Men</a></li>
                <li><a href="#">Sneakers</a></li>
                <li><a href="#">Accessories</a></li>
              </ul>
            </div>
            <div className="footer-section links">
              <h6>Useful Links</h6>
              <ul>
                <li><a href="#">Your Account</a></li>
                <li><a href="#">Your Favorites</a></li>
                <li><a href="#">Sell Item</a></li>
                <li><a href="#">About Us</a></li>
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