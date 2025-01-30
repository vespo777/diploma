import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/LoginRegister.css";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setError("");
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div 
            className="auth-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            key="form"
          >
            <h2>Reset Password</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="auth-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Reset Link
              </motion.button>
            </form>
            <div className="auth-footer">
              Remember your password?{" "}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="auth-box confirmation-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key="confirmation"
          >
            <div className="confirmation-icon">✉️</div>
            <h2>Check Your Email</h2>
            <p className="confirmation-text">
              We've sent a password reset link to:
              <br />
              <strong>{email}</strong>
            </p>
            <p className="confirmation-subtext">
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </p>
            <motion.button
              className="auth-button secondary"
              onClick={() => setIsSubmitted(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Reset Password
            </motion.button>
            <div className="auth-footer">
              <Link to="/login" className="auth-link">
                Back to Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetPasswordPage; 