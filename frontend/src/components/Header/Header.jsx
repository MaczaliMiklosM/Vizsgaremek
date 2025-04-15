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
import './Header.css';

function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
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

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
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
          <div className="search-container search-active" style={{ flexGrow: 1 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            {isMobile && (
              <button className="close-search" onClick={() => setSearchOpen(false)}>
                <CloseIcon />
              </button>
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
            <span onClick={() => handleProtectedRoute("/notifications")} className="nav-link"><NotificationsIcon /></span>
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
