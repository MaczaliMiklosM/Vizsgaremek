import React from "react";
import { Link } from "react-router-dom"; // Importáljuk a Link komponenst
import Person2Icon from '@mui/icons-material/Person2';
import InfoIcon from '@mui/icons-material/Info';
import './main-page.css';

function Main() {
  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <div className="logo">Logo</div>
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
          <Link to="/signin"><Person2Icon /></Link> {/* Profile link */}
          <Link to="/about"><InfoIcon /></Link> {/* Info link */}
          <span>About</span> | <span>Collection</span> | <span>Bell</span> | <span>Favs</span>
        </div>
      </header>

      
      {/* Navigation Bar */}
      <nav className="navbar">

        <a href="/men" className="nav-link">Men</a>
        <a href="/women" className="nav-link">Women</a>
        <a href="/sneakers" className="nav-link">Sneakers</a>
        <a href="/accessories" className="nav-link">Accessories</a>
        <a href="/collectibles" className="nav-link">Collectibles</a>
        <a href="/more" className="nav-link">More</a>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <section className="altTitles">   
          <h2>Popular Brands</h2>   
        </section>
        <section className="popular-brands">
          <div className="card">Brand 1</div>
          <div className="card">Brand 2</div>
          <div className="card">Brand 3</div>
          <div className="card">Brand 4</div>
          <div className="card">Brand 5</div>
        </section>
        <section className="altTitles">
          <h2>Picks For Her</h2>
        </section>
        <section className="altTitles">
          <h2>Picks For Him</h2>
        </section>
        <section className="altTitles">
          <h2>Hot Picks</h2>
        </section>
        <section className="popular-brands">
          {/* Link a ProductDetails oldalra */}
          <Link to="/product-details">
            <div className="card">A Bathing Ape Bape Sta Low <img src="/Images/yeCipo.jpg" alt="yeCipo" /></div>
          </Link>
          <div className="card">Brand 2</div>
          <div className="card">Brand 3</div>
          <div className="card">Brand 4</div>
          <div className="card">Brand 5</div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Your Company Name. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Main;
