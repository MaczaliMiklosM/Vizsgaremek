import React from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import './Notifications.css';

const Notifications = () => {
  const notifications = [
    { id: 1, message: "Új termék érkezett a kollekciódban!", time: "2 órája" },
    { id: 2, message: "A rendelésed feldolgozás alatt áll.", time: "1 napja" },
    { id: 3, message: "Most 20% kedvezmény a kiválasztott cipőkre!", time: "3 napja" },
    { id: 4, message: "Egy kedvenced újra elérhető!", time: "5 napja" },
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
