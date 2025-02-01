import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ApartmentsPage.css';

const ApartmentsPage = () => {
  const { user } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch('http://localhost:8080/apartments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="apartments-page">
      <h1>Apartments</h1>
      <div className="apartments-grid">
        {apartments.map(apartment => (
          <div key={apartment.id} className="apartment-card">
            <h3>{apartment.title}</h3>
            <p>Price: {apartment.price}</p>
            <p>Location: {apartment.location}</p>
            {/* Add more apartment details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentsPage; 