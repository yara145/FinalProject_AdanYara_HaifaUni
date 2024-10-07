import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivitySelection.css';
import activityImage1 from '../assets/images/letter-arrange.png'; // Example image
import logo from '../assets/logo.png';

const activities = [
  { name: 'ترتيب الحروف', image: activityImage1, route: '/custom-word-shuffle' },
  // Add more activity types here...
];

const ActivitySelection = () => {
  const navigate = useNavigate();

  const handleActivityClick = (route) => {
    navigate(route);
  };

  return (
    <div className="activity-selection-page">
      <header className="teacher-header">
        <img src={logo} alt="Logo" className="teacher-logo" />
        <nav className="teacher-nav">
          <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
          <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
        </nav>
      </header>
      
      <div className="activity-selection-container">
        <h2>اختر نوع النشاط الذي تريد انشاءه</h2>
        <div className="activities-grid">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="activity-card"
              onClick={() => handleActivityClick(activity.route)}
            >
              <img src={activity.image} alt={activity.name} className="activity-image" />
              <h3>{activity.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitySelection;
