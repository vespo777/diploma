import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import notificationTrue from "../imgs/icons8-notification-48.png"
import notificationFalse from "../imgs/icons8-notification-48(1).png"
import home from "../imgs/icons8-home.svg";
import search from "../imgs/icons8-search.svg";
import logo from "../imgs/logo.jpg";
import avatarPlaceholder from "../imgs/default-avatar.jpeg";
import teamIcon from "../imgs/team-icon.png";
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [connections, setConnections] = useState([]);
  const [showConnections, setShowConnections] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8080";
  const wrapperRef = useRef(null);
  const [teamInvitations, setTeamInvitations] = useState([]);


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

    const fetchTeamInvitations = async () => {
      try {
        const response = await fetch(`${API_URL}/teams/received-invitations-and-requests?userId=${user.userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        });
        if (!response.ok) throw new Error("Ошибка загрузки приглашений в команду");
        const data = await response.json();
        setTeamInvitations(data);
      } catch (error) {
        console.error("Ошибка при загрузке приглашений в команду:", error);
      }
    };

    fetchNotifications();
    fetchTeamInvitations();
  }, [token, user?.userId]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowNotification(false);
        setShowConnections(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showNotification, showConnections]);

  const handleMyConnections = async (userId) => {
    if (!user?.userId) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/connections/my-connections?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });

      if (!response.ok) throw new Error("Ошибка загрузки соединений");
      const data = await response.json();
      const cleanedData = data.filter(item => typeof item === "object");
      setConnections(cleanedData);
    } catch(err) {
      console.error(err);
    }
  };

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

      setNotifications((prev) => prev.filter((notif) => notif.userId !== senderId));
    } catch (error) {
      console.error("Ошибка обработки запроса:", error);
    }
  };

  const handleTeamInvitationResponse = async (senderId, teamId, status) => {
    try {
      const response = await fetch(`${API_URL}/teams/answer-to-invite?senderId=${senderId}&receiverId=${user.userId}&status=${status}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed to process invitation");

      setTeamInvitations(prev => prev.filter(invite =>
          !(invite.user.userId === senderId && invite.team.id === teamId)
      ));
    } catch (error) {
      console.error("Error handling team invitation:", error);
    }
  };

  const handleTeamRequestResponse = async (senderId, teamId, status) => {
    try {
      const response = await fetch(`${API_URL}/teams/answer-to-request?senderId=${senderId}&receiverId=${user.userId}&status=${status}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed to process request");

      setTeamInvitations(prev => prev.filter(request =>
          !(request.user.userId === senderId && request.team.id === teamId)
      ));
    } catch (error) {
      console.error("Error handling team request:", error);
    }
  };



  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowNotification(false);
  };

  const isActive = (path) => location.pathname === path;
  const hasNewNotifications = notifications.length > 0 || teamInvitations.length > 0;

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



          <Link to="/teams" className={`nav-link ${isActive('/teams') ? 'active' : ''}`}><img alt="Team-icon" src={teamIcon} /></Link>
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
            <div className="notification-icon-container">
              <img src={hasNewNotifications ? notificationTrue : notificationFalse} alt="notification icon" className="notification-icon" />
              {hasNewNotifications && (
                  <span className="notification-badge"></span>
              )}
            </div>
          </button>

          {user ? (
              <div ref={wrapperRef}>
                <AnimatePresence>
                  {showNotification && (
                      <motion.div className="notification-dropdown">
                        <h4>Connection Requests</h4>
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div key={index} className="notification-item">
                                  <p><strong>{notif.personalInfo.name} {notif.personalInfo.surname}</strong> wants to connect with you</p>
                                  <div className="notification-actions">
                                    <button className="accept-btn" onClick={() => handleAnswer(notif.userId, true)}>Accept</button>
                                    <button className="decline-btn" onClick={() => handleAnswer(notif.userId, false)}>Decline</button>
                                    <Link to={`/profile/${notif.userId}`}>View Profile</Link>
                                  </div>
                                </div>
                            ))
                        ) : (
                            <p className="notification-empty">No new connection requests</p>
                        )}

                        <div className="notif-separator"></div>

                        <h4>Team Invitations & Requests</h4>
                        {teamInvitations.length > 0 ? (
                            teamInvitations.map((item, index) => (
                                <div key={index} className="notification-item">
                                  {item.type === "invite" ? (
                                      <>
                                        <p>You're invited to join team <strong><Link to={`/teams/${item.team.id}`}>{item.team.name}</Link></strong></p>
                                        <p>Invited by <i><Link to={`/profile/${item.user.userId}`}>{item.user.email}</Link></i></p>
                                        <div className="notification-actions">
                                          <button
                                              className="accept-btn"
                                              onClick={() => handleTeamInvitationResponse(item.user.userId, item.team.id, "ACCEPTED")}
                                          >
                                            Accept
                                          </button>
                                          <button
                                              className="decline-btn"
                                              onClick={() => handleTeamInvitationResponse(item.user.userId, item.team.id, "REJECTED")}
                                          >
                                            Decline
                                          </button>
                                        </div>
                                      </>
                                  ) : item.type === "request" ? (
                                      <>
                                        <p><strong><Link to={`/profile/${item.user}`}>Someone</Link></strong> wants to join your team Your Team</p>
                                        <div className="notification-actions">
                                          <button
                                              className="accept-btn"
                                              onClick={() => handleTeamRequestResponse(item.user, item.team.id, "ACCEPTED")}
                                          >
                                            Accept
                                          </button>
                                          <button
                                              className="decline-btn"
                                              onClick={() => handleTeamRequestResponse(item.user, item.team.id, "REJECTED")}
                                          >
                                            Decline
                                          </button>
                                        </div>
                                      </>
                                  ) : null}
                                </div>
                            ))
                        ) : (
                            <p className="notification-empty">No new team invitations or requests</p>
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
                          <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false) || setShowConnections(false)}>
                            {user.email}
                          </Link>
                          <Link
                              className="dropdown-item"
                              onClick={() => {
                                setShowConnections(!showConnections);
                                handleMyConnections(user.userId);
                              }}
                          >
                            My Connections
                          </Link>
                          <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showConnections && (
                        <motion.div className="connections-dropdown">
                          {connections.length > 0 ? (
                              connections.map((connect, index) => (
                                  <div key={index} className="notification-item">
                                    <p><strong>{connect.personalInfo.name} {connect.personalInfo.surname}</strong> <br/><i>{connect.socialDetails.profession}</i> at <strong>{connect.socialDetails.company}</strong></p>
                                    <div className="notification-actions">
                                      <Link to={`/profile/${connect.userId}`}>View Profile</Link>
                                    </div>
                                  </div>
                              ))
                          ) : (
                              <p className="notification-empty">Нет друзей</p>
                          )}

                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
