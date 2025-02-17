import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../imgs/default-avatar.jpeg";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    sex: '',
    preferences: {
      smoking: false,
      drinking: false,
      prefersDorm: false,
      sports: '',
      religion: '',
      wakeUpTime: '',
      sleepTime: '',
      university: '',
      workPlace: '',
      school: '',
      cityFrom: '',
      currentCity: '',
      prefersApartment: false,
      lifePlans: '',
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');
        const response = await fetch('http://localhost:8080/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          // Подробное логирование всех объектов
          console.log('personal information:', data.personal_info);
          console.log('locationDetails:', data.locationDetails);
          console.log('roommatePreferences:', data.roommatePreferences);

          // Сохраняем предыдущие значения preferences при обновлении
          setUserData(prevData => ({
            firstName: data.name || prevData.firstName,
            lastName: data.surname || prevData.lastName,
            email: data.email || prevData.email,
            birthDate: data.birthDate || prevData.birthDate,
            sex: data.sex || prevData.sex,
            preferences: {
              smoking: data.socialDetails?.smoking ?? prevData.preferences.smoking,
              drinking: data.socialDetails?.drinking ?? prevData.preferences.drinking,
              prefersDorm: data.roommatePreferences?.prefersDorm ?? prevData.preferences.prefersDorm,
              prefersApartment: data.roommatePreferences?.prefersApartment ?? prevData.preferences.prefersApartment,
              sports: data.socialDetails?.sports || prevData.preferences.sports,
              religion: data.socialDetails?.religion || prevData.preferences.religion,
              wakeUpTime: data.roommatePreferences?.wakeTime || prevData.preferences.wakeUpTime,
              sleepTime: data.roommatePreferences?.sleepTime || prevData.preferences.sleepTime,
              university: data.locationDetails?.university || prevData.preferences.university,
              workPlace: data.locationDetails?.workplace || prevData.preferences.workPlace,
              school: data.locationDetails?.school || prevData.preferences.school,
              cityFrom: data.locationDetails?.cityFrom || prevData.preferences.cityFrom,
              currentCity: data.locationDetails?.currentCity || prevData.preferences.currentCity,
              lifePlans: data.socialDetails?.lifePlans || prevData.preferences.lifePlans
            }
          }));

          setUserId(data.userId);
        } else {
          console.error('Failed to fetch user data:', response.status);
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
      console.log('Current userId state:', userId);
      if (!userId) {
        console.error('User ID is not available');
        alert('User ID is not available. Please try logging in again.');
        return;
      }

      const updateData = {
        name: userData.firstName,
        surname: userData.lastName,
        email: userData.email,
        sex: userData.sex,
        smoking: userData.preferences.smoking,
        drinking: userData.preferences.drinking,
        religion: userData.preferences.religion,
        sports: userData.preferences.sports,
        lifePlans: userData.preferences.lifePlans,
        cityFrom: userData.preferences.cityFrom,
        currentCity: userData.preferences.currentCity,
        school: userData.preferences.school,
        university: userData.preferences.university,
        workplace: userData.preferences.workPlace,
        prefersDorm: userData.preferences.prefersDorm,
        prefersApartment: userData.preferences.prefersApartment,
        wakeTime: userData.preferences.wakeUpTime,
        sleepTime: userData.preferences.sleepTime
      };

      console.log('User ID:', userId);
      console.log('Отправляемые данные:', updateData);

      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error updating profile:', errorData);
        alert('Failed to update profile: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
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
                    name="prefersDorm"
                    checked={userData.preferences.prefersDorm}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Prefers Dorm
                </label>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="prefersApartment"
                    checked={userData.preferences.prefersApartment}
                    onChange={handlePreferenceChange}
                    disabled={!isEditing}
                  />
                  Prefers Apartment
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
                  name="university"
                  value={userData.preferences.university}
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
              <div className="form-group">
                <label>Sports</label>
                <input
                  type="text"
                  name="sports"
                  value={userData.preferences.sports}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>School</label>
              <input
                type="text"
                name="school"
                value={userData.preferences.school}
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
              <div className="form-group">
                <label>Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={userData.preferences.religion}
                  onChange={handlePreferenceChange}
                  disabled={!isEditing}
                />
              </div>
            </div>


            <div className="form-group">
              <label>Life Plans</label>
              <textarea
                name="lifePlans"
                value={userData.preferences.lifePlans}
                onChange={handlePreferenceChange}
                disabled={!isEditing}
                rows="4"
              />
            </div>
          </section>

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
