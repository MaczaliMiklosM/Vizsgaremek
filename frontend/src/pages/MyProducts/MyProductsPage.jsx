import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RequireAuth from '../../components/Auth/RequireAuth';
import "./MyProductsPage.css";

function MyProductsPage() {
  const initialFormData = {
    name: "",
    description: "",
    price: "",
    image_url: "",
    brand: "",
    color: "",
    size: "",
    category: "",
    product_condition: "new",
    target_gender: "unisex",
  };

  const allowedBrands = ["Balenciaga", "Cartier", "Chanel", "Hermes", "Omega", "Dior", "Louis Vuitton"];
  const allowedColors = ["White", "Black", "Blue", "Red", "Pink", "Green", "Purple", "Yellow", "Grey", "Brown", "Orange", "Multicolor"];

  const [formData, setFormData] = useState(initialFormData);
  const [myProducts, setMyProducts] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { size: "" } : {}),
    }));
  };

  const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());

  const isValidSize = (value, category) => {
    const allowedSizes = ["xs", "s", "m", "l", "xl"];
    const val = value.trim().toLowerCase();
    const num = parseInt(val);
    const isNum = !isNaN(num);

    switch (category.toLowerCase()) {
      case "sneaker":
        return isNum && num >= 35 && num <= 52;
      case "bag":
        return allowedSizes.includes(val) || (isNum && num >= 20 && num <= 60);
      case "watch":
        return isNum && num >= 28 && num <= 52;
      default:
        return false;
    }
  };

  const isValidCategory = (value) => {
    return ["sneaker", "bag", "watch"].includes(value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name, description, price, image_url, brand, color, size, category
    } = formData;

    if ([name, description, price, image_url, brand, color, size, category].some((field) => field.trim() === "")) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!isValidCategory(category)) {
      setError("Category must be one of: sneaker, bag, watch.");
      return;
    }

    if (!allowedBrands.includes(brand)) {
      setError("Please select a valid brand.");
      return;
    }

    if (!allowedColors.includes(color)) {
      setError("Please select a valid color.");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setError("Price must be a number greater than 0.");
      return;
    }

    if (!isImageUrl(image_url)) {
      setError("Please enter a valid image URL ending with jpg, png, gif, etc.");
      return;
    }

    if (!isValidSize(size, category)) {
      if (category === "sneaker") {
        setError("Sneaker size must be between EU 35–52.");
      } else if (category === "bag") {
        setError("Bag size must be XS–XL or width 20–60 cm.");
      } else if (category === "watch") {
        setError("Watch size must be between 28–52 mm.");
      } else {
        setError("Invalid size.");
      }
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
    setFormData(initialFormData);
  };

  const sizePlaceholder = {
    sneaker: "Size (EU 35–52)",
    bag: "Size (XS–XL or 20–60 cm)",
    watch: "Size (28–52 mm)",
  }[formData.category] || "Size";

  return (
    <RequireAuth>
      <div>
        <Header />
        <Navbar />

        <div className="upload-page">
          <h2>Upload a New Product</h2>
          <p style={{ color: "#b91c1c", fontWeight: "bold", textAlign: "center" }}>
            Please make sure all details are correct before submission. Changes are not allowed later.
          </p>

          <form className="upload-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
            <input name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} />

            <label>Brand</label>
            <select name="brand" value={formData.brand} onChange={handleChange} required>
              <option value="">Select Brand</option>
              {allowedBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <label>Color</label>
            <select name="color" value={formData.color} onChange={handleChange} required>
              <option value="">Select Color</option>
              {allowedColors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="sneaker">Sneaker</option>
              <option value="bag">Bag</option>
              <option value="watch">Watch</option>
            </select>

            <input
              name="size"
              placeholder={sizePlaceholder}
              value={formData.size}
              onChange={handleChange}
            />

            <label>Condition</label>
            <select name="product_condition" value={formData.product_condition} onChange={handleChange}>
              <option value="new">New</option>
              <option value="used">Used</option>
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
                  <p><strong>Color:</strong> {product.color}</p>
                  <p><strong>Size:</strong> {product.size}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Condition:</strong> {product.product_condition}</p>
                  <p><strong>Gender:</strong> {product.target_gender}</p>
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
