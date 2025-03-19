import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import './MainPage.css'; 
import Header from '../header/Header'; 
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer'; 

function Main() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-container">
      <Header />
      <Navbar />
      

      {/* MAIN CONTENT */}
      <main className="main-content">
        <section className="altTitles">   
          <h2>Popular Brands</h2>   
        </section>
        <section className="popular-brands">
          <div className="card"><img src="/Images/luika.png" alt="Brand" /></div>
          <div className="card"><img src="/Images/patika.png" alt="Brand" /></div>
          <div className="card"><img src="/Images/hermes.png" alt="Brand" /></div>
          <div className="card"><img src="/Images/chrome.png" alt="Brand" /></div>
          <div className="card"><img src="/Images/chrome.png" alt="Brand" /></div>
          <div className="card"><img src="/Images/chrome.png" alt="Brand" /></div>
        </section>

        <section className="altTitles">
          <h2>Top Products</h2>
        </section>
        <section className="popular-brands">
          <Link to="/product-details/1" className="card-link">
            <div className="card">A Bathing Ape Bape Sta Low <img src="/Images/yeCipo.jpg" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2" className="card-link">
            <div className="card">Louis Vuitton x Takashi Murakami <img src="/Images/taska.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/3" className="card-link">
            <div className="card">Patek Philippe Watch  <img src="/Images/patek.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/4" className="card-link">
            <div className="card">Jordan 1 Retro High Dior <img src="/Images/diorJ1.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/5" className="card-link">
            <div className="card">Hermes Bearn Compact Wallet <img src="/Images/hermiona.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/6" className="card-link">
            <div className="card">Hermes Bearn Compact Wallet <img src="/Images/hermiona.png" alt="yeCipo" /></div>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Main;
