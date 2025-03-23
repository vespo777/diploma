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
  const [allUsers, setAllUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '0', max: '1000000' });
  const [hasMore, setHasMore] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [ageRange, setAgeRange] = useState({ min: '0', max: '100' });
  const [genderFilter, setGenderFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const [smokingFilter, setSmokingFilter] = useState(null);
  const [drinkingFilter, setDrinkingFilter] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/recommended-users?userId=${user.userId}`, {
          headers: { 'Authorization': `${localStorage.getItem('token')}` }
        });
        const data = await response.json();

        const uniqueUsers = Array.from(new Map(data.map(u => [u.userId, u])).values());

        setAllUsers(uniqueUsers);  // Загружаем всех
        setVisibleUsers(uniqueUsers.slice(0, PAGE_SIZE));
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

  const filteredUsers = visibleUsers.filter(user => {
    const fullName = `${user.personalInfo?.name ?? ''} ${user.personalInfo?.surname ?? ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const userPriceMin = user.roommateSearch?.budgetMin ?? 0;
    const userPriceMax = user.roommateSearch?.budgetMax ?? Infinity;
    const matchesPrice = userPriceMin >= Number(priceRange.min) && userPriceMax <= Number(priceRange.max);

    const matchesCity = user.locationDetails?.regionFrom?.toLowerCase().includes(cityFilter.toLowerCase() ?? '');

    const birthYear = user.personalInfo?.birthDate ? new Date(user.personalInfo.birthDate).getFullYear() : null;
    const userAge = birthYear ? new Date().getFullYear() - birthYear : null;
    const matchesAge = userAge ? userAge >= Number(ageRange.min) && userAge <= Number(ageRange.max) : true;

    const matchesGender = genderFilter ? user.personalInfo?.gender === genderFilter : true;

    const matchesProfession = user.socialDetails?.profession?.toLowerCase().includes(professionFilter.toLowerCase() ?? '');

    const matchesSmoking = smokingFilter === null ? true : user.socialDetails?.smoking === smokingFilter;
    const matchesDrinking = drinkingFilter === null ? true : user.socialDetails?.drinking === drinkingFilter;

    const matchesUniversity = universityFilter ? user.socialDetails?.universityName?.toLowerCase().includes(universityFilter.toLowerCase()) : true;

    const matchesInterests = interestFilter
        ? user.socialDetails?.interests?.some(interest => interest.toLowerCase().includes(interestFilter.toLowerCase()))
        : true;

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
              setPriceRange({ min: '0', max: '1000000' });
              setCityFilter('');
              setAgeRange({ min: '18', max: '99' });
              setGenderFilter('');
              setProfessionFilter('');
              setSmokingFilter(null);
              setDrinkingFilter(null);
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
