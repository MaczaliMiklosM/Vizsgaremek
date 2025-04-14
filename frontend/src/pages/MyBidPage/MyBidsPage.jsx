import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RequireAuth from "../../components/Auth/RequireAuth";
import axios from "axios";
import "./MyBidsPage.css";

function MyBidsPage() {
  const [bids, setBids] = useState([]);
  const [receivedBids, setReceivedBids] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchBids = async () => {
    try {
      const myBidsRes = await axios.get(`/api/bids/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBids(myBidsRes.data);

      const receivedRes = await axios.get(`/api/bids/received/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceivedBids(receivedRes.data);
    } catch (err) {
      setError("Failed to load bids.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleAccept = async (bidId) => {
    try {
      await axios.post(`/api/bids/accept/${bidId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchBids(); // 🔄 frissítsd újra az adatokat
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  const handleReject = async (bidId) => {
    try {
      await axios.post(`/api/bids/reject/${bidId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchBids(); // 🔄 frissítsd újra az adatokat
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const normalizeStatus = (status) => (status || "").toUpperCase();

  const filteredBids = bids.filter(bid => {
    const status = normalizeStatus(bid.status);
    return activeTab === "active" ? status === "PENDING" : status !== "PENDING";
  });

  return (
    <RequireAuth>
      <Header />
      <Navbar />

      <div className="mybids-container">
        <div className="tabs">
          <span
            className={activeTab === "active" ? "tab active" : "tab"}
            onClick={() => setActiveTab("active")}
          >
            Your Active Bids
          </span>
          <span
            className={activeTab === "history" ? "tab active" : "tab"}
            onClick={() => setActiveTab("history")}
          >
            Your Bid History
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="bid-cards-wrapper">
          {filteredBids.length === 0 ? (
            <p className="no-bids">No {activeTab} bids found.</p>
          ) : (
            filteredBids.map(bid => (
              <div className="bid-card-wrapper" key={bid.id}>
                <Link to={`/product-details/${bid.productId}`} className="bid-product-card">
                  <h3>Product #{bid.productId}</h3>
                  <p>Go to product</p>
                </Link>
                <div className="bid-info-card">
                  <p><strong>Your Bid:</strong> ${bid.amount}</p>
                  <p><strong>Status:</strong> {bid.status}</p>
                  <p><strong>Time:</strong> {new Date(bid.time).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="uploaded-products-section">
          <h2>Bids Received on Your Products</h2>
          <div className="uploaded-products-list">
            {receivedBids.length === 0 ? (
              <p>No bids received on your products yet.</p>
            ) : (
              receivedBids.map(bid => (
                <div className="bid-card-wrapper" key={bid.id}>
                  <Link to={`/product-details/${bid.productId}`} className="bid-product-card">
                    <h3>Product #{bid.productId}</h3>
                    <p>Bidder: User #{bid.userId}</p>
                  </Link>
                  <div className="bid-info-card">
                    <p><strong>Amount:</strong> ${bid.amount}</p>
                    <p><strong>Status:</strong> {bid.status}</p>
                    <p><strong>Time:</strong> {new Date(bid.time).toLocaleString()}</p>
                    {normalizeStatus(bid.status) === "PENDING" && (
                      <div className="bid-actions">
                        <button className="accept-btn" onClick={() => handleAccept(bid.id)}>Accept</button>
                        <button className="reject-btn" onClick={() => handleReject(bid.id)}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </RequireAuth>
  );
}

export default MyBidsPage;
