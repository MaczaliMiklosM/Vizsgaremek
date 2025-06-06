import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import RequireAuth from '../../components/Auth/RequireAuth';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';

import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const basketKey = `basket_${user?.id}`;

  useEffect(() => {
    const loadCart = async () => {
      const stored = JSON.parse(localStorage.getItem(basketKey)) || [];

      const updatedCart = await Promise.all(stored.map(async (item) => {
        try {
          const res = await axios.get(`/api/products/getProductById/${item.id}`);
          if (res.data.status === 'SOLD') {
            return null;
          }
          return item;
        } catch (error) {
          console.error("Error fetching product status:", error);
          return item;
        }
      }));
      const filteredCart = updatedCart.filter(item => item !== null);

      setCart(filteredCart);
      localStorage.setItem(basketKey, JSON.stringify(filteredCart));
    };

    loadCart();
    window.addEventListener('storage', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, [basketKey]);


  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem(basketKey, JSON.stringify(updated));

    toast.success('Item removed from basket!');
  };

  const getTotal = () =>
    cart.reduce((total, item) => total + (item.price), 0);

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
                  <img
                    src={`data:image/jpeg;base64,${item.imageData}`}
                    alt={item.name}
                    className="basket-image"
                  />
                  <div className="basket-details">
                    <h2>{item.name}</h2>
                    <p className="basket-price">${item.price.toLocaleString()}</p>
                    {item.size && (
                      <p><strong>Size:</strong> {item.size}</p>
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
        <ToastContainer position="bottom-right" autoClose={3000} closeButton={false} />
      </div>
    </RequireAuth>
  );
};

export default Basket;
