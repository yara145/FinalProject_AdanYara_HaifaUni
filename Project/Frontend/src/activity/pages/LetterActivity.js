// src/activity/pages/LetterActivity.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LetterActivity.css';
import ProgressBar from '../components/ProgressBar';
import lionImage from '../../assets/lion.png';

const arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];

const LetterActivity = () => {
    const [currentLetters, setCurrentLetters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [round, setRound] = useState(1);
    const [isRoundComplete, setIsRoundComplete] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        generateRandomLetters();
    }, [round]);

    const generateRandomLetters = () => {
        const letterCount = round === 1 ? 10 : 8;
        const shuffledLetters = [...arabicLetters].sort(() => 0.5 - Math.random());
        setCurrentLetters(shuffledLetters.slice(0, letterCount));
        setCurrentIndex(0);
        setCorrectCount(0);
        setIsRoundComplete(false);
    };

    const handleCardClick = () => {
        setCorrectCount(correctCount + 1);
        moveToNextLetter();
    };

    const handleSkip = () => {
        moveToNextLetter();
    };

    const handleRestart = () => {
        setRound(round + 1);
    };

    const moveToNextLetter = () => {
        if (currentIndex < currentLetters.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsRoundComplete(true);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="letter-activity">
            <div className="header">
                <img src={lionImage} alt="Lion Icon" className="lion-icon" />
                <ProgressBar progress={(currentIndex + 1) / currentLetters.length * 100} />
                <button className="back-button" onClick={handleBackToLogin}>Back to Login</button>
            </div>
            {!isRoundComplete ? (
                <div className="letter-card" onClick={handleCardClick}>
                    <div className="letter">{currentLetters[currentIndex]}</div>
                </div>
            ) : (
                <div className="results">
                    <h2>Round Complete!</h2>
                    <p>Correct: {correctCount}</p>
                    <button className="control-button" onClick={handleRestart}>Next Round</button>
                </div>
            )}
            {!isRoundComplete && (
                <div className="controls">
                    <button className="control-button" onClick={handleSkip}>Skip</button>
                </div>
            )}
        </div>
    );
};

export default LetterActivity;
