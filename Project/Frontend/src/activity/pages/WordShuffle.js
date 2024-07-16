import React, { useState, useEffect } from 'react';
import './WordShuffle.css';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import backgroundVideo from '../../assets/videos/background.mp4'; // Your video path

const predefinedWords = [
  { word: 'قرد', letters: ['ق', 'ر', 'د'] },
  { word: 'ثوم', letters: ['ث', 'و', 'م'] },
  { word: 'بئر', letters: ['ب', 'ئ', 'ر'] },
  { word: 'كتاب', letters: ['ك', 'ت', 'ا', 'ب'] },
  { word: 'مدرسة', letters: ['م', 'د', 'ر', 'س', 'ة'] },
  { word: 'شمس', letters: ['ش', 'م', 'س'] }
];

const getShuffledLetters = (letters) => {
  let shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }
  return shuffledLetters;
};

const WordShuffle = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState(getShuffledLetters(predefinedWords[0].letters));
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedLetters, setDisplayedLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < letters.length) {
        setDisplayedLetters((prev) => [...prev, letters[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [letters]);

  const handleLetterClick = (letter, index) => {
    if (selectedLetters.length < predefinedWords[currentWordIndex].letters.length) {
      const newSelectedLetters = [...selectedLetters, letter];
      setSelectedLetters(newSelectedLetters);
      setSelectedPositions([...selectedPositions, index]);

      const formedWord = newSelectedLetters.join('');
      if (formedWord === predefinedWords[currentWordIndex].word) {
        setTimeout(() => {
          setCoins(coins + 1);
          setLevel(level + 1);
          const nextWordIndex = (currentWordIndex + 1) % predefinedWords.length;
          setCurrentWordIndex(nextWordIndex);
          setLetters(getShuffledLetters(predefinedWords[nextWordIndex].letters));
          setDisplayedLetters([]);
          setSelectedLetters([]);
          setSelectedPositions([]);
        }, 2000); // Delay to allow the full word to be displayed
      }
    }
  };

  const handleBackClick = () => {
    navigate('/previous-page');
  };

  const handleExitClick = () => {
    navigate('/');
  };

  return (
    <div className="word-shuffle-container">
      {!isLoading && (
        <video className="background-video" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      {isLoading ? (
        <div className="word-shuffle-loading-container">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : (
        <>
          <div className="word-shuffle-top-bar">
            <div className="word-shuffle-button-container">
              <img
                src={backButtonImage}
                alt="Back"
                className="word-shuffle-button-image"
                onClick={handleBackClick}
              />
              <img
                src={exitButtonImage}
                alt="Exit"
                className="word-shuffle-button-image"
                onClick={handleExitClick}
              />
            </div>
            <div className="word-shuffle-score-display">
              <CoinsDisplay coins={coins} />
              <LevelDisplay level={level} />
            </div>
          </div>
          <div className="word-shuffle-letters-container">
            <div className="word-shuffle-grid word-shuffle-grid-cols-3 word-shuffle-gap-4">
              {displayedLetters.map((letter, index) => (
                <div
                  key={index}
                  className={`word-shuffle-letter-tile word-shuffle-bg-${(index % 6) + 1} animated-tile`}
                  style={
                    selectedPositions.includes(index)
                      ? { opacity: 0.5, pointerEvents: 'none' }
                      : {}
                  }
                  onClick={() => handleLetterClick(letter, index)}
                >
                  {letter}
                </div>
              ))}
            </div>
            {selectedLetters.length > 0 && (
              <div className="word-shuffle-selected-letters-container">
                {selectedLetters.map((letter, index) => (
                  <div
                    key={index}
                    className={`word-shuffle-selected-letter word-shuffle-bg-selected-${(index % 6) + 1} animated-tile`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WordShuffle;
