import React, { useState, useEffect } from "react";
import "./Sidebar.css";

const categoryOptions = ["Sneakers", "Watches", "Bags"];
const filterOptions = {
  gender: ["Women", "Men", "Unisex"],
  brands: ["Balenciaga", "Cartier", "Chanel", "Hermes", "Omega", "Dior", "Louis Vuitton"],
  colors: [
    "White", "Black", "Blue", "Red", "Pink", "Green", "Purple",
    "Yellow", "Grey", "Brown", "Orange", "Multicolor"
  ]
};

function FilterSidebar({ filters, onCheckboxChange, onPriceChange, isMobile, isOpen, onClose }) {
  const [expanded, setExpanded] = useState({
    category: false,
    gender: false,
    brands: false,
    colors: false,
    price: false
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.classList.add("sidebar-open");
      } else {
        document.body.classList.remove("sidebar-open");
      }
    }
  }, [isOpen, isMobile]);

  return (
    <>
      {isMobile && isOpen && (
        <div className="overlay" onClick={onClose}></div>
      )}
      <aside className={`sidebar ${isMobile ? (isOpen ? "open" : "") : ""}`}>
        {isMobile && <button className="sidebar-close" onClick={onClose}>×</button>}
        <h2>Filter</h2>

        <div className="filter-group">
          <h4 onClick={() => toggleSection("category")}>Categories</h4>
          <div className={`filter-content ${!expanded.category ? "collapsed" : ""}`}>
            {categoryOptions.map((option) => {
              const val = option.toLowerCase();
              return (
                <label key={option}>
                  {option}
                  <input
                    type="checkbox"
                    checked={filters.category.includes(val)}
                    onChange={() => onCheckboxChange("category", val)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {Object.entries(filterOptions).map(([key, options]) => (
          <div className="filter-group" key={key}>
            <h4 onClick={() => toggleSection(key)}>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
            <div className={`filter-content ${!expanded[key] ? "collapsed" : ""}`}>
              {options.map((option) => (
                <label key={option}>
                  {option}
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters[key]) && filters[key].includes(option.toLowerCase())}
                    onChange={() => onCheckboxChange(key, option.toLowerCase())}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="filter-group">
          <h4 onClick={() => toggleSection("price")}>Price: ${filters.price}</h4>
          <div className={`filter-content ${!expanded.price ? "collapsed" : ""}`}>
            <input
              type="range"
              min="0"
              max="20000"
              step="100"
              value={filters.price}
              onChange={(e) => onPriceChange(parseInt(e.target.value))}
            />
          </div>
        </div>

        {isMobile && (
          <button className="apply-filters-button" onClick={onClose}>
            See Products
          </button>
        )}
      </aside>
    </>
  );
}

export default FilterSidebar;
