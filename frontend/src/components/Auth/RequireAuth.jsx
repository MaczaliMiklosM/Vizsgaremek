import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './RequireAuth.css';

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
      document.body.classList.add('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {children}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content fade-in">
            <h2>Access Denied</h2>
            <p>You must be signed in to view this page.</p>
            <div className="popup-buttons">
              <button onClick={handleGoBack} className="btn-secondary">Go Back</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequireAuth;
