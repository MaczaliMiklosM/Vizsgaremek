import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RequireAuth from "../../components/Auth/RequireAuth";
import axios from "axios";
import "./BidPage.css";

function BidPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidInput, setBidInput] = useState("");
  const [message, setMessage] = useState("");
  const [hasActiveBid, setHasActiveBid] = useState(false);
  const [isOwnProduct, setIsOwnProduct] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [acceptedBid, setAcceptedBid] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`/api/products/getProductById/${id}`);
        const productData = productRes.data;
        setProduct(productData);
        setActiveImage(productData.imageData);

        if (user && productData.user?.id === user.id) {
          setIsOwnProduct(true);
        }

        if (productData.id) {
          const bidsRes = await axios.get(`/api/bids/product/${productData.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBids(bidsRes.data);

          const activeBid = bidsRes.data.find(
            bid => bid.userId === user?.id && bid.status === "PENDING"
          );
          setHasActiveBid(!!activeBid);

          const myAcceptedBid = bidsRes.data.find(
            bid => bid.userId === user?.id && bid.status === "ACCEPTED"
          );
          if (myAcceptedBid) {
            setAcceptedBid(myAcceptedBid);
          }
        }

        const profileRes = await axios.get("/api/management/adminuser/get-profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(profileRes.data.user);
        setShippingAddress(profileRes.data.user.address);

      } catch (err) {
        console.error("Failed to load bid or product:", err);
        setMessage("Failed to load data.");
      }
    };
    fetchData();
  }, [id]);

  const highestBid = bids.length > 0
    ? Math.max(...bids.map(b => b.amount))
    : product?.price / 2 || 0;

  const handleBidSubmit = async () => {
    if (!product || !product.id) {
      setMessage("Product is still loading. Please wait...");
      return;
    }

    const newBid = parseFloat(bidInput);
    if (isNaN(newBid) || newBid <= highestBid) {
      const warnMsg = `Bid must be higher than $${highestBid}`;
      setMessage(warnMsg);
      return;
    }

    if (!user) {
      setMessage("You must be logged in to place a bid.");
      return;
    }

    const payload = {
      productId: product.id,
      userId: user.id,
      amount: newBid
    };

    try {
      await axios.post("/api/bids/place", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const bidsRes = await axios.get(`/api/bids/product/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(bidsRes.data);

      const alreadyBid = bidsRes.data.some(
        (bid) => bid.userId === user.id && bid.status === "PENDING"
      );
      setHasActiveBid(alreadyBid);

      setMessage(`Your bid of $${newBid} has been placed!`);
      setBidInput("");

    } catch (error) {
      console.error("Error placing bid:", error);
      setMessage("Failed to place bid.");
    }
  };


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  if (!product) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading product...</div>;
  }

  return (
    <RequireAuth>
      <div>
        <Header />
        <Navbar />

        <div className="bid-container">
          <div className="bid-card">
            <h2>{product.name}</h2>

            <img
              src={`data:image/jpeg;base64,${activeImage}`}
              alt={product.name}
              className="bid-image"
            />

            <div className="bid-thumbnails">
              {[product.imageData, product.imageData2, product.imageData3].map((img, idx) => (
                img && <img
                  key={idx}
                  src={`data:image/jpeg;base64,${img}`}
                  className={`bid-thumb ${activeImage === img ? 'active' : ''}`}
                  alt={`thumb${idx + 1}`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>

            <p><strong>Starting Price:</strong> ${product.price}</p>
            <p><strong>Minimum Bid:</strong> ${product.price / 2}</p>
            <p><strong>Highest Bid:</strong> ${highestBid}</p>

            {isOwnProduct ? (
              <p className="bid-message">You cannot bid on your own product.</p>
            ) : acceptedBid ? (
              <>
                <p className="bid-message green">Your bid was accepted!</p>
                <p><strong>Shipping Address:</strong></p>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="bid-input"
                />

              </>
            ) : (
              <>
                {!isOwnProduct && !acceptedBid && userProfile && (
          
                    <p className="info-note">
                      Note: If your bid is accepted, the order will be placed automatically using your shipping address. You can change it in your profile.
                    </p>
                 
                )}
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  placeholder={`Enter more than $${highestBid}`}
                  className="bid-input"
                  disabled={hasActiveBid}
                />
                <button
                  className="bid-button"
                  onClick={handleBidSubmit}
                  disabled={hasActiveBid}
                >
                  Place Bid
                </button>
                {hasActiveBid && (
                  <p className="bid-message">You already have an active bid for this product.</p>
                )}
              </>
            )}

            {message && <p className="bid-message">{message}</p>}

            <div className="bid-history">
              <h4>Bid History</h4>
              {bids.length === 0 ? (
                <p>No bids yet.</p>
              ) : (
                <ul>
                  {bids.map((b, i) => (
                    <li key={i}>
                      ${b.amount} ({b.status})
                      <span className="time"> — {formatDate(b.time)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </RequireAuth>
  );
}

export default BidPage;
