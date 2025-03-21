import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import notificationTrue from "../imgs/icons8-notification-48.png"
import notificationFalse from "../imgs/icons8-notification-48(1).png"
import home from "../imgs/icons8-home.svg";
import search from "../imgs/icons8-search.svg";
import logo from "../imgs/logo.jpg";
import avatarPlaceholder from "../imgs/default-avatar.jpeg";
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8080";


  useEffect(() => {
    if (!token || !user?.userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/connections/received?userId=${user.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) throw new Error("Ошибка загрузки уведомлений");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Ошибка при загрузке уведомлений:", error);
      }
    };

    fetchNotifications();
  }, [token, user?.userId]);

  const handleAnswer = async (senderId, answer) => {
    if (!user?.userId) return;

    try {
      const response = await fetch(`${API_URL}/connections/answer?senderId=${senderId}&receiverId=${user.userId}&answer=${answer}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Ошибка при обработке запроса");

      // Фильтруем отклоненные или принятые запросы
      setNotifications((prev) => prev.filter((notif) => notif.senderId !== senderId));
    } catch (error) {
      console.error("Ошибка обработки запроса:", error);
    }
  };


  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowNotification(false);
  };

  const isActive = (path) => location.pathname === path;
  const hasNewNotifications = notifications.length > 0;

  return (
      <motion.nav
          className="navbar"
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="nav-brand">
          <img src={logo} alt="logo" />
          <Link to="/" className="brand-link">Roommates</Link>
        </div>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <img src={home} alt="home icon" />
          </Link>
          <div className="search-container">
            <button
                className={`nav-link ${showSearch ? 'active' : 'search-button'}`}
                onClick={() => setShowSearch(!showSearch)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <img src={search} alt="search icon" />
            </button>

            <AnimatePresence>
              {showSearch && (
                  <motion.div
                      className="search-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                  >
                    <Link to="/roommates" className="search-option">Roommates</Link>
                    <Link to="/apartments" className="search-option">Apartments</Link>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>



          <Link to="/teams" className={`nav-link ${isActive('/teams') ? 'active' : ''}`}>Teams</Link>
          <Link to="/faq" className={`nav-link ${isActive('/faq') ? 'active' : ''}`}>FAQ</Link>
          {isActive('/apartments') && (
              <Link to="/add-listing" className="nav-link">Add Apartment</Link>
          )}
        </div>

        <div className="nav-auth">

          <button
              className={`nav-link ${showNotification ? 'active' : 'search-button'}`}
              onClick={() => setShowNotification(!showNotification)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <img src={hasNewNotifications ? notificationTrue : notificationFalse} alt="notification icon" className="notification-icon" />
          </button>

          {user ? (
              <>
                <AnimatePresence>
                  {showNotification && (
                      <motion.div className="notification-dropdown">
                        <h4>Запросы на коннект</h4>
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div key={index} className="notification-item">
                                  <p><strong>{notif.personalInfo.name} {notif.personalInfo.surname}</strong> хочет добавить вас в друзья</p>
                                  <div className="notification-actions">
                                    <button className="accept-btn" onClick={() => handleAnswer(notif.userId, true)}>Принять</button>
                                    <button className="decline-btn" onClick={() => handleAnswer(notif.userId, false)}>Отклонить</button>
                                  </div>
                                </div>
                            ))
                        ) : (
                            <p className="notification-empty">Нет новых запросов</p>
                        )}
                      </motion.div>
                  )}
                </AnimatePresence>

                <div className="user-dropdown">
                  <button className="avatar-button" onClick={() => setShowDropdown(!showDropdown)}>
                    <img src={user.avatar || avatarPlaceholder} alt="User Avatar" className="avatar" />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                        <motion.div className="dropdown-menu">
                          <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                            {user.email}
                          </Link>
                          <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
          ) : (
              <div className="auth-buttons">
                <Link to="/login" className={`nav-link login ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                <Link to="/register" className={`nav-link register`}>Register</Link>
              </div>
          )}

        </div>

      </motion.nav>
  );
};

export default Navbar;
