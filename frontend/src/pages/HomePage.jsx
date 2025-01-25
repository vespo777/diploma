import React, { useEffect, useState } from 'react';
import { getListings } from '../services/api';

function HomePage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await getListings();
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <h1>Available Listings</h1>
      <div>
        {listings.map((listing) => (
          <div key={listing.id}>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;