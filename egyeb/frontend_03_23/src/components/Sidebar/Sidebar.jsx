import React, { useState } from "react";
import "./Sidebar.css";

const filterOptions = {
  categories: ["Sneakers", "Watches", "Bags"],
  gender: ["Women", "Men", "Unisex"],
  brands: ["LuiV", "Chanel", "Rolex", "Cartier", "Omega", "Dior", "Balenciaga"],
  colors: [
    "White", "Black", "Blue", "Red", "Pink", "Green", "Purple",
    "Yellow", "Grey", "Brown", "Orange", "Multicolor"
  ]
};

function FilterSidebar({ filters, onCheckboxChange, onPriceChange }) {
  return (
    <aside className="sidebar">
      <h2>Filter</h2>

      <div className="filter-group">
        <h4>Categories</h4>
        {filterOptions.categories.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={filters.categories.includes(option.toLowerCase())}
              onChange={() => onCheckboxChange("categories", option.toLowerCase())}
            />
            {option}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Gender</h4>
        {filterOptions.gender.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={filters.gender.includes(option.toLowerCase())}
              onChange={() => onCheckboxChange("gender", option.toLowerCase())}
            />
            {option}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Brands</h4>
        {filterOptions.brands.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={filters.brands.includes(option)}
              onChange={() => onCheckboxChange("brands", option)}
            />
            {option}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Color</h4>
        {filterOptions.colors.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={filters.colors.includes(option.toLowerCase())}
              onChange={() => onCheckboxChange("colors", option.toLowerCase())}
            />
            {option}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Price: ${filters.price}</h4>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={filters.price}
          onChange={(e) => onPriceChange(parseInt(e.target.value))}
        />
      </div>
    </aside>
  );
}

export default FilterSidebar;