import React from 'react';
import Lottie from 'lottie-react';
import wavesAnimation from '../assets/waves-animation.json'; // Ensure this path is correct

const WavesAnimation = () => {
  return (
    <Lottie 
      animationData={wavesAnimation} 
      speed={1} // Adjust this value to make the animation faster
      style={{ 
        width: '2000px', 
        height: 'auto'
      }} 
    />
  );
};
    


export default WavesAnimation;
