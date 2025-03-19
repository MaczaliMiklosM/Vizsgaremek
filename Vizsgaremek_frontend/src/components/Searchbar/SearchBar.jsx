import React from 'react';
import './SearchBar.css';

function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="search-container">
      <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
      </svg>
      <input 
        type="text" 
        className="search" 
        placeholder={placeholder || "Search"} 
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
