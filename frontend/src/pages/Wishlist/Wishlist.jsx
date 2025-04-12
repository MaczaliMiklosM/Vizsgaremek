// ✅ Frissített Favorites.jsx – Wishlist elemek kattinthatók, de nem blokkolják újra felvételt

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DeleteIcon from '@mui/icons-material/Delete';
import RequireAuth from '../../components/Auth/RequireAuth';
import './Wishlist.css';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/wishlist/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const backendList = response.data
  .filter(item => item.status?.toLowerCase() !== "sold") // ⬅️ ezt tedd bele
  .map(item => ({
    id: item.id,
    name: item.productName,
    price: item.productPrice + " $",
    image: `/Images/product_images/${item.productImageUrl?.split(',')[0]}`,
    productId: item.productId,
  }));


      setFavorites(backendList);
    } catch (error) {
      console.error("❌ Failed to load wishlist", error);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete('/api/wishlist/removeWishlistItem', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: user.id,
          productId,
        },
      });

      setFavorites(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error("❌ Failed to remove item", error);
    }
  };

  return (
    <RequireAuth>
      <div className="container">
        <Header />
        <Navbar />
        <div className="favorites-container">
          <h1>Wishlist</h1>
          <div className="favorites-list">
            {favorites.length > 0 ? (
              favorites.map(product => (
                <div key={product.id} className="favorite-item-wrapper">
                  <Link to={`/product-details/${product.productId}`} className="favorite-item-link">
                    <div className="favorite-item">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="favorite-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/Images/placeholder.jpg'; }}
                      />
                      <div className="favorite-details">
                        <h2>{product.name}</h2>
                        <p className="favorite-price">{product.price}</p>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFromFavorites(product.productId)}
                  >
                    <DeleteIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="no-favorites">You don't have any favorites yet</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  );
};

export default Favorites;
