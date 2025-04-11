import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './MainPage.css';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import axios from "axios";

function Main() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/getProducts");
        const all = response.data;
        const shuffled = all.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        setRandomProducts(selected);
      } catch (err) {
        console.error("❌ Failed to fetch featured products:", err);
      }
    };
    fetchProducts();
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
              <div className="card">
                <img src="/Images/logo_images/balenciaga_logo.jpeg" alt="Balenciaga" />
              </div>
            </Link>
            <Link to="/products?brand=Cartier" className="card-link">
              <div className="card">
                <img src="/Images/logo_images/cartier_logo.jpeg" alt="Cartier" />
              </div>
            </Link>
            <Link to="/products?brand=Chanel" className="card-link">
              <div className="card">
                <img src="/Images/logo_images/chanel_logo.jpeg" alt="Chanel" />
              </div>
            </Link>
            <Link to="/products?brand=Hermes" className="card-link">
              <div className="card">
                <img src="/Images/logo_images/hermes_logo.jpeg" alt="Hermes" />
              </div>
            </Link>
            <Link to="/products?brand=LouisVuitton" className="card-link">
              <div className="card">
                <img src="/Images/logo_images/LouisV_logo.jpeg" alt="LouisVuitton" />
              </div>
            </Link>
            <Link to="/products?brand=Rolex" className="card-link">
              <div className="card">
                <img src="/Images/logo_images/rolex_logo.jpeg" alt="Rolex" />
              </div>
            </Link>
          </section>

          <section className="altTitles">
            <h2>Featured Products</h2>
          </section>

          <section className="popular-brands">
           {randomProducts.map(product => {
             const firstImage = product.imageUrl?.split(",")[0]?.trim(); // csak az első kép
             const imagePath = firstImage?.startsWith("http") || firstImage?.startsWith("/Images")
               ? firstImage
               : `/Images/product_images/${firstImage}`;

             console.log("🖼 Product:", product);
             console.log("📷 Image path:", imagePath);

             return (
               <Link key={product.id} to={`/product-details/${product.id}`} className="card-link">
                 <div className="card">
                   {product.brand}
                   <img src={imagePath} alt={product.name} />
                 </div>
               </Link>
             );
           })}
           {randomProducts.length === 0 && <p>Loading featured products...</p>}
          </section>
          


        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Main;
