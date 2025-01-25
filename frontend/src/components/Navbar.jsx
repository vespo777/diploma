import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Housing App</Link>
        <ul className="nav-links">
          <li><Link to="/">Listings</Link></li>
          <li><Link to="/add-listing">Add Listing</Link></li>
        </ul>
      </div>
    </nav>
  );
};