import React, { useState, useEffect } from 'react';
import './WordShuffle.css';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import CandyProgressBar from '../components/ProgressBar'; // Correct import
import backgroundVideo from '../../assets/videos/background.mp4';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav';

const getShuffledLetters = (letters) => {
  let shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }
  return shuffledLetters;
};

const predefinedWords = [
  { word: 'قرد', letters: ['ق', 'ر', 'د'], photo: require('../../assets/images/monkey.png') },
  { word: 'بئر', letters: ['ب', 'ئ', 'ر'], photo: require('../../assets/images/well.png') },
  { word: 'كتاب', letters: ['ك', 'ت', 'ا', 'ب'], photo: require('../../assets/images/book.png') },
  { word: 'مدرسة', letters: ['م', 'د', 'ر', 'س', 'ة'], photo: require('../../assets/images/school.png') },
  { word: 'شمس', letters: ['ش', 'م', 'س'], photo: require('../../assets/images/Sun2.png') }
];

const WordShuffle = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState(getShuffledLetters(predefinedWords[0].letters));
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedLetters, setDisplayedLetters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);
  const buttonAudio = new Audio(buttonSound);

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
    buttonAudio.play();
    if (selectedLetters.length < predefinedWords[currentWordIndex].letters.length) {
      const newSelectedLetters = [...selectedLetters, letter];
      setSelectedLetters(newSelectedLetters);
      setSelectedPositions([...selectedPositions, index]);

      const formedWord = newSelectedLetters.join('');
      if (formedWord === predefinedWords[currentWordIndex].word) {
        correctAudio.play();
        setFeedback('صحيح!');
        setTimeout(() => {
          setCoins(coins + 1);
          setLevel(level + 1);
          const nextWordIndex = (currentWordIndex + 1) % predefinedWords.length;
          setCurrentWordIndex(nextWordIndex);
          setLetters(getShuffledLetters(predefinedWords[nextWordIndex].letters));
          setDisplayedLetters([]);
          setSelectedLetters([]);
          setSelectedPositions([]);
          setFeedback(null);
          setAttempts(0);
        }, 2000); // Delay to allow the full word to be displayed
      } else if (newSelectedLetters.length === predefinedWords[currentWordIndex].letters.length) {
        setAttempts(attempts + 1);
        if (attempts + 1 >= 2) {
          incorrectAudio.play();
          setFeedback('غير صحيح');
          setTimeout(() => {
            const nextWordIndex = (currentWordIndex + 1) % predefinedWords.length;
            setCurrentWordIndex(nextWordIndex);
            setLetters(getShuffledLetters(predefinedWords[nextWordIndex].letters));
            setDisplayedLetters([]);
            setSelectedLetters([]);
            setSelectedPositions([]);
            setFeedback(null);
            setAttempts(0);
          }, 2000);
        } else {
          setFeedback('حاول مرة أخرى!');
          setTimeout(() => {
            setSelectedLetters([]);
            setSelectedPositions([]);
            setFeedback(null);
          }, 2000);
        }
      }
    }
  };

  const handleBackClick = () => {
    buttonAudio.play();
    navigate('/levels/island');
  };

  const handleExitClick = () => {
    buttonAudio.play();
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
              <LevelDisplay className="level-display" level={level} />
            </div>
          </div>
          <div className="progress-bar-wrapper">
            <CandyProgressBar progress={(currentWordIndex / predefinedWords.length) * 100} />
          </div>
          <div className="word-shuffle-content">
            <div className="word-shuffle-photo-container">
              <img
                src={predefinedWords[currentWordIndex].photo}
                alt="Word"
                className="word-shuffle-photo"
              />
            </div>
            <div className="word-shuffle-letters-and-word-container">
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
              {feedback && (
                <div className={`word-shuffle-feedback ${feedback === 'صحيح!' ? 'correct' : 'incorrect'}`}>
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WordShuffle;
