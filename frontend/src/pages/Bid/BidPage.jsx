import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RequireAuth from "../../components/Auth/RequireAuth";
import axios from "axios";
import "./BidPage.css";

function BidPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidInput, setBidInput] = useState("");
  const [message, setMessage] = useState("");
  const [hasActiveBid, setHasActiveBid] = useState(false);
  const [isOwnProduct, setIsOwnProduct] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productRes = await axios.get(`/api/products/getProductById/${id}`);
        setProduct(productRes.data);

        if (user && productRes.data.user.id === user.id) {
          setIsOwnProduct(true);
          return;
        }

        const bidsRes = await axios.get(`/api/bids/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBids(bidsRes.data);

        const alreadyBid = bidsRes.data.some(
          (bid) => bid.userId === user?.id && bid.status === "PENDING"
        );
        setHasActiveBid(alreadyBid);

      } catch (error) {
        console.error("❌ Error fetching product or bids:", error);
        setMessage("Failed to load product or bids.");
      }
    };

    fetchProductData();
  }, [id]);

  const highestBid = bids.length > 0
    ? Math.max(...bids.map(b => b.amount))
    : product?.price / 2 || 0;

  const handleBidSubmit = async () => {
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid) || newBid <= highestBid) {
      setMessage(`Bid must be higher than $${highestBid}`);
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const bidsRes = await axios.get(`/api/bids/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBids(bidsRes.data);

      const alreadyBid = bidsRes.data.some(
        (bid) => bid.userId === user.id && bid.status === "PENDING"
      );
      setHasActiveBid(alreadyBid);

      setMessage(`Your bid of $${newBid} has been placed!`);
      setBidInput("");

    } catch (error) {
      console.error("❌ Error placing bid:", error);
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
              src={`/Images/product_images/${product.imageUrl?.split(",")[0]}`}
              alt={product.name}
              className="bid-image"
            />
            <p><strong>Starting Price:</strong> ${product.price}</p>
            <p><strong>Minimum Bid:</strong> ${product.price / 2}</p>
            <p><strong>Highest Bid:</strong> ${highestBid}</p>

            {isOwnProduct ? (
              <p className="bid-message">You cannot bid on your own product.</p>
            ) : (
              <>
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
                      💰 ${b.amount} ({b.status})
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
