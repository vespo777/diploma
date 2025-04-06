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
    type: 'ROOM', // ROOM, HOUSE, HOSTEL
    address: '',
    roomQuantity: '1',
    sizeSquareMeter: '1',
    furnished: false,
    internetIncluded: false,
    utilitiesIncluded: false,
    photos: [],
    phoneNumber: '',
    // preferredGender: 'ANY', // MALE, FEMALE, ANY
    // maxTenants: '1',
    // availableFrom: '',
    // minimumStayMonths: '1',
    petsAllowed: false,
    // smokingAllowed: false,
    parkingAvailable: false,
    location2Gis: '',
    linkToKrishaKz: ''
  });

  const [error, setError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
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
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      photos: files
    }));

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   console.log("DEBUG ---- formData:", formData);

  //   try {
  //     const formDataToSend = new FormData();
  //     Object.keys(formData).forEach(key => {
  //       if (key === 'photos') {
  //         // formData.photos.forEach(photo => {
  //         //   formDataToSend.append('photos', photo);
  //         // });
  //       } else {
  //         formDataToSend.append(key, formData[key]);
  //       }
  //     });
  //     console.log("DEBUG ---- formDataToSend:", formDataToSend);
  //     await addListing(formDataToSend);
  //     navigate('/');
  //   } catch (err) {
  //     setError('Failed to add listing. Please try again.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("DEBUG ---- formData:", formData);

    try {
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   if (key === 'photos') {
      //     // formData.photos.forEach(photo => {
      //     //   formDataToSend.append('photos', photo);
      //     // });
      //   } else {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // });
      console.log("DEBUG ---- formDataToSend:", formData);
      await addListing(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to add listing. Please try again.');
    }
  };

  if (!user) {
    return null;
  }

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
                className="auth-input"
                placeholder="Title"
                value={formData.title}
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

            <div className="input-group">
              <input
                type="number"
                name="price"
                className="auth-input"
                placeholder="Price per month (KZT)"
                value={formData.price}
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
                <option value="">Select Location</option>
                <option value="ALMATY">Almaty</option>
                <option value="ASTANA">Astana</option>
                <option value="KASKELEN">Kaskelen</option>
              </select>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="address"
                className="auth-input"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="location2Gis"
                className="auth-input"
                placeholder="Location 2GIS link"
                value={formData.location2Gis}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="linkToKrishaKz"
                className="auth-input"
                placeholder="Link to Krisha.kz"
                value={formData.linkToKrishaKz}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h3>Property Details</h3>
            <div className="input-group">
              <select
                name="type"
                className="auth-input"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="ROOM">Room</option>
                <option value="HOUSE">House</option>
                <option value="HOSTEL">Hostel</option>
              </select>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <input
                  type="number"
                  name="roomQuantity"
                  className="auth-input"
                  placeholder="Number of rooms"
                  value={formData.roomQuantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="input-group half">
                <input
                  type="number"
                  name="sizeSquareMeter"
                  className="auth-input"
                  placeholder="Size in Square Meters"
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
              <label>
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                />
                Furnished
              </label>
              <label>
                <input
                  type="checkbox"
                  name="internetIncluded"
                  checked={formData.internetIncluded}
                  onChange={handleInputChange}
                />
                Internet Included
              </label>
              <label>
                <input
                  type="checkbox"
                  name="utilitiesIncluded"
                  checked={formData.utilitiesIncluded}
                  onChange={handleInputChange}
                />
                Utilities Included
              </label>
            </div>
          </div>

          {/* Photos */}
          <div className="form-section">
            <h3>Photos (Max 5)</h3>
            <div className="input-group">
              <input
                type="file"
                name="photos"
                className="auth-input file-input"
                onChange={handlePhotoChange}
                multiple
                accept="image/*"
                // required
              />
            </div>
            <div className="photo-preview">
              {previewUrls.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index + 1}`} />
              ))}
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
            {/* <div className="input-group">
              <select
                name="preferredGender"
                className="auth-input"
                value={formData.preferredGender}
                onChange={handleInputChange}
              >
                <option value="ANY">Any Gender</option>
                <option value="MALE">Male Only</option>
                <option value="FEMALE">Female Only</option>
              </select>
            </div> */}

            {/* <div className="input-row">
              <div className="input-group half">
                <input
                  type="number"
                  name="maxTenants"
                  className="auth-input"
                  placeholder="Max number of tenants"
                  value={formData.maxTenants}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="input-group half">
                <input
                  type="number"
                  name="minimumStayMonths"
                  className="auth-input"
                  placeholder="Minimum stay (months)"
                  value={formData.minimumStayMonths}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div> */}

            {/* <div className="input-group">
              <input
                type="date"
                name="availableFrom"
                className="auth-input"
                value={formData.availableFrom}
                onChange={handleInputChange}
                required
              />
            </div> */}

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="petsAllowed"
                  checked={formData.petsAllowed}
                  onChange={handleInputChange}
                />
                Pets Allowed
              </label>
              {/* <label>
                <input
                  type="checkbox"
                  name="smokingAllowed"
                  checked={formData.smokingAllowed}
                  onChange={handleInputChange}
                />
                Smoking Allowed
              </label> */}
              <label>
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
