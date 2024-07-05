import React, { useState, useEffect } from 'react';
import './ClipPhotoMatch.css';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import { useNavigate } from 'react-router-dom';
import boatImage from '../../assets/boat.png'; // Adjust the path as needed
import Lottie from 'lottie-react'; // Import the Lottie component from lottie-react
import wavesAnimation from '../../assets/waves-animation.json'; // Import the animation JSON file
import fishAnimation from '../../assets/fish-animation.json'; // Import the fish animation JSON file

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
    const [positiveMessage, setPositiveMessage] = useState(''); // Add state for positive feedback message
    const [laserColor, setLaserColor] = useState(''); // Add state for laser color
    const [clickedIndex, setClickedIndex] = useState(null); // Add state for clicked index
    const [attempts, setAttempts] = useState(0); // Add state for tracking attempts
    const [boatFinished, setBoatFinished] = useState(false); // Add state for boat movement completion
    const [gameEnded, setGameEnded] = useState(false); // Add state to manage game end
    const [showFish, setShowFish] = useState(false); // Add state to manage fish animation visibility

    const currentWord = sidebarWords[currentWordIndex]?.word;

    const navigate = useNavigate();

    useEffect(() => {
        // Reset state or load initial game state if necessary
    }, []);

    useEffect(() => {
        if (boatFinished) {
            // Move the ship out of view slowly before playing the animation
            setShipPosition(2000); // Move the ship far right (off the screen) slowly
        }
    }, [boatFinished]);

    const handleTransitionEnd = () => {
        if (boatFinished) {
            setGameEnded(true); // Trigger the fish animation immediately after the ship transition ends
            setShowFish(true); // Show the fish animation
            setTimeout(() => {
                setShowFish(false); // Hide the fish animation after it completes
            }, 5000); // Adjust the delay to match the fish animation duration
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleImageClick = (image, alt, index) => {
        setClickedIndex(index); // Set the clicked index
        if (alt === currentWord) {
            setPoints(points + 1);
            setSelectedImage(image);
            setCoins(coins + 1); // Increase coins for a correct answer
            setAnimateImage(true); // Trigger animation
            setShipPosition(prev => prev + 55); // Move ship to the right by 55px
            setFeedbackMessage(''); // Clear feedback message on correct answer
            setPositiveMessage('أحسنت! إجابة صحيحة'); // Set positive feedback message
            setLaserColor('green');
            setAttempts(0); // Reset attempts on correct answer

            setTimeout(() => {
                setAnimateImage(false); // Reset animation state
                setLaserColor(''); // Clear laser color
                setClickedIndex(null); // Clear clicked index
                setPositiveMessage(''); // Clear positive feedback message

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

                // Check if all words have been answered
                if (updatedWords.length === 0 && remainingWords.length === 0) {
                    setBoatFinished(true); // Set boatFinished to true if all words are answered
                }
            }, 1000);
        } else {
            setAttempts(prev => prev + 1);
            if (attempts === 1) { // Second incorrect attempt
                setFeedbackMessage('لقد حاولت مرتين! سننتقل إلى الكلمة التالية.'); // Set feedback message on second incorrect attempt
                setTimeout(() => {
                    setLaserColor('');
                    setFeedbackMessage('');
                    setClickedIndex(null); // Clear clicked index after timeout

                    // Move to the next word without moving the ship
                    const updatedWords = sidebarWords.filter(word => word.word !== currentWord);

                    // Get a new word from the remaining words
                    const newWord = remainingWords.shift();

                    // Add the new word if available
                    if (newWord) {
                        updatedWords.push(newWord);
                    }

                    // Update the words in the sidebar
                    setSidebarWords(updatedWords);

                    setSelectedImage(null);
                    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % updatedWords.length);
                    setAttempts(0); // Reset attempts

                    // Check if all words have been answered
                    if (updatedWords.length === 0 && remainingWords.length === 0) {
                        setBoatFinished(true); // Set boatFinished to true if all words are answered
                    }
                }, 2000); // Clear feedback message after 2 seconds
            } else {
                setFeedbackMessage('حاول مرة أخرى 😊'); // Set feedback message on first incorrect answer
                setLaserColor('red');
                setTimeout(() => {
                    setLaserColor('');
                    setFeedbackMessage('');
                    setClickedIndex(null); // Clear clicked index after timeout
                }, 2000); // Clear laser color and feedback message after 2 seconds
            }
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
            <div
                className="photo-container"
                style={{ transform: `translateX(${shipPosition}px)`, transition: 'transform 3s ease' }}
                onTransitionEnd={handleTransitionEnd} // Add this to trigger the fish animation
            >
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
            {sidebarWords.length > 0 && !gameEnded && (
                <div className="photo-container-wrapper">
                    <div className="photo-sidebar">
                        {sidebarWords.map((item, index) => (
                            <div
                                key={index}
                                className={`image-button ${laserColor && clickedIndex === index ? `laser-${laserColor}` : ''}`}
                                onClick={() => handleImageClick(item.image, item.word, index)}
                            >
                                <img src={item.image} alt={item.word} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {feedbackMessage && (
                <div className="feedback-modal feedback-error">
                    <div className="feedback-content">
                        {feedbackMessage}
                    </div>
                </div>
            )}
            {positiveMessage && (
                <div className="feedback-modal feedback-success">
                    <div className="feedback-content">
                        {positiveMessage}
                    </div>
                </div>
            )}
            {gameEnded && showFish && (
                <div className="game-ended-animation">
                    <Lottie animationData={fishAnimation} loop={false} /> {/* Play the fish animation */}
                </div>
            )}
            <div className="controls">
                {/* Add controls and game logic here */}
            </div>
        </div>
    );
};

export default ClipPhotoMatch;
