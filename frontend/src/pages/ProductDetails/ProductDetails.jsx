import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IosShareIcon from '@mui/icons-material/IosShare';
import axios from 'axios';
import './ProductDetails.css';
import RequireAuth from '../../components/Auth/RequireAuth';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AccessDeniedPopup from '../../components/Auth/AccessDeniedPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [inBasket, setInBasket] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const basketKey = `basket_${user?.id}`;

  const isUploader = user?.id && product?.uploaderId === user.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/getProductById/${id}`);
        const data = response.data;
        setProduct(data);

        if (data.imageData) {
          setActiveImage(data.imageData);
        }

        if (isLoggedIn && user?.id) {
          const token = localStorage.getItem("token");
          const wishlistRes = await axios.get(`/api/wishlist/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const wishExists = wishlistRes.data.some(item => item.productId === data.id);
          setInWishlist(wishExists);
        }

        const basket = JSON.parse(localStorage.getItem(basketKey)) || [];
        const basketExists = basket.some(p => Number(p.id) === Number(data.id));
        setInBasket(basketExists);
      } catch (error) {
        console.error('Failed to load product:', error);
      }
    };

    fetchProduct();
  }, [id, isLoggedIn, user?.id, basketKey]);

  const handleShare = () => {
    const link = `${window.location.origin}/#/product-details/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("🔗 Product link copied to clipboard!");
  };

  const addToBasket = () => {
    if (!isLoggedIn) {
      setShowAccessDenied(true);
      return;
    }

    if (isUploader) {
      toast.error("You can't buy your own product!");
      return;
    }

    const basket = JSON.parse(localStorage.getItem(basketKey)) || [];
    const exists = basket.find(p => Number(p.id) === Number(product.id));

    if (exists) {
      toast.info("Already in basket");
      return;
    }

    basket.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageData: product.imageData,
      size: product.size || 'N/A'
    });

    localStorage.setItem(basketKey, JSON.stringify(basket));
    setInBasket(true);
    toast.success("🛒 Added to basket!");
  };

  const addToWishlist = async () => {
    if (!isLoggedIn) {
      setShowAccessDenied(true);
      return;
    }

    if (isUploader) {
      toast.error("You can't add your own product to wishlist!");
      return;
    }

    if (inWishlist) {
      toast.info("Already in wishlist");
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
        toast.success("❤️ Added to wishlist!");
      } else {
        toast.error("Failed to add to wishlist.");
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      toast.error("Something went wrong with the wishlist.");
    }
  };

  const handleBid = () => {
    if (!isLoggedIn) {
      setShowAccessDenied(true);
      return;
    }

    if (isUploader) {
      toast.error("You can't bid on your own product!");
      return;
    }

    navigate(`/bid/${id}`);
  };

  if (!product) return <div>Loading...</div>;

  if (product.status === "SOLD") {
    return (
      <div className="container">
        <Header />
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 20px", fontSize: "1.5rem" }}>
          <p>🚫<strong>The requested product is no longer available.</strong></p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <RequireAuth>
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
            <div className="main-image-wrapper">
              <img
                src={`data:image/jpeg;base64,${activeImage}`}
                alt="Product"
                className="main-image"
              />
              <div className="thumbnail-row">
                {product.imageData && (
                  <img
                    src={`data:image/jpeg;base64,${product.imageData}`}
                    alt="Thumb 1"
                    className={`thumbnail ${activeImage === product.imageData ? 'active' : ''}`}
                    onClick={() => setActiveImage(product.imageData)}
                  />
                )}
                {product.imageData2 && (
                  <img
                    src={`data:image/jpeg;base64,${product.imageData2}`}
                    alt="Thumb 2"
                    className={`thumbnail ${activeImage === product.imageData2 ? 'active' : ''}`}
                    onClick={() => setActiveImage(product.imageData2)}
                  />
                )}
                {product.imageData3 && (
                  <img
                    src={`data:image/jpeg;base64,${product.imageData3}`}
                    alt="Thumb 3"
                    className={`thumbnail ${activeImage === product.imageData3 ? 'active' : ''}`}
                    onClick={() => setActiveImage(product.imageData3)}
                  />
                )}
              </div>
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
                <span>{inBasket ? "Already in Basket" : "Buy Now"}</span>
              </button>

              <button className="btn wishlist-btn" onClick={addToWishlist}>
                <AddCircleIcon /> <span>{inWishlist ? "Already in Wishlist" : "Wishlist"}</span>
              </button>

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
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeButton={false} />
    </div>
    </RequireAuth>
  );
}

export default ProductDetails;
