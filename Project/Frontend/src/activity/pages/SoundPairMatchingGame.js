// SoundPairMatchingGame.js
import React, { useState, useEffect } from 'react';
import './SoundPairMatchingGame.css';
import { useNavigate } from 'react-router-dom';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backSound from '../../assets/sound/backBT.wav';
import BackgroundModal from '../../Teacher/Modal';
import CreateActivityForm from '../../Teacher/ChooseBg';
import ProgressBar from '../components/ProgressBar'; // Adjust the path if necessary
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const backAudio = new Audio(backSound);
correctAudio.preload = 'auto';
incorrectAudio.preload = 'auto';
backAudio.preload = 'auto';

const SoundPairMatchingGame = () => {
    const [progress, setProgress] = useState(0); // Track progress
    const [pairs, setPairs] = useState([{ word1: '', word2: '' }]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [draggedWord, setDraggedWord] = useState(null);
    const [dropZone1, setDropZone1] = useState(null);
    const [dropZone2, setDropZone2] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [coins, setCoins] = useState(0);
    const [level, setLevel] = useState(1);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [isBgModalOpen, setIsBgModalOpen] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState(null);
    const navigate = useNavigate();

    const [isPlaying, setIsPlaying] = useState(false);
    const playAudio = (audio) => {
        if (isPlaying) return;
        setIsPlaying(true);

        audio.pause();
        audio.currentTime = 0;
        audio.play()
            .then(() => setIsPlaying(false))
            .catch((error) => {
                console.error('Audio playback failed:', error);
                setIsPlaying(false);
            });
    };

    const handleAddPair = () => {
        setPairs([...pairs, { word1: '', word2: '' }]);
    };

    const handleRemovePair = (index) => {
        setPairs(pairs.filter((_, i) => i !== index));
    };

    const handleWordChange = (index, field, value) => {
        const updatedPairs = [...pairs];
        updatedPairs[index][field] = value;
        setPairs(updatedPairs);
    };

    const handleStartGame = () => {
        if (pairs.every(pair => pair.word1 && pair.word2)) {
            const shuffled = pairs.flatMap(pair => [pair.word1, pair.word2]).sort(() => Math.random() - 0.5);
            setShuffledWords(shuffled);
            setIsGameStarted(true);
            setMatchedPairs([]);
            setFeedbackMessage('');
        } else {
            alert('يرجى إدخال جميع أزواج الكلمات.');
        }
    };

    const handleDragStart = (word) => {
        setDraggedWord(word);
    };

    const handleDrop = (zone, word) => {
        if (zone === 1) {
            setDropZone1(word);
        } else {
            setDropZone2(word);
        }
    };
// Update progress inside the match logic
useEffect(() => {
    if (dropZone1 && dropZone2) {
        const isMatch = pairs.some(pair => (
            (pair.word1 === dropZone1 && pair.word2 === dropZone2) ||
            (pair.word1 === dropZone2 && pair.word2 === dropZone1)
        ));
        if (isMatch) {
            playAudio(correctAudio);
            setMatchedPairs([...matchedPairs, dropZone1, dropZone2]);
            setFeedbackMessage('🎉 إجابة صحيحة!');
            setFeedbackType('correct');
            setCoins(coins + 10);

            // Remove matched words from shuffledWords
            setShuffledWords(shuffledWords.filter(word => word !== dropZone1 && word !== dropZone2));

            // Update progress percentage
            const newProgress = ((matchedPairs.length + 2) / (pairs.length * 2)) * 100;
            setProgress(newProgress);
        } else {
            playAudio(incorrectAudio);
            setFeedbackMessage('❌ حاول مرة أخرى.');
            setFeedbackType('incorrect');
        }
        setDropZone1(null);
        setDropZone2(null);
        setTimeout(() => {
            setFeedbackMessage('');
        }, 1000);
    }
}, [dropZone1, dropZone2, pairs, matchedPairs, coins, shuffledWords]);


    const handleBackgroundSelect = (background) => {
        setSelectedBackground(background);
        setIsBgModalOpen(false);
    };

    const handleBackClick = () => {
        playAudio(backAudio);
        setTimeout(() => navigate('/activity-selection'), 0);
    };

    const handleExitClick = () => {
        playAudio(backAudio);
        setTimeout(() => navigate('/'), 0);
    };

// Add the ProgressBar component to the game phase
return (
    <div
        className="sound-pair-matching-game"
        style={
            isGameStarted && selectedBackground
                ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover' }
                : {}
        }
    >
       {isGameStarted ? (
    <div className="game-container-wrapper">
        <div className="game-phase">
            <ProgressBar progress={progress} /> {/* Add the progress bar */}
            <h2 className="game-instruction">قم بمطابقة الكلمتين اللتين لهما نفس الصوت!</h2> {/* New instruction line */}
            <div className="top-bar">
                <div className="score-display">
                    <CoinsDisplay coins={coins} />
                    <LevelDisplay level={level} />
                </div>
                <div className="button-container">
                    <img src={backButtonImage} alt="Back" className="nav-icon" onClick={handleBackClick} />
                    <img src={exitButtonImage} alt="Exit" className="nav-icon" onClick={handleExitClick} />
                </div>
            </div>
            <div className="game-container">
                <div className="word-grid">
                    {shuffledWords.map((word, index) => (
                        <div
                            key={index}
                            className={`word-box ${matchedPairs.includes(word) ? 'matched' : ''}`}
                            draggable={!matchedPairs.includes(word)}
                            onDragStart={() => handleDragStart(word)}
                        >
                            {word}
                        </div>
                    ))}
                </div>
                <div className="drop-zones">
                    <div className="drop-zone" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(1, draggedWord)}>
                        {dropZone1 || 'منطقة السحب 1'}
                    </div>
                    <div className="drop-zone" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(2, draggedWord)}>
                        {dropZone2 || 'منطقة السحب 2'}
                    </div>
                </div>
            </div>
            {feedbackMessage && (
                <div className={`feedback-message ${feedbackType}`}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    </div>
) : (
     
                <div className="input-phase">
                    <header className="teacher-header">
                        <nav className="teacher-nav">
                            <button className="nav-button" onClick={handleExitClick}>خروج</button>
                            <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
                            <button className="nav-button" onClick={handleBackClick}>رجوع</button>
                        </nav>
                    </header>
                    <div className="input-container">
                    <h2 style={{ color: '#4caf50', fontSize: '1.9rem' }}>أدخل أزواج الكلمات</h2>

                        {pairs.map((pair, index) => (
                            <div key={index} className="pair-block">
                                <input
                                    type="text"
                                    placeholder="الكلمة 1"
                                    value={pair.word1}
                                    onChange={(e) => handleWordChange(index, 'word1', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="الكلمة 2"
                                    value={pair.word2}
                                    onChange={(e) => handleWordChange(index, 'word2', e.target.value)}
                                />
                                <button className="cancel-button" onClick={() => handleRemovePair(index)}>✖</button>
                            </div>
                        ))}
                        <div className="button-group">
                            <button className="custom-add-word-button" onClick={handleAddPair}>+ إضافة زوج</button>
                            <button className="custom-background-button" onClick={() => setIsBgModalOpen(true)}>اختر خلفية</button>
                        </div>
                        <BackgroundModal isOpen={isBgModalOpen} onClose={() => setIsBgModalOpen(false)}>
                            <CreateActivityForm onBackgroundSelect={handleBackgroundSelect} />
                        </BackgroundModal>
                        {selectedBackground && (
                            <div className="selected-background-preview">
                                <h4>الخلفية المختارة:</h4>
                                <img src={selectedBackground} alt="Selected Background" className="preview-image" />
                            </div>
                        )}
                        <button className="start-game-button" onClick={handleStartGame}>بدء اللعبة</button>
                    </div>
                </div>
            )}
        </div>
    );
    
    
};

export default SoundPairMatchingGame;
