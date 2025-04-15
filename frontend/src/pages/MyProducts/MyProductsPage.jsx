import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RequireAuth from '../../components/Auth/RequireAuth';
import axios from "axios";
import "./MyProductsPage.css";

function MyProductsPage() {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", brand: "", color: "", size: "",
    category: "", product_condition: "NEW", target_gender: "WOMAN"
  });
  const [imageFile, setImageFile] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const allowedBrands = ["Balenciaga", "Cartier", "Chanel", "Hermes", "Omega", "Dior", "Louis Vuitton"];
  const allowedColors = ["White", "Black", "Blue", "Red", "Pink", "Green", "Purple", "Yellow", "Grey", "Brown", "Orange", "Multicolor"];

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/products/by-user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        if (err.response?.status === 403) {
          setError("You are not authorized to view your products.");
        }
      }
    };
    fetchMyProducts();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name, description, price, brand, color, size, category,
      product_condition, target_gender
    } = formData;

    if (!name || !description || !price || !brand || !color || !size || !category || !imageFile) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("brand", brand);
      form.append("color", color);
      form.append("size", size);
      form.append("category", category.toUpperCase());
      form.append("productCondition", product_condition.toUpperCase());
      form.append("targetGender", target_gender.toUpperCase());
      form.append("uploaderId", user.id);
      form.append("status", "UNAPPROVED");
      form.append("imageData", imageFile);

      await axios.post("/api/products/createProduct", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      setError("");
      setFormData({
        name: "", description: "", price: "", brand: "", color: "", size: "", category: "",
        product_condition: "NEW", target_gender: "WOMAN"
      });
      setImageFile(null);

      const updated = await axios.get(`/api/products/by-user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyProducts(updated.data);

    } catch (err) {
      console.error("❌ Upload failed:", err);
      if (err.response?.status === 403) {
        setError("You are not authorized to upload products.");
      } else {
        setError("Failed to upload product.");
      }
    }
  };

  return (
    <RequireAuth>
      <div>
        <Header />
        <Navbar />

        <div className="upload-page">
          <h2>Upload a New Product</h2>
          {error && <div className="form-error">{error}</div>}

          <form className="upload-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />

            <label>Brand</label>
            <select name="brand" value={formData.brand} onChange={handleChange}>
              <option value="">Select Brand</option>
              {allowedBrands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>

            <label>Color</label>
            <select name="color" value={formData.color} onChange={handleChange}>
              <option value="">Select Color</option>
              {allowedColors.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="sneaker">Sneaker</option>
              <option value="bag">Bag</option>
              <option value="watch">Watch</option>
            </select>

            <input name="size" placeholder="Size" value={formData.size} onChange={handleChange} />

            <label>Condition</label>
            <select name="product_condition" value={formData.product_condition} onChange={handleChange}>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
            </select>

            <label>Target Gender</label>
            <select name="target_gender" value={formData.target_gender} onChange={handleChange}>
              <option value="MAN">Man</option>
              <option value="WOMAN">Woman</option>
            </select>

            <label>Upload Image</label>
            <input type="file" name="imageFile" accept="image/*" onChange={handleFileChange} />

            <button type="submit">Upload Product</button>
          </form>

          <h3>Your Uploaded Products</h3>
          <div className="product-list">
            {myProducts.length === 0 ? (
              <p className="empty-text">No products uploaded yet.</p>
            ) : (
              myProducts.map((p) => (
                <div key={p.id} className="product-card">
                  {p.status === "SOLD" && (
                    <div className="sold-banner">💰 SOLD</div>
                  )}
                  {p.status === "UNAPPROVED" && (
                    <div className="approval-banner">⏳ Waiting for Approval</div>
                  )}
                  <img src={`data:image/jpeg;base64,${p.imageData}`} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <p><strong>Price:</strong> ${p.price}</p>
                  <p><strong>Brand:</strong> {p.brand}</p>
                  <p><strong>Color:</strong> {p.color}</p>
                  <p><strong>Size:</strong> {p.size}</p>
                  <p><strong>Category:</strong> {p.category}</p>
                  <p><strong>Condition:</strong> {p.productCondition}</p>
                  <p><strong>Gender:</strong> {p.targetGender}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <Footer />
      </div>
    </RequireAuth>
  );
}

export default MyProductsPage;
