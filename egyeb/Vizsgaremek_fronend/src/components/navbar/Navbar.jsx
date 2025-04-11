import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/men" className="nav-link">Men</Link>
      <Link to="/women" className="nav-link">Women</Link>
      <Link to="/sneakers" className="nav-link">Sneakers</Link>
      <Link to="/accessories" className="nav-link">Accessories</Link>
      <Link to="/more" className="nav-link">More</Link>
    </nav>
  );
}

export default Navbar;
