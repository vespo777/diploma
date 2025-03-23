import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import defaultAvatar from '../imgs/default-avatar.jpeg';
import '../styles/RoommatesPage.css';

const PAGE_SIZE = 20;

const RoommatesPage = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]); // Все пользователи
  const [visibleUsers, setVisibleUsers] = useState([]); // Часть пользователей для показа
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '0', max: '1000000' });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/recommended-users?userId=${user.userId}`, {
          headers: { 'Authorization': `${localStorage.getItem('token')}` }
        });
        const data = await response.json();

        // Убираем дубликаты
        const uniqueUsers = Array.from(new Map(data.map(u => [u.userId, u])).values());

        setAllUsers(uniqueUsers);  // Загружаем всех
        setVisibleUsers(uniqueUsers.slice(0, PAGE_SIZE)); // Показываем первую партию
        setHasMore(uniqueUsers.length > PAGE_SIZE); // Если пользователей больше PAGE_SIZE, показываем кнопку

      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Функция для подгрузки пользователей
  const loadMoreUsers = () => {
    const newUsers = allUsers.slice(0, visibleUsers.length + PAGE_SIZE);

    setVisibleUsers(newUsers);
    setHasMore(newUsers.length < allUsers.length); // Если загрузили всех, убираем кнопку
  };

  // Фильтрация пользователей
  const filteredUsers = visibleUsers.filter(user => {
    const fullName = `${user.personalInfo.name} ${user.personalInfo.surname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const userPrice = user.roommateSearch?.budgetMin || 0;
    const matchesPrice = userPrice >= Number(priceRange.min) && userPrice <= Number(priceRange.max);
    return matchesSearch && matchesPrice;
  });

  if (!user) return <Navigate to="/login" />;
  if (loading && allUsers.length === 0) return <div className="loading">Loading...</div>;

  return (
      <div className="roommates-page">
        <div className="filter-sidebar">
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <div className="input-group">
                <label>Min Price</label>
                <input type="number" name="min" value={priceRange.min} onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))} min="0" />
              </div>
              <div className="input-group">
                <label>Max Price</label>
                <input type="number" name="max" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))} min="0" />
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="search-bar">
            <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="users-container">
            <motion.div className="auth-box listing-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2>For You</h2>
              {filteredUsers.map((user, index) => (
                  <div key={user.id || index} className="roommate-card">
                    <div className="roommate-avatar">
                      <img src={user.avatarUrl || defaultAvatar} alt={`${user.personalInfo.name}'s avatar`} />
                    </div>
                    <div className="roommate-info">
                      <h3>{user.personalInfo.name} {user.personalInfo.surname}</h3>
                      <p className="price-info">Minimal Budget: {user.roommateSearch?.budgetMin} T</p>
                    </div>
                    <Link to={`/profile/${user.userId}`}>More</Link>
                  </div>
              ))}
            </motion.div>

            {hasMore && (
                <button className="load-more-btn" onClick={loadMoreUsers}>
                  Additional Users
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default RoommatesPage;
