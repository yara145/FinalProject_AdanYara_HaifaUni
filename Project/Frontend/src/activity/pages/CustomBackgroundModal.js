import React from 'react';
import './CustomBackgroundModal.css';

const CustomBackgroundModal = ({ isOpen, onClose, onBackgroundSelect, imageOptions }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-background-modal-overlay">
      <div className="custom-background-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>اختَر الخلفية</h3>
        <div className="image-selector">
          {imageOptions.map((image, index) => (
            <div key={index} className="image-container" onClick={() => onBackgroundSelect(image.src)}>
              <img src={image.src} alt={image.name} className="image-preview" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomBackgroundModal;
