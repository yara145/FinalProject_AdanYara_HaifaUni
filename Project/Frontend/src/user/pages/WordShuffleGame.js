import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import axios from 'axios';
import CoinsDisplay from '../../activity/components/CoinsDisplay';
import LevelDisplay from '../../activity/components/LevelDisplay';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav';
import ProgressBar from '../../activity/components/ProgressBar';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import restartButtonImage from '../../assets/images/restart.png';
import './CustomWordShuffle.css';

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const buttonAudio = new Audio(buttonSound);

const getShuffledLetters = (letters) => {
  let shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }
  return shuffledLetters;
};

const CustomWordShuffle = () => {
  const { activityId, studentId, level: levelParam } = useParams();
  const navigate = useNavigate();

  const [wordsWithPhotos, setWordsWithPhotos] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [coins, setCoins] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [activityComplete, setActivityComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [failedItems, setFailedItems] = useState([]);  // Track failed items

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/activities/activity/${activityId}/${studentId}/${levelParam}`);
        setWordsWithPhotos(response.data.wordsWithPhotos);
        if (response.data.wordsWithPhotos.length) {
          const firstWordLetters = response.data.wordsWithPhotos[0].word.split('');
          setLetters(getShuffledLetters(firstWordLetters));
        }
        setSelectedBackground(response.data.background);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };
    fetchActivity();
  }, [activityId, studentId, levelParam]);

  const handleLetterClick = (letter) => {
    buttonAudio.play();
    const newSelectedLetters = [...selectedLetters, letter];
    setSelectedLetters(newSelectedLetters);

    const currentWord = wordsWithPhotos[currentWordIndex].word;

    if (newSelectedLetters.length === currentWord.length) {
      if (newSelectedLetters.join('') === currentWord) {
        correctAudio.play();
        setFeedback('صحيح!');
        setScore((prevScore) => prevScore + 1);
        setCoins((prevCoins) => prevCoins + 1);
        const progressPercentage = ((score + 1) / wordsWithPhotos.length) * 100;
        setProgress(progressPercentage);

        setTimeout(() => {
          moveToNextWord();
        }, 2000);
      } else {
        incorrectAudio.play();
        if (wrongAttempts === 0) {
          setFeedback('خطأ! حاول مرة أخرى');
          setWrongAttempts(1);
          setSelectedLetters([]);
        } else {
          setFeedback('فشلت! الانتقال إلى الكلمة التالية');
          setFailedItems((prevFailedItems) => [
            ...prevFailedItems,
            {
              word: currentWord,
              image: wordsWithPhotos[currentWordIndex].photo,
            },
          ]);
          setTimeout(() => {
            moveToNextWord();
          }, 2000);
        }
      }
    }
  };

  const moveToNextWord = () => {
    if (currentWordIndex < wordsWithPhotos.length - 1) {
      const nextWordIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextWordIndex);
      const nextWord = wordsWithPhotos[nextWordIndex].word;
      setLetters(getShuffledLetters(nextWord.split('')));
      resetGame();
    } else {
      completeActivity();
    }
  };

  const resetGame = () => {
    setSelectedLetters([]);
    setFeedback(null);
    setWrongAttempts(0);
  };

  const completeActivity = async () => {
    const isComplete = score === wordsWithPhotos.length;  // Check if score matches total words
    const played = true;  // Mark activity as played
    setActivityComplete(true); // Explicitly set activityComplete to true

    try {
      const response = await axios.post('http://localhost:5000/api/activities/save-result', {
        activityId,
        studentId,
        level: levelParam,
        score,
        completed: isComplete,
        played,
        failedItems, // Send failed items to backend
      });
      console.log('Activity result saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving activity result:', error);
    }
  };

  const handleBackToMenu = () => {
    navigate(`/student/activities/${studentId}/word-shuffle`);
  };

  const handleExitClick = () => {
    navigate('/');
  };

  return (
    <div
      className="custom-word-shuffle-container"
      style={{
        backgroundImage: selectedBackground ? `url(${selectedBackground})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="top-bar">
        <div className="left-buttons">
          <button className="icon-button" onClick={handleExitClick}>
            <img src={exitButtonImage} alt="Exit" />
          </button>
          <button className="icon-button" onClick={handleBackToMenu}>
            <img src={backButtonImage} alt="Back" />
          </button>
        </div>
        <div className="right-display">
          <CoinsDisplay coins={coins} />
          <LevelDisplay level={gameLevel} />
        </div>
      </header>

      {isLoading ? (
        <div className="custom-word-shuffle-loading-container">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : activityComplete ? (
        <div className="feedback-modal summary-modal">
          <div className="summary-content">
            <div>لقد أجبت على جميع الأسئلة!</div>
            <div>مجموع النقاط: {score}/{wordsWithPhotos.length}</div>
            <div>مستوى: {gameLevel}</div>
          </div>
          <div className="summary-buttons">
            <img src={restartButtonImage} alt="Restart" onClick={() => window.location.reload()} />
            <img src={exitButtonImage} alt="Exit" onClick={handleBackToMenu} />
          </div>
        </div>
      ) : (
        <div className="custom-word-shuffle-content">
          <img
            src={wordsWithPhotos[currentWordIndex].photo}
            alt="Word"
            className="custom-word-shuffle-photo"
          />
          {feedback && (
            <div className={`custom-word-shuffle-feedback ${feedback === 'صحيح!' ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
          <ProgressBar progress={progress} />
          <div className="letter-grid">
            {letters.map((letter, index) => (
              <div
                key={index}
                onClick={() => handleLetterClick(letter)}
                className="custom-word-shuffle-letter-tile"
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="selected-letters-container">
            {selectedLetters.map((letter, index) => (
              <span key={index} className="selected-letter" style={{ fontSize: '20px' }}>
                {letter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomWordShuffle;
