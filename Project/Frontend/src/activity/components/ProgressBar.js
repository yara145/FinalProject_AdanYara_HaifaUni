import React from 'react';
import './ProgressBar.css';

import lionImage from '../../assets/images/lion.png';

const ProgressBar = ({ progress }) => (
    <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <img
            src={lionImage}
            alt="Lion Icon"
            className="lion-icon-progress"
            style={{ left: `calc(${progress}% - 25px)` }} // Adjusting the position based on progress
        />
    </div>
);

export default ProgressBar;
