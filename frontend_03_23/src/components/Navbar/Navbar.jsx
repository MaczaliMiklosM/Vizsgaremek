import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className={`nav-links ${isMobile ? "compact" : ""}`}>
        <Link to="/products/women">Women</Link>
        <Link to="/products/men">Men</Link>
        <Link to="/products/sneakers">Sneakers</Link>
        <Link to="/products/bags">Bags</Link>
        <Link to="/products/watches">Watches</Link>
      </div>
    </nav>
  );
}

export default Navbar;
