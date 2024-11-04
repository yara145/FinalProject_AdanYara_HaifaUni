// ReversedWordImageMatch.js
import React, { useState, useEffect } from 'react';

import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import { useNavigate } from 'react-router-dom';
import BackgroundModal from '../../Teacher/Modal';
import CreateActivityForm from '../../Teacher/ChooseBg';
import './ReversedWordImageMatch.css';

import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backSound from '../../assets/sound/backBT.wav';
// Import ProgressBar at the top of ReversedWordImageMatch.js
import ProgressBar from '../components/ProgressBar';


const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const backAudio = new Audio(backSound);

correctAudio.preload = 'auto';
incorrectAudio.preload = 'auto';
backAudio.preload = 'auto';

const ReversedWordImageMatch = () => {

  const [entries, setEntries] = useState([{ image: null, answers: ['', '', '', ''] }]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [attempts, setAttempts] = useState(2);
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  const handleBackClick = () => {
    playAudio(backAudio);
    navigate(-1); // Navigate to the previous page
  };
  
  const handleExitClick = () => {
    playAudio(backAudio);
    navigate('/'); // Navigate to the home page or any other exit route
  };

  


  const handleAddEntry = () => {
    setEntries([...entries, { image: null, answers: ['', '', '', ''] }]);
  };

  const handleRemoveEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleImageUpload = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const updatedEntries = [...entries];
      updatedEntries[index].image = URL.createObjectURL(event.target.files[0]);
      setEntries(updatedEntries);
    }
  };

  const handleAnswerChange = (entryIndex, answerIndex, value) => {
    const updatedEntries = [...entries];
    updatedEntries[entryIndex].answers[answerIndex] = value;
    setEntries(updatedEntries);
  };

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    setIsBgModalOpen(false);
  };

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const handleStartGame = () => {
    if (entries.every((entry) => entry.image && entry.answers.every((answer) => answer))) {
      const shuffledEntries = entries.map(entry => ({
        ...entry,
        shuffledAnswers: shuffleArray(entry.answers)
      }));
      setEntries(shuffledEntries);
      setIsGameStarted(true);
      setCurrentEntryIndex(0);
      setAttempts(2);
  
      // Reset progress and correct answers when the game starts
      setProgress(0);
      setCorrectAnswers(0);
    } else {
      alert('Please complete all fields and upload images.');
    }
  };
  
  const isCorrectAnswer = (selectedAnswer) => {
    const currentEntry = entries[currentEntryIndex];
    return selectedAnswer.trim().toLowerCase() === currentEntry.answers[0].trim().toLowerCase();
  };
  


  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Tracks correctly answered questions
  // const handleAnswerSelect = (selectedAnswer) => {
  //   const currentEntry = entries[currentEntryIndex];
  
  //   // Define the isCorrectAnswer function locally
  //   const isCorrectAnswer = (answer) =>
  //     answer.trim().toLowerCase() === currentEntry.answers[0].trim().toLowerCase();
  
  //   if (isCorrectAnswer(selectedAnswer)) {
  //     playAudio(correctAudio); // Play the correct sound
  
  //     // Update correct answers and progress
  //     setCorrectAnswers((prevCorrect) => {
  //       const newCorrectAnswers = prevCorrect + 1;
  //       setProgress((newCorrectAnswers / entries.length) * 100);
  //       return newCorrectAnswers;
  //     });
  
  //     if (currentEntryIndex < entries.length - 1) {
  //       // Move to the next entry
  //       setCurrentEntryIndex((prevIndex) => prevIndex + 1);
  //       setAttempts(2); // Reset attempts for the next entry
  //     } else {
  //       // End the game with a completion message
  //       setTimeout(() => {
  //         alert('🎉 You completed the game!');
  //         setIsGameStarted(false);
  //       }, 500);
  //     }
  //   } else {
  //     // Play the incorrect sound
  //     playAudio(incorrectAudio);
  
  //     if (attempts > 1) {
  //       // Decrease attempts by 1
  //       setAttempts((prevAttempts) => prevAttempts - 1);
  //       alert('❌ Incorrect! Try again.');
  //     } else {
  //       // No attempts left, move to the next entry or end the game
  //       if (currentEntryIndex < entries.length - 1) {
  //         setCurrentEntryIndex((prevIndex) => prevIndex + 1);
  //         setAttempts(2); // Reset attempts for the next entry
  //       } else {
  //         // End the game if it was the last entry
  //         setTimeout(() => {
  //           alert('🎉 You completed the game!');
  //           setIsGameStarted(false);
  //         }, 500);
  //       }
  //     }
  //   }
  // };
  
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio play logic with state tracking
  const playAudio = (audio) => {
    if (isPlaying) return;
    setIsPlaying(true);
  
    audio.pause();
    audio.currentTime = 0;
    audio.play()
      .then(() => setIsPlaying(false))
      .catch((error) => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
  };
  
  const handleAnswerSelect = (selectedAnswer) => {
    const currentEntry = entries[currentEntryIndex];
  
    const isCorrectAnswer = (answer) =>
      answer.trim().toLowerCase() === currentEntry.answers[0].trim().toLowerCase();
  
    if (isCorrectAnswer(selectedAnswer)) {
      playAudio(correctAudio);
      setCoins((prev) => prev + 10);
      setFeedbackMessage('🎉 أحسنت! إجابة صحيحة');
      setFeedbackType('correct');
  
      setCorrectAnswers((prevCorrect) => {
        const newCorrect = prevCorrect + 1;
        setProgress((newCorrect / entries.length) * 100);
        return newCorrect;
      });
  
      setTimeout(() => {
        setFeedbackMessage('');
        if (currentEntryIndex < entries.length - 1) {
          setCurrentEntryIndex((prev) => prev + 1);
          setAttempts(2);
        } else {
          alert('🎉 لقد أكملت اللعبة!');
          setIsGameStarted(false);
        }
      }, 1000);
    } else {
      playAudio(incorrectAudio);
      if (attempts > 1) {
        setAttempts((prev) => prev - 1);
        setFeedbackMessage('❌ حاول مرة أخرى!');
        setFeedbackType('try-again');
      } else {
        setFeedbackMessage('❌ إجابة غير صحيحة!');
        setFeedbackType('incorrect');
  
        setTimeout(() => {
          setFeedbackMessage('');
          if (currentEntryIndex < entries.length - 1) {
            setCurrentEntryIndex((prev) => prev + 1);
            setAttempts(2);
          } else {
            alert('🎉 لقد أكملت اللعبة!');
            setIsGameStarted(false);
          }
        }, 1000);
      }
    }
  };
  

  return (
    <div
      className="reversed-word-image-match"
      style={
        isGameStarted && selectedBackground
          ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover' }
          : {}
      }
    >
      {/* Render this block only if the game has started */}
      {isGameStarted && (
        <>
          {/* Top Bar with Buttons, Score Display, and Progress Bar */}
          <div className="top-bar">
            <div className="score-display">
              <CoinsDisplay coins={coins} />
              <LevelDisplay level={level} />
            </div>
            <div className="button-container">
              <img
                src={backButtonImage}
                alt="Back"
                className="nav-icon"
                onClick={handleBackClick}
              />
              <img
                src={exitButtonImage}
                alt="Exit"
                className="nav-icon"
                onClick={handleExitClick}
              />
            </div>
          </div>
  
          {/* Progress Bar */}
          <ProgressBar progress={progress} maxProgress={100} />
  
          {/* Feedback Message */}
          {feedbackMessage && (
            <div className={`feedback-message ${feedbackType}`}>
              {feedbackMessage}
            </div>
          )}
  
          {/* Main Game Content */}
          <div className="reversed-game-content">
            <h2 className="game-instruction">اختر الإجابة الصحيحة من الخيارات أدناه!</h2>
            <img
              src={entries[currentEntryIndex].image}
              alt="Current"
              className="reversed-game-image"
            />
            <div className="reversed-answer-options">
              {entries[currentEntryIndex].shuffledAnswers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  className="reversed-answer-button"
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
  
{/* Main Content for Input Phase */}
{!isGameStarted && (
  <>
    {/* Added header section */}
    <header className="teacher-header">
      <nav className="teacher-nav">
        <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
        <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
        <button className="nav-button" onClick={() => navigate('/activity-selection')}>خلف</button>
      </nav>
    </header>

    {/* Input Form */}
    <div className="reversed-input-form" style={{ marginTop: '80px' }}>
      <h1 className="reversed-input-title">إدخال بيانات اللعبة</h1>
      {entries.map((entry, index) => (
        <div key={index} className="reversed-entry-block">
          <div className="reversed-entry-header">
            <button
              className="reversed-cancel-button"
              onClick={() => handleRemoveEntry(index)}
            >
              ✖
            </button>
          </div>
          <label className="reversed-upload-label">{`صورة ${index + 1}`}</label>
          <input
            type="file"
            onChange={(e) => handleImageUpload(index, e)}
            className="reversed-upload-input"
          />
          <div className="reversed-answers-container">
            <div className="reversed-answer-grid">
              <div className="reversed-answer-block">
                <label className="reversed-answer-label">الإجابة الصحيحة:</label>
                <input
                  type="text"
                  value={entry.answers[0]}
                  onChange={(e) => handleAnswerChange(index, 0, e.target.value)}
                  className="reversed-answer-input"
                />
              </div>
              {entry.answers.slice(1).map((answer, answerIndex) => (
                <div key={answerIndex} className="reversed-answer-block">
                  <label className="reversed-answer-label">إجابة محتملة:</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, answerIndex + 1, e.target.value)}
                    className="reversed-answer-input"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="button-group">
        <div className="inline-buttons">
          <button className="reversed-add-entry-button" onClick={handleAddEntry}>
            + أضف كلمة
          </button>
          <button
            className="reversed-background-button"
            onClick={() => setIsBgModalOpen(true)}
          >
            اختر خلفية
          </button>
        </div>
        <button className="start-game-button" onClick={handleStartGame}>
          ابدأ اللعبة
        </button>
      </div>
      <BackgroundModal isOpen={isBgModalOpen} onClose={() => setIsBgModalOpen(false)}>
        <CreateActivityForm onBackgroundSelect={handleBackgroundSelect} />
      </BackgroundModal>
    </div>
  </>
)}



    </div>
  );
  
  
  
  
};

export default ReversedWordImageMatch;
