import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../../assets/coin-animation.json'; // Ensure this path is correct

const CoinAnimation = ({ isAnimating }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: animationData,
    });

    if (isAnimating) {
      animation.goToAndPlay(0);
    }

    return () => animation.destroy(); // Cleanup on unmount
  }, [isAnimating]);

  return (
    <div
      ref={animationContainer}
      style={{
        width: '200px',
        height: '75px',
        transform: 'scale(1)',
        marginTop: '40px', // Adjust this value to move it down
      }}
    />
  );
};

export default CoinAnimation;
