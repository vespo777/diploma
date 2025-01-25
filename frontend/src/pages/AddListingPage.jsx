import React, { useState } from 'react';
import { addListing } from '../services/listingService';
import '../styles/addListingPage.css';

export const AddListingPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newListing = { title, description, price };
    await addListing(newListing);
    alert('Listing added successfully!');
    setTitle('');
    setDescription('');
    setPrice('');
  };

  return (
    <div className="add-listing-page">
      <h1>Add a New Listing</h1>
      <form onSubmit={handleSubmit} className="add-listing-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};