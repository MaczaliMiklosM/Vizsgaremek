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
      const today = new Date().toISOString().split("T")[0];
      const stored = localStorage.getItem("featuredProducts");
      const storedDate = localStorage.getItem("featuredProductsDate");

      try {
        if (stored && storedDate === today) {
          const cached = JSON.parse(stored);
          const productIds = cached.map(p => p.id);
          const res = await axios.get("/api/products/getProducts");
          const all = res.data;

          const updatedList = all.filter(p =>
            productIds.includes(p.id) && p.status?.toLowerCase() !== 'sold'
          );

          if (updatedList.length === 12) {
            setRandomProducts(updatedList);
            return;
          } else {
            localStorage.removeItem("featuredProducts");
            localStorage.removeItem("featuredProductsDate");
          }
        }

        const res = await axios.get("/api/products/getProducts");
        const allProducts = res.data.filter(p => p.status?.toLowerCase() !== 'sold');

        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 12);

        setRandomProducts(selected);
        localStorage.setItem("featuredProducts", JSON.stringify(selected));
        localStorage.setItem("featuredProductsDate", today);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
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
            {[
              { brand: "Balenciaga", img: "balenciaga_logo.jpeg" },
              { brand: "Cartier", img: "cartier_logo.jpeg" },
              { brand: "Chanel", img: "chanel_logo.jpeg" },
              { brand: "Hermes", img: "hermes_logo.jpeg" },
              { brand: "LouisVuitton", img: "LouisVuitton_logo.jpeg" },
              { brand: "Rolex", img: "rolex_logo.jpeg" }
            ].map(({ brand, img }) => (
              <Link to={`/products?brand=${brand}`} key={brand} className="card-link">
                <div className="card">
                  <img src={`/Images/logo_images/${img}`} alt={brand} />
                </div>
              </Link>
            ))}
          </section>

          <section className="altTitles">
            <h2>Today's Featured Products</h2>
          </section>

          <section className="popular-brands grid-2-rows">
            {randomProducts.length > 0 ? (
              randomProducts.map(product => (
                <Link key={product.id} to={`/product-details/${product.id}`} className="card-link">
                  <div className="card">
                    <img
                      src={`data:image/jpeg;base64,${product.imageData}`}
                      alt={product.name}
                    />
                    <div className="details">
                      <div className="brand">{product.brand}</div>
                      <div className="price">{product.price} $</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Loading featured products...</p>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Main;
