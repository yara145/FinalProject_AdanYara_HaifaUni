import React, { useState, useEffect } from 'react';
import './CustomWordShuffle.css';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav';
import axios from 'axios';

const getShuffledLetters = (letters) => {
  let shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }
  return shuffledLetters;
};

const CustomWordShuffle = ({ studentId }) => {
  const [wordsWithPhotos, setWordsWithPhotos] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedLetters, setDisplayedLetters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();
  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);
  const buttonAudio = new Audio(buttonSound);

  useEffect(() => {
    // Fetch activities for this student
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`/api/students/${studentId}/activities/word-shuffle`);
        setWordsWithPhotos(response.data);
        startGame(response.data[0].word); // Start with first word
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };
    fetchActivities();
  }, [studentId]);

  const startGame = (firstWord) => {
    const firstWordLetters = firstWord.split('');
    setLetters(getShuffledLetters(firstWordLetters));
    setIsGameStarted(true);
    setIsLoading(false);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < letters.length) {
        setDisplayedLetters((prev) => [...prev, letters[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [letters]);

  const handleLetterClick = (letter, index) => {
    buttonAudio.play();
    const newSelectedLetters = [...selectedLetters, letter];
    setSelectedLetters(newSelectedLetters);
    setSelectedPositions([...selectedPositions, index]);

    const formedWord = newSelectedLetters.join('');
    if (formedWord === wordsWithPhotos[currentWordIndex].word) {
      correctAudio.play();
      setFeedback('صحيح!');
      setTimeout(() => {
        updateScore();
        goToNextWord();
      }, 2000);
    } else if (newSelectedLetters.length === letters.length) {
      handleIncorrect();
    }
  };

  const handleIncorrect = () => {
    setAttempts(attempts + 1);
    if (attempts >= 2) {
      incorrectAudio.play();
      setFeedback('حاول مرة أخرى');
      resetGame();
    } else {
      setFeedback('حاول مرة أخرى');
      setSelectedLetters([]);
      setSelectedPositions([]);
    }
  };

  const updateScore = () => {
    setCoins(coins + 1);
    setLevel(level + 1);
    // You can also save score and progress in the backend here.
  };

  const goToNextWord = () => {
    const nextWordIndex = (currentWordIndex + 1) % wordsWithPhotos.length;
    setCurrentWordIndex(nextWordIndex);
    setLetters(getShuffledLetters(wordsWithPhotos[nextWordIndex].word.split('')));
    resetGame();
  };

  const resetGame = () => {
    setDisplayedLetters([]);
    setSelectedLetters([]);
    setSelectedPositions([]);
    setFeedback(null);
    setAttempts(0);
  };

  const handleBackClick = () => {
    buttonAudio.play();
    navigate('/activity-selection');
  };

  const handleExitClick = () => {
    buttonAudio.play();
    navigate('/');
  };

  return (
    <div className="custom-word-shuffle-container">
      <header className="teacher-header">
        {isGameStarted && (
          <nav className="teacher-nav">
            <button className="nav-button" onClick={handleExitClick}>خروج</button>
            <button className="nav-button" onClick={handleBackClick}>خلف</button>
          </nav>
        )}
      </header>

      {!isGameStarted ? (
        isLoading ? (
          <div className="custom-word-shuffle-loading-container">
            <Lottie animationData={loadingAnimation} />
          </div>
        ) : (
          <div className="start-game-message">
            <button className="start-game-button" onClick={() => startGame(wordsWithPhotos[0].word)}>بدء اللعبة</button>
          </div>
        )
      ) : (
        <>
          <div className="custom-word-shuffle-top-bar">
            <div className="custom-word-shuffle-score-display">
              <CoinsDisplay coins={coins} />
              <LevelDisplay level={level} />
            </div>
          </div>
          <div className="custom-word-shuffle-content">
            <div className="custom-word-shuffle-photo-container">
              <img src={wordsWithPhotos[currentWordIndex].photo} alt="Word" className="custom-word-shuffle-photo" />
            </div>
            <div className="custom-word-shuffle-letters-container">
              <div className="custom-word-shuffle-grid custom-word-shuffle-grid-cols-3 custom-word-shuffle-gap-4">
                {displayedLetters.map((letter, index) => (
                  <div
                    key={index}
                    className={`custom-word-shuffle-letter-tile custom-word-shuffle-bg-${(index % 6) + 1} animated-tile`}
                    style={selectedPositions.includes(index) ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    onClick={() => handleLetterClick(letter, index)}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            {selectedLetters.length > 0 && (
              <div className="custom-word-shuffle-selected-letters-container">
                {selectedLetters.map((letter, index) => (
                  <div key={index} className={`custom-word-shuffle-selected-letter custom-word-shuffle-bg-selected-${(index % 6) + 1}`}>
                    {letter}
                  </div>
                ))}
              </div>
            )}
            {feedback && <div className={`custom-word-shuffle-feedback ${feedback === 'صحيح!' ? 'correct' : 'incorrect'}`}>{feedback}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomWordShuffle;
