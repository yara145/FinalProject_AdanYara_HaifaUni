import React, { useState, useEffect, useRef } from 'react';
import './ClipPhotoMatch.css';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import { useNavigate } from 'react-router-dom';
import boatImage from '../../assets/images/Ship.png'; 
import Lottie from 'lottie-react';
import wavesAnimation from '../../assets/animation/waves-animation.json';
import octopusImage from '../../assets/images/Octopus.png'; 
import sunImage from '../../assets/images/sun.png'; 

// Import images
import garlicImage from '../../assets/toom.png';
import monkeyImage from '../../assets/monkey.jpg';
import wellImage from '../../assets/p.png';
import sandcastleImage from '../../assets/sand.jpg';
import cryImage from '../../assets/cry.jpg';
import shopImage from '../../assets/shop.jpg';

// Import sounds
import correctSound from '../../assets/sound/correct.wav';
import tryAgainSound from '../../assets/sound/tryAgain.wav';
import incorrectSound from '../../assets/sound/incorrect.wav';

const allWords = [
    { word: "قرد", image: monkeyImage },
    { word: "ثوم", image: garlicImage },
    { word: "بئر", image: wellImage },
    { word: "رمل", image: sandcastleImage },
    { word: "دمع", image: cryImage },
    { word: "سوق", image: shopImage }
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
    const [shipPosition, setShipPosition] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [positiveMessage, setPositiveMessage] = useState('');
    const [laserColor, setLaserColor] = useState('');
    const [clickedIndex, setClickedIndex] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const [isFinalMove, setIsFinalMove] = useState(false);
    const [summaryMessage, setSummaryMessage] = useState(''); 
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentWord = sidebarWords[currentWordIndex]?.word;

    const navigate = useNavigate();

    // Create refs for the audio elements
    const correctAudioRef = useRef(null);
    const tryAgainAudioRef = useRef(null);
    const incorrectAudioRef = useRef(null);

    useEffect(() => {
        // Reset state or load initial game state if necessary
    }, []);

    const handleTransitionEnd = () => {
        if (gameEnded) {
            setTimeout(() => {
                // Additional actions when the game ends, if necessary
            }, 5000);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % sidebarWords.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + sidebarWords.length) % sidebarWords.length);
    };

    const handleImageClick = (image, alt, index) => {
        setClickedIndex(index);
        if (alt === currentWord) {
            correctAudioRef.current.play(); // Play correct answer sound
            setPoints(points + 1);
            setSelectedImage(image);
            setCoins(coins + 1);
            setAnimateImage(true);
            setFeedbackMessage('');
            setPositiveMessage('أحسنت! إجابة صحيحة');
            setLaserColor('green');
            setAttempts(0);

            setTimeout(() => {
                setAnimateImage(false);
                setLaserColor('');
                setClickedIndex(null);
                setPositiveMessage('');

                const updatedWords = sidebarWords.filter(word => word.word !== alt);
                const newWord = remainingWords.shift();
                if (newWord) {
                    updatedWords.push(newWord);
                }
                setSidebarWords(updatedWords);
                setSelectedImage(null);
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % updatedWords.length);

                if (updatedWords.length === 0 && remainingWords.length === 0) {
                    setGameEnded(true);
                    setIsFinalMove(true);
                    setShipPosition(1500); // Ensure the ship moves off-screen
                    setSummaryMessage(`لقد أجبت على جميع الأسئلة! نقاطك: ${points} عملات: ${coins}`); // Set the summary message
                } else {
                    setShipPosition(prev => prev + 55); // Move the ship forward after each correct answer
                }
            }, 1000);
        } else {
            setAttempts(prev => prev + 1);
            if (attempts >= 1) { // Corrected condition to handle two attempts
                incorrectAudioRef.current.play(); // Play incorrect answer sound
                setFeedbackMessage('لقد حاولت مرتين! سننتقل إلى الكلمة التالية.');
                setTimeout(() => {
                    setLaserColor('');
                    setFeedbackMessage('');
                    setClickedIndex(null);

                    const updatedWords = sidebarWords.filter(word => word.word !== currentWord);
                    const newWord = remainingWords.shift();
                    if (newWord) {
                        updatedWords.push(newWord);
                    }
                    setSidebarWords(updatedWords);
                    setSelectedImage(null);
                    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % updatedWords.length);
                    setAttempts(0);

                    if (updatedWords.length === 0 && remainingWords.length === 0) {
                        setGameEnded(true);
                        setIsFinalMove(true);
                        setShipPosition(1500); // Ensure the ship moves off-screen
                        setSummaryMessage(`لقد أجبت على جميع الأسئلة! نقاطك: ${points} عملات: ${coins}`); // Set the summary message
                    }
                }, 2000);
            } else {
                tryAgainAudioRef.current.play(); // Play try again sound
                setFeedbackMessage('حاول مرة أخرى 😊');
                setLaserColor('red');
                setTimeout(() => {
                    setLaserColor('');
                    setFeedbackMessage('');
                    setClickedIndex(null);
                }, 2000);
            }
        }
    };

    return (
        <>
            <img src={sunImage} alt="Sun" className="sun-photo" />
            <header className="header">
                <div className="back-button-container">
                    <button className="back-button" onClick={handleBackToLogin}>رجوع</button>
                </div>
                <div class="page-specific">
                <div className="score-display">
                    <CoinsDisplay coins={coins} />
                    <LevelDisplay level={level} />
                </div>
                </div>
            </header>
            <main className="photo-container" style={{ transform: `translateX(${shipPosition}px)`, transition: isFinalMove ? 'transform 2s ease' : 'transform 3s ease' }} onTransitionEnd={handleTransitionEnd}>
                <img src={boatImage} alt="Ship" className="ship-photo" />
            </main>
            <section className="center-container">
                <img src={octopusImage} alt="Octupus" className="octupus-photo" />
                <div className="word-on-sail">{currentWord}</div>
                <div className="wood-of-boat">
                    {selectedImage && (
                        <img src={selectedImage} alt="Selected" className={`selected-image ${animateImage ? 'animate' : ''}`} />
                    )}
                </div>
            </section>
            <div className="lottie-container">
                <Lottie animationData={wavesAnimation} />
            </div>
            {sidebarWords.length > 0 && !gameEnded && (
                <div className="photo-navigation">
                    <button className="nav-button" onClick={handlePrevious}>{'<'}</button>
                    {sidebarWords.map((item, index) => (
                        <img
                            key={index}
                            src={item.image}
                            alt={item.word}
                            className={`image-wrapper ${currentIndex === index ? 'visible' : ''}`}
                            onClick={() => handleImageClick(item.image, item.word, index)}
                        />
                    ))}
                    <button className="nav-button" onClick={handleNext}>{'>'}</button>
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
            {gameEnded && summaryMessage && (
                <div className="feedback-modal summary-modal">
                    <div className="feedback-content">
                        {summaryMessage}
                    </div>
                </div>
            )}
            <div className="controls">
                {/* Add controls and game logic here */}
            </div>
            <audio ref={correctAudioRef} src={correctSound} />
            <audio ref={tryAgainAudioRef} src={tryAgainSound} />
            <audio ref={incorrectAudioRef} src={incorrectSound} />
        </>
    );
};

export default ClipPhotoMatch;
