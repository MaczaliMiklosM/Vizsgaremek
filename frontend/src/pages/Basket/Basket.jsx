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

  // Kosár betöltése és a SOLD státuszú termékek eltávolítása
  useEffect(() => {
    const loadCart = async () => {
      const stored = JSON.parse(localStorage.getItem(basketKey)) || [];
      
      // Konzol log: nézd meg, mi van a kosárban betöltés előtt
      console.log("Initial cart items from localStorage:", stored);

      // Frissítjük a kosarat, hogy eltávolítsuk a SOLD státuszú termékeket
      const updatedCart = await Promise.all(stored.map(async (item) => {
        try {
          const res = await axios.get(`/api/products/getProductById/${item.id}`);
          if (res.data.status === 'SOLD') {
            return null; // Ha a termék SOLD, akkor eltávolítjuk
          }
          return item; // Ha nem SOLD, akkor benne marad a kosárban
        } catch (error) {
          console.error("Error fetching product status:", error);
          return item; // Ha nem találjuk a terméket, akkor hagyjuk benne
        }
      }));

      // Szűrjük ki azokat a termékeket, amelyek SOLD státuszúak
      const filteredCart = updatedCart.filter(item => item !== null);

      // Konzol log: nézd meg a szűrt kosarat
      console.log("Filtered cart items (SOLD removed):", filteredCart);

      setCart(filteredCart);
      localStorage.setItem(basketKey, JSON.stringify(filteredCart));
    };

    loadCart();
    window.addEventListener('storage', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, [basketKey]);

  // Eltávolítás a kosárból
  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem(basketKey, JSON.stringify(updated));

    toast.success('Item removed from basket!');
    console.log("Updated cart after removal:", updated); // Konzol log: eltávolított termék után
  };

  // Összeg kiszámítása
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
                    {/* Itt megjelenítjük a termék státuszát is */}
                    <p><strong>Status:</strong> {item.status}</p>
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
