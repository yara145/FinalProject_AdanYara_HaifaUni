// ProgressBar.js
import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => (
  <div className="progress-bar-container">
    <div
      className="progress-bar-fill"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export default ProgressBar;
