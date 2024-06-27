import React, { useState, useEffect } from 'react';
import './ClipPhotoMatch.css';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import { useNavigate } from 'react-router-dom';
import boatImage from '../../assets/boat.png'; // Adjust the path as needed
import Lottie from 'lottie-react'; // Import the Lottie component from lottie-react
import wavesAnimation from '../../assets/waves-animation.json'; // Import the animation JSON file

// Import images
import garlicImage from '../../assets/toom.png';
import monkeyImage from '../../assets/monkey.jpg';
import wellImage from '../../assets/p.png';
import sandcastleImage from '../../assets/sand.jpg';
import cryImage from '../../assets/cry.jpg'; // Example for new images
import shopImage from '../../assets/shop.jpg'; // Example for new images

const allWords = [
    { word: "قرد", image: monkeyImage }, // Arabic for Monkey
    { word: "ثوم", image: garlicImage }, // Arabic for Garlic
    { word: "بئر", image: wellImage }, // Arabic for Well
    { word: "رمل", image: sandcastleImage }, // Arabic for Sandcastle
    { word: "دمع", image: cryImage }, // Arabic for Cry
    { word: "سوق", image: shopImage } // Arabic for Market
];

const initialWords = allWords.slice(0, 4);

const ClipPhotoMatch = () => {
    const [coins, setCoins] = useState(0);
    const [level, setLevel] = useState(1);
    const [points, setPoints] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [animateImage, setAnimateImage] = useState(false);
    const [sidebarWords, setSidebarWords] = useState(initialWords);
    const [remainingWords, setRemainingWords] = useState(allWords.slice(4));
    const [shipPosition, setShipPosition] = useState(0); // Add state for ship position
    const [feedbackMessage, setFeedbackMessage] = useState(''); // Add state for feedback message
    const [laserColor, setLaserColor] = useState(''); // Add state for laser color

    const currentWord = sidebarWords[currentWordIndex]?.word;

    const navigate = useNavigate();

    useEffect(() => {
        // Reset state or load initial game state if necessary
    }, []);

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleImageClick = (image, alt, index) => {
        if (alt === currentWord) {
            setPoints(points + 1);
            setSelectedImage(image);
            setCoins(coins + 1); // Increase coins for a correct answer
            setAnimateImage(true); // Trigger animation
            setShipPosition(prev => prev + 55); // Move ship to the right by 10px
            setFeedbackMessage(''); // Clear feedback message on correct answer
            setLaserColor('green');

            setTimeout(() => {
                setAnimateImage(false); // Reset animation state
                setLaserColor(''); // Clear laser color

                // Remove the correct word from the sidebar
                const updatedWords = sidebarWords.filter(word => word.word !== alt);

                // Get a new word from the remaining words
                const newWord = remainingWords.shift();

                // Add the new word if available
                if (newWord) {
                    updatedWords.push(newWord);
                }

                // Update the words in the sidebar
                setSidebarWords(updatedWords);

                // Move to the next word after a short delay
                setSelectedImage(null);
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % updatedWords.length);
            }, 1000);
        } else {
            setFeedbackMessage('حاول مرة أخرى 😊'); // Set feedback message on incorrect answer
            setLaserColor('red');
            setTimeout(() => {
                setLaserColor('');
                setFeedbackMessage('');
            }, 2000); // Clear laser color and feedback message after 2 seconds
        }
    };

    return (
        <div className="clip-photo-match">
            <div className="header">
                <div className="back-button-container">
                    <button className="back-button" onClick={handleBackToLogin}>رجوع</button>
                </div>
                <div className="score-display">
                    <CoinsDisplay coins={coins} />
                    <LevelDisplay level={level} />
                </div>
            </div>
            <div className="photo-container" style={{ transform: `translateX(${shipPosition}px)` }}>
                <img src={boatImage} alt="Ship" className="ship-photo" />
                <div className="word-on-sail">{currentWord}</div>
                <div className="wood-of-boat">
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className={`selected-image ${animateImage ? 'animate' : ''}`}
                        />
                    )}
                </div>
            </div>
            <div className="lottie-container">
                <Lottie animationData={wavesAnimation} /> {/* Use Lottie component to render the animation */}
            </div>
            {sidebarWords.length > 0 && (
                <div className="photo-container-wrapper">
                    <div className="photo-sidebar">
                        {sidebarWords.map((item, index) => (
                            <div
                                key={index}
                                className={`image-button ${laserColor && currentWord === item.word ? `laser-${laserColor}` : ''}`}
                                onClick={() => handleImageClick(item.image, item.word, index)}
                            >
                                <img src={item.image} alt={item.word} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {feedbackMessage && (
                <div className="feedback-modal">
                    <div className="feedback-content">
                        {feedbackMessage}
                    </div>
                </div>
            )}
            <div className="controls">
                {/* Add controls and game logic here */}
            </div>
        </div>
    );
};

export default ClipPhotoMatch;
