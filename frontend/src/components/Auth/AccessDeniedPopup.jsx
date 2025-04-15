import React, { useEffect } from 'react';
import './RequireAuth.css';

const AccessDeniedPopup = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content fade-in">
        <h2>Access Denied</h2>
        <p>You must be signed in to view this page.</p>
        <div className="popup-buttons">
          <button onClick={onClose} className="btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPopup;
