import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import './ProductDetails.css';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';

const productData = {
  1: {
    name: "A Bathing Ape Bape Sta Low",
    description: "A premium sneaker designed by A Bathing Ape and Kanye West.",
    price: "$18,625",
    images: ["/Images/kep1.jpg", "/Images/kep2.jpg", "/Images/kep3.jpg"],
  },
  2: {
    name: "Louis Vuitton x Takashi Murakami",
    description: "A stylish collaboration featuring vibrant designs.",
    price: "$14,293",
    images: ["/Images/taska.png"],
  },
  3: {
    name: "Louis Vuitton LV Trainer Black Grey Crystal",
    description: "A luxurious sneaker with a unique design.",
    price: "$7,374",
    images: ["/Images/luimage.png"],
  },
};

function ProductDetails() {
  const { id } = useParams();
  const product = productData[id] || {};

  const [selectedImage, setSelectedImage] = useState(product.images ? product.images[0] : '');

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="container">
      <Header />
      <Navbar />

      <div className="product-details">
        <div className="product-header">
          <h1>{product.name}</h1>
          <h3>{product.description}</h3>
        </div>

        <div className="product-content">
          <div className="product-images">
            <div className="main-image">
              <img src={selectedImage} alt="Product" />
            </div>
            <div className="image-thumbnails">
              {product.images &&
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-price">
              <h2>{product.price}</h2>
            </div>
            <div className="product-actions">
              <button className="btn bid-btn">Place Bid</button>
              <button className="btn buy-btn">Buy Now</button>
              <button className="btn wishlist-btn">
                <AddCircleIcon /> Wishlist
              </button>
              <button className="btn favorite-btn">
                <FavoriteBorderIcon /> Favorite
              </button>
              <button className="btn share-btn">
                <IosShareIcon /> Share
              </button>
            </div>
            <div className="product-condition">
              <p>
                <strong>Condition:</strong> New
              </p>
            </div>
            <div className="verified">
              <p className="verified-text">Verified Product</p>
            </div>
          </div>
        </div>

        <div className="product-description">
          <h3>Product Description:</h3>
          <p>{product.description}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;
