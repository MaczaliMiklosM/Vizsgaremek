import React from 'react';
import Header from '../header/Header';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import './About.css';

const About = () => {
  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="about-container">
        <h1>Rólunk</h1>

        {/* Company Introduction */}
        <section className="about-section">
          <h2>📖 Kik vagyunk?</h2>
          <p>
            A **YeCipo** egy prémium sneaker és divatáru webáruház, amely a legjobb minőségű cipőket és kiegészítőket kínálja a divat szerelmeseinek. 
            Célunk, hogy ügyfeleink számára egyedi és exkluzív darabokat biztosítsunk, a legújabb trendek figyelembevételével.
          </p>
        </section>

        {/* History */}
        <section className="about-section">
          <h2>🏛 Történetünk</h2>
          <p>
            A YeCipo 2015-ben alakult egy kis budapesti garázsban, szenvedélyes sneaker-gyűjtők által. Az évek során kinőttük magunkat egy
            vezető online piactérré, amely világszerte szállít ritka és ikonikus cipőket.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="about-section">
          <h2>🎯 Küldetésünk</h2>
          <p>
            Célunk, hogy a prémium cipők szerelmeseinek egy megbízható platformot biztosítsunk, ahol autentikus termékeket vásárolhatnak és fedezhetnek fel.
            Hiszünk a közösségben és a minőségben.
          </p>
        </section>

        {/* Contact Information */}
        <section className="about-section">
          <h2>📞 Kapcsolat</h2>
          <p><strong>Email:</strong> support@yecipo.hu</p>
          <p><strong>Telefon:</strong> +36 1 234 5678</p>
          <p><strong>Cím:</strong> 1051 Budapest, Fashion Street 10.</p>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default About;
