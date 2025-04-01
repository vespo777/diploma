import React from 'react';
import '../styles/HomePage.css';

const Help = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Help & Support</h1>
        <p>Find answers to common questions and get assistance</p>
      </section>

      <section className="problems-section">
        <h2>Frequently Asked Questions</h2>
        <div className="section-container">
            <div className="problem-card">
              <h3>How do I create an account?</h3>
              <p>Click the "Register" button in the top right corner and fill out the required information to create your account.</p>
            </div>
            <div className="problem-card">
              <h3>How do I post a listing?</h3>
              <p>After logging in, click on "Add an Announcement" in the navigation bar and fill out the listing details.</p>
            </div>
            <div className="problem-card">
              <h3>How do I search for roommates?</h3>
              <p>Use the search button in the navigation bar to access our roommate search features.</p>
            </div>
        </div>
      </section>

      <section className="solutions-section">
        <h2>Contact Support</h2>
        <div className="section-container">
          <div className="solution-card">
            <h3>Email Support</h3>
            <p>support@roommates.com</p>
          </div>
          <div className="solution-card">
            <h3>Phone Support</h3>
            <p>+7 999 999 99 99</p>
          </div>
          <div className="solution-card">
            <span className="feature-icon">💬</span>
            <h3>Live Chat</h3>
            <p>Available 24/7</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
