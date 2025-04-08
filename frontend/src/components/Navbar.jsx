import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import notificationTrue from "../imgs/icons8-notification-48.png"
import notificationFalse from "../imgs/icons8-notification-48(1).png"
import home from "../imgs/icons8-home.svg";
import roommatesIcon from "../imgs/roommates-icon.png";
import logo from "../imgs/logo.jpg";
import avatarPlaceholder from "../imgs/default-avatar.jpeg";
import apartmentIcon from "../imgs/apartments-icon.png"
import faqIcon from "../imgs/faq-icon.png"
import teamIcon from "../imgs/team-icon.png";
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const userData = JSON.parse(localStorage.getItem('userData'));
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
  const avatarPreview = userData?.profilePhotoPath;


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
          <div className="nav-link-container">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <img src={home} alt="home icon" />
            </Link>
            <span className="nav-link-label">Home</span>
          </div>

          <div className="nav-link-container">
            <Link to="/roommates" className={`nav-link ${isActive('/roommates') ? 'active' : ''}`}>
              <img src={roommatesIcon} alt="search icon" />
            </Link>
            <span className="nav-link-label">Roommates</span>
          </div>

          <div className="nav-link-container">
            <Link to="/apartments" className={`nav-link ${isActive('/apartments') ? 'active' : ''}`}>
              <img alt="apartment-icon" src={apartmentIcon} style={{ width: '24px', height: '24px'}} />
            </Link>
            <span className="nav-link-label">Apartments</span>
          </div>

          <div className="nav-link-container">
            <Link to="/teams" className={`nav-link ${isActive('/teams') ? 'active' : ''}`}>
              <img alt="Team-icon" src={teamIcon} />
            </Link>
            <span className="nav-link-label">Teams</span>
          </div>

          <div className="nav-link-container">
            <Link to="/faq" className={`nav-link ${isActive('/faq') ? 'active' : ''}`}>
              <img src={faqIcon} alt="faq-icon" />
            </Link>
            <span className="nav-link-label">FAQ</span>
          </div>

          {isActive('/apartments') && (
              <div className="nav-link-container">
                {/* <Link to="/add-listing" className="nav-link">+</Link>
                <span className="nav-link-label">Add Listing</span> */}
              </div>
          )}
        </div>

        <div className="nav-auth">

          {user && (
              <div className="notification-semi-container">
                <div className="notification-icon-container">
                  <button
                      className={`notification-button ${showNotification ? 'active' : ''}`}
                      onClick={() => setShowNotification(!showNotification)}
                  >
                    <img src={hasNewNotifications ? notificationTrue : notificationFalse} alt="notification icon" className="notification-icon" />
                  </button>
                  {hasNewNotifications && (
                      <span className="notification-badge"></span>
                  )}
                </div>
                <span className="nav-link-label">Notification</span>
              </div>
          )}

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
                                        {item.user?.personalInfo ? (
                                          <p>
                                            <strong>
                                              <Link to={`/profile/${item.user.userId}`}>
                                                {item.user.personalInfo.name} {item.user.personalInfo.surname}
                                              </Link>
                                            </strong> wants to join your team <strong>Your Team</strong>
                                          </p>
                                        ) : (
                                          <p>
                                            <strong>
                                              <Link to={`/profile/${item.user?.userId || '#'}`}>Someone</Link>
                                            </strong> wants to join your team <strong>Your Team</strong>
                                          </p>
                                        )}
                                        <div className="notification-actions">
                                          <button
                                              className="accept-btn"
                                              onClick={() => handleTeamRequestResponse(item.user.userId, item.team.id, "ACCEPTED")}
                                          >
                                            Accept
                                          </button>
                                          <button
                                              className="decline-btn"
                                              onClick={() => handleTeamRequestResponse(item.user.userId, item.team.id, "REJECTED")}
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
                    <img src={avatarPreview || avatarPlaceholder} alt="User Avatar" className="avatar" />
                  </button>
                  <span className="nav-link-label">Profile</span>


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
                <Link to="/login" className={`nav-link login`}>Login</Link>
                <Link to="/register" className={`nav-link register`}>Register</Link>
              </div>
          )}
        </div>

      </motion.nav>
  );
};

export default Navbar;
