import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ShoppingBasket as ShoppingBasketIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './Header.css';

function Header() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const menuRef = useRef(null);

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

    return (
        <header className="header" style={{ height: '100px' }}>
            <div className="header-top" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                {/* Mobile Menu Button on the left */}
                {isMobile && (
                    <button className="menu-toggle" onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none' }}>
                        <MenuIcon fontSize="large" />
                    </button>
                )}

                {/* Logo - Hidden when search is active in mobile view */}
                {!isMobile || !searchOpen ? (
                    <div className="logo-container">
                        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                            <img src="/Images/logo_images/luxshop_logo.jpeg" alt="LuxShop" />
                        </Link>
                    </div>
                ) : null}

                {/* Search bar - Always visible on desktop, toggled on mobile */}
                {!isMobile || searchOpen ? (
                    <div className="search-container search-active" style={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
                        <input type="text" className="search-input" placeholder="Search..." style={{ width: '100%', paddingRight: '40px' }} />
                        {isMobile && (
                            <button className="close-search" onClick={() => setSearchOpen(false)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none' }}>
                                <CloseIcon fontSize="large" />
                            </button>
                        )}
                    </div>
                ) : null}

                {/* Profile Links - Always visible on desktop */}
                {!isMobile && (
                    <div className="profile-links">
                        <Link to="/signin" style={{ textDecoration: 'none', background: 'none' }}>Sign In</Link>
                        <Link to="/profile" style={{ textDecoration: 'none', background: 'none' }}>Profil</Link>
                        <Link to="/about" style={{ textDecoration: 'none', background: 'none' }}>About Us</Link>
                        <Link to="/wishlist" style={{ background: 'none' }}><FavoriteBorderIcon /></Link>
                        <Link to="/basket" style={{ background: 'none' }}><ShoppingBasketIcon /></Link>
                        <Link to="/notifications" style={{ background: 'none' }}><NotificationsIcon /></Link>
                    </div>
                )}

                {/* Search icon only visible on mobile */}
                {isMobile && !searchOpen && (
                    <SearchIcon className="search-icon" onClick={() => setSearchOpen(true)} style={{ background: 'none' }} />
                )}
            </div>

            {/* Mobile Sidebar Menu */}
            {isMobile && (
                <div ref={menuRef} className={`sidebar-menu ${menuOpen ? "active" : ""}`}>
                    <button className="close-menu" onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none' }}>
                        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                            <img src="/Images/logo_images/luxshop_logo.jpeg" alt="LuxShop" />
                        </Link>
                    </button>
                    <Link to="/signin" style={{ textDecoration: 'none', background: 'none' }}>Sign In</Link>
                    <Link to="/profile" style={{ textDecoration: 'none', background: 'none' }}>Profil</Link>
                    <Link to="/about" style={{ textDecoration: 'none', background: 'none' }}>About Us</Link>
                    <Link to="/wishlist" style={{ background: 'none' }}>Wishlist</Link>
                    <Link to="/basket" style={{ background: 'none' }}>Basket</Link>
                    <Link to="/notifications" style={{ background: 'none' }}>Notifications</Link>
                </div>
            )}
        </header>
    );
}

export default Header;