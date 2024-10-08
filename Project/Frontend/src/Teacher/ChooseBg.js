import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChooseBg.css';

const staticImageOptions = [
  { name: 'الخلفية 1', src: require('../assets/images/background.png') },
  { name: 'الخلفية 2', src: require('../assets/images/background2.png') }
];

const CreateActivityForm = ({ onBackgroundSelect }) => {
  const [activity, setActivity] = useState({
    background: staticImageOptions[0].src // Default background to prevent blank
  });
  const [file, setFile] = useState(null);
  const [imageOptions, setImageOptions] = useState(staticImageOptions);

  useEffect(() => {
    // Fetch images from backend when component mounts
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/activities/images');
      setImageOptions([...staticImageOptions, ...response.data]); // Combine static and uploaded images
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const selectBackground = (imgSrc) => {
    setActivity({ ...activity, background: imgSrc });
  };

  const handleConfirmBackground = () => {
    if (onBackgroundSelect) {
      onBackgroundSelect(activity.background); // Pass the selected background to parent component
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setActivity({ ...activity, background: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/api/activities/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('تم حفظ الصورة بنجاح وإضافتها إلى الخلفيات المتاحة!');
      fetchImages(); // Fetch updated image list after saving the new image
    } catch (error) {
      alert('فشل في حفظ الصورة');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h3>يمكنك اختيار خلفية من الخلفيات المتاحة أو رفع خلفية جديدة للمجموعة</h3>
      <div className="image-selector">
        {imageOptions.map(image => (
          <div key={image.name} className="image-container" onClick={() => selectBackground(image.src)}>
            <img src={image.src} alt={image.name} className="image-preview" />
          </div>
        ))}
      </div>
      <label htmlFor="file-upload" className="custom-file-upload">رفع صورة جديدة</label>
      <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
      {file && <button onClick={handleSave} className="form-button">حفظ الصورة الجديدة</button>}
      <div className="selected-background">
        <h3>الخلفية المختارة:</h3>
        <img src={activity.background} alt="Selected Background" className="selected-image" />
        <button onClick={handleConfirmBackground} className="confirm-background-button">اختيار هذه الخلفية</button>
      </div>
    </div>
  );
};

export default CreateActivityForm;
