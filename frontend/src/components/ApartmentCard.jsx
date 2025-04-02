import React from 'react';
import { Link } from 'react-router-dom';

const ApartmentCard = ({ apartment, onDelete, isOwner }) => {
    return (
        <div className="apartment-card">
            <div className="apartment-image">
                {apartment.photoPath ? (
                    <img src={apartment.photoPath} alt={apartment.description} />
                ) : (
                    <div className="image-placeholder">No Image</div>
                )}
            </div>
            <div className="apartment-details">
                <h3>{apartment.description || 'No description'}</h3>
                <p><strong>Rooms:</strong> {apartment.roomQuantity}</p>
                <p><strong>Size:</strong> {apartment.sizeSquareMeter} m²</p>
                {apartment.location2Gis && (
                    <a
                        href={apartment.location2Gis}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-link"
                    >
                        View on 2GIS
                    </a>
                )}
                {apartment.linkToKrishaKz && (
                    <a
                        href={apartment.linkToKrishaKz}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="krisha-link"
                    >
                        View on Krisha.kz
                    </a>
                )}
                <div className="apartment-actions">
                    <Link to={`/apartments/${apartment.apartmentId}`} className="view-btn">
                        View Details
                    </Link>
                    {isOwner && (
                        <button
                            className="delete-btn"
                            onClick={() => onDelete(apartment.apartmentId)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApartmentCard;
