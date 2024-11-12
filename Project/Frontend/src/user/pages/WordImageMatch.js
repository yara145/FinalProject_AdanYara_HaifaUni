import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CoinsDisplay from '../../activity/components/CoinsDisplay';
import LevelDisplay from '../../activity/components/LevelDisplay';
import ProgressBar from '../../activity/components/ProgressBar';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backSound from '../../assets/sound/backBT.wav';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import restartButtonImage from '../../assets/images/restart.png';

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const backAudio = new Audio(backSound);
correctAudio.preload = 'auto';
incorrectAudio.preload = 'auto';
backAudio.preload = 'auto';

const CustomWordImageMatch = () => {
  const { activityId, studentId, level } = useParams();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(2);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [activityComplete, setActivityComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/activities/custom-activity/${activityId}/${studentId}/${level}`);
        setActivityData(response.data);
        setIsGameStarted(true);
      } catch (error) {
        setError('Error fetching activity data');
        console.error('Error fetching activity data:', error);
      }
    };

    fetchActivityData();
  }, [activityId, studentId, level]);

  useEffect(() => {
    if (isGameStarted && activityData) {
      const currentWord = activityData.wordsWithPhotos[currentWordIndex];
      const combinedImages = shuffleArray([currentWord.correctImage, ...currentWord.otherImages]);
      setShuffledImages(combinedImages);
    }
  }, [isGameStarted, currentWordIndex, activityData]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const playAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  };

  const handleImageSelect = async (selectedImage) => {
    const currentWord = activityData.wordsWithPhotos[currentWordIndex];
    const failedItems = [];

    if (selectedImage === currentWord.correctImage) {
      playAudio(correctAudio);
      setCoins(coins + 1);
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      setScore((prevScore) => prevScore + 1);

      const progressPercentage = activityData.wordsWithPhotos.length > 0 ? (newCorrectAnswers / activityData.wordsWithPhotos.length) * 100 : 0;
      setProgress(progressPercentage);

      setFeedbackMessage('🎉 أحسنت! إجابة صحيحة');
      setFeedbackType('correct');

      if (currentWordIndex < activityData.wordsWithPhotos.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setAttempts(2);
      } else {
        completeActivity(failedItems);
      }
    } else {
      playAudio(incorrectAudio);
      if (attempts > 1) {
        setAttempts(attempts - 1);
        setFeedbackMessage('❌ حاول مرة أخرى!');
        setFeedbackType('try-again');
      } else {
        failedItems.push({ word: currentWord.word, image: selectedImage });
        setFeedbackMessage('❌ إجابة غير صحيحة!');
        setFeedbackType('incorrect');
        if (currentWordIndex < activityData.wordsWithPhotos.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setAttempts(2);
        } else {
          completeActivity(failedItems);
        }
      }
    }
  };

  const completeActivity = async (failedItems) => {
    setActivityComplete(true);
    try {
      const response = await axios.post('http://localhost:5000/api/activities/save-result', {
        activityId,
        studentId,
        level,
        score,
        completed: currentWordIndex >= activityData.wordsWithPhotos.length - 1,
        played: true,
        failedItems,
      });
      console.log('Activity result saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving activity result:', error);
    }
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setAttempts(2);
    setFeedbackMessage('');
    setFeedbackType('');
    setCoins(0);
    setScore(0);
    setProgress(0);
    setCorrectAnswers(0);
    setShuffledImages([]);
  };

  const handleBackToMenu = () => {
    navigate(`/student/activities/${studentId}/word-image-match`);
  };

  const handleExitClick = () => {
    backAudio.play().catch((error) => console.log('Exit button sound playback failed:', error));
    setTimeout(() => navigate('/'), 0);
  };

  return (
    <div className="custom-word-image-match" style={isGameStarted && activityData?.selectedBackground ? { backgroundImage: `url(${activityData.selectedBackground})`, backgroundSize: 'cover' } : {}}>
      {error && <div className="error-message">{error}</div>}

      {isGameStarted && (
        <>
          <ProgressBar progress={progress} />
          <p className="instruction-text">اختر الصورة الصحيحة لكل كلمة لتحقق تقدماً في اللعبة!</p>
        </>
      )}

      <div className="game-content">
        <div className="top-bar">
          <div className="score-display">
            <CoinsDisplay coins={coins} />
            <LevelDisplay level={level} />
          </div>
          <div className="button-container">
            <button className="nav-button" onClick={handleBackToMenu}>خلف</button>
            <button className="nav-button" onClick={handleExitClick}>خروج</button>
          </div>
        </div>

        <div className="game-play-container">
          <h2 className="game-word">{activityData?.wordsWithPhotos[currentWordIndex]?.word}</h2>

          <div className="image-options-container">
            {shuffledImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Option ${index + 1}`}
                className="game-image"
                onClick={() => handleImageSelect(img)}
              />
            ))}
          </div>
        </div>

        {feedbackMessage && <div className={`feedback-message ${feedbackType}`}>{feedbackMessage}</div>}

        {activityComplete && (
          <div className="feedback-modal summary-modal">
            <div className="summary-content">
              <div>لقد أجبت على جميع الأسئلة!</div>
              <div>مجموع النقاط: {score}/{activityData.wordsWithPhotos.length}</div>
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
  );
};

export default CustomWordImageMatch;
