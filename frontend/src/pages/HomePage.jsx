import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const storedValue1 = localStorage.getItem('confirmCode');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const storedValue2 = user ? user.userId : null

  useEffect(() => {
      if (Number(storedValue1) === storedValue2) {
        setTimeout(() => {
          alert("You need to fill Anceta!");
          navigate("/anceta-page");
        }, 3000);
      }
  }, [storedValue2, storedValue1, navigate]);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Connect with your dream-roommates</h1>
        <p>We solve problems with finding a roommate</p>
      </section>

      {/*<section className="listings-section">*/}
      {/*  <h2>Featured Listings</h2>*/}
      {/*  <div className="listings-grid">*/}
      {/*    {mockListings.map((listing) => (*/}
      {/*      <motion.div*/}
      {/*        key={listing.id}*/}
      {/*        className="listing-card"*/}
      {/*        whileHover={{ scale: 1.03 }}*/}
      {/*        transition={{ duration: 0.2 }}*/}
      {/*      >*/}
      {/*        <Link to={`/listing/${listing.id}`} className="listing-link">*/}
      {/*          <img src={listing.images[0]} alt={listing.title} />*/}
      {/*          <div className="listing-content">*/}
      {/*            <h3>{listing.title}</h3>*/}
      {/*            <p className="listing-location">{listing.location}</p>*/}
      {/*            <p className="listing-description">{listing.description}</p>*/}
      {/*            <div className="listing-details">*/}
      {/*              <span>🛏 {listing.bedrooms} beds</span>*/}
      {/*              <span>🚿 {listing.bathrooms} baths</span>*/}
      {/*              <span>📏 {listing.area}m²</span>*/}
      {/*            </div>*/}
      {/*            <p className="listing-price">{listing.price}₸/month</p>*/}
      {/*          </div>*/}
      {/*        </Link>*/}
      {/*      </motion.div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</section>*/}

      <section className="listings-section">
        <h2>Problems like</h2>
        <div className="problems-wrapper">
          <ul>
            <li>no platforms for active cohabitants in need</li>
              <li>different daily routines</li>
              <li>late payment</li>
            <li>communication problems</li>
            <li> noise</li>
            <li>cleanliness</li>
            <li>different cultures</li>
          </ul>
        </div>
      </section>
      <section className="about-section">
        <h2>Will be resolved in this way:</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Personal information Anketa</h3>
          </div>
          <div className="feature">
            <h3>identify personality type with  ML algos</h3>
          </div>
          <div className="feature">
            <h3>Find and create teams</h3>
          </div>
          <div className="feature">
            <h3>Find roommate</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
