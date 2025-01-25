import React, { useEffect, useState } from 'react';
import { fetchListings } from '../services/listingService';
import '../styles/listingPage.css';

export const ListingPage = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getListings = async () => {
      const data = await fetchListings();
      setListings(data);
    };
    getListings();
  }, []);

  return (
    <div className="listing-page">
      <h1>Available Listings</h1>
      <div className="listing-grid">
        {listings.map((listing) => (
          <div key={listing.id} className="listing-card">
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
            <p><strong>Price:</strong> {listing.price} $</p>
          </div>
        ))}
      </div>
    </div>
  );
};
