import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import './Collection.css';

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/management/adminuser/get-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const userId = data.user.id;
        return fetch(`/api/collection/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res => {
        if (!res.ok) throw new Error('Collection fetch failed');
        return res.json();
      })
      .then(data => {
        console.log("✅ Collection data:", data);
        setCollection(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to fetch collection:', err);
        setLoading(false);
      });
  }, []);

  const totalValue = collection.reduce((total, item) => total + item.productPrice, 0);

  return (
    <RequireAuth>
      <div className="container">
        <Header />
        <Navbar />

        <div className="collection-container">
          <h1>My Collection</h1>

          {loading ? (
            <p>Loading collection...</p>
          ) : (
            <div className="collection-list">
              {collection.length > 0 ? (
                collection.map((item) => (
                  <div key={item.id} className="collection-item">
                    <img
                      src={
                        item.productImage
                          ? `data:image/jpeg;base64,${item.productImage}`
                          : ''
                      }
                      alt={item.productName}
                      className="collection-image"
                    />
                    <div className="collection-details">
                      <h2>{item.productName}</h2>
                      <p className="collection-price">${item.productPrice}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-collection">Your collection is empty</p>
              )}
            </div>
          )}

          {!loading && collection.length > 0 && (
            <div className="collection-total">
              Total Collection Value: ${totalValue}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </RequireAuth>
  );
};

export default Collection;
