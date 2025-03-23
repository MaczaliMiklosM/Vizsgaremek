import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import './ProductDetails.css';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const productData = {
  1: {
    name: "Women's Runner Sneakers Mesh and Nylon",
    description: "A mesh and nylon runner with urban appeal, offering lightweight comfort and statement style.",
    price: "$645",
    condition: "Used",
    size: "38 EU",
    color: "Pink/White",
    images: ["/Images/product_images/cipok5_1.jpeg", "/Images/product_images/cipok5_2.jpeg", "/Images/product_images/cipok5_3.jpeg"],
  },
  2: {
    name: "Women's Runner Sneakers Mesh and Nylon",
    description: "A mesh and nylon runner with urban appeal, offering lightweight comfort and statement style.",
    price: "$645",
    condition: "Used",
    size: "38 EU",
    color: "Pink/White",
    images: ["/Images/product_images/cipok5_1.jpeg", "/Images/product_images/cipok5_2.jpeg", "/Images/product_images/cipok5_3.jpeg"],
  },
  3: {
    name: "Women's Runner Sneakers Mesh and Nylon",
    description: "A mesh and nylon runner with urban appeal, offering lightweight comfort and statement style.",
    price: "$645",
    condition: "Used",
    size: "38 EU",
    color: "Pink/White",
    images: ["/Images/product_images/cipok5_1.jpeg", "/Images/product_images/cipok5_2.jpeg", "/Images/product_images/cipok5_3.jpeg"],
  },
};

function ProductDetails() {
  const { id } = useParams();
  const product = productData[id] || {};
  const [selectedImage, setSelectedImage] = useState(product.images ? product.images[0] : '');
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleShare = () => {
    const link = `${window.location.origin}/#/product-details/${id}`;
    navigator.clipboard.writeText(link);
    alert("🔗 Product link copied to clipboard!");
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
            <button className="hidden"></button>
              <button className="btn bid-btn" onClick={() => navigate(`/bid/${id}`)}>
                <span>Place Bid</span>
              </button>
              
              <button className="btn buy-btn" onClick={() => navigate('/basket')}>
                <span>Buy Now</span>
              </button>
              <button className="btn wishlist-btn" onClick={() => navigate('/wishlist')}>
                <AddCircleIcon /> <span>Wishlist</span>
              </button>
              <button className="btn share-btn" onClick={handleShare}>
                <IosShareIcon /> <span>Share</span>
              </button>
            </div>

            <div className="product-condition">
              <p><strong>Condition:</strong> {product.condition}</p>
            </div>
            <div className="product-size">
              <p><strong>Size:</strong> {product.size}</p>
            </div>
            <div className="product-color">
              <p><strong>Color:</strong> {product.color}</p>
            </div>

            <div className="verified">
              <p className="verified-text">Verified Product</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetails;
