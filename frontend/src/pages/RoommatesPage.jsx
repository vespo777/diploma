import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/RoommatesPage.css';

const RoommatesPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="roommates-page">
      <h1>Roommates</h1>
      <div className="roommates-grid">
        {users.map(user => (
          <div key={user.id} className="roommate-card">
            <h3>{user.firstName} {user.lastName}</h3>
            <p>Email: {user.email}</p>
            {/* Add more user details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoommatesPage; 