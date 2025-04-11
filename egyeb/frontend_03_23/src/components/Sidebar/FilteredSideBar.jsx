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
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <aside className={`sidebar ${isMobile ? (isOpen ? "open" : "") : ""}`}>
      {isMobile && <button className="sidebar-close" onClick={onClose}>×</button>}
      <h2>Filter</h2>

      <div className="filter-group">
        <h4 onClick={() => toggleSection("category")}>Categories</h4>
        <div className={`filter-content ${!expanded.category ? "collapsed" : ""}`}>
          {categoryOptions.map((option) => (
            <label key={option}>
              {option}
              <input
                type="radio"
                name="category"
                checked={filters.category === option.toLowerCase()}
                onChange={() => onCheckboxChange("category", option.toLowerCase())}
              />
            </label>
          ))}
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
            max="10000"
            step="100"
            value={filters.price}
            onChange={(e) => onPriceChange(parseInt(e.target.value))}
          />
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
