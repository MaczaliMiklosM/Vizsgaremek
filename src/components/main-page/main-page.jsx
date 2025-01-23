import React from "react";
import { Link } from "react-router-dom"; 
import Person2Icon from '@mui/icons-material/Person2';
import InfoIcon from '@mui/icons-material/Info';
import './main-page.css';
import Header from '../header/Header'; // Importing the new Header component
import Navbar from '../navbar/Navbar';

function Main() {
  return (
    <div className="container">
      {/* Header Section */}
      <Header /> {/* Using the new Header component */}
      <Navbar />

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
          <Link to="/product-details/1">
            <div className="card" id="1">A Bathing Ape Bape Sta Low <img src="/Images/yeCipo.jpg" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="2">Louis Vuitton x Takashi Murakami<img src="/Images/taska.png" alt="yeCipo" /></div>
          </Link>
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
