import React from 'react';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Notifications.css';

const Notifications = () => {
  const notifications = [
    { id: 1, message: "Notification", time: "2 hours ago" },
  ];

  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="notifications-container">
        <h1>Notifications</h1>

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            ))
          ) : (
            <p className="no-notifications">Nincsenek új értesítések</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
