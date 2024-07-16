import React, { useState, useEffect, useRef } from 'react';
import './ClipActivity.css';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import { useNavigate } from 'react-router-dom';
import boatImage from '../../assets/images/Ship.png';
import Lottie from 'lottie-react';
import wavesAnimation from '../../assets/animation/waves-animation.json';
import sunAnimation from '../../assets/animation/sun.json';
import fishAnimation from '../../assets/animation/fish-animation.json';
import crabAnimation from '../../assets/animation/crap.json';
import wheelAnimation from '../../assets/animation/wheel.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import restartButtonImage from '../../assets/images/restart.png';
import correctAnimation from '../../assets/animation/true.json';
import incorrectAnimation from '../../assets/animation/false.json';
import garlicImage from '../../assets/images/garlic.png';
import monkeyImage from '../../assets/images/monkey.png';
import wellImage from '../../assets/images/well.png';
import sandcastleImage from '../../assets/images/sand.png';
import cryImage from '../../assets/images/crying.png';
import shopImage from '../../assets/shop.jpg';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backButtonSound from '../../assets/sound/backBT.wav';
import exitButtonSound from '../../assets/sound/backBT.wav';
import forwardSound from '../../assets/sound/forward.mp3';

const allWords = [
    { word: "قرد", image: monkeyImage },
    { word: "ثوم", image: garlicImage },
    { word: "بئر", image: wellImage },
    { word: "رمل", image: sandcastleImage },
    { word: "دمع", image: cryImage },
    { word: "سوق", image: shopImage }
];

const initialWords = allWords.slice(0, 4);

