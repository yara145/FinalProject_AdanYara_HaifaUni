import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import axios from 'axios';
import CoinsDisplay from '../../activity/components/CoinsDisplay';
import LevelDisplay from '../../activity/components/LevelDisplay';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import restartButtonImage from '../../assets/images/restart.png';
import './CustomWordShuffle.css';

const getShuffledLetters = (letters) => {
  let shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }
  return shuffledLetters;
};

const CustomWordShuffle = () => {
  const { activityId, studentId, level } = useParams();
  const navigate = useNavigate();

  const [wordsWithPhotos, setWordsWithPhotos] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [activityComplete, setActivityComplete] = useState(false);
  const [score, setScore] = useState(0);

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);
  const buttonAudio = new Audio(buttonSound);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/activities/activity/${activityId}/${studentId}/${level}`);
        setWordsWithPhotos(response.data.wordsWithPhotos);
        if (response.data.wordsWithPhotos.length) {
          const firstWordLetters = response.data.wordsWithPhotos[0].word.split('');
          setLetters(getShuffledLetters(firstWordLetters));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };
    fetchActivity();
  }, [activityId, studentId, level]);

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
        setTimeout(() => {
          moveToNextWord();
        }, 2000);
      } else {
        incorrectAudio.play();
        if (wrongAttempts === 0) {
          setFeedback('خطأ! حاول مرة أخرى');
          setWrongAttempts(1); // Allow only one retry
          setSelectedLetters([]); // Clear selected letters for retry
        } else {
          setFeedback('فشلت! الانتقال إلى الكلمة التالية');
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
      // Only save to backend when all words have been answered
      completeActivity();
    }
  };
  const completeActivity = async () => {
    setActivityComplete(true);
    console.log('Before saving activity result:');
    console.log('Current Score:', score);
    console.log('Words Length:', wordsWithPhotos.length);
    console.log('Current Word Index:', currentWordIndex);

    try {
        const response = await axios.post('http://localhost:5000/api/activities/save-result', {
            activityId,
            studentId,
            level,
            score,
            completed: currentWordIndex >= wordsWithPhotos.length - 1, // Change condition to check if all words are attempted
        });

        console.log('Activity result saved successfully:', response.data);
    } catch (error) {
        console.error('Error saving activity result:', error);
    }
};



  const resetGame = () => {
    setSelectedLetters([]); // Clear selected letters for next attempt
    setFeedback(null);
    setWrongAttempts(0);
  };

  const handleBackToMenu = () => {
    navigate(`/student/activities/${studentId}/word-shuffle`);
  };

  return (
    <div className="custom-word-shuffle-container">
      <header className="top-bar">
        <div className="left-buttons">
          <button className="icon-button" onClick={() => navigate('/')}>
            <img src={exitButtonImage} alt="Exit" />
          </button>
          <button className="icon-button" onClick={handleBackToMenu}>
            <img src={backButtonImage} alt="Back" />
          </button>
        </div>
        <div className="right-display">
          <CoinsDisplay coins={coins} />
          <LevelDisplay level={parseInt(level)} />
        </div>
      </header>

      {isLoading ? (
        <div className="custom-word-shuffle-loading-container">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : activityComplete ? (
        <div className="feedback-modal summary-modal">
          <div className="summary-content">
            <div>{`لقد أجبت على جميع الأسئلة!`}</div>
            <div>{`مجموع النقاط: ${score}/${wordsWithPhotos.length}`}</div>
            <div>{`مستوى: ${level}`}</div>
          </div>
          <div className="summary-buttons">
            <img 
              src={restartButtonImage} 
              alt="Restart" 
              onClick={() => window.location.reload()} 
            />
            <img 
              src={exitButtonImage} 
              alt="Exit" 
              onClick={handleBackToMenu} 
            />
          </div>
        </div>
      ) : (
        <div className="custom-word-shuffle-content">
          <img src={wordsWithPhotos[currentWordIndex].photo} alt="Word" className="custom-word-shuffle-photo" />
          {feedback && (
            <div className={`custom-word-shuffle-feedback ${feedback.includes('صحيح') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
          <div className="letter-grid">
            {letters.map((letter, index) => (
              <div
                key={index}
                onClick={() => handleLetterClick(letter)}
                className={`custom-word-shuffle-letter-tile`}
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
