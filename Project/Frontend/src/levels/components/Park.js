// src/levels/components/Park.js
import React from 'react';
import { gsap } from 'gsap';
import parkImage from '../../assets/park.png';

const Park = ({ onClick }) => {
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, { duration: 0.2, x: 10, y: -10, repeat: -1, yoyo: true });
  };

  const handleMouseLeave = (e) => {
    gsap.killTweensOf(e.currentTarget);
    gsap.to(e.currentTarget, { duration: 0.2, x: 0, y: 0 });
  };

  return (
    <div
      className="image-container"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={parkImage} alt="Park" />
    </div>
  );
};

export default Park;
