import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Profile.css';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
  ShoppingBasket as ShoppingBasketIcon,
  Person2 as Person2Icon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Checklist as ChecklistIcon
} from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone_number: '', address: '', country: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/api/management/adminuser/get-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data.user);
        setFormData(response.data.user);
        toast.success("Profile data loaded successfully!", { closeButton: false });
      })
      .catch(error => {
        console.error('Failed to fetch user profile:', error);
        if (error.response?.status === 403) {
          toast.error("Access denied.", { closeButton: false });
        } else {
          toast.error("Failed to load profile.", { closeButton: false });
        }
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!user || !token) return;

    axios.put(`/api/management/admin/update/${user.id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
        setEditMode(false);
        toast.success('Profile updated successfully!', { closeButton: false });
      })
      .catch(error => {
        console.error('Failed to update profile:', error);
        toast.error('Failed to update profile.', { closeButton: false });
      });
  };

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
              <h2><LocalShippingIcon /> Your Orders</h2>
              <Link to="/my-orders" className="checkout-btn">View Orders</Link>
            </div>
            <div className="profile-section">
              <h2><BookmarkBorderIcon /> Your Collection</h2>
              <Link to="/collection" className="checkout-btn">Your Collection</Link>
            </div>
            <div className="profile-section">
              <h2><ChecklistIcon /> Your Own Products</h2>
              <Link to="/myproducts" className="checkout-btn">Your Products</Link>
            </div>
            <div className="profile-section">
              <h2><ChecklistIcon /> Your Bids</h2>
              <Link to="/mybids" className="checkout-btn">Your Bids</Link>
            </div>
            <div className="profile-section">
              <h2><ShoppingBasketIcon /> Your Basket</h2>
              <Link to="/basket" className="checkout-btn">Your Basket</Link>
            </div>
          </div>

          <div className="profile-section2">
            <h2><Person2Icon /> Personal Information</h2>
            {user ? (
              <>
                {editMode ? (
                  <div className="edit-form">
                    <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone" />
                    <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                    <button className="checkout-btn" onClick={handleSave}>Save</button>
                    <button className="checkout-btn" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p><strong>Name:</strong> {user.full_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone_number}</p>
                    <p><strong>Country:</strong> {user.country}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <button className="checkout-btn" onClick={() => setEditMode(true)}>Edit</button>
                  </>
                )}
              </>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  );
};

export default Profile;
