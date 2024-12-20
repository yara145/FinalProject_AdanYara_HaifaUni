import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Teacher/ActivitySelection.css';
import wordShuffleImage from '../../assets/images/letter-arrange.png';
import wordImageMatchImage from '../../assets/images/word-image-match.png'; // Add an image for this new activity type
import backButtonImage from '../../assets/images/back.png'; // Back button image
import exitButtonImage from '../../assets/images/exit.png'; // Exit button image

const activities = [
  { name: 'ترتيب الحروف', type: 'word-shuffle', image: wordShuffleImage },
  { name: 'مطابقة الكلمة بالصورة', type: 'word-image-match', image: wordImageMatchImage }, // New activity type
];

const StudentIsland = () => {
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

  // Update the handleBackClick function to go to /home
  const handleBackClick = () => {
    navigate('/home'); // Navigate to the home page
  };

  const handleExitClick = () => {
    localStorage.removeItem('studentId'); // Remove saved student data
    navigate('/'); // Redirect to home or login page
  };

  return (
    <div className="activity-selection-page">
      <div className="header">
        {/* Back Button with Image */}
        <button className="back-button" onClick={handleBackClick}>
          <img src={backButtonImage} alt="Back" className="button-image" />
        </button>

        {/* Exit Button with Image */}
        <button className="exit-button" onClick={handleExitClick}>
          <img src={exitButtonImage} alt="Exit" className="button-image" />
        </button>
      </div>

      <h2>اختر نوع النشاط</h2>
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

export default StudentIsland;
