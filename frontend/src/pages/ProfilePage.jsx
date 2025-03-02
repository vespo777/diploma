import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import "../styles/ProfilePage.css"

const API_URL = 'http://localhost:8080';
const regions = [
  "Almaty Region",
  "Nur-Sultan Region",
  "Shymkent Region",
  "East-Kazakhstan Region",
  "West-Kazakhstan Region",
  "South-Kazakhstan Region",
  "North-Kazakhstan Region",
  "Karaganda Region",
  "Atyrau Region",
  "Aktobe Region",
  "Kostanay Region",
  "Pavlodar Region",
  "Mangystau Region",
  "Kyzylorda Region",
  "Akmola Region",
];

const ProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.userId) return;

     const responce = fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: { 'Authorization': `${localStorage.getItem('token')}` }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to load profile'))
        .then(data => setUserData(data))
        .catch(setError)
        .finally(() => setLoading(false));


  }, [user]);

  const handleChange = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/profile/${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      alert('Profile updated successfully');
    } catch (err) {
      alert(err.message);
    }
  };
  const formatTime = (time) => (time ? time + ":00" : "");

  const handleTimeChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      roommatePreferences: {
        ...prev.roommatePreferences,
        [key]: formatTime(value),
      },
    }));
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>No user data found</p>;

  return (
      <div className="profile-container">
        <h2>Edit Profile</h2>
        <form className="profile-content" onSubmit={handleSubmit}>
          <h3>Personal Info</h3>
          <input type="date" value={userData.personalInfo.birthDate ?? ""} onChange={(e) => handleChange('personalInfo', 'birthDate', e.target.value)} />
          <select value={userData.personalInfo.gender} onChange={(e) => handleChange('personalInfo.gender', e.target.value)}>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          <input type="text" placeholder="nationality" value={userData.personalInfo.nationality ?? ""} onChange={(e) => handleChange('personalInfo', 'nationality', e.target.value)} />
          <input type="text" placeholder="religion" value={userData.personalInfo.religion ?? ""} onChange={(e) => handleChange('personalInfo', 'religion', e.target.value)} />



          <h3>Social Details</h3>
          <input type="text" placeholder="School Name" value={userData.socialDetails.schoolName ?? ""} onChange={(e) => handleChange('socialDetails', 'schoolName', e.target.value)} />
          <input type="text" placeholder="University Name" value={userData.socialDetails.universityName ?? ""} onChange={(e) => handleChange('socialDetails', 'universityName', e.target.value)} />
          <input type="text" placeholder="University Speciality" value={userData.socialDetails.universitySpecialty ?? ""} onChange={(e) => handleChange('socialDetails', 'universitySpecialty', e.target.value)} />
          <input type="text" placeholder="Company" value={userData.socialDetails.company ?? ""} onChange={(e) => handleChange('socialDetails', 'company', e.target.value)} />
          <input type="text" placeholder="Position" value={userData.socialDetails.profession ?? ""} onChange={(e) => handleChange('socialDetails', 'profession', e.target.value)} />

          <h3>Roommate Search</h3>
          <input type="number" value={userData.roommateSearch.budgetMin ?? 15000} onChange={(e) => handleChange('roommateSearch', 'budgetMin', Number(e.target.value))} />
          <input type="number" value={userData.roommateSearch.budgetMax ?? 450000} onChange={(e) => handleChange('roommateSearch', 'budgetMax', Number(e.target.value))} />
          <label>Search Status</label>
          <select value={userData.roommateSearch.searchStatus} onChange={(e) => handleChange('roommateSearch.searchStatus', e.target.value)}>
            <option value="1">I am roommate and I don't have an apartment</option>
            <option value="2">I am roommate and I have an apartment</option>
            <option value="3">Not searching</option>
          </select>

          <h3>Roommate Preferences</h3>
          <label>Wake up time</label>
          <input
              type="time"
              value={userData.roommatePreferences.wakeTime}
              onChange={(e) => handleTimeChange("wakeUpTime", e.target.value)}
          />
          <label>Sleep Time</label>
          <input
              type="time"
              value={userData.roommatePreferences.sleepTime}
              onChange={(e) => handleTimeChange("sleepTime", e.target.value)}
          />
          <input type="text" placeholder="Pets" value={userData.roommatePreferences.pets ?? ""} onChange={(e) => handleChange('roommatePreferences', 'pets', e.target.value)} />

         <h3>LocationDetails</h3>
          <label>Current City:</label>

          <select value={userData.locationDetails.currentCity} onChange={(e) => handleChange('locationDetails', 'currentCity', e.target.value)}>
            <option value="Almaty">Almaty</option>
            <option value="Nur-Sultan">Nur-Sultan</option>
          </select>

          <label>Region From:</label>
          <select
              name="location_details.regionFrom"
              value={userData.locationDetails.regionFrom}
              onChange={(e) => handleChange('locationDetails', 'regionFrom',  e.target.value)}
          >
            <option value="">Select Region</option>
            {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
            ))}
          </select>

          <h3>Contacts</h3>
          <input type="text" placeholder="Phone number" value={userData.contacts.callNumber ?? ""} onChange={(e) => handleChange('contacts', 'callNumber', e.target.value)} />
          <input type="text" placeholder="Telegram nickname" value={userData.contacts.telegramNickname ?? ""} onChange={(e) => handleChange('contacts', 'telegramNickname', e.target.value)} />

          <button className="save-button" type="submit">Save</button>
        </form>
      </div>
  );
};

export default ProfilePage;
