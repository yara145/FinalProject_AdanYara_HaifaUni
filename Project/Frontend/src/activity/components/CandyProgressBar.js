import React from 'react';
import './CandyProgressBar.css';

const CandyProgressBar = ({ progress }) => (
  <div className="progress-bar-container">
    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
  </div>
);

export default CandyProgressBar;
