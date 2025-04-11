import React, { useState } from 'react';
import Header from '../header/Header'; 
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';
import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "A Bathing Ape Bape Sta Low", price: 18625, image: "/Images/kep1.jpg", quantity: 1, stock: 2, size: "47.5" },
    { id: 2, name: "Louis Vuitton x Takashi Murakami", price: 14293, image: "/Images/taska.png", quantity: 1, stock: 1, size: "M" },
  ]);

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, Math.min(item.quantity + change, item.stock)) } 
        : item
    ));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="container" style={{ overflowX: 'hidden' }}>
      <Header />
      <Navbar />
      <div className="basket-container">
        <h1>Your Basket</h1>
        {cart.length > 0 ? (
          <div className="basket-list">
            {cart.map(item => (
              <div key={item.id} className="basket-item">
                <img src={item.image} alt={item.name} className="basket-image" />
                <div className="basket-details">
                  <h2>{item.name}</h2>
                  <p className="basket-price">${item.price.toLocaleString()}</p>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, -1)} className="quantity-btn"><Remove /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="quantity-btn"><Add /></button>
                  </div>
                  <p><strong>Selected Size:</strong> {item.size}</p>
                  {item.stock === 1 && <p className="low-stock">Hurry! Last piece available.</p>}
                </div>
                <button className="remove-basket-btn" onClick={() => removeFromCart(item.id)}>❌ Remove</button>
              </div>
            ))}
            <h2>Total: ${getTotal().toLocaleString()}</h2>
            <div className="summary">
              <h3>Order Summary</h3>
              <p>Shipping: Free</p>
              <p>Total: ${getTotal().toLocaleString()}</p>
            </div>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          </div>
        ) : (
          <p className="empty-basket">Your basket is empty.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Basket;
