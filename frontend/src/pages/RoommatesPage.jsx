import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useUserImageStore from './../store/userStore';

import defaultAvatar from '../imgs/default-avatar.jpeg';
import '../styles/RoommatesPage.css';

const PAGE_SIZE = 20;

const RoommatesPage = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '-100000000000', max: '100000000000' });
  const [hasMore, setHasMore] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [ageRange, setAgeRange] = useState({ min: '-100', max: '100' });
  const [genderFilter, setGenderFilter] = useState('Any');
  const [professionFilter, setProfessionFilter] = useState('');
  const [smokingFilter, setSmokingFilter] = useState('Any');
  const [drinkingFilter, setDrinkingFilter] = useState('Any');
  const [universityFilter, setUniversityFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');


  // const { images, setImage, clearImage } = useUserImageStore();
  // const handleImageChange = (userId, e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImage(userId, reader.result); // Store image by userId
  //   };
  //   reader.readAsDataURL(file);
  // };

  const matchingLevelsMap = useRef({});
  const hasFetched = useRef(false);


  const fetchMatchingLevels = async () => {
    if (!user?.userId || hasFetched.current) return;
    hasFetched.current = true

    try {
      const response = await fetch(`http://localhost:8080/get-matching-score?userId=${user.userId}`, {
        headers: { 'Authorization': `${localStorage.getItem('token')}` }
      });


      if (!response.ok) {
        throw new Error(`Failed to fetch matching levels: ${response.status}`);
      }

      const data = await response.json();

      console.log("\n\nDEBUG data: ", data, "\n\n");

      // Заполняем глобальную хешмапу
      const levelsMap = {};
      data.forEach(item => {
        if (item.user.userId && item.matchingScore) {
          levelsMap[item.user.userId] = item.matchingScore;
        }
      });


      matchingLevelsMap.current = levelsMap;

    } catch (error) {
      console.error("Error fetching matching levels:", error);
    }
  };

  // Функция для получения matching level по userId
  const getMatchingLevel = (userId) => {
    return matchingLevelsMap.current[userId];
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);

        // Сначала получаем matching levels
        await fetchMatchingLevels();
        // задержка чтобы предотвратить concurrency exception
        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await fetch(`http://localhost:8080/recommended-users?userId=${user.userId}`, {
          headers: { 'Authorization': `${localStorage.getItem('token')}` }
        });
        const data = await response.json();

        const uniqueUsers = Array.from(new Map(data.map(u => [u.userId, u])).values());

        setAllUsers(uniqueUsers);  // Загружаем всех
        setVisibleUsers(uniqueUsers.slice(0, PAGE_SIZE));
        setHasMore(uniqueUsers.length > PAGE_SIZE);

      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null; // Handle missing birth date

    const today = new Date();
    const birthDateObj = new Date(birthDate);

    // Calculate difference in years
    let age = today.getFullYear() - birthDateObj.getFullYear();

    // Adjust if birthday hasn't occurred yet this year
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const loadMoreUsers = () => {
    const newUsers = allUsers.slice(0, visibleUsers.length + PAGE_SIZE);

    setVisibleUsers(newUsers);
    setHasMore(newUsers.length < allUsers.length);
  };

  const filteredUsers = visibleUsers.filter(user => {
    // Search by name
    const fullName = `${user.personalInfo?.name ?? ''} ${user.personalInfo?.surname ?? ''}`.toLowerCase();
    const matchesSearch = !searchTerm || fullName.includes(searchTerm.toLowerCase());
  
  // Budget range
  const userPriceMin = user.roommateSearch?.budgetMin ?? (-1 * Infinity);
  const userPriceMax = user.roommateSearch?.budgetMax ?? Infinity;
  const matchesPrice = 
    (priceRange.min === '-100000000000' || priceRange.min === '' || userPriceMin >= Number(priceRange.min)) && 
    (priceRange.max === '100000000000' || priceRange.max === '' || userPriceMax <= Number(priceRange.max));

  
  // City filter
  const matchesCity = !cityFilter || 
    (user.locationDetails?.regionFrom && 
     user.locationDetails.regionFrom.toLowerCase().includes(cityFilter.toLowerCase()));
  
  // Age filter
  const birthDate = user.personalInfo?.birthDate;
  const userAge = birthDate ? calculateAge(birthDate) : null;
  const matchesAge = 
    !userAge || 
    ((ageRange.min === '-100' || ageRange.min === '' || userAge >= Number(ageRange.min)) && 
     (ageRange.max === '100' || ageRange.max === '' || userAge <= Number(ageRange.max)));
  
  // Gender filter
  const matchesGender = genderFilter === 'Any' || !genderFilter || 
    (user.personalInfo?.gender && user.personalInfo.gender === genderFilter);
  
  // Profession filter
  const matchesProfession = !professionFilter || 
    (user.socialDetails?.profession && 
     user.socialDetails.profession.toLowerCase().includes(professionFilter.toLowerCase()));

  // Smoking filter
  const matchesSmoking = smokingFilter === 'Any' || 
    (user.socialDetails?.smoking === (smokingFilter === 'true'));

  // Drinking filter
  const matchesDrinking = drinkingFilter === 'Any' || 
    (user.socialDetails?.drinking === (drinkingFilter === 'true'));
  
  // University filter
  const matchesUniversity = !universityFilter || 
    (user.socialDetails?.universityName && 
     user.socialDetails.universityName.toLowerCase().includes(universityFilter.toLowerCase()));

  // Interests filter
  const matchesInterests = !interestFilter || 
    (user.socialDetails?.interests && 
     Array.isArray(user.socialDetails.interests) &&
     user.socialDetails.interests.length > 0 &&
     user.socialDetails.interests.some(interest => 
       interest.toLowerCase().includes(interestFilter.toLowerCase())
     ));
  
    return (
      matchesSearch &&
      matchesPrice &&
      matchesCity &&
      matchesAge &&
      matchesGender &&
      matchesProfession &&
      matchesSmoking &&
      matchesDrinking &&
      matchesUniversity &&
      matchesInterests
    );
  });
  

  if (!user) return <Navigate to="/login" />;
  if (loading && allUsers.length === 0) return <div className="loading">Loading...</div>;

  return (
    <div className="roommates-page">
      <div className="filter-sidebar">
        <div className="filter-section">
          <h3>Filters</h3>

          {/* Поиск по имени */}
          <div className="input-group">
            <label>Search by Name</label>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {/* Бюджет */}
          <div className="price-inputs">
            <label>Budget Range</label>
            <div className="input-group">
              <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))} />
              <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))} />
            </div>
          </div>

          {/* Город */}
          <div className="input-group">
            <label>Region From</label>
            <input type="text" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
          </div>

          {/* Возраст */}
          <div className="price-inputs">
            <label>Age Range</label>
            <div className="input-group">
              <input type="number" placeholder="Min Age" value={ageRange.min} onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))} />
              <input type="number" placeholder="Max Age" value={ageRange.max} onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))} />
            </div>
          </div>

          {/* Пол */}
          <div className="input-group">
            <label>Gender</label>
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
              <option value="">Any</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          {/* Профессия */}
          <div className="input-group">
            <label>Profession</label>
            <input type="text" value={professionFilter} onChange={(e) => setProfessionFilter(e.target.value)} />
          </div>

          {/* Курение */}
          <div className="input-group">
            <label>Smoking</label>
            <select value={smokingFilter} onChange={(e) => setSmokingFilter(e.target.value === "true" ? true : e.target.value === "false" ? false : null)}>
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Алкоголь */}
          <div className="input-group">
            <label>Drinking</label>
            <select value={drinkingFilter} onChange={(e) => setDrinkingFilter(e.target.value === "true" ? true : e.target.value === "false" ? false : null)}>
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Университет */}
          <div className="input-group">
            <label>University</label>
            <input type="text" value={universityFilter} onChange={(e) => setUniversityFilter(e.target.value)} />
          </div>

          {/* Интересы */}
          <div className="input-group">
            <label>Interests</label>
            <input type="text" value={interestFilter} onChange={(e) => setInterestFilter(e.target.value)} placeholder="e.g., Football, Music" />
          </div>

          {/* Кнопка сброса */}
          <button className="reset-btn" onClick={() => {
            setSearchTerm('');
            setPriceRange({ min: '-100000000000', max: '100000000000' });
            setCityFilter('');
            setAgeRange({ min: '-100', max: '100' });
            setGenderFilter('Any');
            setProfessionFilter('');
            setSmokingFilter('Any');
            setDrinkingFilter('Any');
            setUniversityFilter('');
            setInterestFilter('');
          }}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="content-area">

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
                  <p className="price-info">Budget: {user.roommateSearch?.budgetMin}-{user.roommateSearch?.budgetMax} kzt</p>
                  <p className="price-info">Current City: {user.locationDetails?.currentCity}</p>
                  <p className="price-info">Age: {calculateAge(user.personalInfo?.birthDate) || 'Unknown'}</p>
                  <p className="price-info">Matching Score: {getMatchingLevel(user.userId)}</p>
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
