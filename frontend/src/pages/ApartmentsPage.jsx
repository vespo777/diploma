import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApartmentCard from "../components/ApartmentCard";
import LoadingRabbit from '../components/pixi/Loading';
import '../styles/ApartmentsPage.css';
import '../components/ApartmentCard.css';

const ApartmentsPage = () => {
  const userData = JSON.parse(localStorage.getItem('userData')); // Теперь это объект
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ setResults] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: '',
    minRooms: '',
    maxRooms: '',
    minSize: '',
    maxSize: ''
  });
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const query = new URLSearchParams();
        if (searchParams.query) query.append('query', searchParams.query);
        if (searchParams.minRooms) query.append('minRooms', searchParams.minRooms);
        if (searchParams.maxRooms) query.append('maxRooms', searchParams.maxRooms);
        if (searchParams.minSize) query.append('minSize', searchParams.minSize);
        if (searchParams.maxSize) query.append('maxSize', searchParams.maxSize);

        // const response = await fetch(`${API_URL}/apartments/search?${query.toString()}`, {
        //   method: 'GET',
        //     headers: {
        //       Authorization: `${localStorage.getItem('token')}`
        //     }
        // });
        // if (!response.ok) throw new Error('Failed to fetch apartments');
        const response = await fetch(`${API_URL}/apartments`, {
          method: 'GET',
            headers: {
              Authorization: `${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        setApartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);


  const handleDeleteApartment = async (id) => {
    try {
      const response = await fetch(`${API_URL}/apartments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete apartment');

      setApartments(apartments.filter(apt => apt.apartmentId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await fetch(`/api/apartments/search?query=${encodeURIComponent(searchParams.query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };


  if (loading) return <LoadingRabbit />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
      <div className="apartments-container">
        <div className="apartments-header">
          <h1>Available Apartments</h1>
              <button
                  className="add-listing-btn"
                  onClick={() => navigate('/add-listing')}
              >
                Add Listing
              </button>
        </div>

        <div className="search-filters">
          <input
              type="text"
              name="query"
              placeholder="Search by description or location"
              value={searchParams.query}
              onChange={handleSearchChange}
          />
          <button onClick={handleSearchSubmit}>Search</button>
          <div className="filter-group">
            <label>Rooms:</label>
            <input
                type="number"
                name="minRooms"
                placeholder="Min"
                value={searchParams.minRooms}
                onChange={handleSearchChange}
            />
            <span>-</span>
            <input
                type="number"
                name="maxRooms"
                placeholder="Max"
                value={searchParams.maxRooms}
                onChange={handleSearchChange}
            />
          </div>
          <div className="filter-group">
            <label>Size (m²):</label>
            <input
                type="number"
                name="minSize"
                placeholder="Min"
                value={searchParams.minSize}
                onChange={handleSearchChange}
            />
            <span>-</span>
            <input
                type="number"
                name="maxSize"
                placeholder="Max"
                value={searchParams.maxSize}
                onChange={handleSearchChange}
            />
          </div>
        </div>


        <div className="apartments-grid">
          {apartments.length > 0 ? (
              apartments.map(apartment => (
                  <ApartmentCard
                      key={apartment.apartmentId}
                      apartment={apartment}
                      onDelete={handleDeleteApartment}
                      isOwner={userData?.userId === apartment.user?.userId}
                  />
              ))
          ) : (
              <div className="no-results">No apartments found matching your criteria</div>
          )}
        </div>
      </div>
  );
};

export default ApartmentsPage;
