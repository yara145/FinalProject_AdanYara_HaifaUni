// CustomWordImageMatch.js
import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar'; // Import ProgressBar
import './CustomWordImageMatch.css';
import { useNavigate } from 'react-router-dom';
import BackgroundModal from '../../Teacher/Modal';
import CreateActivityForm from '../../Teacher/ChooseBg';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backSound from '../../assets/sound/backBT.wav';




const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const backAudio = new Audio(backSound);
correctAudio.preload = 'auto'; // Preload correct answer sound
incorrectAudio.preload = 'auto'; // Preload incorrect answer sound
backAudio.preload = 'auto'; // Preload back button sound



// UploadButton Component Definition
const UploadButton = ({ label, onUpload }) => (
  <div className="upload-container">
    <label className="upload-label">{label}</label>
    <input type="file" className="upload-input" onChange={onUpload} />
  </div>
);


const CustomWordImageMatch = () => {
  const [words, setWords] = useState([
    { word: '', correctImage: null, otherImages: [null, null, null] },
  ]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(2);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [progress, setProgress] = useState(0); // Track progress
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers
  const [shuffledImages, setShuffledImages] = useState([]);

  const navigate = useNavigate();

const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
const playAudio = (audio) => {
  if (isPlaying) return; // Prevent multiple triggers
  setIsPlaying(true);

  audio.pause();
  audio.currentTime = 0;
  audio.play()
    .then(() => setIsPlaying(false)) // Reset the state after playing
    .catch((error) => {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    });
};
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

useEffect(() => {
  if (isGameStarted) {
    const currentWord = words[currentWordIndex];
    const combinedImages = shuffleArray([
      currentWord.correctImage,
      ...currentWord.otherImages,
    ]);
    setShuffledImages(combinedImages);
  }
}, [currentWordIndex, isGameStarted]);

  const handleAddWord = () => {
    setWords([...words, { word: '', correctImage: null, otherImages: [null, null, null] }]);
  };

  const handleRemoveWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleWordChange = (index, value) => {
    const updatedWords = [...words];
    updatedWords[index].word = value;
    setWords(updatedWords);
  };

  const handleImageUpload = (wordIndex, type, imageIndex, event) => {
    if (event.target.files && event.target.files[0]) {
      const updatedWords = [...words];
      const imageUrl = URL.createObjectURL(event.target.files[0]);

      if (type === 'correct') {
        updatedWords[wordIndex].correctImage = imageUrl;
      } else {
        updatedWords[wordIndex].otherImages[imageIndex] = imageUrl;
      }
      setWords(updatedWords);
    }
  };

  const handleStartGame = () => {
    if (words.every((entry) => entry.word && entry.correctImage && entry.otherImages.every((img) => img))) {
      setIsGameStarted(true);
      setCurrentWordIndex(0);
      setAttempts(2);
      setProgress(0); // Reset progress
    } else {
      alert('Please complete all fields and upload all images.');
    }
  };

  const handleImageSelect = (selectedImage) => {
    const currentWord = words[currentWordIndex];
  
    if (selectedImage === currentWord.correctImage) {
      playAudio(correctAudio); // Play correct sound safely
      setCoins(coins + 10);
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
  
      const progressPercentage = (newCorrectAnswers / words.length) * 100;
      setProgress(progressPercentage);
  
      setFeedbackMessage('🎉 أحسنت! إجابة صحيحة');
      setFeedbackType('correct');
  
      setTimeout(() => {
        setFeedbackMessage('');
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setAttempts(2);
        } else {
          alert('🎉 لقد أكملت اللعبة!');
          setIsGameStarted(false);
        }
      }, 1000);
    } else {
      playAudio(incorrectAudio); // Play incorrect sound safely
      if (attempts > 1) {
        setAttempts(attempts - 1);
        setFeedbackMessage('❌ حاول مرة أخرى!');
        setFeedbackType('try-again');
      } else {
        setFeedbackMessage('❌ إجابة غير صحيحة!');
        setFeedbackType('incorrect');
  
        setTimeout(() => {
          setFeedbackMessage('');
          if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
            setAttempts(2);
          } else {
            alert('🎉 لقد أكملت اللعبة!');
            setIsGameStarted(false);
          }
        }, 1000);
      }
    }
  };
  
    
   
       

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    setIsBgModalOpen(false);
  };

  const handleBackClick = () => {
    backAudio.play().catch((error) => console.log('Back button sound playback failed:', error));
    setTimeout(() => navigate('/activity-selection'), 0); // Immediate navigation
  };
  
  const handleExitClick = () => {
    backAudio.play().catch((error) => console.log('Exit button sound playback failed:', error));
    setTimeout(() => navigate('/'), 0); // Immediate navigation
  };
  
  
  

  return (
    <div
      className="custom-word-image-match"
      style={
        isGameStarted && selectedBackground
          ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover' }
          : {}
      }
    >
      {/* Render ProgressBar only during the game phase */}
      {isGameStarted && (
        <>
          <ProgressBar progress={progress} /> {/* Add ProgressBar */}
          <p className="instruction-text">
            اختر الصورة الصحيحة لكل كلمة لتحقق تقدمًا في اللعبة!
          </p>
        </>
      )}
  
      {!isGameStarted ? (
        <>
          <header className="teacher-header">
            <nav className="teacher-nav">
              <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
              <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
              <button className="nav-button" onClick={() => navigate('/activity-selection')}>خلف</button>
            </nav>
          </header>
  
          <div className="custom-word-image-match-container">
            <div className="custom-word-input-form scrollable-container">
         
            <h2 style={{ color: '#4caf50' }}>أدخل كلمات وارفع صور</h2>


              {words.map((entry, wordIndex) => (
                <div key={wordIndex} className="word-block">
                  <div className="word-header">
                    <h3>{`كلمة ${wordIndex + 1}`}</h3>
                    <button className="cancel-button" onClick={() => handleRemoveWord(wordIndex)}>✖</button>
                  </div>
                  <input
                    type="text"
                    placeholder={`أدخل الكلمة ${wordIndex + 1}`}
                    value={entry.word}
                    onChange={(e) => handleWordChange(wordIndex, e.target.value)}
                  />
                  <div className="image-uploads">
                    <UploadButton
                      label="الصورة الصحيحة"
                      onUpload={(e) => handleImageUpload(wordIndex, 'correct', null, e)}
                    />
                    {entry.otherImages.map((_, imageIndex) => (
                      <UploadButton
                        key={imageIndex}
                        label={`صورة ${imageIndex + 1}`}
                        onUpload={(e) => handleImageUpload(wordIndex, 'other', imageIndex, e)}
                      />
                    ))}
                  </div>
                  <hr className="divider" />
                </div>
              ))}
  
              <div className="button-group">
                <button className="custom-add-word-button" onClick={handleAddWord}>+ أضف كلمة</button>
                <button className="custom-background-button" onClick={() => setIsBgModalOpen(true)}>
                  اختر خلفية
                </button>
              </div>
  
              <BackgroundModal isOpen={isBgModalOpen} onClose={() => setIsBgModalOpen(false)}>
                <CreateActivityForm onBackgroundSelect={handleBackgroundSelect} />
              </BackgroundModal>
  
              {selectedBackground && (
                <div className="selected-background-preview">
                  <h4>الخلفية المختارة:</h4>
                  <img src={selectedBackground} alt="Selected Background" className="preview-image" />
                </div>
              )}
  
              <button className="start-game-button" onClick={handleStartGame}>ابدأ اللعبة</button>
            </div>
          </div>
        </>
      ) : (
        <div className="game-content">
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
  
          <div className="game-play-container">
            <h2 className="game-word">{words[currentWordIndex]?.word}</h2>
  
    

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
  
          {feedbackMessage && (
            <div className={`feedback-message ${feedbackType}`}>
              {feedbackMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
  
 



};
export default CustomWordImageMatch;
