import React, { useState, useEffect, useRef } from "react";
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

  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [myProducts, setMyProducts] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("LIVE");

  const user = JSON.parse(localStorage.getItem("user"));
  const imageInputRefs = [useRef(null), useRef(null), useRef(null)];

  const allowedBrands = ["Balenciaga", "Cartier", "Chanel", "Hermes", "Omega", "Christian Dior", "Louis Vuitton","Rolex"];
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

  useEffect(() => {
    const allImagesUploaded = imageFiles.every((file) => file);
    if (allImagesUploaded && error === "Please fill out all required fields and upload 3 images.") {
      setError("");
    }
  }, [imageFiles, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (index) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const resizedFile = await resizeImage(file, 508, 508);
    const newFiles = [...imageFiles];
    newFiles[index] = resizedFile;
    setImageFiles(newFiles);
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          }, file.type);
        };
      };
    });
  };

  const getSizePlaceholder = () => {
    switch (formData.category) {
      case "sneaker": return "Recommended: EU size 35 - 50";
      case "bag": return "Recommended: 15cm - 50cm";
      case "watch": return "Recommended: 30mm - 50mm";
      default: return "Enter size";
    }
  };

  const validateSize = () => {
    const size = formData.size.trim();
    if (!size) return "Size is required.";
    switch (formData.category) {
      case "sneaker": const num = parseInt(size, 10); if (isNaN(num) || num < 35 || num > 50) return "Sneaker size should be between 35 and 50."; break;
      case "watch": const mm = parseInt(size, 10); if (isNaN(mm) || mm < 30 || mm > 50) return "Watch size should be between 30mm and 50mm."; break;
      case "bag": const cm = parseInt(size, 10); if (isNaN(cm) || cm < 15 || cm > 50) return "Bag size should be between 15cm and 50cm."; break;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, brand, color, size, category, product_condition, target_gender } = formData;

    if (!name || !description || !price || !brand || !color || !size || !category || imageFiles.some((file) => !file)) {
      setError("Please fill out all required fields and upload 3 images.");
      return;
    }

    const sizeValidation = validateSize();
    if (sizeValidation) {
      setError(sizeValidation);
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
      form.append("imageData", imageFiles[0]);
      form.append("imageData2", imageFiles[1]);
      form.append("imageData3", imageFiles[2]);

      await axios.post("/api/products/createProduct", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      setError("");
      setFormData({ name: "", description: "", price: "", brand: "", color: "", size: "", category: "", product_condition: "NEW", target_gender: "WOMAN" });
      setImageFiles([null, null, null]);
      imageInputRefs.forEach(ref => { if (ref.current) ref.current.value = ""; });

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

  const filteredProducts = myProducts.filter((p) => {
    const status = p.status?.toUpperCase();
    return activeTab === "LIVE"
      ? status === "APPROVED"
      : activeTab === "PENDING"
        ? status === "UNAPPROVED"
        : status === "SOLD";
  });

  return (
    <RequireAuth>
      <div>
        <Header />
        <Navbar />

        <div className="upload-page">
          <h2>Upload a New Product</h2>

          <div className="form-warning">
            Please fill out everything carefully. <br />
            Once the product is uploaded, <strong>you won’t be able to edit it later.</strong>
          </div>

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
            <label>Size</label>
            <input name="size" placeholder={getSizePlaceholder()} value={formData.size} onChange={handleChange} />
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
            <label>Upload 3 Images (first will be thumbnail)</label>
            <input type="file" accept="image/*" onChange={handleFileChange(0)} ref={imageInputRefs[0]} />
            <input type="file" accept="image/*" onChange={handleFileChange(1)} ref={imageInputRefs[1]} />
            <input type="file" accept="image/*" onChange={handleFileChange(2)} ref={imageInputRefs[2]} />
            <button type="submit">Upload Product</button>
          </form>

          <div className="tabs">
            {["LIVE", "PENDING", "SOLD"].map(tab => (
              <span
                key={tab}
                className={activeTab === tab ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </span>
            ))}
          </div>

          <div className="product-list-fullwidth">
            {filteredProducts.length === 0 ? (
              <p className="empty-text">No {activeTab.toLowerCase()} products.</p>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} className="product-row">
                  {p.status === "SOLD" && <div className="sold-banner">SOLD</div>}
                  {p.status === "UNAPPROVED" && <div className="approval-banner">Waiting for Approval</div>}
                  <div className="product-row-left">
                    <img src={`data:image/jpeg;base64,${p.imageData}`} alt={p.name} className="product-image" />
                  </div>
                  <div className="product-row-right">
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