const ClipActivity = () => {
    const [coins, setCoins] = useState(0);
    const [level, setLevel] = useState(1);
    const [points, setPoints] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [sidebarWords, setSidebarWords] = useState(initialWords);
    const [remainingWords, setRemainingWords] = useState(allWords.slice(4));
    const [shipPosition, setShipPosition] = useState(0);
    const [animationData, setAnimationData] = useState(null);
    const [laserColor, setLaserColor] = useState('');
    const [clickedIndex, setClickedIndex] = useState(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [isFinalMove, setIsFinalMove] = useState(false);
    const [summaryMessage, setSummaryMessage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentWord = sidebarWords[currentWordIndex]?.word;

    const navigate = useNavigate();

    const correctAudioRef = useRef(null);
    const incorrectAudioRef = useRef(null);
    const backAudioRef = useRef(null);
    const forwardAudioRef = useRef(null);
    const exitAudioRef = useRef(null);

    useEffect(() => {
        backAudioRef.current = new Audio(backButtonSound);
        backAudioRef.current.load();
        forwardAudioRef.current = new Audio(forwardSound);
        forwardAudioRef.current.load();
        exitAudioRef.current = new Audio(exitButtonSound);
        exitAudioRef.current.load();
    }, []);

    useEffect(() => {
        if (shipPosition > 0) {
            forwardAudioRef.current.currentTime = 0;
            forwardAudioRef.current.play().catch(error => {
                console.error('Error playing forward sound:', error);
            });
        }
    }, [shipPosition]);

    const handleTransitionEnd = () => {
        if (gameEnded) {
            setTimeout(() => {}, 5000);
        }
    };

    const handleBackClick = () => {
        if (backAudioRef.current) {
            backAudioRef.current.currentTime = 0;
            backAudioRef.current.play().catch(error => {
                console.error('Error playing back button sound:', error);
            });
        }
        navigate('/login');
    };

    const handleExitClick = () => {
        if (exitAudioRef.current) {
            exitAudioRef.current.currentTime = 0;
            exitAudioRef.current.play().catch(error => {
                console.error('Error playing exit button sound:', error);
            });
        }
        navigate('/');
    };

    const handleRestartClick = () => {
        window.location.reload();
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % sidebarWords.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + sidebarWords.length) % sidebarWords.length);
    };

    const handleImageClick = (image, alt, index) => {
        if (index !== currentIndex) {
            return;
        }

        setClickedIndex(index);
        if (alt === currentWord) {
            correctAudioRef.current.play();
            setPoints(points + 1);
            setSelectedImage(image);
            setCoins(coins + 1);
            setLaserColor('laser-green');
            setAnimationData(correctAnimation);

            setTimeout(() => {
                setLaserColor('');
                setClickedIndex(null);
                setAnimationData(null);

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
                    setShipPosition(1500);
                    setSummaryMessage(`لقد أجبت على جميع الأسئلة! نقاطك: ${points} عملات: ${coins}`);
                } else {
                    setShipPosition(prev => prev + 55);
                }
            }, 2000);
        } else {
            incorrectAudioRef.current.play();
            setAnimationData(incorrectAnimation);
            setLaserColor('laser-red');
            setTimeout(() => {
                setLaserColor('');
                setAnimationData(null);
                setClickedIndex(null);

                const updatedWords = sidebarWords.filter(word => word.word !== currentWord);
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
                    setShipPosition(1500);
                    setSummaryMessage(`لقد أجبت على جميع الأسئلة! نقاطك: ${points} عملات: ${coins}`);
                }
            }, 2000);
        }
    };

    return (
        <>
            <div className="sun-animation">
                <Lottie animationData={sunAnimation} />
            </div>
            <header className="header">
                <div className="button-container">
                    <div className="exit-button-wrapper">
                        <img 
                            src={exitButtonImage} 
                            alt="Exit" 
                            className="exit-button-image"
                            onClick={handleExitClick}
                        />
                    </div>
                    <div className="back-button-wrapper">
                        <img 
                            src={backButtonImage} 
                            alt="Back" 
                            className="back-button-image"
                            onClick={handleBackClick}
                        />
                    </div>
                </div>
                <div className="score-display">
                    <CoinsDisplay coins={coins} />
                    <LevelDisplay level={level} />
                </div>
            </header>

            <main className="photo-container" style={{ transform: `translateX(${shipPosition}px)`, transition: isFinalMove ? 'transform 2s ease' : 'transform 3s ease' }} onTransitionEnd={handleTransitionEnd}>
                <img src={boatImage} alt="Ship" className="ship-photo" />
            </main>
            {gameEnded ? (
                <>
                    <div className="fish-animation left">
                        <Lottie animationData={fishAnimation} />
                    </div>
                    <div className="fish-animation right">
                        <Lottie animationData={fishAnimation} />
                    </div>
                    <div className="fish-animation left reverse">
                        <Lottie animationData={fishAnimation} />
                    </div>
                    <div className="fish-animation right reverse">
                        <Lottie animationData={fishAnimation} />
                    </div>
                    <div className="fish-animation center">
                        <Lottie animationData={fishAnimation} />
                    </div>
                    <div className="fish-animation extra-left">
                        <Lottie animationData={fishAnimation} />
                    </div>
                    <div className="fish-animation extra-right">
                        <Lottie animationData={fishAnimation} />
                    </div>
                </>
            ) : (
                <section className="center-container">
                    <div className="word-on-sail">{currentWord}</div>
                    <div className="wood-of-boat">
                        {selectedImage && (
                            <img src={selectedImage} alt="Selected" className={`selected-image ${laserColor}`} />
                        )}
                    </div>
                </section>
            )}
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
                            className={`image-wrapper ${currentIndex === index ? 'visible' : ''} ${clickedIndex === index ? laserColor : ''}`}
                            onClick={() => handleImageClick(item.image, item.word, index)}
                        />
                    ))}
                    <button className="nav-button" onClick={handleNext}>{'>'}</button>
                </div>
            )}
            {animationData && (
                <div className="animation-container">
                    <Lottie animationData={animationData} />
                </div>
            )}
            {gameEnded && summaryMessage && (
                <div className="feedback-modal summary-modal">
                    <div className="wheel-animation">
                        <Lottie animationData={wheelAnimation} />
                    </div>
                    <div className="summary-content">
                        <div>{`لقد أجبت على جميع الأسئلة!`}</div>
                        <div>{`مجموع النقاط: ${points}`}</div>
                        <div>{`مستوى: ${level}`}</div>
                    </div>
                    <div className="summary-buttons">
                        <img 
                            src={restartButtonImage} 
                            alt="Restart" 
                            onClick={handleRestartClick}
                        />
                        <img 
                            src={exitButtonImage} 
                            alt="Exit" 
                            onClick={handleExitClick}
                        />
                    </div>
                    <div className="crab-animation">
                        <Lottie animationData={crabAnimation} />
                    </div>
                </div>
            )}
            <div className="controls">
                {/* Add controls and game logic here */}
            </div>
            <audio ref={correctAudioRef} src={correctSound} preload="auto" />
            <audio ref={incorrectAudioRef} src={incorrectSound} preload="auto" />
        </>
    );
};

export default ClipActivity;
