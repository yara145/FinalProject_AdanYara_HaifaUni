import React, { useEffect, useState } from 'react';
import './CoinsDisplay.css';
import CoinAnimation from './CoinAnimation'; // Import the CoinAnimation component

const CoinsDisplay = ({ coins }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (coins > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Duration of the animation

      return () => clearTimeout(timer);
    }
  }, [coins]);

  return (
    <div className="coins-container">
      <CoinAnimation isAnimating={isAnimating} /> {/* Use the CoinAnimation component */}
      <span className="coins-text">{coins}</span>
    </div>
  );
};

export default CoinsDisplay;
