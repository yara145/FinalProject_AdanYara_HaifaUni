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

  // Fetch activity data when component mounts
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/activities/custom-activity/${activityId}/${studentId}/${level}`);
        setActivityData(response.data); // Set the activity data once fetched
        setIsGameStarted(true);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchActivityData();
  }, [activityId, studentId, level]);

  // Update images once the activity data is available
  useEffect(() => {
    if (isGameStarted && activityData) {
      const currentWord = activityData.wordsWithPhotos[currentWordIndex];

      // Shuffle images
      const combinedImages = shuffleArray([
        currentWord.correctImage, // Correct image
        ...currentWord.otherImages, // Other images for that word
      ]);
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

    if (selectedImage === currentWord.correctImage) {
      playAudio(correctAudio);
      setCoins(coins + 1); // Increment coins by 1
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);

      // Increment the score by 1
      setScore((prevScore) => prevScore + 1);

      const progressPercentage = (newCorrectAnswers / activityData.wordsWithPhotos.length) * 100;
      setProgress(progressPercentage);

      setFeedbackMessage('🎉 أحسنت! إجابة صحيحة');
      setFeedbackType('correct');

      if (currentWordIndex < activityData.wordsWithPhotos.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setAttempts(2);
      } else {
        completeActivity(); // End game and save results when all words are completed
      }
    } else {
      playAudio(incorrectAudio);
      if (attempts > 1) {
        setAttempts(attempts - 1);
        setFeedbackMessage('❌ حاول مرة أخرى!');
        setFeedbackType('try-again');
      } else {
        setFeedbackMessage('❌ إجابة غير صحيحة!');
        setFeedbackType('incorrect');

        if (currentWordIndex < activityData.wordsWithPhotos.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setAttempts(2);
        } else {
          completeActivity(); // End game if no more attempts
        }
      }
    }
  };

  const completeActivity = async () => {
    setActivityComplete(true);
    try {
        const response = await axios.post('http://localhost:5000/api/activities/save-result', {
            activityId,
            studentId,
            level,
            score, // Correct score to be sent
            completed: currentWordIndex >= activityData.wordsWithPhotos.length - 1,
        });
        console.log('Activity result saved successfully:', response.data);
    } catch (error) {
        console.error('Error saving activity result:', error);
    }
  };

  const handleBackToMenu = () => {
    navigate(`/student/activities/${studentId}/word-image-match`);
  };

  const handleExitClick = () => {
    backAudio.play().catch((error) => console.log('Exit button sound playback failed:', error));
    setTimeout(() => navigate('/'), 0); // Immediate navigation
  };

  return (
    <div
      className="custom-word-image-match"
      style={isGameStarted && activityData?.selectedBackground
        ? { backgroundImage: `url(${activityData.selectedBackground})`, backgroundSize: 'cover' }
        : {}
      }
    >
      {isGameStarted && (
        <>
          <ProgressBar progress={progress} /> {/* Add ProgressBar */}
          <p className="instruction-text">
            اختر الصورة الصحيحة لكل كلمة لتحقق تقدماً في اللعبة!
          </p>
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
          {/* Display the current word */}
          <h2 className="game-word">{activityData?.wordsWithPhotos[currentWordIndex]?.word}</h2>

          {/* Display the shuffled image options */}
          <div className="image-options-container">
            {shuffledImages.map((img, index) => (
              <img
                key={index}
                src={img} // Use full image URL here
                alt={`Option ${index + 1}`}
                className="game-image"
                onClick={() => handleImageSelect(img)} // Handle image selection
              />
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {feedbackMessage && (
          <div className={`feedback-message ${feedbackType}`}>
            {feedbackMessage}
          </div>
        )}

        {/* Final Result Modal */}
        {activityComplete && (
          <div className="feedback-modal summary-modal">
            <div className="summary-content">
              <div>{`لقد أجبت على جميع الأسئلة!`}</div>
              <div>{`مجموع النقاط: ${score}/${activityData.wordsWithPhotos.length}`}</div>
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
        )}
      </div>
    </div>
  );
};

export default CustomWordImageMatch;
