import React from 'react';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { ShoppingBasket as ShoppingBasketIcon} from '@mui/icons-material';
import './Header.css';

function Header() {
  return (
    <header className="header">
            <Link to="/">
            <div className="logo"><img src="/Images/logo.png" alt="yeCipo" /></div>
                </Link>
      
      <div className="group" style={{ flexGrow: 1, maxWidth: "calc(100% - 300px)" }}>
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
            clipRule="evenodd"
          />
        </svg>
        <input type="text" className="input" placeholder="Search" />
      </div>
      <div className="profile-links">
        <Link to="/signin">Sign In</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/about">About</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/favorites"><FavoriteBorderIcon /></Link>
        <Link to="/basket"><ShoppingBasketIcon /></Link>
        <Link to="/notifications"><NotificationsIcon /></Link>
      </div>
    </header>
  );
}

export default Header;
