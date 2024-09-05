import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signpost from '../../assets/images/cn1.png'; // Ensure the path is correct
import candyBg from '../../assets/images/candybg.png'; // Ensure the path is correct
import './IslandLevels.css';

const levels = [
  { name: 'المرحلة الاولى تجميع الحروف', path: '/shuffle', color: 'pink', clickable: true },
  { name: 'المرحلة الثانية مغلقة', path: '/levels/island/2', color: 'gray', clickable: false },
  { name: 'المرحلة الثالثة مغلقة', path: '/levels/island/3', color: 'gray', clickable: false },
  { name: 'المرحلة الرابعة مغلقة', path: '/levels/island/4', color: 'gray', clickable: false },
];

const IslandLevels = () => {
  const navigate = useNavigate();

  const handleLevelClick = (path, clickable) => {
    if (clickable) {
      navigate(path);
    }
  };

  const handleBackClick = () => {
    navigate('/home'); // Update this to the correct path of your homepage
  };

  return (
    <div className="island-levels" style={{ backgroundImage: `url(${candyBg})` }}>
      <button className="back-button" onClick={handleBackClick}>رجوع</button>
      <div className="water"></div>
      <div className="levels-wrapper">
        <div className="levels-container">
          {levels.map((level, index) => (
            <div
              key={index}
              className={`level ${level.color}`}
              onClick={() => handleLevelClick(level.path, level.clickable)}
            >
              <img src={signpost} alt={`Signpost for ${level.name}`} className="signpost" />
              <div className={`level-title ${!level.clickable ? 'locked' : ''}`}>{level.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IslandLevels;
