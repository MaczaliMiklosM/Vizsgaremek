import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import { Link } from 'react-router-dom';
import {
  ShoppingBasket as ShoppingBasketIcon,
  Person2 as Person2Icon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Checklist as ChecklistIcon
} from '@mui/icons-material';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('JWT token:', token); 
    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    axios.get('http://localhost:8080/api/adminuser/get-profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("✅ Profile response:", response.data); 
      setUser(response.data.user);
    })
    .catch(error => {
      console.error('❌ Failed to fetch user profile:', error);
      if (error.response?.status === 403) {
        alert("Access denied.");
      }
    });
  }, []);

  return (
    <RequireAuth>
      <div className="container">
        <Header />
        <Navbar />
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="profile-sections">
            <div className="profile-section">
              <h2><FavoriteBorderIcon /> Your Wishlist</h2>
              <ul className="cart-items"></ul>
              <Link to="/wishlist" className="checkout-btn">Your WishList</Link>
            </div>

            <div className="profile-section">
              <h2><BookmarkBorderIcon /> Your Collection</h2>
              <div className="cart-total">Total: $0</div>
              <Link to="/collection" className="checkout-btn">Your Collection</Link>
            </div>

            <div className="profile-section">
              <h2><ChecklistIcon /> Your Own Products and Your Bids</h2>
              <Link to="/myproducts" className="checkout-btn">Your Products</Link>
            </div>

            <div className="profile-section">
              <h2><Person2Icon /> Personal Information</h2>
              {user ? (
                <>
                  <p><strong>Name:</strong> {user.full_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone_number}</p>
                  <p><strong>Country:</strong> {user.country}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                </>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  );
};

export default Profile;
