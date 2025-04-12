import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IosShareIcon from '@mui/icons-material/IosShare';
import axios from 'axios';
import './ProductDetails.css';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AccessDeniedPopup from '../../components/Auth/AccessDeniedPopup';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/getProductById/${id}`);
      const data = response.data;
      setProduct(data);

      const baseImages = data.imageUrl?.split(',') || [];
      setSelectedImage(`/Images/product_images/${baseImages[0]}`);

      // 💡 Friss ellenőrzés szerverről:
      if (isLoggedIn && user?.id) {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/wishlist/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const exists = res.data.some(item => item.productId === data.id);
        setInWishlist(exists);
      }

    } catch (error) {
      console.error('❌ Failed to load product:', error);
    }
  };

  fetchProduct();
}, [id, isLoggedIn, user?.id]);


  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleShare = () => {
    const link = `${window.location.origin}/#/product-details/${id}`;
    navigator.clipboard.writeText(link);
    alert("Product link copied to clipboard!");
  };

  const addToBasket = () => {
    if (!isLoggedIn) {
      setShowAccessDenied(true);
      return;
    }

    const basket = JSON.parse(localStorage.getItem("basket")) || [];
    if (!basket.find(p => p.id === product.id)) {
      basket.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `/Images/product_images/${product.imageUrl?.split(',')[0]}`,
        quantity: 1,
        stock: 2,
        size: product.size || 'N/A'
      });
      localStorage.setItem("basket", JSON.stringify(basket));
      alert("Added to basket!");
      navigate('/basket');
    } else {
      alert("Already in basket!");
      navigate('/basket');
    }
  };

  const addToWishlist = async () => {
    if (!isLoggedIn) {
      setShowAccessDenied(true);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post('/api/wishlist/addWishlistItem', {
        userId: user.id,
        productId: product.id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const updated = [...(JSON.parse(localStorage.getItem("wishlist")) || []), {
          productId: product.id
        }];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setInWishlist(true);
        alert("Added to wishlist!");
      } else {
        alert("Failed to add to wishlist.");
      }
    } catch (error) {
      console.error("❌ Error adding product to wishlist:", error);
      alert("An error occurred while adding the product to your wishlist.");
    }
  };

  const handleBid = () => {
    if (!isLoggedIn) {
      setShowAccessDenied(true);
      return;
    }
    navigate(`/bid/${id}`);
  };

  if (!product) return <div>Loading...</div>;

  const imageList = product.imageUrl?.split(',') || [];

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
              {imageList.map((img, idx) => (
                <img
                  key={idx}
                  src={`/Images/product_images/${img.trim()}`}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => handleImageClick(`/Images/product_images/${img.trim()}`)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-price">
              <h2>{product.price} $</h2>
            </div>

            <div className="product-actions">
              <button className="btn bid-btn" onClick={handleBid}>
                <span>Place Bid</span>
              </button>

              <button className="btn buy-btn" onClick={addToBasket}>
                <span>Buy Now</span>
              </button>

              {inWishlist ? (
                <button className="btn wishlist-btn" disabled>
                  <AddCircleIcon /> <span>Already in Wishlist</span>
                </button>
              ) : (
                <button className="btn wishlist-btn" onClick={addToWishlist}>
                  <AddCircleIcon /> <span>Wishlist</span>
                </button>
              )}

              <button className="btn share-btn" onClick={handleShare}>
                <IosShareIcon /> <span>Share</span>
              </button>
            </div>

            <div className="product-meta">
              <p><strong>&nbsp;&nbsp;Condition:</strong> {product.productCondition}</p>
              <p><strong>&nbsp;&nbsp;Size:</strong> {product.size}</p>
              <p><strong>&nbsp;&nbsp;Color:</strong> {product.color}</p>
              <p><strong>&nbsp;&nbsp;Gender:</strong> {product.targetGender}</p>
              <p><strong>&nbsp;&nbsp;Category:</strong> {product.category}</p>
              <p><strong>&nbsp;&nbsp;Brand:</strong> {product.brand}</p>
              <p className="verified-text">&nbsp;&nbsp;Verified Product</p>
            </div>
          </div>
        </div>
      </div>

      {showAccessDenied && <AccessDeniedPopup onClose={() => setShowAccessDenied(false)} />}
      <Footer />
    </div>
  );
}

export default ProductDetails;
