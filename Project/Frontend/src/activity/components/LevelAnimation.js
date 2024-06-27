import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../../assets/level-animation.json'; // Ensure this path is correct

const LevelAnimation = ({ isAnimating }) => {
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

  return <div ref={animationContainer} style={{ width: '300px', height: '90px',transform: 'scale(0.5)' , marginTop: '30px',}} />; // Fixed size
};

export default LevelAnimation;
