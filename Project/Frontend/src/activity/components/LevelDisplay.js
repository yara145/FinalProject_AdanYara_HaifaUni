import React, { useEffect, useState } from 'react';
import './LevelDisplay.css';
import LevelAnimation from './LevelAnimation'; // Import the LevelAnimation component

const LevelDisplay = ({ level }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Duration of the animation

    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className="level-container">
      <LevelAnimation isAnimating={isAnimating} /> {/* Use the LevelAnimation component */}
      <span className="level-text">{level}</span>
    </div>
  );
};

export default LevelDisplay;
