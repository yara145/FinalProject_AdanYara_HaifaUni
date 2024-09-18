import React, { useState, useEffect } from 'react';
import './LetterIdentification.css';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import lionIcon from '../../assets/images/lion.png'; // Lion icon for progress bar
import backgroundVideo from '../../assets/videos/background2.mp4'; // New background video
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav'; 
import loadingAnimation from '../../assets/animation/loading-animation.json';

const predefinedLetters = [
  { letter: 'ا', part: 1 },
  { letter: 'ب', part: 1 },
  { letter: 'ت', part: 1 },
  //... more letters for part 1
  { letter: 'د', part: 2 },
  { letter: 'ذ', part: 2 },
  //... more letters for part 2
  { letter: 'ك', part: 3 },
  { letter: 'ل', part: 3 },
  //... more letters for part 3
];

const LetterIdentification = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);
  const buttonAudio = new Audio(buttonSound);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (isCorrect) => {
    buttonAudio.play();
    if (isCorrect) {
      correctAudio.play();
      setFeedback('صحيح!');
      setTimeout(() => moveToNextLetter(), 2000);
    } else {
      incorrectAudio.play();
      if (attempts === 1) {
        setFeedback('محاولة أخرى!');
        setTimeout(() => moveToNextLetter(), 2000);
      } else {
        setFeedback('غير صحيح. حاول مرة أخرى!');
        setAttempts(attempts + 1);
      }
    }
  };

  const moveToNextLetter = () => {
    setAttempts(0);
    setFeedback(null);
    const nextIndex = currentLetterIndex + 1;
    if (nextIndex < predefinedLetters.length) {
      setCurrentLetterIndex(nextIndex);
      setProgress(((nextIndex + 1) / predefinedLetters.length) * 100);
    } else {
      navigate('/congratulations'); // Navigate to end screen when all letters are done
    }
  };

  return (
    <div className="letter-identification-container">
      {!isLoading && (
        <video className="background-video" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      {isLoading ? (
        <div className="loading-container">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : (
        <>
          <div className="top-bar">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
              <img 
                src={lionIcon} 
                alt="Lion Icon" 
                className="lion-icon-progress" 
                style={{ left: `calc(${progress}% - 25px)` }} 
              />
            </div>
          </div>
          <div className="letter-card">
            <h1>{predefinedLetters[currentLetterIndex].letter}</h1>
          </div>
          <div className="buttons-container">
            <button className="answer-button" onClick={() => handleAnswer(true)}>صح</button>
            <button className="answer-button" onClick={() => handleAnswer(false)}>خطأ</button>
          </div>
          {feedback && <div className={`feedback ${feedback === 'صحيح!' ? 'correct' : 'incorrect'}`}>{feedback}</div>}
        </>
      )}
    </div>
  );
};

export default LetterIdentification;
