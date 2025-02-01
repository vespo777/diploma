import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import defaultAvatar from "../imgs/default-avatar.jpeg";
import "../styles/ProfilePage.css";

const ProfileIDPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    sex: '',
    bio: '',
    preferences: {
      smoking: false,
      drinking: false,
      pets: false,
      sports: false,
      religion: false,
      wakeUpTime: '',
      sleepTime: '',
      studyPlace: '',
      workPlace: '',
      profession: '',
      cityFrom: '',
      currentCity: '',
      livingPreference: '', // общага/квартира
      plans: '',
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/profile/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, user, navigate]);

  if (!user) return null;
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>

      <motion.div 
        className="profile-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={userData.avatarUrl || defaultAvatar} 
              alt="Profile" 
              className="avatar-image"
            />
          </div>
        </div>

        <div className="profile-info">
          <section className="info-section">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{`${userData.firstName} ${userData.lastName}`}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{userData.phoneNumber || 'Not specified'}</p>
              </div>
              <div className="info-item">
                <label>Birth Date</label>
                <p>{new Date(userData.birthDate).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <p>{userData.sex === 'M' ? 'Male' : 'Female'}</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2>Preferences</h2>
            <div className="preferences-grid">
              <div className="preference-item">
                <label>Smoking</label>
                <p>{userData.preferences.smoking ? 'Yes' : 'No'}</p>
              </div>
              <div className="preference-item">
                <label>Drinking</label>
                <p>{userData.preferences.drinking ? 'Yes' : 'No'}</p>
              </div>
              <div className="preference-item">
                <label>Pets</label>
                <p>{userData.preferences.pets ? 'Yes' : 'No'}</p>
              </div>
              <div className="preference-item">
                <label>Sports</label>
                <p>{userData.preferences.sports ? 'Yes' : 'No'}</p>
              </div>
              <div className="preference-item">
                <label>Religion</label>
                <p>{userData.preferences.religion ? 'Yes' : 'No'}</p>
              </div>
              <div className="preference-item">
                <label>Wake Up Time</label>
                <p>{userData.preferences.wakeUpTime || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>Sleep Time</label>
                <p>{userData.preferences.sleepTime || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>Study Place</label>
                <p>{userData.preferences.studyPlace || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>Work Place</label>
                <p>{userData.preferences.workPlace || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>Profession</label>
                <p>{userData.preferences.profession || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>City From</label>
                <p>{userData.preferences.cityFrom || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>Current City</label>
                <p>{userData.preferences.currentCity || 'Not specified'}</p>
              </div>
              <div className="preference-item">
                <label>Living Preference</label>
                <p>{userData.preferences.livingPreference || 'Not specified'}</p>
              </div>
            </div>
          </section>

          {userData.bio && (
            <section className="info-section">
              <h2>Bio</h2>
              <p className="bio-text">{userData.bio}</p>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileIDPage;
