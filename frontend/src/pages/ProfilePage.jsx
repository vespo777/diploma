import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../imgs/default-avatar.jpeg";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
      livingPreference: '',
      plans: '',
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Полученные данные:', data);
          
          setUserData(prevData => ({
            firstName: data.firstName || prevData.firstName,
            lastName: data.lastName || prevData.lastName,
            email: data.email || prevData.email,
            phoneNumber: data.phoneNumber || prevData.phoneNumber,
            birthDate: data.birthDate || prevData.birthDate,
            sex: data.sex || prevData.sex,
            bio: data.bio || prevData.bio,
            preferences: {
              smoking: data.preferences?.smoking || false,
              drinking: data.preferences?.drinking || false,
              pets: data.preferences?.pets || false,
              sports: data.preferences?.sports || false,
              religion: data.preferences?.religion || false,
              wakeUpTime: data.preferences?.wakeUpTime || '',
              sleepTime: data.preferences?.sleepTime || '',
              studyPlace: data.preferences?.studyPlace || '',
              workPlace: data.preferences?.workPlace || '',
              profession: data.preferences?.profession || '',
              cityFrom: data.preferences?.cityFrom || '',
              currentCity: data.preferences?.currentCity || '',
              livingPreference: data.preferences?.livingPreference || '',
              plans: data.preferences?.plans || '',
            }
          }));
          
          if (data.avatarUrl) {
            setPreviewUrl(data.avatarUrl);
          }
        } else {
          console.error('Ошибка получения данных:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      // Append basic user data
      Object.keys(userData).forEach(key => {
        if (key !== 'preferences') {
          formData.append(key, userData[key]);
        }
      });

      // Append preferences as JSON string
      formData.append('preferences', JSON.stringify(userData.preferences));

      const response = await fetch(`http://localhost:8080/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
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
              src={previewUrl || defaultAvatar} 
              alt="Profile" 
              className="avatar-image"
            />
            {isEditing && (
              <div className="avatar-overlay">
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  Change Photo
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <section className="info-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={userData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select
                  name="sex"
                  value={userData.sex}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2>Preferences</h2>
            <div className="preferences-grid">
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="smoking"
                    checked={userData.preferences.smoking}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Smoking
                </label>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="drinking"
                    checked={userData.preferences.drinking}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Drinking
                </label>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="pets"
                    checked={userData.preferences.pets}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Pets
                </label>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="sports"
                    checked={userData.preferences.sports}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Sports
                </label>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="religion"
                    checked={userData.preferences.religion}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Religion
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Wake Up Time</label>
                <input
                  type="time"
                  name="wakeUpTime"
                  value={userData.preferences.wakeUpTime}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Sleep Time</label>
                <input
                  type="time"
                  name="sleepTime"
                  value={userData.preferences.sleepTime}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Study Place</label>
                <input
                  type="text"
                  name="studyPlace"
                  value={userData.preferences.studyPlace}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Work Place</label>
                <input
                  type="text"
                  name="workPlace"
                  value={userData.preferences.workPlace}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profession</label>
              <input
                type="text"
                name="profession"
                value={userData.preferences.profession}
                onChange={handlePreferenceChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City From</label>
                <input
                  type="text"
                  name="cityFrom"
                  value={userData.preferences.cityFrom}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Current City</label>
                <input
                  type="text"
                  name="currentCity"
                  value={userData.preferences.currentCity}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Living Preference</label>
              <select
                name="livingPreference"
                value={userData.preferences.livingPreference}
                onChange={handlePreferenceChange}
                disabled={!isEditing}
              >
                <option value="">Select preference</option>
                <option value="DORMITORY">Dormitory</option>
                <option value="APARTMENT">Apartment</option>
              </select>
            </div>

            <div className="form-group">
              <label>Plans</label>
              <textarea
                name="plans"
                value={userData.preferences.plans}
                onChange={handlePreferenceChange}
                disabled={!isEditing}
                rows="4"
              />
            </div>
          </section>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="4"
            />
          </div>

          {isEditing && (
            <motion.button
              type="submit"
              className="save-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
