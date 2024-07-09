import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import './ClipActivity.css';
import carAnimation from '../../assets/animation/car-animation.json';

const arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];

const ClipActivity = () => {
    const [currentLetter, setCurrentLetter] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const animationContainer = useRef(null);
    const animationInstance = useRef(null);

    useEffect(() => {
        generateRandomLetter();
        animationInstance.current = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: carAnimation,
        });

        return () => animationInstance.current.destroy(); // Cleanup on unmount
    }, []);

    const generateRandomLetter = () => {
        const randomIndex = Math.floor(Math.random() * arabicLetters.length);
        setCurrentLetter(arabicLetters[randomIndex]);
    };

    const handleLetterClick = () => {
        setIsCorrect(true);
        animationInstance.current.goToAndPlay(0);

        // Use GSAP to animate the car and the letter div
        gsap.to(animationContainer.current, {
            duration: 0.5, // Faster animation
            x: '100vw',
            ease: 'power1.inOut',
            onComplete: () => {
                gsap.to(animationContainer.current, {
                    duration: 0.5, // Faster return animation
                    x: 0,
                    onComplete: () => {
                        setIsCorrect(false);
                        generateRandomLetter();
                    }
                });
            }
        });
    };

    const handleSkip = () => {
        generateRandomLetter();
    };

    return (
        <div className="clip-activity">
            <div className="car-container" ref={animationContainer}>
                <div className="car-animation">
                    <div className="speech-bubble" onClick={handleLetterClick}>
                        {currentLetter}
                    </div>
                </div>
            </div>
            <button className="skip-button" onClick={handleSkip}>Skip</button>
        </div>
    );
};

export default ClipActivity;
