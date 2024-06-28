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

const LetterActivity = () => {
    const [currentLetters, setCurrentLetters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [skippedLetters, setSkippedLetters] = useState([]);
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

    const navigate = useNavigate();
    const { reward: rewardConfetti } = useReward('rewardId', 'confetti');

    useEffect(() => {
        generateRandomLetters();
    }, [round]);

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 3000); // Close the popup after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const generateRandomLetters = () => {
        const letterCount = round === 1 ? 10 : 8;
        const shuffledLetters = [...arabicLetters].sort(() => 0.5 - Math.random());
        setCurrentLetters(shuffledLetters.slice(0, letterCount));
        setCurrentIndex(0);
        setSkippedLetters([]);
        setCorrectCount(0);
        setIsRoundComplete(false);
        setShowMessage(false);
        setProgress(0); // Reset progress
    };

    const handleCardClick = () => {
        const clickedLetter = currentLetters[currentIndex];
        const newSkippedLetters = skippedLetters.filter(letter => letter !== clickedLetter);
        setSkippedLetters(newSkippedLetters);
        setCorrectCount(correctCount + 1);
        updatePoints(points + 10);
        updateCoins(coins + 5); // Update coins

        const isLastLetter = currentIndex === currentLetters.length - 1;

        if (correctCount + 1 === 5 && !badges.includes('star')) {
            setBadges([...badges, 'star']);
        }

        const progressIncrement = 100 / (currentLetters.length + skippedLetters.length); // Calculate progress increment
        setProgress(prevProgress => Math.min(prevProgress + progressIncrement, 100)); // Increment progress by a calculated step
        moveToNextLetter(newSkippedLetters, isLastLetter);
    };

    const handleSkip = () => {
        const skippedLetter = currentLetters[currentIndex];
        if (!skippedLetters.includes(skippedLetter)) {
            setSkippedLetters([...skippedLetters, skippedLetter]);
        }
        moveToNextLetter(skippedLetters, false);
    };

    const handleRestart = () => {
        setRound(round + 1);
    };

    const moveToNextLetter = (updatedSkippedLetters, isLastLetter) => {
        if (currentIndex < currentLetters.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (updatedSkippedLetters.length > 0) {
            setCurrentLetters(updatedSkippedLetters);
            setCurrentIndex(0);
            setShowPopup(true); // Show popup message
        } else {
            if (isLastLetter) {
                rewardConfetti();
            }
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
                            <p>الرجاء قراءة الأحرف التي تخطيتها قبل الانتقال إلى الجولة التالية.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="results">
                    <h2>!جولة مكتملة</h2>
                    <p>صحيح: {correctCount}</p>
                    <button className="control-button" onClick={handleRestart}>الجولة التالية</button>
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
