import React, { useState, useEffect } from "react";
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
    gender: p.gender?.toLowerCase(),
    brand: p.brand?.toLowerCase().replace(/\s/g, ''),
    color: p.color?.toLowerCase(),
  }));
}

function ProductsPage() {
  const { category } = useParams();
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    gender: [],
    brands: [],
    colors: [],
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

    const lower = category?.toLowerCase();
    const validCategories = ["bag", "watch", "sneaker"];
    const validGenders = ["man", "woman", "unisex"];

    if (validCategories.includes(lower)) {
      setFilters(prev => ({ ...prev, category: [lower] }));
    } else if (validGenders.includes(lower)) {
      setFilters(prev => ({ ...prev, gender: [lower] }));
    }

    setFilters(prev => ({
      ...prev,
      brands: brand ? [brand.toLowerCase().replace(/\s/g, '')] : prev.brands,
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
    setFilters({ category: [], gender: [], brands: [], colors: [], price: 10000 });
  };

  const normalizedProducts = normalizeProducts(allProducts);
  const filteredProducts = normalizedProducts.filter((product) => {
    const matchCategory =
      filters.category.length === 0 ||
      filters.category.length === 3 ||
      filters.category.includes(product.category);

    const matchGender =
      filters.gender.length === 0 ||
      filters.gender.length === 3 ||
      filters.gender.includes(product.gender);

    const matchBrand =
      filters.brands.length === 0 || filters.brands.includes(product.brand);

    const matchColor =
      filters.colors.length === 0 || filters.colors.includes(product.color);

    const matchPrice = product.price <= filters.price;

    const matchSearch =
      !searchTerm || product.name.toLowerCase().includes(searchTerm);

    return matchCategory && matchGender && matchBrand && matchColor && matchPrice && matchSearch;
  });

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
            <h4>{filteredProducts.length} products found</h4>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>

          <section className="products-grid">
            {filteredProducts.map((product) => {
              const firstImage = product.imageUrl?.split(',')[0];
              const imagePath = `/Images/product_images/${firstImage}`;
              return (
                <Link
                  to={`/product-details/${product.id}`}
                  key={product.id}
                  className="card-link"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="product-card">
                    <img src={imagePath} alt={product.name} />
                    <div className="details">
                      <div className="name">{product.name}</div>
                      <div className="price">{product.price} $</div>
                    </div>
                  </div>
                </Link>
              );
            })}
            {filteredProducts.length === 0 && <p>No products match your filters.</p>}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ProductsPage;
