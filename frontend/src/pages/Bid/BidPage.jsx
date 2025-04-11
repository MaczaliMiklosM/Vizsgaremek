import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RequireAuth from '../../components/Auth/RequireAuth';
import "./BidPage.css";

const dummyProductData = {
  1: {
    name: "Chanel Bag",
    image: "/Images/product_images/taska8_1.jpeg",
    startingPrice: 645,
  },
  2: {
    name: "Dior Heels",
    image: "/Images/product_images/cipok2_1.jpeg",
    startingPrice: 550,
  },
  3: {
    name: "Omega Watch",
    image: "/Images/product_images/orak1_1.jpeg",
    startingPrice: 800,
  },
};

function BidPage() {
  const { id } = useParams();
  const product = dummyProductData[id];

  const [bids, setBids] = useState([]);
  const [bidInput, setBidInput] = useState("");
  const [message, setMessage] = useState("");

  if (!product) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Product not found.</div>;
  }

  const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : product.startingPrice;

  const handleBidSubmit = () => {
    const newBid = parseFloat(bidInput);

    if (isNaN(newBid) || newBid <= highestBid) {
      setMessage(` Bid must be higher than $${highestBid}`);
      return;
    }

    const bidEntry = {
      amount: newBid,
      time: new Date().toLocaleString(),
    };

    setBids([bidEntry, ...bids]);
    setMessage(` Your bid of $${newBid} has been placed!`);
    setBidInput("");
  };

  return (
    <RequireAuth>
       <div>
      <Header />
      <Navbar />

      <div className="bid-container">
        <div className="bid-card">
          <h2>{product.name}</h2>
          <img src={product.image} alt={product.name} className="bid-image" />
          <p><strong>Starting Price:</strong> ${product.startingPrice}</p>
          <p><strong>Highest Bid:</strong> ${highestBid}</p>

          <input
            type="number"
            placeholder={`Enter more than $${highestBid}`}
            value={bidInput}
            onChange={(e) => setBidInput(e.target.value)}
            className="bid-input"
          />
          <button className="bid-button" onClick={handleBidSubmit}>Place Bid</button>
          {message && <p className="bid-message">{message}</p>}

          <div className="bid-history">
            <h4>Bid History</h4>
            {bids.length === 0 ? (
              <p>No bids yet.</p>
            ) : (
              <ul>
                {bids.map((b, i) => (
                  <li key={i}>💰 ${b.amount} <span className="time">({b.time})</span></li>
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
