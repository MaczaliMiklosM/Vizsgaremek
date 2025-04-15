import React, { useState } from 'react';
import './Footer.css';
import { Facebook, Instagram, LinkedIn, GitHub, Home, Email, Phone } from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../Auth/AuthModal';
import AccessDeniedPopup from '../Auth/AccessDeniedPopup';

const Footer = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleProtectedRoute = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setShowAccessDenied(true);
    }
  };

  return (
    <footer className="footer-fullwidth">
      <div className="footer-social">
        <span>Get connected with us on social networks:</span>
        <div className="social-links">
          <a href="https://www.facebook.com/profile.php?id=61574491025378" target="_blank" rel="noopener noreferrer"><Facebook /></a>
          <a href="https://x.com/Luxshop_real" target="_blank" rel="noopener noreferrer"><XIcon /></a>
          <a href="https://www.instagram.com/luxshopreal1/" target="_blank" rel="noopener noreferrer"><Instagram /></a>
          <a href="https://www.linkedin.com/mynetwork/" target="_blank" rel="noopener noreferrer"><LinkedIn /></a>
          <a href="https://github.com/dashboard" target="_blank" rel="noopener noreferrer"><GitHub /></a>
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
                <li onClick={() => navigate("/products?search=woman")} className="footer-link">Women</li>
                <li onClick={() => navigate("/products?search=man")} className="footer-link">Men</li>
                <li onClick={() => navigate("/products?search=sneaker")} className="footer-link">Sneakers</li>
                <li onClick={() => navigate("/products?search=bag")} className="footer-link">Bags</li>
                <li onClick={() => navigate("/products?search=watch")} className="footer-link">Watches</li>
              </ul>
            </div>

            <div className="footer-section links">
              <h6>Useful Links</h6>
              <ul>
                <li onClick={() => handleProtectedRoute("/profile")} className="footer-link">Your Account</li>
                <li onClick={() => handleProtectedRoute("/wishlist")} className="footer-link">Your Wishlist</li>
                <li onClick={() => handleProtectedRoute("/myproducts")} className="footer-link">Sell Item</li>
                <li onClick={() => navigate("/about")} className="footer-link">About Us</li>
                <li onClick={() => navigate("/terms")} className="footer-link">Terms And Conditions</li>
              </ul>
            </div>

            <div className="footer-section contact">
              <h6>Contact</h6>
              <ul>
                <li><Home /> 4400, Nyíregyháza Városmajor u. 4.</li>
                <li><Email /> support@luxshop.com</li>
                <li><Phone /> +36 1 234 5678</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        © 2025 Copyright: LuxShop LLC
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showAccessDenied && <AccessDeniedPopup onClose={() => setShowAccessDenied(false)} />}
    </footer>
  );
};

export default Footer;
