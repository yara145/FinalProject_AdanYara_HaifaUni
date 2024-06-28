import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signpost from '../../assets/signpost.png'; // Ensure the path is correct
import treeAnimation from '../../assets/animation/trea.json'; // Ensure the path is correct
import boat from '../../assets/islandboat.png'; // Ensure the path is correct
import Lottie from 'lottie-react';
import './IslandLevels.css';

const levels = [
  { name: 'المرحلة الاولى احرف', path: '/clip-photo-match', color: 'brown', clickable: true },
  { name: 'المرحلة الثانية مغلقة', path: '/levels/island/2', color: 'gray', clickable: false },
  { name: 'المرحلة الثالثة مغلقة', path: '/levels/island/3', color: 'gray', clickable: false },
  { name: 'المرحلة الرابعة مغلقة', path: '/levels/island/4', color: 'gray', clickable: false },
];

const IslandLevels = () => {
  const navigate = useNavigate();
  const avatar = JSON.parse(localStorage.getItem('avatar')); // Assume avatar is stored in localStorage

  useEffect(() => {
    console.log("Avatar:", avatar);
  }, [avatar]);

  const handleLevelClick = (path, clickable) => {
    if (clickable) {
      navigate(path);
    }
  };

  return (
    <div className="island-levels">
      <div className="water"></div>
      <div className="tree-left">
        <Lottie animationData={treeAnimation} loop={true} />
      </div>
      <div className="tree-right">
        <Lottie animationData={treeAnimation} loop={true} />
      </div>
      <div className="boat">
        <img src={boat} alt="Boat" />
        {avatar && <img src={avatar.image} alt={avatar.name} className="avatar" />}
      </div>
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
