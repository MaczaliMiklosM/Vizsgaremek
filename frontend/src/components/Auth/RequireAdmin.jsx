import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  if (role !== 'ADMIN') {
    alert("You don't have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
