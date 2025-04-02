import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { mockListings } from '../mockData/listings';
import '../styles/ApartmentsPage.css';

const ApartmentsPage = () => {
  const { user } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    // smoking: false,
    // drinking: false,
    minPrice: '',
    maxPrice: '',
    prefersDorm: false,
    prefersApartment: false,
    wakeUpTime: '',
    sleepTime: '',
    sports: '',
    religion: '',
    university: '',
    workPlace: '',
    school: '',
    cityFrom: '',
    currentCity: '',
    lifePlans: ''
  });

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch('http://localhost:8080/apartments', {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setApartments(data);
      } catch (error) {
        console.error('Error fetching apartments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const handleFilterChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredApartments = apartments.filter(apartment => {
    // Фильтрация по цене (если у вас есть поле price в модели)
    const price = apartment.price || 0;
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    
    // Фильтрация по количеству комнат
    const roomFilter = filters.roomQuantity 
      ? apartment.roomQuantity === parseInt(filters.roomQuantity)
      : true;
    
    // Фильтрация по размеру
    const size = apartment.sizeSquareMeter || 0;
    const minSize = filters.minSize ? parseInt(filters.minSize) : 0;
    const maxSize = filters.maxSize ? parseInt(filters.maxSize) : Infinity;
    
    return (
      price >= minPrice && 
      price <= maxPrice &&
      roomFilter &&
      size >= minSize && 
      size <= maxSize
    );
  });

  const filteredListings = mockListings.filter(listing => {
    const price = parseInt(listing.price);
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    
    return price >= minPrice && price <= maxPrice;
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  // if (loading) {
  //   return <div className="loading">Loading...</div>;
  // }

  // Получаем первое фото из мок-данных
  const mockPhoto = mockListings[0]?.images?.[0];

  return (
    <div className="apartments-page">
      <div className="filters-sidebar">
        <h2>Apartment Preferences</h2>

        <div className="filter-section">
          <h3>Price Range</h3>
          <label>
            Min Price (₸)
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
              min="0"
            />
          </label>
          <label>
            Max Price (₸)
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Any"
              min="0"
            />
          </label>
        </div>
        
        {/* <div className="filter-section">
          <h3>Lifestyle</h3>
          <label>
            <input
              type="checkbox"
              name="smoking"
              checked={filters.smoking}
              onChange={handleFilterChange}
            />
            Smoking
          </label>
          <label>
            <input
              type="checkbox"
              name="drinking"
              checked={filters.drinking}
              onChange={handleFilterChange}
            />
            Drinking
          </label>
        </div> */}

        <div className="filter-section">
          <h3>Living Preferences</h3>
          <label>
            <input
              type="checkbox"
              name="prefersDorm"
              checked={filters.prefersDorm}
              onChange={handleFilterChange}
            />
            Prefers Dorm
          </label>
          <label>
            <input
              type="checkbox"
              name="prefersApartment" 
              checked={filters.prefersApartment}
              onChange={handleFilterChange}
            />
            Prefers Apartment
          </label>
        </div>

        <div className="filter-section">
          <h3>Schedule</h3>
          <label>
            Wake Up Time
            <input
              type="time"
              name="wakeUpTime"
              value={filters.wakeUpTime}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Sleep Time
            <input
              type="time"
              name="sleepTime"
              value={filters.sleepTime}
              onChange={handleFilterChange}
            />
          </label>
        </div>

        <div className="filter-section">
          <h3>Background</h3>
          <label>
            University
            <input
              type="text"
              name="university"
              value={filters.university}
              onChange={handleFilterChange}
              placeholder="Enter university"
            />
          </label>
          <label>
            Work Place
            <input
              type="text"
              name="workPlace"
              value={filters.workPlace}
              onChange={handleFilterChange}
              placeholder="Enter workplace"
            />
          </label>
          <label>
            School
            <input
              type="text"
              name="school"
              value={filters.school}
              onChange={handleFilterChange}
              placeholder="Enter school"
            />
          </label>
        </div>

        <div className="filter-section">
          <h3>Location</h3>
          <label>
            City From
            <input
              type="text"
              name="cityFrom"
              value={filters.cityFrom}
              onChange={handleFilterChange}
              placeholder="Enter city of origin"
            />
          </label>
          <label>
            Current City
            <input
              type="text"
              name="currentCity"
              value={filters.currentCity}
              onChange={handleFilterChange}
              placeholder="Enter current city"
            />
          </label>
        </div>
      </div>

      <div className="apartments-content">
        <h1>Available Apartments</h1>
        <div className="listings-grid">
          {filteredApartments.map((apartment) => (
            <motion.div
              key={apartment.apartmentId}
              className="listing-card"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/listing/${apartment.apartmentId}`} className="listing-link">
                {apartment.photoPath && (
                  <img 
                    src={mockPhoto} 
                    alt={apartment.description || 'Apartment'} 
                  />
                )}
                <div className="listing-content">
                  <h3>
                    {apartment.roomQuantity ? `${apartment.roomQuantity}-room apartment` : 'Apartment'}
                  </h3>
                  <p className="listing-location">{apartment.location2Gis || 'Location not specified'}</p>
                  <p className="listing-description">
                    {apartment.description || 'No description provided'}
                  </p>
                  <div className="listing-details">
                    <span>🛏 {apartment.roomQuantity || '?'} rooms</span>
                    <span>📏 {apartment.sizeSquareMeter || '?'} m²</span>
                  </div>
                  {apartment.linkToKrishaKz && (
                    <a 
                      href={apartment.linkToKrishaKz} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="krisha-link"
                    >
                      View on krisha.kz
                      </a>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="apartments-content">
        <h1>Available Apartments</h1>
        <div className="listings-grid">
          {mockListings.map((apartment) => (
            <motion.div
              key={apartment.id}
              className="listing-card"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/listing/${apartment.id}`} className="listing-link">
                <img src={apartment.images[0]} 
                alt={apartment.title} />
                <div className="listing-content">
                  <h3>{apartment.title}</h3>
                  <p className="listing-location">{apartment.location}</p>
                  <p className="listing-description">{apartment.description}</p>
                  <div className="listing-details">
                    <span>🛏 {apartment.bedrooms} beds</span>
                    <span>🚿 {apartment.bathrooms} baths</span>
                    <span>📏 {apartment.area}m²</span>
                  </div>
                  <p className="listing-price">{apartment.price}₸/month</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ApartmentsPage; 