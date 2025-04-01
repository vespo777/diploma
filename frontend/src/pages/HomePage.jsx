import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAttention, setShowAttention] = useState(false);
  const [showMlAlert, setShowMlAlert] = useState(false);
  const [showBasicAlert, setShowBasicAlert] = useState(false);

  const storedValue1 = localStorage.getItem('confirmCode');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const storedValue2 = user ? user.userId : null;

  useEffect(() => {
    const checkMLQuestions = async () => {
      if (!storedValue2) return;

      try {
        const response = await fetch(`http://localhost:8080/check-ml-questions?userId=${storedValue2}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          }
        });
        if (!response.ok) throw new Error('Failed to check ML questions status');

        const data = await response.json();

        if (!data) {
          setTimeout(() => {
            setShowMlAlert(true);
          }, 3000);
        } else {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (error) {
        console.error('Error checking ML questions:', error);
      }
    };

    if (Number(storedValue1) === storedValue2) {
      setTimeout(() => {
        setShowBasicAlert(true);
      }, 3000);
    } else {
      checkMLQuestions();
    }
  }, [storedValue2, storedValue1, navigate]);

  const handleMlSkip = () => {
    setShowMlAlert(false);
    setShowAttention(true);
  };

  const handleBasicSkip = () => {
    setShowBasicAlert(false);
    // You might want to set another attention state here if needed
  };

  return (
      <div className="home-container">
        {/* Success indicator for ML questions */}
        {showSuccess && (
            <div className="ml-success-indicator">
              ✓ ML Questions Completed - You'll get better matches!
            </div>
        )}

        {/* Attention message for skipped ML questions */}
        {showAttention && (
            <div className="attention-message">
              <span className="attention-icon">⚠️</span>
              <span>You need to complete the ML questionnaire for better matches!</span>
              <button
                  className="attention-button"
                  onClick={() => navigate("/ml-questions")}
              >
                Complete Now
              </button>
            </div>
        )}

        {/* ML Questionnaire Alert */}
        {showMlAlert && (
            <div className="custom-alert">
              <div className="alert-content">
                <h3>Questionnaire Required</h3>
                <p>You need to fill out the ML questionnaire! It will give you better roommate matches.</p>
                <div className="alert-buttons">
                  <button className="alert-primary" onClick={() => navigate("/ml-questions")}>
                    Complete Now
                  </button>
                  <button className="alert-secondary" onClick={handleMlSkip}>
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Basic Questionnaire Alert */}
        {showBasicAlert && (
            <div className="custom-alert">
              <div className="alert-content">
                <h3>Basic Information Required</h3>
                <p>You need to fill out the basic questionnaire to continue.</p>
                <div className="alert-buttons">
                  <button className="alert-primary" onClick={() => navigate("/anceta-page")}>
                    Complete Now
                  </button>
                  <button className="alert-secondary" onClick={handleBasicSkip}>
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
        )}

        <section className="hero-section">
          <div className="hero-content">
            <h1>Connect With Your Perfect Roommate</h1>
            <p>We solve all your roommate matching problems</p>
            <a className="cta-button" href={`/roommates`}>Get Started</a>
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
