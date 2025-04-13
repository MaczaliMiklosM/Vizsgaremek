import React from 'react';
import './TermsPage.css';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

function TermsPage() {
  return (
    <div className="terms-page">
      <Header />
      <Navbar />
      <main className="terms-content">
        <h1>Terms & Conditions</h1>

        <section>
          <h2>1. Overview</h2>
          <p>Welcome to LuxCollect. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
        </section>

        <section>
          <h2>2. Your Obligations</h2>
          <p>Users must provide accurate and up-to-date information and agree to use our services in compliance with all applicable laws and regulations.</p>
        </section>

        <section>
          <h2>3. Listings & Product Authenticity</h2>
          <p>Only authentic luxury products may be listed. LuxCollect reserves the right to remove any listing that appears fraudulent or misleading.</p>
        </section>

        <section>
          <h2>4. Bidding & Purchasing</h2>
          <p>All bids are binding. By placing a bid, you agree to purchase the item at the bid price if you win. All transactions are considered final unless explicitly stated otherwise.</p>
        </section>

        <section>
          <h2>5. Account Suspension</h2>
          <p>We may suspend or terminate accounts involved in fraud, abuse, or violations of these terms without prior notice.</p>
        </section>

        <section>
          <h2>6. Disclaimer of Liability</h2>
          <p>LuxCollect shall not be liable for any losses or damages resulting from use of our platform. Products are sold “as-is” unless otherwise specified.</p>
        </section>

        <section>
          <h2>7. Contact Information</h2>
          <p>If you have any questions regarding these terms, please reach out to us:</p>
          <ul>
            <li>Email: support@luxcollect.com</li>
            <li>Phone: +36 1 234 5678</li>
            <li>Address: 4400 Nyíregyháza, Városmajor utca 4.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default TermsPage;
