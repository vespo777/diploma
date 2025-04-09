import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addListing } from '../services/listingService';
import '../styles/addListingPage.css';

const AddListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'ROOM', // ROOM, HOUSE, HOSTEL
    address: '',
    roomQuantity: '1',
    sizeSquareMeter: '1',
    furnished: false,
    photoPath: '',
    internetIncluded: false,
    utilitiesIncluded: false,
    phoneNumber: '',
    petsAllowed: false,
    parkingAvailable: false,
    location2Gis: '',
    linkToKrishaKz: '',
  });

  const [error, setError] = useState('');
  const [apartmentPhotoPreview, setApartmentPhotoPreview] = useState('default');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
    if (!isValidType) {
      alert('Please upload only JPEG, JPG, or PNG images.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;

      setFormData(prev => ({
        ...prev,
        photoPath: base64String,
      }));

      setApartmentPhotoPreview(base64String);
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("DEBUG ---- formData:", formData);

    try {
      console.log("DEBUG ---- formDataToSend:", formData);
      await addListing(formData);
      navigate('/apartments');
    } catch (err) {
      setError('Failed to add listing. Please try again.');
    }
  };


  return (
    <div className="auth-container">
      <motion.div
        className="auth-box listing-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Add an Announcement</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="input-group">
              <input
                type="text"
                name="title"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>


            <div className="input-group">
              <input
                type="number"
                name="price"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                placeholder="Price per month (KZT)"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <textarea
                  name="description"
                  className="auth-input textarea"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3>Location</h3>
            <div className="input-group">
              <select
                name="location"
                className="auth-input"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="ALMATY">Almaty</option>
                <option value="ASTANA">Astana</option>
                <option value="KASKELEN">Kaskelen</option>
              </select>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="address"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="location2Gis"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                placeholder="Location 2GIS link"
                value={formData.location2Gis}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="linkToKrishaKz"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                placeholder="Link to Krisha.kz"
                value={formData.linkToKrishaKz}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Property Details</h3>
            <div className="input-group">
              <select
                name="propertyType"
                className="auth-input"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="ROOM">Room</option>
                <option value="HOUSE">House</option>
                <option value="HOSTEL">Hostel</option>
              </select>
            </div>

            <div className="input-row">
              <div className="input-group-half">
                <label className="flex items-center space-x-2 text-gray-700">
                  Amount of rooms
                </label>
                <input
                  type="number"
                  name="roomQuantity"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                  placeholder="Number of rooms"
                  value={formData.roomQuantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="input-group-half">
                <label className="flex items-center space-x-2 text-gray-700">
                  Size of room in squere meter
                </label>
                <input
                  type="number"
                  name="sizeSquareMeter"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"                  placeholder="Size in Square Meters"
                  value={formData.sizeSquareMeter}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h3>Amenities</h3>
            <div className="checkbox-group">
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name="furnished"
                  className="mr-2 accent-blue-500 w-4 h-4"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                />
                Furnished
              </label>
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name="internetIncluded"
                  className="mr-2 accent-blue-500 w-4 h-4"
                  checked={formData.internetIncluded}
                  onChange={handleInputChange}
                />
                Internet Included
              </label>
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name="utilitiesIncluded"
                  className="mr-2 accent-blue-500 w-4 h-4"
                  checked={formData.utilitiesIncluded}
                  onChange={handleInputChange}
                />
                Utilities Included
              </label>
            </div>
          </div>

          {/* Photos */}
          <div className="form-section">
            <h3>Photo</h3>
            <div className="input-group">
              <label>
                Choose Photo
                <input
                    type="file"
                    name="photo"
                    className="file-input"
                    onChange={handlePhotoChange}
                    accept="image/png, image/jpeg, image/jpg"
                    required
                />
              </label>
            </div>
            <div className="photo-preview">
              {apartmentPhotoPreview !== 'default' && (
                  <>
        <span
            className="apartment-preview-cancellation"
            onClick={() => {
              setApartmentPhotoPreview('default');
              setFormData(prev => ({...prev, photoPath: ''}));
            }}
        ></span>
                    <img src={apartmentPhotoPreview} alt="Apartment preview" />
                  </>
              )}
              {apartmentPhotoPreview === 'default' && (
                  <div className="default-preview">No photo selected</div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="input-group">
              <input
                type="tel"
                name="phoneNumber"
                className="auth-input"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="form-section">
            <h3>Preferences</h3>
            <div className="checkbox-group">
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name="petsAllowed"
                  checked={formData.petsAllowed}
                  onChange={handleInputChange}
                />
                Pets Allowed
              </label>

              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name="parkingAvailable"
                  checked={formData.parkingAvailable}
                  onChange={handleInputChange}
                />
                Parking Available
              </label>
            </div>
          </div>

          <motion.button
            type="submit"
            className="auth-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddListingPage;
