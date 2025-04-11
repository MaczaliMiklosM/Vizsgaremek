import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ShoppingBasket as ShoppingBasketIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AuthModal from '../Auth/AuthModal';
import './Header.css';

function Header() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
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
          setShowAuthModal(true);
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

    return (
        <header className="header" style={{ height: '100px' }}>
            <div className="header-top" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                {isMobile && (
                    <button className="menu-toggle" onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none' }}>
                        <MenuIcon fontSize="large" />
                    </button>
                )}

                {!isMobile || !searchOpen ? (
                    <div className="logo-container">
                        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                            <img src="/Images/logo_images/luxshop_logo.png" alt="LuxShop" />
                        </Link>
                    </div>
                ) : null}

                {!isMobile || searchOpen ? (
                    <div className="search-container search-active" style={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            style={{ width: '100%', paddingRight: '40px' }}
                        />
                        {isMobile && (
                            <button className="close-search" onClick={() => setSearchOpen(false)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none' }}>
                                <CloseIcon />
                            </button>
                        )}
                    </div>
                ) : null}

                {/* DESKTOP NAVIGATION */}
                {!isMobile && (
                    <div className="profile-links">
                        {isLoggedIn ? (
                            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer'}}>
                                Sign Out
                            </span>
                        ) : (
                            <span onClick={() => setShowAuthModal(true)} className="nav-link" style={{ cursor: 'pointer' }}>
                                Sign In
                            </span>
                        )}
                        <Link to="/profile" className="nav-link">Profil</Link>
                        <Link to="/about" className="nav-link">About Us</Link>
                        <Link to="/wishlist" className="nav-link"><FavoriteBorderIcon /></Link>
                        <Link to="/basket" className="nav-link"><ShoppingBasketIcon /></Link>
                        <Link to="/notifications" className="nav-link"><NotificationsIcon /></Link>
                    </div>
                )}

                {isMobile && !searchOpen && (
                    <SearchIcon className="search-icon" onClick={() => setSearchOpen(true)} style={{ background: 'none' }} />
                )}
            </div>

            {/* MOBILE SIDEBAR MENU */}
            {isMobile && (
                <div ref={menuRef} className={`sidebar-menu ${menuOpen ? "active" : ""}`}>
                    <button className="close-menu" onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none' }}>
                        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                            <img src="/Images/logo_images/luxshop_logo.png" alt="LuxShop" />
                        </Link>
                    </button>
                    {isLoggedIn ? (
                        <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>Sign Out</span>
                    ) : (
                        <span onClick={() => setShowAuthModal(true)} className="nav-link" style={{ cursor: 'pointer' }}>Sign In</span>
                    )}
                    <Link to="/profile" className="nav-link">Profil</Link>
                    <Link to="/about" className="nav-link">About Us</Link>
                    <Link to="/wishlist" className="nav-link">Wishlist</Link>
                    <Link to="/basket" className="nav-link">Basket</Link>
                    <Link to="/notifications" className="nav-link">Notifications</Link>
                </div>
            )}

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </header>
    );
}

export default Header;