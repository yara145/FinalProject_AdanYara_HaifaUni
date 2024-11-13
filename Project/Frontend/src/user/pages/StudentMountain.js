import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Teacher/ActivitySelection.css';
import cardLetterImage from '../../assets/images/letters-card.png';
import backButtonImage from '../../assets/images/back.png';  // Back button image
import exitButtonImage from '../../assets/images/exit.png';  // Exit button image

const activities = [
  { name: ' بطاقات الحروف', type: 'CustomLettersCard', image: cardLetterImage }, // New card-letter activity
];

const StudentMountain = () => {
  const { studentId } = useParams(); // Retrieve studentId from URL params
  const navigate = useNavigate();

  const handleActivityClick = (type) => {
    if (studentId) {
      navigate(`/student/activities/${studentId}/${type}`);
    } else {
      console.error("Student ID not found. Please log in.");
      navigate('/login');
    }
  };

  const handleBackClick = () => {
    navigate('/home'); // Go back to home
  };

  const handleExit = () => {
    // Assuming you're using localStorage or similar for user authentication
    localStorage.removeItem('studentId'); // Remove any saved data
    navigate('/'); // Redirect to the login or home page
  };

  return (
    <div className="activity-selection-page">
      <div className="header">
        {/* Back Button with Image */}
        <button className="back-button" onClick={handleBackClick}>
          <img src={backButtonImage} alt="Back" className="button-image" />
        </button>

        {/* Logout/Exit Button with Image */}
        <button className="exit-button" onClick={handleExit}>
          <img src={exitButtonImage} alt="Exit" className="button-image" />
        </button>
      </div>

      <h2>اختر نوع النشاط في تلة الوعي الصوتي</h2>
      <div className="activities-grid">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="activity-card"
            onClick={() => handleActivityClick(activity.type)}
          >
            <img src={activity.image} alt={activity.name} className="activity-image" />
            <h3>{activity.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentMountain;
