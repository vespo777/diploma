import React from 'react';
// import { Link } from 'react-router-dom';
import '../styles/navbar.css';


export const Navbar = () => {
  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    marginRight: '10px',
    transition: 'background-color 0.3s ease'
  };

  const registerStyle = {
    ...linkStyle,
    backgrounColor: "rgb(227, 191, 72)",
    marginRight: '0'
  };

  return (
    <nav style={{ 
      background: '#007bff', 
      color: '#fff', 
      padding: '10px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <a href="/" 
        style={linkStyle} 
        className="nav-link"
      >
        Home
      </a>
      <a href="/add-listing" 
        style={linkStyle}
        className="nav-link"
      >
        Add Listing
      </a>
      <a href="/profile" 
        style={linkStyle}
        className="nav-link"
      >
        Profile
      </a>
      <div style={{display: 'flex', marginLeft: 'auto'}}>
        <a href="/login" 
          style={linkStyle}
          className="nav-link"
        >
          Login
        </a>
        <a href="/register" 
          style={registerStyle}
          className="nav-link register"
        >
          Register
        </a>
      </div>
    </nav>
  );
};