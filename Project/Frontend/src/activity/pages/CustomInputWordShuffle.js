import React, { useState, useEffect } from 'react';
import './CustomWordShuffle.css';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
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

const CustomWordShuffle = () => {
  const [wordsWithPhotos, setWordsWithPhotos] = useState([{ word: '', photo: null }]);
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

  const handleWordChange = (index, value) => {
    const updatedWords = [...wordsWithPhotos];
    updatedWords[index].word = value;
    setWordsWithPhotos(updatedWords);
  };

  const handleImageUpload = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const updatedWords = [...wordsWithPhotos];
      updatedWords[index].photo = URL.createObjectURL(event.target.files[0]);
      setWordsWithPhotos(updatedWords);
    }
  };

  const handleAddWordPhotoField = () => {
    setWordsWithPhotos([...wordsWithPhotos, { word: '', photo: null }]);
  };

  const handleStartGame = () => {
    if (wordsWithPhotos.every(entry => entry.word && entry.photo)) {
      const firstWordLetters = wordsWithPhotos[0].word.split('');
      setLetters(getShuffledLetters(firstWordLetters));
      setIsGameStarted(true);
      setIsLoading(false);
    }
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
      setFeedback('Correct!');
      setTimeout(() => {
        setCoins(coins + 1);
        setLevel(level + 1);
        const nextWordIndex = (currentWordIndex + 1) % wordsWithPhotos.length;
        setCurrentWordIndex(nextWordIndex);
        setLetters(getShuffledLetters(wordsWithPhotos[nextWordIndex].word.split('')));
        resetGame();
      }, 2000); // Delay for feedback
    } else if (newSelectedLetters.length === letters.length) {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        incorrectAudio.play();
        setFeedback('Try Again');
        setTimeout(() => resetGame(), 2000);
      } else {
        setFeedback('Try Again');
        setTimeout(() => {
          setSelectedLetters([]);
          setSelectedPositions([]);
          setFeedback(null);
        }, 2000);
      }
    }
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
    navigate('/levels/island');
  };

  const handleExitClick = () => {
    buttonAudio.play();
    navigate('/');
  };

  return (
    <div className="custom-word-shuffle-container">
      {!isGameStarted ? (
        <div className="custom-word-input-form">
          <h2>Enter your words and upload a photo for each:</h2>
          <p>Upload words and photos that the user will use in the game.</p>
          {wordsWithPhotos.map((entry, index) => (
            <div key={index} className="custom-word-input-pair">
              <input
                type="text"
                placeholder={`Enter word ${index + 1}`}
                value={entry.word}
                onChange={(e) => handleWordChange(index, e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
              />
            </div>
          ))}
          <button className="custom-add-word-button" onClick={handleAddWordPhotoField}>
            + Add another word and photo
          </button>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      ) : isLoading ? (
        <div className="custom-word-shuffle-loading-container">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : (
        <>
          <div className="custom-word-shuffle-top-bar">
            <div className="custom-word-shuffle-button-container">
              <img
                src={backButtonImage}
                alt="Back"
                className="custom-word-shuffle-button-image"
                onClick={handleBackClick}
              />
              <img
                src={exitButtonImage}
                alt="Exit"
                className="custom-word-shuffle-button-image"
                onClick={handleExitClick}
              />
            </div>
            <div className="custom-word-shuffle-score-display">
              <CoinsDisplay coins={coins} />
              <LevelDisplay className="level-display" level={level} />
            </div>
          </div>
          <div className="custom-word-shuffle-content">
            <div className="custom-word-shuffle-photo-container">
              <img
                src={wordsWithPhotos[currentWordIndex].photo}
                alt="Word"
                className="custom-word-shuffle-photo"
              />
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
                  <div
                    key={index}
                    className={`custom-word-shuffle-selected-letter custom-word-shuffle-bg-selected-${(index % 6) + 1} animated-tile`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            )}
            {feedback && (
              <div className={`custom-word-shuffle-feedback ${feedback === 'Correct!' ? 'صحيح' : 'غير صحيح'}`}>
                {feedback}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomWordShuffle;
