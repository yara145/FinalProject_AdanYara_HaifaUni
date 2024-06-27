import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IslandLevels.css';
import signpost from '../../assets/signpost.png'; // Ensure the path is correct

const levels = [
  { name: 'Level 1', path: '/levels/island/1', color: 'brown', clickable: true },
  { name: 'Level 2', path: '/levels/island/2', color: 'gray', clickable: false },
  { name: 'Level 3', path: '/levels/island/3', color: 'gray', clickable: false },
  { name: 'Level 4', path: '/levels/island/4', color: 'gray', clickable: false },
];

const IslandLevels = () => {
  const navigate = useNavigate();

  const handleLevelClick = (path, clickable) => {
    if (clickable) {
      navigate(path);
    }
  };

  return (
    <div className="island-levels">
      <div className="island"></div>
      <div className="water"></div>
      <div className="levels-container">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`level ${level.color}`}
            onClick={() => handleLevelClick(level.path, level.clickable)}
          >
            <img src={signpost} alt={`Signpost for ${level.name}`} className="signpost" />
            <div className="level-title">{level.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IslandLevels;
