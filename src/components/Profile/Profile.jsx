import React from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-sections">
          
          {/* Cart Section */}
          <div className="profile-section">
            <h2>🛒 A kosár</h2>
            <ul className="cart-items">
              <li>
                <span>Nike Air Max 97</span>
                <span>$180</span>
              </li>
              <li>
                <span>Adidas Ultraboost</span>
                <span>$150</span>
              </li>
            </ul>
            <div className="cart-total">Összeg: $330</div>
            <Link to="/checkout" className="checkout-btn">Tovább a fizetéshez</Link>
          </div>

          {/* Favorites Section */}
          <div className="profile-section">
            <h2>❤️ Kedvencek</h2>
            <p>Jordan 1 High OG - $220</p>
            <p>Yeezy Boost 350 V2 - $250</p>
          </div>

          {/* Wishlist Section */}
          <div className="profile-section">
            <h2>📜 Kívánságlista</h2>
            <p>Balenciaga Triple S - $850</p>
            <p>Off-White x Nike Dunk - $350</p>
          </div>

          {/* Personal Info */}
          <div className="profile-section">
            <h2>👤 Személyes adatok</h2>
            <p>Név: Kovács Péter</p>
            <p>Email: peter.kovacs@example.com</p>
          </div>

          {/* Collection Section */}
          <div className="profile-section">
            <h2>🎨 Kollekció</h2>
            <p>Travis Scott x Air Jordan 1</p>
            <p>Fear of God Sneakers</p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
