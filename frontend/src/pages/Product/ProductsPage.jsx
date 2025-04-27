import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './ProductsPage.css';

const filterOptions = {
  productCondition: ["New", "Used"],
  brands: ["Balenciaga", "Cartier", "Chanel", "Hermes", "Omega", "Christian Dior", "Louis Vuitton","Rolex"],
  colors: ["White", "Black", "Blue", "Red", "Pink", "Green", "Purple", "Yellow", "Grey", "Brown", "Orange", "Multicolor"]
};

function normalizeProducts(products) {
  return products.map(p => ({
    ...p,
    category: p.category?.toLowerCase(),
    gender: (p.targetGender || '').toLowerCase(),
    brand: p.brand?.toLowerCase().replace(/\s/g, ''),
    color: p.color?.toLowerCase(),
    productCondition: p.productCondition?.toLowerCase().replace(/\s/g, '')
  }));
}

function ProductsPage() {
  const { category } = useParams();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], colors: [], productCondition: [], price: 10000 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({ productCondition: false, brands: false, colors: false, price: false });
  const [showAccessPopup, setShowAccessPopup] = useState(false);

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/products/getProducts", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setAllProducts(response.data.products || response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brand = params.get("brand");
    const search = params.get("search")?.toLowerCase() || "";
    setSearchTerm(search);
    setFilters(prev => ({ ...prev, brands: brand ? [brand.toLowerCase().replace(/\s/g, '')] : [] }));
  }, [category, location.search]);

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, price: value }));
  };

  const normalizedProducts = normalizeProducts(allProducts);
  const visibleProducts = normalizedProducts.filter(p => p.status?.toLowerCase() !== 'sold');

  const maxProductPrice = useMemo(() => {
    if (visibleProducts.length === 0) return 10000;
    return Math.ceil(Math.max(...visibleProducts.map(p => p.price)) / 100) * 100;
  }, [visibleProducts]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, price: maxProductPrice }));
  }, [maxProductPrice]);

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter(product => {
      const matchBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchColor = filters.colors.length === 0 || filters.colors.includes(product.color);
      const matchCondition = filters.productCondition.length === 0 || filters.productCondition.includes(product.productCondition);
      const matchPrice = filters.price >= maxProductPrice || product.price <= filters.price;
      const search = searchTerm.trim().toLowerCase();
      const matchSearch = !search || product.name.toLowerCase().includes(search) || product.category?.toLowerCase().includes(search) || (search === "man" && product.gender === "man") || (search === "woman" && product.gender === "woman");
      return matchBrand && matchColor && matchCondition && matchPrice && matchSearch;
    });
  }, [visibleProducts, filters, searchTerm]);

  const getCategoryLabel = () => {
    if (searchTerm === "bag") return "bags";
    if (searchTerm === "watch") return "watches";
    if (searchTerm === "sneaker") return "sneakers";
    if (searchTerm === "woman") return "women products";
    if (searchTerm === "man") return "men products";
    return "products";
  };

  const resetFilters = () => {
    setFilters({ brands: [], colors: [], productCondition: [], price: maxProductPrice });
    setSearchTerm("");
    window.history.replaceState({}, document.title, "/#products");
  };

  return (
    <div className={showAccessPopup ? "blurred-wrapper" : ""}>
      <Header />
      <Navbar />

      {isMobile && (
        <div className="mobile-filter-bar">
          <button onClick={() => setIsFilterOpen(true)}>Filter</button>
        </div>
      )}

      <div className="products-container">
        <aside className={`sidebar ${isMobile ? (isFilterOpen ? "open" : "") : ""}`}>
          {isMobile && <button className="sidebar-close" onClick={() => setIsFilterOpen(false)}>×</button>}
          <h2>Filter</h2>

          {Object.entries(filterOptions).map(([key, options]) => (
            <div className="filter-group" key={key}>
              <h4 onClick={() => toggleSection(key)}>{key === "productCondition" ? "Condition" : key.charAt(0).toUpperCase() + key.slice(1)}</h4>
              <div className={`filter-content ${!expanded[key] ? "collapsed" : ""}`}>
                {options.map(option => {
                  const normalizedValue = option.toLowerCase().replace(/\s/g, '');
                  return (
                    <label key={option}>
                      {option}
                      <input
                        type="checkbox"
                        checked={Array.isArray(filters[key]) && filters[key].includes(normalizedValue)}
                        onChange={() => handleCheckboxChange(key, normalizedValue)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="filter-group">
            <h4 onClick={() => toggleSection("price")}>
              Price: {filters.price >= maxProductPrice ? `${maxProductPrice}+` : `$${filters.price}`}
            </h4>
            <div className={`filter-content ${!expanded.price ? "collapsed" : ""}`}>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                step="100"
                value={filters.price}
                onChange={(e) => handlePriceChange(parseInt(e.target.value))}
              />
            </div>
          </div>

          {isMobile && (
            <button className="apply-filters-button" onClick={() => setIsFilterOpen(false)}>
              See Products
            </button>
          )}
        </aside>

        <main className="products-main">
          <div className="filter-actions">
            <h4>{filteredProducts.length} {getCategoryLabel()} found</h4>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>

          <section className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link
                  to={`/product-details/${product.id}`}
                  key={product.id}
                  className="card-link"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="product-card">
                    <img src={`data:image/jpeg;base64,${product.imageData}`} alt={product.name} />
                    <div className="details">
                      <div className="name">{product.name}</div>
                      <div className="price">{product.price} $</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-results">
                <p>No products match your filters or search, please reset the filter.</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {showAccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Access Denied</h2>
            <p>You must be signed in to view this page.</p>
            <div className="popup-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/login'}>Sign In</button>
              <button className="btn-secondary" onClick={() => setShowAccessPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProductsPage;
