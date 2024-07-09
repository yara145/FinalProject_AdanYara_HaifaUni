import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LetterActivity.css';
import { useReward } from 'react-rewards';
import CoinsDisplay from '../components/CoinsDisplay';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import LevelDisplay from '../components/LevelDisplay';

const arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];

const levelThresholds = [0, 50, 100, 200, 400]; // Example level thresholds

const divideLettersIntoRounds = (letters) => {
    const shuffledLetters = [...letters].sort(() => 0.5 - Math.random());
    const roundSize = Math.ceil(shuffledLetters.length / 3);
    return [
        shuffledLetters.slice(0, roundSize),
        shuffledLetters.slice(roundSize, roundSize * 2),
        shuffledLetters.slice(roundSize * 2)
    ];
};

const [round1Letters, round2Letters, round3Letters] = divideLettersIntoRounds(arabicLetters);

const LetterActivity = () => {
    const [currentLetters, setCurrentLetters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [round, setRound] = useState(1);
    const [isRoundComplete, setIsRoundComplete] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [coins, setCoins] = useState(0);
    const [badges, setBadges] = useState([]);
    const [progress, setProgress] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(1); // Track the number of attempts left

    const navigate = useNavigate();
    const { reward: rewardConfetti } = useReward('rewardId', 'confetti');

    useEffect(() => {
        generateRoundLetters();
    }, [round]);

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 3000); // Close the popup after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const generateRoundLetters = () => {
        let roundLetters;
        switch(round) {
            case 1:
                roundLetters = round1Letters;
                break;
            case 2:
                roundLetters = round2Letters;
                break;
            case 3:
                roundLetters = round3Letters;
                break;
            default:
                roundLetters = [];
        }
        setCurrentLetters(roundLetters);
        setCurrentIndex(0);
        setCorrectCount(0);
        setIsRoundComplete(false);
        setShowMessage(false);
        setProgress(0); // Reset progress
        setAttemptsLeft(1); // Reset attempts for the next round
    };

    const handleCardClick = () => {
        setCorrectCount(correctCount + 1);
        updatePoints(points + 10);
        updateCoins(coins + 5); // Update coins

        if (correctCount + 1 === 5 && !badges.includes('star')) {
            setBadges([...badges, 'star']);
        }

        const progressIncrement = 100 / currentLetters.length; // Calculate progress increment
        setProgress(prevProgress => Math.min(prevProgress + progressIncrement, 100)); // Increment progress by a calculated step
        moveToNextLetter();
    };

    const handleSkip = () => {
        if (attemptsLeft > 0) {
            setShowPopup(true);
            setShowMessage(true);
            setAttemptsLeft(attemptsLeft - 1);
        } else {
            moveToNextLetter();
        }
    };

    const handleRestart = () => {
        if (round < 3) {
            setRound(round + 1);
        } else {
            setRound(1); // Reset to the first round if it's the end of the third round
        }
        setAttemptsLeft(1); // Reset attempts for the next round
    };

    const moveToNextLetter = () => {
        if (currentIndex < currentLetters.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAttemptsLeft(1); // Reset attempts for the next letter
        } else {
            rewardConfetti();
            setIsRoundComplete(true);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const updatePoints = (newPoints) => {
        setPoints(newPoints);
        checkLevelUp(newPoints);
    };

    const updateCoins = (newCoins) => {
        setCoins(newCoins);
    };

    const checkLevelUp = (newPoints) => {
        const newLevel = levelThresholds.findIndex(threshold => newPoints < threshold);
        if (newLevel > level) {
            setLevel(newLevel);
        }
    };

    return (
        <div className="letter-activity">
            <div className="header">
                <div className="back-button-container">
                    <button className="back-button" onClick={handleBackToLogin}>رجوع</button>
                </div>
                <div className="score-display">
                    <div className="coins-container">
                        <CoinsDisplay coins={coins} />
                    </div>
                    <div className="level-container">
                        <LevelDisplay level={level} />
                    </div>
                </div>
            </div>
            <ProgressBar progress={progress} />
            <div className="badges">
                {badges.map(badge => <Badge key={badge} badgeType={badge} />)}
            </div>
            <div id="rewardId" style={{ position: 'relative' }}></div>
            {!isRoundComplete ? (
                <>
                    <div className="letter-card" onClick={handleCardClick}>
                        <div className="letter">{currentLetters[currentIndex]}</div>
                    </div>
                    {showPopup && (
                        <div className="popup-message">
                            <p>لقد تجاوزت المحاولة. لديك محاولة أخرى.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="results">
                    <h2>!جولة مكتملة</h2>
                    <p>صحيح: {correctCount}</p>
                    {round < 3 && (
                        <button className="control-button" onClick={handleRestart}>الجولة التالية</button>
                    )}
                </div>
            )}
            {!isRoundComplete && (
                <div className="controls">
                    <button className="control-button skip-button" onClick={handleSkip}>
                        تخطي 
                    </button>
                </div>
            )}
        </div>
    );
};

export default LetterActivity;
