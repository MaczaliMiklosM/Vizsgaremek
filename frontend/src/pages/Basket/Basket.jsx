import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import RequireAuth from '../../components/Auth/RequireAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('basket')) || [];
    setCart(stored);
  }, []);

  const removeFromCart = (id) => {
    const removedItem = cart.find(item => item.id === id);
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('basket', JSON.stringify(updated));

    toast.success(
      <div className="toast-message">
        🗑️ Removed from basket
        <button
          className="toast-undo-button"
          onClick={() => {
            const restored = [...updated, removedItem];
            setCart(restored);
            localStorage.setItem('basket', JSON.stringify(restored));
            toast.dismiss();
          }}
        >
          Undo
        </button>
      </div>
    );
  };

  const getTotal = () =>
    cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  return (
    <RequireAuth>
      <div className="container" style={{ overflowX: 'hidden' }}>
        <Header />
        <Navbar />
        <div className="basket-container">
          <h1>Your Basket</h1>
          {cart.length > 0 ? (
            <div className="basket-list">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="basket-item">
                  <img src={item.image} alt={item.name} className="basket-image" />
                  <div className="basket-details">
                    <h2>{item.name}</h2>
                    <p className="basket-price">${item.price.toLocaleString()}</p>
                    {item.size && (
                      <p>
                        <strong>Size:</strong> {item.size}
                      </p>
                    )}
                    {item.stock === 1 && (
                      <p className="low-stock">Hurry! Last piece available.</p>
                    )}
                  </div>
                  <button className="remove-basket-btn" onClick={() => removeFromCart(item.id)}>
                    <Delete style={{ marginRight: '5px' }} />
                    Remove
                  </button>
                </div>
              ))}
              <div className="summary">
                <h2>Total: ${getTotal().toLocaleString()}</h2>
                <h3>Order Summary</h3>
                <p>Shipping: Free</p>
                <p><strong>Total:</strong> ${getTotal().toLocaleString()}</p>
                <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
              </div>
            </div>
          ) : (
            <p className="empty-basket">Your basket is empty.</p>
          )}
        </div>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} closeButton={false} />
    </RequireAuth>
  );
};

export default Basket;
