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
        <Link to="/products?search=woman">Women</Link>
        <Link to="/products?search=man">Men</Link>
        <Link to="/products?search=bag">Bags</Link>
        <Link to="/products?search=sneaker">Sneakers</Link>
        <Link to="/products?search=watch">Watches</Link>
        <Link to="/products">All Products</Link>
      </div>
    </nav>
  );
}

export default Navbar;
