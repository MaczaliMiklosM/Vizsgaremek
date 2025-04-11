import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import './MainPage.css'; 
import Header from '../Header/Header'; 
import Navbar from '../Navbar/Navbar';
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
    <div>
      <Header />
      <Navbar />
      <div className="main-container">
        <main className="main-content">
          <section className="altTitles">   
            <h2>Brands We Love</h2>   
          </section>
          <section className="popular-brands">
            <Link to="/products?brand=Balenciaga" className="card-link">
              <div className="card"><img src="/Images/logo_images/balenciaga_logo.jpeg" alt="Balenciaga" /></div>
            </Link>
            <Link to="/products?brand=Cartier" className="card-link">
              <div className="card"><img src="/Images/logo_images/cartier_logo.jpeg" alt="Cartier" /></div>
            </Link>
            <Link to="/products?brand=Chanel" className="card-link">
              <div className="card"><img src="/Images/logo_images/chanel_logo.jpeg" alt="Chanel" /></div>
            </Link>
            <Link to="/products?brand=Hermes" className="card-link">
              <div className="card"><img src="/Images/logo_images/hermes_logo.jpeg" alt="Hermes" /></div>
            </Link>
            <Link to="/products?brand=LuiV" className="card-link">
              <div className="card"><img src="/Images/logo_images/LouisV_logo.jpeg" alt="LuiV" /></div>
            </Link>
            <Link to="/products?brand=Rolex" className="card-link">
              <div className="card"><img src="/Images/logo_images/rolex_logo.jpeg" alt="Rolex" /></div>
            </Link>
          </section>
          
          <section className="altTitles">
            <h2>Featured Products</h2>
          </section>
          <section className="popular-brands">
            <Link to="/product-details/1" className="card-link">
              <div className="card">Balenciaga<img src="/Images/product_images/cipok5_1.jpeg" alt="image" /></div>
            </Link>
            <Link to="/product-details/2" className="card-link">
              <div className="card">Dior<img src="/Images/product_images/cipok2_1.jpeg" alt="image" /></div>
            </Link>
            <Link to="/product-details/3" className="card-link">
              <div className="card">Omega
                <img src="/Images/product_images/orak1_1.jpeg" alt="image" /></div>
            </Link>
            <Link to="/product-details/4" className="card-link">
              <div className="card">Cartier<img src="/Images/product_images/orak6_1.jpeg" alt="image" /></div>
            </Link>
            <Link to="/product-details/5" className="card-link">
              <div className="card">Louis Vuitton
                <img src="/Images/product_images/taska1.jpeg" alt="image" /></div>
            </Link>
            <Link to="/product-details/6" className="card-link">
              <div className="card">Chanel<img src="/Images/product_images/taska8_1.jpeg" alt="image" /></div>
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Main;
