import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DeleteIcon from '@mui/icons-material/Delete';
import RequireAuth from '../../components/Auth/RequireAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import './Wishlist.css';

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

      console.log("✅ Raw wishlist response:", response.data);

      const backendList = response.data
        .filter(item => item.status?.toLowerCase() !== "sold")
        .map(item => {
          console.log("🛠️ Processed wishlist item:", {
            id: item.id,
            name: item.productName,
            image: item.productImage?.substring(0, 30) + '...'
          });

          return {
            id: item.id,
            name: item.productName,
            price: item.productPrice + " $",
            imageData: item.productImage,
            productId: item.productId,
          };
        });

      setFavorites(backendList);
    } catch (error) {
      console.error("❌ Failed to load wishlist", error);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const removedItem = favorites.find(item => item.productId === productId);

      await axios.delete('/api/wishlist/removeWishlistItem', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: user.id,
          productId,
        },
      });

      const updated = favorites.filter(item => item.productId !== productId);
      setFavorites(updated);

      toast.success(
        <div className="toast-message">
          🗑️ Removed from wishlist
          <button
            className="toast-undo-button"
            onClick={async () => {
              try {
                await axios.post('/api/wishlist/addWishlistItem', {
                  userId: user.id,
                  productId: removedItem.productId,
                }, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                const restored = [...updated, removedItem];
                setFavorites(restored);
                toast.dismiss();
              } catch (err) {
                console.error("❌ Undo failed", err);
                toast.error("Undo failed");
              }
            }}
          >
            Undo
          </button>
        </div>
      );
    } catch (error) {
      console.error("❌ Failed to remove item", error);
      toast.error("Failed to remove item");
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
                <div key={product.id} className="favorite-item">
                  <Link to={`/product-details/${product.productId}`} className="favorite-item-link">
                    <img
                      src={`data:image/jpeg;base64,${product.imageData}`}
                      alt={product.name}
                      className="favorite-image"
                    />
                    <div className="favorite-details">
                      <h2>{product.name}</h2>
                      <p className="favorite-price">{product.price}</p>
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
        <ToastContainer position="bottom-right" autoClose={3000} closeButton={false} />
      </div>
    </RequireAuth>
  );
};

export default Favorites;
