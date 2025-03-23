import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import FilterSidebar from '../Sidebar/FilteredSideBar';
import './ProductsPage.css';

const allProducts = [
  { id: 1, name: "Chanel Bag", gender: "women", category: "bags", brand: "Balenciaga", color: "pink", price: 2200, image: "/Images/product_images/taska8_1.jpeg" },
  { id: 2, name: "Dior Heels", gender: "women", category: "sneakers", brand: "Cartier", color: "black", price: 1900, image: "/Images/product_images/cipok2_1.jpeg" },
  { id: 3, name: "Omega Watch", gender: "men", category: "watches", brand: "Chanel", color: "silver", price: 5800, image: "/Images/product_images/orak1_1.jpeg" },
  { id: 4, name: "Balenciaga Shoes", gender: "men", category: "sneakers", brand: "Hermes", color: "white", price: 1100, image: "/Images/product_images/cipok5_1.jpeg" },
  { id: 5, name: "Louis Vuitton Backpack", gender: "unisex", category: "bags", brand: "Louis Vuitton", color: "brown", price: 4200, image: "/Images/product_images/taska1.jpeg" },
  { id: 6, name: "Cartier Watch", gender: "unisex", category: "watches", brand: "Rolex", color: "gold", price: 6200, image: "/Images/product_images/orak6_1.jpeg" },
];

function ProductsPage() {
  const { category } = useParams();

  const [filters, setFilters] = useState({
    category: "",
    gender: [],
    brands: [],
    colors: [],
    price: 10000,
  });

  // ✅ NAVBAR-ból érkező kategória alapján checkbox automatikus beállítás
  useEffect(() => {
    if (!category) return;

    const lower = category.toLowerCase();

    if (["men", "women", "unisex"].includes(lower)) {
      setFilters((prev) => ({
        ...prev,
        gender: [lower],
      }));
    } else if (["sneakers", "bags", "watches"].includes(lower)) {
      setFilters((prev) => ({
        ...prev,
        category: lower,
      }));
    }
  }, [category]);

  const handleCheckboxChange = (type, value) => {
    if (type === "category") {
      setFilters((prev) => ({ ...prev, category: value }));
    } else {
      setFilters((prev) => {
        const current = prev[type];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [type]: updated };
      });
    }
  };

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, price: value }));
  };

  const filteredProducts = allProducts.filter((product) => {
    return (
      (!filters.category || product.category === filters.category) &&
      (filters.gender.length === 0 || filters.gender.includes(product.gender)) &&
      (filters.brands.length === 0 || filters.brands.includes(product.brand)) &&
      (filters.colors.length === 0 || filters.colors.includes(product.color.toLowerCase())) &&
      product.price <= filters.price &&
      (!category || product.category === category.toLowerCase())
    );
  });

  return (
    <div>
      <Header />
      <Navbar />
      <div className="products-container">
        <FilterSidebar
          filters={filters}
          onCheckboxChange={handleCheckboxChange}
          onPriceChange={handlePriceChange}
        />
        <main className="products-main">
          
          <section className="products-grid">
            {filteredProducts.map((product) => (
              <Link
                to={`/product-details/${product.id}`}
                key={product.id}
                className="card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="product-card">
                  {product.name}
                  <img src={product.image} alt={product.name} />
                </div>
              </Link>
            ))}
            {filteredProducts.length === 0 && <p>No products match your filters.</p>}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ProductsPage;
