import React from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import { ShoppingBasket as ShoppingBasketIcon, Person2 as Person2Icon, 
         FavoriteBorder as FavoriteBorderIcon, BookmarkBorder as BookmarkBorderIcon, 
         Checklist as ChecklistIcon } from '@mui/icons-material';
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
            <h2><ShoppingBasketIcon /> Your Basket</h2>
            <ul className="cart-items">
              <li>
                <span>A Bathing Ape Bape Sta Low</span>
                <span>$18,245</span>
              </li>
              <li>
                <span>Louis Vuitton LV Trainer Black Grey Crystal</span>
                <span>$7,374</span>
              </li>
            </ul>
            <div className="cart-total">Price: $25,721</div>
            <Link to="/checkout" className="checkout-btn">Proceed to payment</Link>
          </div>

          {/* Favorites Section */}
          <div className="profile-section">
            <h2><FavoriteBorderIcon /> Your Favorites</h2>
            <ul className="cart-items">
              <li>
                <span>Louis Vuitton x Takashi Murakami</span>
                <span>$14,293</span>
              </li>
              <li>
                <span>Adidas Ultraboost</span>
                <span>$150</span>
              </li>
            </ul>
            <div className="cart-total">Total: $14,443</div>
            <Link to="/favorites" className="checkout-btn">Go to my favorites</Link>
          </div>

          {/* Wishlist Section */}
          <div className="profile-section">
            <h2><ChecklistIcon /> Your Wishlist</h2>
            <p>Balenciaga Triple S</p>
            <p>Off-White x Nike Dunk</p>
          </div>

          {/* Personal Info */}
          <div className="profile-section">
            <h2><Person2Icon /> Personal Information</h2>
            <p>Name: Maczali Miklós</p>
            <p>Email: maczali@example.com</p>
            <p>Phone number: 06301234567</p>
            <p>City: Levelek 4555</p>
            <p>Address: Fasz u. 1</p>
          </div>

          {/* Collection Section */}
          <div className="profile-section">
            <h2><BookmarkBorderIcon /> Your Collection</h2>
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
