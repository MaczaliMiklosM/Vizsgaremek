import React from "react";
import { Link } from "react-router-dom"; 
import Person2Icon from '@mui/icons-material/Person2';
import InfoIcon from '@mui/icons-material/Info';
import './MainPage.css'; // Updated to match the new file name
import Header from '../header/Header'; 
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer'; // Ensure this is the correct file name

function Main() {
  return (
    <div className="main-container">
      <Header />
      <Navbar />
      <main className="main-content">
        <section className="altTitles">   
          <h2>Popular Brands</h2>   
        </section>
        <section className="popular-brands">
          <div className="card"><img src="/Images/luika.png" alt="yeCipo" /></div>
          <div className="card"><img src="/Images/patika.png" alt="yeCipo" /></div>
          <div className="card"><img src="/Images/hermes.png" alt="yeCipo" /></div>
          <div className="card"><img src="/Images/jordi.png" alt="yeCipo" /></div>
          <div className="card"><img src="/Images/chrome.png" alt="yeCipo" /></div>
        </section>
        <section className="altTitles">
        <br />
        
        </section>
        <section className="altTitles">
          <section className="popular-brands">
          <Link to="/product-details/1">
            <div className="card" id="1">A Bathing Ape Bape Sta Low <img src="/Images/yeCipo.jpg" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="2">Louis Vuitton x Takashi Murakami<img src="/Images/taska.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="3">Patek Philippe Annual Calendar Chronograph<img src="/Images/patek.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="4">Jordan 1 Retro High Dior<img src="/Images/diorJ1.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="4">Hermes Bearn Compact Wallet Black<img src="/Images/hermiona.png" alt="yeCipo" /></div>
          </Link>
        </section>
        </section>
        <section className="altTitles">
          <section className="popular-brands">
          <Link to="/product-details/1">
            <div className="card" id="1">A Bathing Ape Bape Sta Low <img src="/Images/yeCipo.jpg" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="2">Louis Vuitton x Takashi Murakami<img src="/Images/taska.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="3">Patek Philippe Annual Calendar Chronograph<img src="/Images/patek.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="4">Jordan 1 Retro High Dior<img src="/Images/diorJ1.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="4">Hermes Bearn Compact Wallet Black<img src="/Images/hermiona.png" alt="yeCipo" /></div>
          </Link>
        </section>
        </section>
        <section className="popular-brands">
          <Link to="/product-details/1">
            <div className="card" id="1">A Bathing Ape Bape Sta Low <img src="/Images/yeCipo.jpg" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="2">Louis Vuitton x Takashi Murakami<img src="/Images/taska.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="3">Patek Philippe Annual Calendar Chronograph<img src="/Images/patek.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="4">Jordan 1 Retro High Dior<img src="/Images/diorJ1.png" alt="yeCipo" /></div>
          </Link>
          <Link to="/product-details/2">
            <div className="card" id="4">Hermes Bearn Compact Wallet Black<img src="/Images/hermiona.png" alt="yeCipo" /></div>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Main;
