import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AvatarCropper = ({ image, onCrop, onCancel }) => {
    const [crop, setCrop] = useState({ aspect: 1/1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    const getCroppedImg = () => {
        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            imgRef.current,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleCropComplete = (crop) => {
        setCompletedCrop(crop);
    };

    const handleSave = () => {
        if (completedCrop) {
            const croppedImage = getCroppedImg();
            onCrop(croppedImage);
        }
    };

    return (
        <div className="avatar-cropper-wrapper">
            <ReactCrop
                src={image}
                crop={crop}
                onChange={newCrop => setCrop(newCrop)}
                onComplete={handleCropComplete}
                aspect={1}
                circularCrop={false}
            >
                <img ref={imgRef} src={image} alt="Crop preview" />
            </ReactCrop>
            <div className="avatar-crop-buttons">
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="button" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default AvatarCropper;
