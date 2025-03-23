import React, { useState } from "react";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./MyProductsPage.css";

function MyProductsPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    brand: "",
    color: "",
    size: "",
    product_condition: "new",
    bidding_enabled: "no",
    target_gender: "unisex",
  });

  const [myProducts, setMyProducts] = useState([]);
  const [error, setError] = useState("");

  const currentBids = [
    {
      productName: "Omega Seamaster Watch",
      yourBid: 780,
      currentHighest: 810,
      status: "Outbid",
    },
  ];

  const bidHistory = [
    { name: "Cartier Tank", amount: 600, time: "2024.03.12 13:52" },
    { name: "LV Monogram Bag", amount: 960, time: "2024.03.10 09:13" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.image_url || !formData.brand || !formData.color || !formData.size) {
      setError("Please fill out all fields.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!isImageUrl(formData.image_url)) {
      setError("Please enter a valid image URL.");
      return;
    }

    setError("");

    const newProduct = {
      ...formData,
      product_id: Date.now(),
      upload_date: new Date().toISOString().split("T")[0],
      uploader_id: "current_user",
    };

    setMyProducts([newProduct, ...myProducts]);

    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      brand: "",
      color: "",
      size: "",
      product_condition: "new",
      bidding_enabled: "no",
      target_gender: "unisex",
    });
  };

  return (
    <div>
      <Header />
      <Navbar />

      <div className="upload-page">
        <h2>Upload a New Product</h2>

        <form className="upload-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
          <input name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} />
          <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
          <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} />
          <input name="size" placeholder="Size" value={formData.size} onChange={handleChange} />

          <label>Condition</label>
          <select name="product_condition" value={formData.product_condition} onChange={handleChange}>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <label>Bidding Enabled</label>
          <select name="bidding_enabled" value={formData.bidding_enabled} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          <label>Target Gender</label>
          <select name="target_gender" value={formData.target_gender} onChange={handleChange}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>

          <button type="submit">Upload Product</button>
        </form>

        <h3>Your Uploaded Products</h3>
        <div className="product-list">
          {myProducts.length === 0 ? (
            <p className="empty-text">No products uploaded yet.</p>
          ) : (
            myProducts.map((product) => (
              <div key={product.product_id} className="product-card">
                <img src={product.image_url} alt={product.name} />
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${product.price} USD</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Size:</strong> {product.size}</p>
                <p><strong>Condition:</strong> {product.product_condition}</p>
                <p><strong>Bidding:</strong> {product.bidding_enabled}</p>
                <p><strong>Gender:</strong> {product.target_gender}</p>
              </div>
            ))
          )}
        </div>

        <div className="bid-section">
          <h3>Your Bidding Activity</h3>

          <div className="bid-list">
            <div className="bid-subsection">
              <h4>🟢 Current Bids</h4>
              {currentBids.map((bid, index) => (
                <div key={index} className="bid-card">
                  <p><strong>Product:</strong> {bid.productName}</p>
                  <p><strong>Your Highest Bid:</strong> ${bid.yourBid}</p>
                  <p><strong>Current Highest Bid:</strong> ${bid.currentHighest}</p>
                  <p><strong>Status:</strong> {bid.status}</p>
                </div>
              ))}
            </div>

            <div className="bid-subsection">
              <h4>📜 Bid History</h4>
              <ul className="bid-history-list">
                {bidHistory.map((entry, index) => (
                  <li key={index}><span>{entry.name} – </span>${entry.amount} on {entry.time}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyProductsPage;
