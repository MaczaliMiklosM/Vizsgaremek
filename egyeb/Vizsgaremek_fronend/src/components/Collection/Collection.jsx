import React, { useState } from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import './Collection.css';

const Collection = () => {
  const [collection, setCollection] = useState([
    { id: 1, name: "Nike Dunk Low Retro", price: 110, image: "/Images/dunklow.png" },
    { id: 2, name: "New Balance 550", price: 130, image: "/Images/nb550.png" },
    { id: 3, name: "Off-White x Air Force 1", price: 1500, image: "/Images/offwhiteaf1.png" }
  ]);

  const removeFromCollection = (id) => {
    setCollection(collection.filter(product => product.id !== id));
  };

  const totalValue = collection.reduce((total, product) => total + product.price, 0);

  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="collection-container">
        <h1>My Collection</h1>
        <div className="collection-list">
          {collection.length > 0 ? (
            collection.map(product => (
              <div key={product.id} className="collection-item">
                <img src={product.image} alt={product.name} className="collection-image" />
                <div className="collection-details">
                  <h2>{product.name}</h2>
                  <p className="collection-price">${product.price}</p>
                </div>
                <button 
                  className="remove-collection-btn"
                  onClick={() => removeFromCollection(product.id)}
                >
                  ❌ Remove
                </button>
              </div>
            ))
          ) : (
            <p className="no-collection">Your collection is empty</p>
          )}
        </div>
        <div className="collection-total">Total Collection Value: ${totalValue}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Collection;
