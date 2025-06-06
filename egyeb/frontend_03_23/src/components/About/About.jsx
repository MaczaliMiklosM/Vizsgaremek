import React from 'react';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Info as InfoIcon, OtherHouses as OtherHousesIcon, 
         Phone as PhoneIcon, TrackChanges as TrackChangesIcon } from '@mui/icons-material';
import './About.css';

const About = () => {
  return (
    <div className="container">
      <Header />
      <Navbar />
      <div className="about-container">
        <h1>About Us</h1>

        {/* Company Introduction */}
        <section className="about-section">
          <h2><InfoIcon /> Who Are We?</h2>
          <p>
            <strong>LuxCollect</strong> is a premium online marketplace dedicated to exclusive, limited-edition, and collectible luxury products.
            Our goal is to provide our customers with unique and high-value items while ensuring a secure and transparent trading experience.
          </p>
        </section>

        {/* History */}
        <section className="about-section">
          <h2><OtherHousesIcon /> Our Story</h2>
          <p>
            Although LuxCollect is currently a fictional company, this project brings it to life! We are designing and developing the company's online presence
            along with its backend database, creating a marketplace where collectors and investors can acquire rare luxury items.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="about-section">
          <h2><TrackChangesIcon /> Our Mission</h2>
          <p>
            Our mission is to provide collectors and investors with a safe, reliable platform where they can buy, sell, and bid on authentic luxury products.
            We are committed to authenticity verification and creating a premium experience for our users.
          </p>
        </section>

        {/* Contact Information */}
        <section className="about-section">
          <h2><PhoneIcon /> Contact</h2>
          <p><strong>Email:</strong> support@luxcollect.com</p>
          <p><strong>Phone:</strong> +36 1 234 5678</p>
          <p><strong>Address:</strong> 1051 Budapest, Luxury Avenue 10.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
