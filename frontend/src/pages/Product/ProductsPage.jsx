import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import FilterSidebar from '../../components/Sidebar/FilteredSideBar';
import './ProductsPage.css';

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
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    productCondition: [],
    price: 10000,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        console.error("❌ Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brand = params.get("brand");
    const search = params.get("search")?.toLowerCase() || "";
    setSearchTerm(search);

    setFilters(prev => ({
      ...prev,
      brands: brand ? [brand.toLowerCase().replace(/\s/g, '')] : [],
    }));
  }, [category, location.search]);

  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, price: value }));
  };

  const resetFilters = () => {
    setFilters({
      brands: [],
      colors: [],
      productCondition: [],
      price: 10000
    });
    setSearchTerm("");
    window.history.replaceState({}, document.title, "/#products");
  };

  const normalizedProducts = normalizeProducts(allProducts);
  const visibleProducts = normalizedProducts.filter(p => p.status?.toLowerCase() !== 'sold');

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((product) => {
      const matchBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchColor = filters.colors.length === 0 || filters.colors.includes(product.color);
      const matchCondition = filters.productCondition.length === 0 || filters.productCondition.includes(product.productCondition);
      const matchPrice = product.price <= filters.price;

      const search = searchTerm.trim().toLowerCase();
      const matchSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      (search === "man" && product.gender === "man") ||
      (search === "woman" && product.gender === "woman");
    

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

  return (
    <div>
      <Header />
      <Navbar />

      {isMobile && (
        <div className="mobile-filter-bar">
          <button onClick={() => setIsFilterOpen(true)}>Filter</button>
        </div>
      )}

      <div className="products-container">
        <FilterSidebar
          filters={filters}
          onCheckboxChange={handleCheckboxChange}
          onPriceChange={handlePriceChange}
          isMobile={isMobile}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

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

      <Footer />
    </div>
  );
}

export default ProductsPage;
