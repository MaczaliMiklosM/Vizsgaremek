import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import Person2Icon from '@mui/icons-material/Person2';
import InfoIcon from '@mui/icons-material/Info';
import './productDetails.css'; 

function ProductDetails() {
  const images = [
    "/Images/kep1.jpg",
    "/Images/kep2.jpg",
    "/Images/kep3.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Logo</div>
        <div className="group" style={{ flexGrow: 1, maxWidth: "calc(100% - 300px)" }}>
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
              clipRule="evenodd"
            />
          </svg>
          <input type="text" className="input" placeholder="Search" />
        </div>
        <div className="profile-links">
          <Link to="/signin"><Person2Icon /></Link> 
          <Link to="/about"><InfoIcon /></Link> 
          <span>About</span> | <span>Collection</span> | <span>Bell</span> | <span>Favs</span>
        </div>
      </header>

      <nav className="navbar">
        <a href="/brands" className="nav-link">Brands</a>
        <a href="/men" className="nav-link">Men</a>
        <a href="/women" className="nav-link">Women</a>
        <a href="/sneakers" className="nav-link">Sneakers</a>
        <a href="/accessories" className="nav-link">Accessories</a>
        <a href="/collectibles" className="nav-link">Collectibles</a>
        <a href="/more" className="nav-link">More</a>
      </nav>

      <div className="product-details">
        <div className="product-header">
          <h1>A Bathing Ape Bape Sta Low</h1>
          <h3>Kanye West College Dropout</h3>
        </div>

        <div className="product-content">
          <div className="product-images">
            <div className="main-image">
              <img src={selectedImage} alt="Product" />
            </div>
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => handleImageClick(image)}
                  style={{ cursor: 'pointer', margin: '10px' }}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-price">
              <h2>$18,625</h2>
            </div>
            <div className="product-size">
              <label htmlFor="size">Select Size: </label>
              <select id="size" name="size">
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42" selected>42</option>
                <option value="43" disabled>43</option>
                <option value="44" disabled>44</option>
                <option value="45" disabled>45</option>
                <option value="46" disabled>46</option>
              </select>
            </div>

            <div className="product-actions">
              <button className="btn bid-btn">Place Bid</button>
              <button className="btn wishlist-btn"><AddCircleIcon /> Wishlist</button>
              <button className="btn favorite-btn"><FavoriteBorderIcon /> Favorite</button>
              <button className="btn share-btn"><IosShareIcon /> Share</button>
            </div>

            <div className="product-condition">
              <p><strong>Condition:</strong> New</p>
            </div>
            <div className="verified">
              <p className="verified-text">Verified Product</p>
            </div>
          </div>
        </div>

        <div className="product-description">
          <h3>Product Description:</h3>
          <p>This is a premium sneaker designed by A Bathing Ape and Kanye West, featuring a distinctive low-top design. A must-have for sneaker collectors and fashion enthusiasts alike!</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
