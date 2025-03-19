import React from "react";
import { useNavigate } from "react-router-dom";
import "../Products.css"; // A közös CSS fájl

const categories = ["Men", "Women", "Sneakers", "Accessories", "More"];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category} onClick={() => navigate(`/products/${category.toLowerCase()}`)}>
            {category}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
