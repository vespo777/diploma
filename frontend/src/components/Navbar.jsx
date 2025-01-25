import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';


export const Navbar = () => {
  return (
    <nav style={{ background: '#007bff', color: '#fff', padding: '10px' }}>
      <a href="/" style={{ marginRight: '10px', color: '#fff', textDecoration: 'none' }}>Home</a>
      <a href="/add-listing" style={{ color: '#fff', textDecoration: 'none' }}>Add Listing</a>
    </nav>
  );
};