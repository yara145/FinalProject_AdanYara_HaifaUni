import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Teacher/ActivitySelection.css';
import wordShuffleImage from '../../assets/images/letter-arrange.png';
import wordImageMatchImage from '../../assets/images/word-image-match.png'; // Add an image for this new activity type

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

  return (
    <div className="activity-selection-page">
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
