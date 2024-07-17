import React from 'react';
import './CandyProgressBar.css';
import candyImage from '../../assets/images/candy.png'; // Ensure this path is correct

const CandyProgressBar = ({ progress }) => (
  <div className="progress-bar-container">
    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    <img
      src={candyImage}
      alt="Candy Icon"
      className="candy-icon-progress"
      style={{ left: `${progress}%` }} // Adjusting the position based on progress
    />
  </div>
);

export default CandyProgressBar;
