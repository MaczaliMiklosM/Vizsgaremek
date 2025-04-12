import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccessDeniedPopup from './AccessDeniedPopup';
import './RequireAuth.css';

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll'); 
    }
  
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, []);
  

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {children}
      {showPopup && <AccessDeniedPopup onClose={handleGoBack} />}
    </>
  );
};

export default RequireAuth;
