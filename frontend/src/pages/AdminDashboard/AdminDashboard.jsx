import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedImage, setSelectedImage] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/products/getProducts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const approveProduct = (id) => {
    console.log('Approved:', id);
    // TODO: Send approval to backend
  };

  const unapproveProduct = (id) => {
    console.log('Unapproved:', id);
    // TODO: Send unapprove request to backend
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Frontenden is távolítsuk el a listából:
      setProducts(prev => prev.filter(product => product.id !== id));
      alert("Product successfully deleted!");
    } catch (error) {
      console.error("❌ Failed to delete product", error);
      alert("Failed to delete product.");
    }
  };
  

  const filteredProducts = products.filter(product => {
    if (activeTab === 'pending' && product.status !== 'UNAPPROVED') return false;
    if (activeTab === 'approved' && product.status === 'UNAPPROVED') return false;
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-center">
          <div className="admin-logo">
            <h1>LuxShop Administrator Panel</h1>
          </div>
          <div className="admin-tabs">
            <button
              className={activeTab === 'pending' ? 'active-tab' : ''}
              onClick={() => setActiveTab('pending')}
            >
              Pending Products
            </button>
            <button
              className={activeTab === 'approved' ? 'active-tab' : ''}
              onClick={() => setActiveTab('approved')}
            >
              All Products
            </button>
          </div>
        </div>
        <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
      </header>

      <main className="admin-panel">
        <h2>{activeTab === 'pending' ? 'Pending Product Approvals' : 'All Products'}</h2>

        {activeTab === 'approved' && (
        <div className="admin-searchbar-container">
          <input
            type="text"
            placeholder="Search products..."
            className="admin-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          )}

        {filteredProducts.map(product => (
          <div key={product.id} className="product-row">
            <div className="product-image-column">
              <div className="thumbnail-row">
                {(product.imageUrl?.split(',') || []).map((img, idx) => (
                  <img
                    key={idx}
                    src={`/Images/product_images/${img}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className={selectedImage[product.id] === img ? 'selected-thumbnail' : ''}
                    onClick={() => setSelectedImage(prev => ({ ...prev, [product.id]: img }))}
                  />
                ))}
              </div>
              <img
                src={`/Images/product_images/${selectedImage[product.id] || product.imageUrl?.split(',')[0]}`}
                alt="Main View"
                className="main-image"
              />
            </div>

            <div className="product-details">
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Size:</strong> {product.size}</p>
              <p><strong>Color:</strong> {product.color}</p>
              <p><strong>Gender:</strong> {product.targetGender}</p>
              <p><strong>Condition:</strong> {product.productCondition}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> {product.price} $</p>
              <p><strong>Status:</strong> {product.status}</p>
              <p><strong>Upload Date:</strong> {product.uploadDate?.split('T')[0]}</p>

              <div className="product-actions">
                {activeTab === 'pending' ? (
                  <>
                    <button onClick={() => approveProduct(product.id)} className="approve-btn">Approve</button>
                    <button onClick={() => unapproveProduct(product.id)} className="unapprove-btn">Unapprove</button>
                  </>
                ) : (
                  <button onClick={() => deleteProduct(product.id)} className="delete-btn">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default AdminDashboard;
