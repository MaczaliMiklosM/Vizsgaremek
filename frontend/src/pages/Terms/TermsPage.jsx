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
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>LuxShop</strong>, the exclusive marketplace for luxury goods. By using our platform, you agree to these Terms and Conditions. Please read them carefully before engaging with our services.
          </p>
        </section>

        <section>
          <h2>2. User Responsibilities</h2>
          <p>
            As a registered member, you agree to provide accurate personal information and to use the platform lawfully and respectfully. Misuse of the site may result in suspension or permanent ban.
          </p>
        </section>

        <section>
          <h2>3. Product Listings & Authenticity</h2>
          <p>
            All items listed must be original, verified luxury products. LuxCollect reserves the right to remove any product deemed counterfeit, misleading, or inappropriate without notice.
          </p>
        </section>

        <section>
          <h2>4. Bidding & Purchase Policy</h2>
          <p>
            Bids placed are binding offers. If your bid is accepted, you are obligated to complete the purchase. Products can also be purchased directly at the listed price if no bids exist. All sales are final.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            LuxShop is not liable for any direct or indirect damages resulting from your use of the platform. All products are sold "as-is" unless stated otherwise by the seller.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            For questions or support, feel free to reach out to us:
          </p>
          <ul>
            <li>Email: <a href="mailto:support@luxshop.com">support@luxshop.com</a></li>
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
