import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeImages, setActiveImages] = useState({});
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/products/getProducts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);

      const defaultImages = {};
      res.data.forEach(p => {
        if (p.imageData) defaultImages[p.id] = p.imageData;
      });
      setActiveImages(defaultImages);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to fetch products.");
    }
  };

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/orders/getAllOrders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        console.warn("Unexpected response format:", res.data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to fetch orders.");
      setOrders([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'approved') {
      fetchAllProducts();
    } else if (activeTab === 'orders') {
      fetchAllOrders();
    }
  }, [activeTab]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const approveProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/products/approveProduct/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
      toast.success("Product approved!");
    } catch (err) {
      console.error("Failed to approve product", err);
      toast.error("Failed to approve product.");
    }
  };

  const unapproveProduct = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success("Product rejected and deleted.");
    } catch (error) {
      console.error("Failed to reject product", error);
      toast.error("Failed to reject product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success("Product successfully deleted!");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product.");
      window.alert("Failed to delete product. You cannot delete products with active bids or products that have been sold.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/orders/admin/updateStatus/${orderId}?status=${newStatus}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchAllOrders();
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Failed to update order status.");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'pending') {
      return product.status === 'UNAPPROVED' && matchesSearch;
    }

    if (activeTab === 'approved') {
      if (selectedStatus === 'ALL') return matchesSearch;
      return product.status === selectedStatus && matchesSearch;
    }

    return true;
  });

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-center">
          <div className="admin-logo">
            <h1>LuxShop Administrator Panel</h1>
          </div>
          <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
          <div className="admin-tabs">
            <button className={activeTab === 'pending' ? 'active-tab' : ''} onClick={() => setActiveTab('pending')}>Pending Products</button>
            <button className={activeTab === 'approved' ? 'active-tab' : ''} onClick={() => setActiveTab('approved')}>All Products</button>
            <button className={activeTab === 'orders' ? 'active-tab' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
          </div>
        </div>
      </header>

      <main className="admin-panel">
        {activeTab === 'orders' ? (
          <>
            <h2>All Orders</h2>
            {orders.length === 0 ? (
              <p>No orders available.</p>
            ) : (
              orders.map(order => (
                <div key={order.orderId} className="order-row">
                  <h4>Order #{order.orderId}</h4>
                  <p><strong>User ID:</strong> {order.userId}</p>
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                  <p><strong>Total:</strong> ${order.totalAmount}</p>
                  <label>Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                  >
                    {["CART", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            <h2>{activeTab === 'pending' ? 'Pending Product Approvals' : 'All Products'}</h2>

            {activeTab === 'approved' && (
              <div className="admin-searchbar-container">
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="ALL">All</option>
                  <option value="APPROVED">Approved</option>
                  <option value="SOLD">Sold</option>
                </select>
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
                  <img src={`data:image/jpeg;base64,${activeImages[product.id]}`} alt="Main" className="main-image" />
                  <div className="thumbnail-row">
                    {[product.imageData, product.imageData2, product.imageData3].map((img, idx) =>
                      img && (
                        <img
                          key={idx}
                          src={`data:image/jpeg;base64,${img}`}
                          className={`thumbnail ${activeImages[product.id] === img ? 'selected-thumbnail' : ''}`}
                          onClick={() => setActiveImages(prev => ({ ...prev, [product.id]: img }))}
                          alt={`thumb${idx + 1}`}
                        />
                      )
                    )}
                  </div>
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
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
