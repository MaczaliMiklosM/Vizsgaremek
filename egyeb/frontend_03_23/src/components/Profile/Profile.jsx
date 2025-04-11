import React from 'react';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
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
          <div className="profile-section">
            <h2><FavoriteBorderIcon /> Your Wishlist</h2>
            <ul className="cart-items">

            </ul>
           
            <Link to="/wishlist" className="checkout-btn">Your WishList</Link>
          </div>
            <div className="profile-section">
            <h2><BookmarkBorderIcon /> Your Collection</h2>
            <div className="cart-total">Total: $0</div>
            <Link to="/collection" className="checkout-btn">Your Collection</Link>
          </div>
           <div className="profile-section">
            <h2><BookmarkBorderIcon /> Your Own Products and Your Bids</h2>
            <Link to="/myproducts" className="checkout-btn">Your Products</Link>
          </div>
          <div className="profile-section">
            <h2><Person2Icon /> Personal Information</h2>
            <p>Name: Maczali Miklós</p>
            <p>Email: maczali@example.com</p>
            <p>Phone: 06301234567</p>
            <p>City: Nyíregyháza </p>
            <p>Address: Utca u. 1</p>
          </div>        

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
