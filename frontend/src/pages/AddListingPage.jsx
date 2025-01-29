import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addListing } from '../services/listingService';
import '../styles/LoginRegister.css';
import '../styles/addListingPage.css';

const AddListingPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newListing = { title, description, price };
      await addListing(newListing);
      navigate('/');  // Redirect to home page after successful submission
    } catch (err) {
      setError('Failed to add listing. Please try again.');
    }
  };

  if (!user) {
    return null; // Return null since useEffect will redirect
  }

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Add New Listing</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <motion.div 
              className="input-icon"
              whileHover={{ scale: 1.1 }}
            >
              📝
            </motion.div>
          </div>

          <div className="input-group">
            <textarea
              className="auth-input textarea"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <motion.div 
              className="input-icon"
              whileHover={{ scale: 1.1 }}
            >
              📄
            </motion.div>
          </div>

          <div className="input-group">
            <input
              type="number"
              className="auth-input"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <motion.div 
              className="input-icon"
              whileHover={{ scale: 1.1 }}
            >
              💰
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="auth-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Listing
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddListingPage;