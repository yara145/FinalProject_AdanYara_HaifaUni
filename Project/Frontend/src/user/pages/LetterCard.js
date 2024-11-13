import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CoinsDisplay from '../../activity/components/CoinsDisplay';
import LevelDisplay from '../../activity/components/LevelDisplay';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import ProgressBar from '../../activity/components/ProgressBar';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import restartButtonImage from '../../assets/images/restart.png';
import './LetterCard.css';

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

const LetterCardGame = () => {
  const { activityId, studentId, level } = useParams();
  const navigate = useNavigate();

  const [activityData, setActivityData] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [failedItems, setFailedItems] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [progress, setProgress] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [activityComplete, setActivityComplete] = useState(false);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/activities/letteractivity/${activityId}/${studentId}/${level}`);
        console.log("Fetched Activity Data (activityData):", response.data); // Log the activity data
        setActivityData(response.data);
        setIsGameStarted(true);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };
    fetchActivityData();
  }, [activityId, studentId, level]);

  useEffect(() => {
    if (activityData && isGameStarted && activityData.wordsWithPhotos.length > 0) {
      const currentWord = activityData.wordsWithPhotos[currentWordIndex];
      const wordLetters = currentWord.word.split('');
      setShuffledLetters(shuffleArray(wordLetters));

      setAttempts((prevAttempts) => {
        const newAttempts = [...prevAttempts];
        newAttempts[currentWordIndex] = 0;
        return newAttempts;
      });
    }
  }, [activityData, isGameStarted, currentWordIndex]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleExitClick = () => {
    navigate('/home');
  };

  const handleCorrect = () => {
    const currentWord = activityData.wordsWithPhotos[currentWordIndex];
    correctAudio.play();
    setCoins((prevCoins) => prevCoins + 1);
    setCorrectAnswers((prev) => prev + 1);

    const progressPercentage = ((correctAnswers + 1) / activityData.wordsWithPhotos.length) * 100;
    setProgress(progressPercentage);
    setFeedbackMessage('🎉 أحسنت! إجابة صحيحة');
    setFeedbackType('correct');

    if (currentWordIndex < activityData.wordsWithPhotos.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setAttempts((prevAttempts) => {
        const newAttempts = [...prevAttempts];
        newAttempts[currentWordIndex] = 0;
        return newAttempts;
      });
    } else {
      setActivityComplete(true);
      console.log('Last word reached, calling completeActivity...');
    }
  };

  const handleIncorrect = () => {
    incorrectAudio.play();

    if (attempts[currentWordIndex] < 1) {
      setAttempts((prevAttempts) => {
        const newAttempts = [...prevAttempts];
        newAttempts[currentWordIndex] = prevAttempts[currentWordIndex] + 1;
        return newAttempts;
      });
      setFeedbackMessage('❌ حاول مرة أخرى!');
      setFeedbackType('try-again');
    } else {
      setFeedbackMessage('❌ إجابة غير صحيحة!');
      setFeedbackType('incorrect');

      const failedLetter = activityData.wordsWithPhotos[currentWordIndex]?.word;
      if (failedLetter) {
        setFailedItems((prevFailedItems) => [
          ...prevFailedItems,
          { word: failedLetter, image: '' }, // Add failed word with empty image
        ]);
      }

      if (currentWordIndex < activityData.wordsWithPhotos.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setActivityComplete(true);
        console.log('Last word reached, calling completeActivity...');
      }
    }
  };

  const handleBackToMenu = () => {
    navigate(`/student/activities/${studentId}/CustomLettersCard`);
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setAttempts([]);
    setCoins(0);
    setProgress(0);
    setCorrectAnswers(0);
    setFailedItems([]);
    setActivityComplete(false);
    setIsGameStarted(true);
  };

  const completeActivity = async () => {
    const finalScore = correctAnswers;
    const totalWords = activityData.wordsWithPhotos.length;
    const isComplete = finalScore === totalWords;

    console.log('completeActivity called...');
    console.log('Final score:', finalScore);
    console.log('Total words:', totalWords);

    if (failedItems.length > 0) {
      console.log('Failed items:', failedItems); 
    }

    try {
      const response = await axios.post('http://localhost:5000/api/activities/save-result', {
        activityId,
        studentId,
        level,
        score: finalScore,
        completed: isComplete,
        played: true,
        failedItems,
      });
      console.log('Activity result saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving activity result:', error);
    }
  };

  useEffect(() => {
    if (activityComplete) {
      completeActivity(); // Call completeActivity when activity is complete
    }
  }, [activityComplete]);

  // Check and apply background image if it exists, otherwise set 'none'
  const backgroundImage = activityData?.background
    ? `url(${activityData.background})`
    : 'none'; // Default to none if background is not found

  console.log("Background Image URL:", backgroundImage); // Log the background image URL

  return (
    <div 
      className="custom-letters-card-container" 
      style={{ backgroundImage: backgroundImage }}
    >
      <h2>اختر الكلمة الصحيحة لتحقق تقدماً في اللعبة!</h2>

      {isGameStarted && activityData && (
        <>
          <ProgressBar progress={progress} />

          <div className="custom-letters-card-input-form">
            <div className="top-bar">
              <div className="score-display">
                <CoinsDisplay coins={coins} />
                <LevelDisplay level={level} />
              </div>
              <div className="custom-letters-card-button-container">
                <img
                  className="nav-button-image"
                  src={backButtonImage}
                  alt="Back"
                  onClick={handleBackToMenu}
                />
                <img
                  className="nav-button-image"
                  src={exitButtonImage}
                  alt="Exit"
                  onClick={handleExitClick}
                />
              </div>
            </div>

            <div className="custom-letters-card-content">
              <div className="letter-card">
                {activityData.wordsWithPhotos[currentWordIndex] && (
                  <h1>{activityData.wordsWithPhotos[currentWordIndex].word}</h1>
                )}
              </div>

              <div className="custom-letters-card-button-group">
                <button className="custom-letters-card-correct-button" onClick={handleCorrect}>
                  صحيح
                </button>
                <button className="custom-letters-card-incorrect-button" onClick={handleIncorrect}>
                  غير صحيح
                </button>
              </div>

              {feedbackMessage && (
                <div className={`custom-letters-card-feedback-message ${feedbackType}`}>
                  {feedbackMessage}
                </div>
              )}

              {activityComplete && (
                <div className="feedback-modal summary-modal">
                  <div className="summary-content">
                    <div>لقد أجبت على جميع الأسئلة!</div>
                    <div>مجموع النقاط: {correctAnswers}/{activityData.wordsWithPhotos.length}</div>
                    <div>مستوى: {level}</div>
                  </div>
                  <div className="summary-buttons">
                    <img src={restartButtonImage} alt="Restart" onClick={resetGame} />
                    <img src={exitButtonImage} alt="Exit" onClick={handleBackToMenu} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LetterCardGame;
