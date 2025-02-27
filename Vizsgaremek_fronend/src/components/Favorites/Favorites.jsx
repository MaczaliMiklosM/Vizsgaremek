import React, { useState } from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import './Favorites.css';

const Favorites = () => {
  // Example favorite products
  const [favorites, setFavorites] = useState([
    { 
      id: 1, 
      name: "Nike Air Jordan 1 Retro High OG", 
      price: "$220", 
      image: "/Images/jordan1.png" 
    },
    { 
      id: 2, 
      name: "Adidas Yeezy Boost 350 V2", 
      price: "$250", 
      image: "/Images/yeezy350.png" 
    },
    { 
      id: 3, 
      name: "Balenciaga Triple S Sneakers", 
      price: "$850", 
      image: "/Images/balenciaga.png" 
    }
  ]);

  // Remove item from favorites
  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(product => product.id !== id));
  };

  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="favorites-container">
        <h1>Favorites</h1>

        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map(product => (
              <div key={product.id} className="favorite-item">
                <img src={product.image} alt={product.name} className="favorite-image" />
                <div className="favorite-details">
                  <h2>{product.name}</h2>
                  <p className="favorite-price">{product.price}</p>
                </div>
                <button 
                  className="remove-favorite-btn"
                  onClick={() => removeFromFavorites(product.id)}
                >
                  ❌ Eltávolítás
                </button>
              </div>
            ))
          ) : (
            <p className="no-favorites">You don't have any favorite yet</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
