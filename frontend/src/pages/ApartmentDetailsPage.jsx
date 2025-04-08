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
  const userData = JSON.parse(localStorage.getItem('user')) || {};

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
  }, [id, userData.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApartment((prevApartment) => ({
      ...prevApartment,
      [name]: value
    }));
    setHasChanges(true);
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
        ← Назад
      </button>

      {isOwner && hasChanges && (
        <button className="save-button" onClick={handleSave}>
        Сохранить изменения
        </button>
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
            <strong>Описание:</strong>
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
            <strong>Цена:</strong> {isOwner ? (
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
            <strong>Адрес:</strong> {isOwner ? (
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

        <p><strong>Комнат:</strong> {isOwner ? (
          <input
            type="number"
            name="roomQuantity"
            value={apartment.roomQuantity}
            onChange={handleInputChange}
            placeholder="Room quantity"
          />
        ) : apartment.roomQuantity}</p>

        <p><strong>Площадь:</strong> {isOwner ? (
          <input
            type="number"
            name="sizeSquareMeter"
            value={apartment.sizeSquareMeter}
            onChange={handleInputChange}
            placeholder="Size (m²)"
          />
        ) : apartment.sizeSquareMeter} м²</p>

        <p><strong>Мебель:</strong> {isOwner ? (
          <select
            name="furnished"
            value={apartment.furnished}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.furnished ? 'Да' : 'Нет')}</p>

        <p><strong>Интернет включен:</strong> {isOwner ? (
          <select
            name="internetIncluded"
            value={apartment.internetIncluded}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.internetIncluded ? 'Да' : 'Нет')}</p>   

        <p><strong>Домашние животные разрешены:</strong> {isOwner ? (
          <select
            name="petsAllowed"
            value={apartment.petsAllowed}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.petsAllowed ? 'Да' : 'Нет')}</p>  

        <p><strong>Парковка доступна:</strong> {isOwner ? (
          <select
            name="parkingAvailable"
            value={apartment.parkingAvailable}
            onChange={handleInputChange}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        ) : (apartment.parkingAvailable ? 'Да' : 'Нет')}</p>  

        <p><strong>Номер телефона:</strong> {isOwner ? (
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















// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import './../styles/ApartmentDetailsPage.css';
// import { useNavigate } from 'react-router-dom';


// const API_URL = 'http://localhost:8080'; // Подстрой под свой адрес



// const ApartmentDetailsPage = () => {
//   const { id } = useParams();
//   const [apartment, setApartment] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();


//   useEffect(() => {


//     const fetchApartment = async () => {
//       try {
//         const response = await fetch(`${API_URL}/apartments/${id}`, {
//           headers: {
//             Authorization: `${localStorage.getItem('token')}`
//           }
//         });

//         if (!response.ok) throw new Error('Failed to fetch apartment');

//         const data = await response.json();
//         setApartment(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApartment();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (error || !apartment) return <div>Error: {error || 'Apartment not found'}</div>;

//   return (
    
//     <div className="apartment-details-container">

//         {/* 🟡 Вот сюда вставляем кнопку "Назад" */}
//       <button className="back-button" onClick={() => navigate(-1)}>
//         ← Назад
//       </button>

//       <h2>{apartment.title}</h2>
//       <img
//         src={apartment.photoPath || 'https://via.placeholder.com/400'}
//         alt={apartment.description}
//         style={{ maxWidth: '400px', marginBottom: '1rem' }}
//       />
//       <p><strong>Description:</strong> {apartment.description}</p>
//       <p><strong>Price:</strong> {apartment.price} ₸</p>
//       <p><strong>Location:</strong> {apartment.location}</p>
//       <p><strong>Address:</strong> {apartment.address}</p>
//       <p><strong>Rooms:</strong> {apartment.roomQuantity}</p>
//       <p><strong>Size:</strong> {apartment.sizeSquareMeter} m²</p>
//       <p><strong>Type:</strong> {apartment.propertyType}</p>
//       <p><strong>Furnished:</strong> {apartment.furnished ? 'Yes' : 'No'}</p>
//       <p><strong>Internet Included:</strong> {apartment.internetIncluded ? 'Yes' : 'No'}</p>
//       <p><strong>Utilities Included:</strong> {apartment.utilitiesIncluded ? 'Yes' : 'No'}</p>
//       <p><strong>Pets Allowed:</strong> {apartment.petsAllowed ? 'Yes' : 'No'}</p>
//       <p><strong>Parking Available:</strong> {apartment.parkingAvailable ? 'Yes' : 'No'}</p>
//       <p><strong>Phone Number:</strong> {apartment.phoneNumber}</p>

//       {apartment.location2Gis && (
//         <p>
//           <a href={apartment.location2Gis} target="_blank" rel="noopener noreferrer">
//             View on 2GIS
//           </a>
//         </p>
//       )}

//       {apartment.linkToKrishaKz && (
//         <p>
//           <a href={apartment.linkToKrishaKz} target="_blank" rel="noopener noreferrer">
//             View on Krisha.kz
//           </a>
//         </p>
//       )}
//     </div>
//   );
// };

// export default ApartmentDetailsPage;
