import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockListings } from '../mockData/listings';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
      {/* <img src="../imgs/main_image.png" alt="hero" /> */}
        <h1>Find Your Perfect Home</h1>
        <p>Discover thousands of properties that match your preferences</p>
      </section>

      <section className="listings-section">
        <h2>Featured Listings</h2>
        <div className="listings-grid">
          {mockListings.map((listing) => (
            <motion.div
              key={listing.id}
              className="listing-card"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/listing/${listing.id}`} className="listing-link">
                <img src={listing.images[0]} alt={listing.title} />
                <div className="listing-content">
                  <h3>{listing.title}</h3>
                  <p className="listing-location">{listing.location}</p>
                  <p className="listing-description">{listing.description}</p>
                  <div className="listing-details">
                    <span>🛏 {listing.bedrooms} beds</span>
                    <span>🚿 {listing.bathrooms} baths</span>
                    <span>📏 {listing.area}m²</span>
                  </div>
                  <p className="listing-price">{listing.price}₸/month</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🏠</span>
            <h3>Wide Selection</h3>
            <p>Thousands of verified listings across the country</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <h3>Secure Platform</h3>
            <p>Safe and secure transactions with verified users</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h3>24/7 Support</h3>
            <p>Our dedicated team is always here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 