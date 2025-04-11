import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import './Collection.css';

const Collection = () => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    setCollection(basket);
  }, []);

  const totalValue = collection.reduce((total, product) => total + product.price, 0);

  return (
    <RequireAuth>
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
    </RequireAuth>
  );
};

export default Collection;
