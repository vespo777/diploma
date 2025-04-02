import React, { useState } from 'react';

const ApartmentForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        description: '',
        photoPath: '',
        location2Gis: '',
        linkToKrishaKz: '',
        roomQuantity: '',
        sizeSquareMeter: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Apartment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Photo URL:</label>
                        <input
                            type="url"
                            name="photoPath"
                            value={formData.photoPath}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>2GIS Location Link:</label>
                        <input
                            type="url"
                            name="location2Gis"
                            value={formData.location2Gis}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Krisha.kz Link:</label>
                        <input
                            type="url"
                            name="linkToKrishaKz"
                            value={formData.linkToKrishaKz}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Number of Rooms:</label>
                        <input
                            type="number"
                            name="roomQuantity"
                            value={formData.roomQuantity}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Size (m²):</label>
                        <input
                            type="number"
                            name="sizeSquareMeter"
                            value={formData.sizeSquareMeter}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApartmentForm;
