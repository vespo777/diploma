import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../imgs/logo.jpg";
import '../styles/navbar.css';


const Navbar = () => {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="nav-brand">
        <img src={logo} alt="logo" />
        <Link to="/" className="brand-link">
          Roommates
        </Link>
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Home Page
        </Link>
        <button
          className={`nav-link ${showSearch ? 'active' : 'search-button'}`}
          onClick={() => setShowSearch(!showSearch)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Search
        </button>
        <Link
          to="/add-listing"
          className={`nav-link ${isActive('/add-listing') ? 'active' : ''}`}
        >
          Add an Announcement
        </Link>
          <Link
            to="/faq"
            className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
          >
            FAQ
          </Link>
      </div>

      <div className="nav-auth">
        {user ? (
          <>
            {/* <span className="user-email">{user.email}</span> */}
            <Link
            to="/profile"
            className={`user-email ${isActive('/profile') ? 'active' : ''}`}>
            {user.email}
          </Link>
            <motion.button
              className="logout-button"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link
              to="/login"
              className={`nav-link login ${isActive('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`nav-link register : ''}`}
            >
              Register
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="search-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#2D2D2D',
              padding: '20px',
              zIndex: 1000
            }}
          >
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSearch(false)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '5px 10px'
                }}
              >
                ×
              </button>
              <div className="search-links">
                <Link
                  to="/roommates"
                  className={`search-link ${isActive('/roommates') ? 'active' : ''}`}
                  onClick={() => setShowSearch(false)}
                >
                  <motion.div
                    className="search-card"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h3>Roommates</h3>
                    <p>Find your perfect roommate</p>
                  </motion.div>
                </Link>

                <Link
                  to="/apartments"
                  className={`search-link ${isActive('/apartments') ? 'active' : ''}`}
                  onClick={() => setShowSearch(false)}
                >
                  <motion.div
                    className="search-card"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h3>Apartments</h3>
                    <p>Find your perfect place</p>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
