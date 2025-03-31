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
        alert("You need to fill out the questionnaire!");
        navigate("/anceta-page");
      }, 3000);
    }
  }, [storedValue2, storedValue1, navigate]);

  return (
      <div className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Connect With Your Perfect Roommate</h1>
            <p>We solve all your roommate matching problems</p>
            <button className="cta-button">Get Started</button>
          </div>
        </section>

        <section className="problems-section">
          <div className="section-container">
            <h2>Common Roommate Problems We Solve</h2>
            <div className="problems-grid">
              <div className="problem-card">
                <div className="problem-icon">🕒</div>
                <h3>Different Daily Routines</h3>
                <p>Find roommates with compatible schedules</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">💸</div>
                <h3>Late Payments</h3>
                <p>Match with financially responsible roommates</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🗣️</div>
                <h3>Communication Issues</h3>
                <p>Connect with people who share your communication style</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🧹</div>
                <h3>Cleanliness</h3>
                <p>Find roommates with similar cleanliness standards</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🌍</div>
                <h3>Cultural Differences</h3>
                <p>Match with culturally compatible roommates</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🔊</div>
                <h3>Noise Levels</h3>
                <p>Find roommates with similar noise preferences</p>
              </div>
            </div>
          </div>
        </section>

        <section className="solutions-section">
          <div className="section-container">
            <h2>How We Solve These Problems</h2>
            <div className="solutions-grid">
              <div className="solution-card">
                <div className="solution-number">1</div>
                <h3>Detailed Questionnaire</h3>
                <p>Our comprehensive form captures your living preferences and habits</p>
              </div>
              <div className="solution-card">
                <div className="solution-number">2</div>
                <h3>Smart Matching Algorithm</h3>
                <p>ML-powered compatibility scoring for ideal matches</p>
              </div>
              <div className="solution-card">
                <div className="solution-number">3</div>
                <h3>Team Formation</h3>
                <p>Create or join groups of compatible roommates</p>
              </div>
              <div className="solution-card">
                <div className="solution-number">4</div>
                <h3>Verified Profiles</h3>
                <p>All users go through our verification process</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonial-section">
          <div className="section-container">
            <h2>What Our Users Say</h2>
            <div className="testimonial-card">
              <p>"I found my perfect roommate in just 2 days! We've been living together for 6 months with zero issues."</p>
              <div className="testimonial-author">- Sarah, 24</div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default HomePage;
