import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingRabbit from "../components/pixi/Loading";
import '../styles/ApartmentDetailsPage.css';

const ApartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};

        const response = await fetch(`${API_URL}/apartments/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch apartment');
        }

        const data = await response.json();
        setApartment(data);
        setImagePreview(data.photoPath);
        if (storedUserData && data.userId === storedUserData.userId) {
          setIsOwner(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG or PNG)');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setImagePreview(base64String);
      setApartment(prev => ({
        ...prev,
        photoPath: base64String  // Store directly in photoPath
      }));
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApartment((prevApartment) => ({
      ...prevApartment,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this apartment listing?')) {
      try {
        const response = await fetch(`${API_URL}/apartments/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete apartment');

        navigate('/apartments');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting apartment');
      }
    }
  };

  const handleSave = async () => {
    try {
      // Create a copy of apartment data without the photoBase64 field
      const { photoBase64, ...apartmentData } = apartment;

      const response = await fetch(`${API_URL}/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apartmentData)
      });

      if (!response.ok) {
        throw new Error('Failed to update apartment');
      }

      const updatedData = await response.json();
      setApartment(updatedData);
      setHasChanges(false);
      alert('Changes saved successfully!');

      // Update the image preview with the new path from server
      if (updatedData.photoPath) {
        setImagePreview(updatedData.photoPath);
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Error saving changes');
    }
  };

  if (loading) return <LoadingRabbit />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!apartment) return <div>No apartment found</div>;

  return (
      <div className="apartment-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {isOwner && (
            <div className="owner-buttons">
              {hasChanges && (
                  <button className="save-button" onClick={handleSave}>
                    Save Changes
                  </button>
              )}
              <button className="delete-button" onClick={handleDelete}>
                Delete from listing
              </button>
            </div>
        )}

        <div className="apartment-header">
          {isOwner ? (
              <input
                  type="text"
                  name="title"
                  value={apartment.title}
                  onChange={handleInputChange}
                  placeholder="Введите название квартиры"
                  className="title-input editable"
              />
          ) : (
              <h1 className="title-text">{apartment.title}</h1>
          )}
          <div className="image-upload-container">
            {imagePreview && (
                <img src={imagePreview} alt="Apartment" className="apartment-photo" />
            )}
            {isOwner && (
                <div className="image-upload-controls">
                  <label className="upload-label">
                    Change Photo
                    <input
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleImageChange}
                        className="file-input"
                    />
                  </label>
                </div>
            )}
          </div>
        </div>

        <div className="apartment-info">
          <div className="description-field">
            <strong>Description:</strong>
            {isOwner ? (
                <textarea
                    name="description"
                    value={apartment.description}
                    onChange={handleInputChange}
                    placeholder="Apartment description"
                    className="description-input"
                />
            ) : (
                <div className="description-text">{apartment.description}</div>
            )}
          </div>

          <div className="info-field">
            <strong>Price:</strong> {isOwner ? (
              <input
                  type="number"
                  name="price"
                  value={apartment.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="info-input"
              />
          ) : apartment.price} ₸
          </div>

          <div className="info-field">
            <strong>Address:</strong> {isOwner ? (
              <input
                  type="text"
                  name="address"
                  value={apartment.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="info-input"
              />
          ) : apartment.address}
          </div>

          <p><strong>Rooms:</strong> {isOwner ? (
              <input
                  type="number"
                  name="roomQuantity"
                  value={apartment.roomQuantity}
                  onChange={handleInputChange}
                  placeholder="Room quantity"
              />
          ) : apartment.roomQuantity}</p>

          <p><strong>Size:</strong> {isOwner ? (
              <input
                  type="number"
                  name="sizeSquareMeter"
                  value={apartment.sizeSquareMeter}
                  onChange={handleInputChange}
                  placeholder="Size (m²)"
              />
          ) : apartment.sizeSquareMeter} м²</p>

          <p><strong>Furnished:</strong> {isOwner ? (
              <select
                  name="furnished"
                  value={apartment.furnished}
                  onChange={handleInputChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
          ) : (apartment.furnished ? 'Yes' : 'No')}</p>

          <p><strong>Internet Included:</strong> {isOwner ? (
              <select
                  name="internetIncluded"
                  value={apartment.internetIncluded}
                  onChange={handleInputChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
          ) : (apartment.internetIncluded ? 'Yes' : 'No')}</p>

          <p><strong>Pets Allowed:</strong> {isOwner ? (
              <select
                  name="petsAllowed"
                  value={apartment.petsAllowed}
                  onChange={handleInputChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
          ) : (apartment.petsAllowed ? 'Yes' : 'No')}</p>

          <p><strong>Parking Available:</strong> {isOwner ? (
              <select
                  name="parkingAvailable"
                  value={apartment.parkingAvailable}
                  onChange={handleInputChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
          ) : (apartment.parkingAvailable ? 'Yes' : 'No')}</p>

          <p><strong>Phone Number:</strong> {isOwner ? (
              <input
                  type="text"
                  name="phoneNumber"
                  value={apartment.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Address"
              />
          ) : apartment.phoneNumber}</p>

          {apartment.location2Gis && (
              <p><strong>2GIS Location:</strong> {isOwner ? (
                  <input
                      type="text"
                      name="location2Gis"
                      value={apartment.location2Gis}
                      onChange={handleInputChange}
                      placeholder="2GIS link"
                  />
              ) : (
                  <a href={apartment.location2Gis} target="_blank" rel="noopener noreferrer">
                    View on 2GIS
                  </a>
              )}</p>
          )}

          <p><strong>Property Type</strong> {isOwner ? (
              <select
                  name="propertyType"
                  value={apartment.propertyType}
                  onChange={handleInputChange}
              >
                <option value="ROOM">Room</option>
                <option value="HOUSE">House</option>
                <option value="HOSTEL">Hostel</option>
              </select>
          ) : apartment.propertyType}</p>

          {apartment.linkToKrishaKz && (
              <p><strong>Krisha.kz Link:</strong> {isOwner ? (
                  <input
                      type="text"
                      name="linkToKrishaKz"
                      value={apartment.linkToKrishaKz}
                      onChange={handleInputChange}
                      placeholder="Krisha.kz link"
                  />
              ) : (
                  <a href={apartment.linkToKrishaKz} target="_blank" rel="noopener noreferrer">
                    View on Krisha.kz
                  </a>
              )}</p>
          )}
        </div>
      </div>
  );
};

export default ApartmentDetailsPage;
