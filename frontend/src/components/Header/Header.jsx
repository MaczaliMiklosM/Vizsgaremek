import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ShoppingBasket as ShoppingBasketIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AuthModal from '../Auth/AuthModal';
import AccessDeniedPopup from '../Auth/AccessDeniedPopup';
import axios from 'axios';
import './Header.css';

function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleProtectedRoute = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setShowAccessDenied(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products/getProducts');
        setAllProducts(res.data.products || res.data);
      } catch (err) {
        console.error("Failed to fetch products for search", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch unread notification count:", err);
      }
    };

    if (isLoggedIn) {
      fetchUnreadCount();
    }
  }, [isLoggedIn]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()) &&
      product.status !== 'SOLD'
    ).slice(0, 5);

    setSuggestions(filtered);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSuggestions([]);
      if (isMobile) setSearchOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(true);
    setSearchOpen(false);
  };

  return (
    <header className="header" style={{ height: '100px' }}>
      <div className="header-top" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <div className="menu-toggle" onClick={toggleMenu} style={{ background: 'none', border: 'none' }}>
            <MenuIcon fontSize="large" />
          </div>
        )}

        {!isMobile || !searchOpen ? (
          <div className="logo-container">
            <span className="logo" onClick={() => navigate("/")}>
              <img src="/Images/logo_images/luxshop_logo.png" alt="LuxShop" />
            </span>
          </div>
        ) : null}

        {!isMobile || searchOpen ? (
          <div className="search-container search-active" style={{ flexGrow: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
            {isMobile && (
              <button className="close-search" onClick={() => setSearchOpen(false)}>
                <CloseIcon />
              </button>
            )}

            {searchTerm && (
              <ul className="search-suggestions">
                {suggestions.length === 0 ? (
                  <li className="no-result">No results found.</li>
                ) : (
                  suggestions.map((product) => (
                    <li key={product.id} onClick={() => {
                      navigate(`/product-details/${product.id}`);
                      setSearchTerm('');
                      setSuggestions([]);
                    }}>
                      <img src={`data:image/jpeg;base64,${product.imageData}`} alt={product.name} />
                      <span>{product.name}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        ) : null}

        {!isMobile && (
          <div className="profile-links">
            {isLoggedIn ? (
              <span onClick={handleLogout} className="nav-link">Sign Out</span>
            ) : (
              <span onClick={() => setShowAuthModal(true)} className="nav-link">Sign In</span>
            )}
            <span onClick={() => handleProtectedRoute("/profile")} className="nav-link">Profil</span>
            <span onClick={() => navigate("/about")} className="nav-link">About Us</span>
            <span onClick={() => handleProtectedRoute("/wishlist")} className="nav-link"><FavoriteBorderIcon /></span>
            <span onClick={() => handleProtectedRoute("/basket")} className="nav-link"><ShoppingBasketIcon /></span>

            {/* 🔔 NOTIFICATION ICON + BADGE */}
            <span onClick={() => handleProtectedRoute("/notifications")} className="nav-link notification-icon-wrapper">
              <NotificationsIcon />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </span>
          </div>
        )}

        {isMobile && !searchOpen && (
          <SearchIcon className="search-icon" onClick={() => setSearchOpen(true)} style={{ cursor: 'pointer' }} />
        )}
      </div>

      {isMobile && (
        <div ref={menuRef} className={`sidebar-menu ${menuOpen ? "active" : ""}`}>
          <div className="close-menu" onClick={() => setMenuOpen(false)}>
            <span className="logo" onClick={() => navigate("/")}>
              <img src="/Images/logo_images/luxshop_logo.png" alt="LuxShop" />
            </span>
          </div>
          {isLoggedIn ? (
            <span onClick={handleLogout} className="nav-link">Sign Out</span>
          ) : (
            <span onClick={() => setShowAuthModal(true)} className="nav-link">Sign In</span>
          )}
          <span onClick={() => handleProtectedRoute("/profile")} className="nav-link">Profil</span>
          <span onClick={() => navigate("/about")} className="nav-link">About Us</span>
          <span onClick={() => navigate("/products")} className="nav-link">Products</span>
          <span onClick={() => handleProtectedRoute("/wishlist")} className="nav-link">Wishlist</span>
          <span onClick={() => handleProtectedRoute("/basket")} className="nav-link">Basket</span>
          <span onClick={() => handleProtectedRoute("/notifications")} className="nav-link">Notifications</span>
        </div>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showAccessDenied && <AccessDeniedPopup onClose={() => setShowAccessDenied(false)} />}
    </header>
  );
}

export default Header;
