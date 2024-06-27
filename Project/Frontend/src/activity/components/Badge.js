import React from 'react';
import './Badge.css';

const Badge = ({ badgeType }) => (
    <div className={`badge ${badgeType}`}></div>
);

export default Badge;
