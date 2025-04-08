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
                <h3>Title: {apartment.title || 'No title provided'}</h3>
                <p><strong>Rooms:</strong> {apartment.roomQuantity}</p>
                <p><strong>Size:</strong> {apartment.sizeSquareMeter} m²</p>

                {/* Separate link containers */}
                <div className="links-container">
                    {apartment.location2Gis && (
                        <div className="gis-link">
                            <a 
                                href={apartment.location2Gis} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <span className="link-icon">🗺️ </span>
                                2GIS Location
                            </a>
                        </div>
                    )}

                    {apartment.linkToKrishaKz && (
                        <div className="krisha-link">
                            <a 
                                href={apartment.linkToKrishaKz} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <span className="link-icon">🏠 </span>
                                Krisha.kz Link
                            </a>
                        </div>
                    )}
                </div>

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
