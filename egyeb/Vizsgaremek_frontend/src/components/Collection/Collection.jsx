import React, { useState } from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import './Collection.css';

const Collection = () => {
  const [collection, setCollection] = useState([
    { id: 1, name: "Collection", price: 11000, image: "/Images/dunklow.png" },
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
