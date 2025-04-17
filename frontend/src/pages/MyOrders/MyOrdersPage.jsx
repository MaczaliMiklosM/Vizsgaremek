import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RequireAuth from '../../components/Auth/RequireAuth';
import axios from 'axios';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/orders/getAllOrdersById/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError('Failed to fetch your orders. Please try again later.');
      }
    };
    fetchOrders();
  }, [user?.id]);

  return (
    <RequireAuth>
      <div className="container">
        <Header />
        <Navbar />
        <div className="orders-container">
          <h1>Your Orders</h1>
          {error && <p className="error-msg">{error}</p>}
          {orders.length === 0 && !error ? (
            <p className="empty-msg">You haven't placed any orders yet.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.orderId}>
                  <h3>Order #{order.orderId}</h3>
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                  <div className="order-items">
                    <h4>Product:</h4>
                    <ul className="order-item-list">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="order-item">
                          <div className="item-name">
                            <strong>{item.productName || `Product #${item.productId}`}</strong>
                          </div>
                         
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </RequireAuth>
  );
};

export default MyOrdersPage;
