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
        <h1>Terms and Conditions</h1>
        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to LuxCollect. By accessing or using our services, you agree to be bound by these Terms and Conditions.</p>
        </section>

        <section>
          <h2>2. User Responsibilities</h2>
          <p>All users must provide accurate information and agree to comply with all applicable laws and regulations while using our platform.</p>
        </section>

        <section>
          <h2>3. Products and Listings</h2>
          <p>All listings must be for authentic and verifiable luxury products. LuxCollect reserves the right to remove any listing that violates this policy.</p>
        </section>

        <section>
          <h2>4. Bidding and Transactions</h2>
          <p>Bidding is binding. By placing a bid, you agree to pay the stated amount if you win. All sales are final unless otherwise noted.</p>
        </section>

        <section>
          <h2>5. Account Termination</h2>
          <p>We reserve the right to suspend or terminate accounts for fraudulent activity, violations of these terms, or at our sole discretion.</p>
        </section>

        <section>
          <h2>6. Liability</h2>
          <p>LuxCollect is not liable for any damages resulting from use of our site. All items are sold as-is unless specified otherwise.</p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>If you have any questions or concerns regarding these terms, please contact us at:</p>
          <ul>
            <li>Email: support@luxcollect.com</li>
            <li>Phone: +36 1 234 5678</li>
            <li>Address: 4400, Nyíregyháza Városmajor u. 4.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default TermsPage;