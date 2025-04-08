import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ApartmentDetailsPage.css';

const ApartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // Для проверки, является ли пользователь владельцем
  const [hasChanges, setHasChanges] = useState(false);
  const API_URL = 'http://localhost:8080';

  // Безопасное получение userData
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchApartment = async () => {
      try {
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

        console.log(data.userId, userData, )
        // Проверяем наличие userData и userId
        if (userData && data.userId === userData.userId) {
          setIsOwner(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [userData?.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApartment((prevApartment) => ({
      ...prevApartment,
      [name]: value
    }));
    setHasChanges(true);
  };

  // Add this function in your component
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

        navigate('/apartments'); // Redirect after deletion
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting apartment');
      }
    }
  };


  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apartment)
      });

      if (!response.ok) {
        throw new Error('Failed to update apartment');
      }

      const updatedData = await response.json();
      setApartment(updatedData);
      setHasChanges(false);
      // Можно добавить уведомление об успешном сохранении
      alert('Изменения успешно сохранены!');
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Ошибка при сохранении изменений');
    }
  };

  if (loading) return <div>Loading...</div>;
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

        {apartment.photoPath && (
          <img src={apartment.photoPath} alt="Apartment" className="apartment-photo" />
        )}
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
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.furnished ? 'Да' : 'Нет')}</p>

<p><strong>Internet Included:</strong> {isOwner ? (
          <select
            name="internetIncluded"
            value={apartment.internetIncluded}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.internetIncluded ? 'Да' : 'Нет')}</p>

<p><strong>Pets Allowed:</strong> {isOwner ? (
          <select
            name="petsAllowed"
            value={apartment.petsAllowed}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.petsAllowed ? 'Да' : 'Нет')}</p>

<p><strong>Parking Available:</strong> {isOwner ? (
          <select
            name="parkingAvailable"
            value={apartment.parkingAvailable}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.parkingAvailable ? 'Да' : 'Нет')}</p>

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

        {/* Остальные поля, аналогичные примеру выше */}
      </div>
    </div>
  );
};

export default ApartmentDetailsPage;

