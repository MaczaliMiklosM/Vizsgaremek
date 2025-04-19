import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No valid token found. Please log in!');
        return;

      }

      const response = await axios.get('/api/notifications/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data);
    } catch (error) {
      console.error('Error while fetching notifications:', error);
      setError('Error while fetching notifications!');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    markAsRead();
  }, []);

  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="notifications-container">
        <h1>Notifications</h1>

        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.isRead === false ? 'unread-notification' : ''}`}
              >
                <p>{notification.message}</p>
                <span className='notification-time'>
                  {new Date(notification.timestamp).toLocaleString('hu-HU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">

            <p>You have no notifications yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
