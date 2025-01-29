import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import logo from "../imgs/logo.jpg";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="nav-brand">
        <img src={logo} alt="logo" />
        <Link to="/" className="brand-link">
          HomeSwap
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/add-listing" className="nav-link">
          Add Listing
        </Link>
        {user && (
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        )}
      </div>

      <div className="nav-auth">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
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
            <Link to="/login" className="nav-link login">
              Login
            </Link>
            <Link to="/register" className="nav-link register">
              Register
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;