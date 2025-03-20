import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

import defaultAvatar from '../imgs/default-avatar.jpeg';
import '../styles/RoommatesPage.css';

const RoommatesPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({
    min: '0',
    max: '1000000'
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users', {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const fullName = `${user.personalInfo.name} ${user.personalInfo.surname}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const userPrice = user.roommateSearch?.budgetMin || 0;
      const matchesPrice = userPrice >= Number(priceRange.min) &&
                          userPrice <= Number(priceRange.max);
      return matchesSearch && matchesPrice;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, priceRange, users]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="roommates-page">
      <div className="filter-sidebar">
        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-inputs">
            <div className="input-group">
              <label>Min Price</label>
              <input
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceChange}
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Max Price</label>
              <input
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceChange}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="roommates-grid">
          {filteredUsers.map((user, index) => (
            <div key={user.id || index} className="roommate-card">
              <div className="roommate-avatar">
                <img src={user.avatarUrl || defaultAvatar} alt={`${user.firstName}'s avatar`} />
              </div>
              <div className="roommate-info">
                <h3>{user.personalInfo.name} {user.personalInfo.surname}</h3>
                <p className="price-info">
                  Minimal Budget: {user.roommateSearch?.budgetMin} T
                </p>
              </div>
              <Link to={`/profile/${user.userId}`}>More</Link>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoommatesPage;
