import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import BackgroundModal from '../../Teacher/Modal';
import CreateActivityForm from '../../Teacher/ChooseBg';
import './PhonemeMatchingGame.css';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backSound from '../../assets/sound/backBT.wav';

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const backAudio = new Audio(backSound);
correctAudio.preload = 'auto';
incorrectAudio.preload = 'auto';
backAudio.preload = 'auto';

const UploadButton = ({ label, onUpload }) => (
  <div className="upload-container">
    <label className="upload-label">{label}</label>
    <input type="file" className="upload-input" onChange={onUpload} />
  </div>
);

const PhonemeMatchingGame = () => {
  const [phonemes, setPhonemes] = useState([{ letter: '', image: null }]);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [draggedPhoneme, setDraggedPhoneme] = useState(null);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [matchedIndices, setMatchedIndices] = useState([]);
  const navigate = useNavigate();

  const playAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch((error) => console.error('Audio playback failed:', error));
  };

  const handleAddPhoneme = () => {
    setPhonemes([...phonemes, { letter: '', image: null }]);
  };

  const handleRemovePhoneme = (index) => {
    setPhonemes(phonemes.filter((_, i) => i !== index));
  };

  const handleLetterChange = (index, value) => {
    const updatedPhonemes = [...phonemes];
    updatedPhonemes[index].letter = value;
    setPhonemes(updatedPhonemes);
  };

  const handleImageUpload = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const updatedPhonemes = [...phonemes];
      updatedPhonemes[index].image = URL.createObjectURL(event.target.files[0]);
      setPhonemes(updatedPhonemes);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleStartGame = () => {
    if (phonemes.every((entry) => entry.letter && entry.image)) {
      const letters = phonemes.map((entry) => ({ letter: entry.letter }));
      const images = phonemes.map((entry) => ({ image: entry.image }));

      shuffleArray(letters);
      shuffleArray(images);

      setShuffledLetters(letters);
      setShuffledImages(images);

      setIsGameStarted(true);
      setProgress(0);
    } else {
      alert('Please complete all fields and upload images.');
    }
  };

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    setIsBgModalOpen(false);
  };

  const handleDragStart = (letter) => {
    setDraggedPhoneme(letter);
  };
  const handleDrop = (index) => {
    const correctImage = shuffledImages[index]; // The image at the drop index
    const draggedLetterIndex = shuffledLetters.findIndex(
      entry => entry.letter === draggedPhoneme
    );
  
    // Find the original phoneme entry that matches the dragged letter
    const originalPhonemeIndex = phonemes.findIndex(
      entry => entry.letter === draggedPhoneme && entry.image === correctImage.image
    );
  
    // Ensure we have a valid match between the dragged letter and the image
    if (draggedLetterIndex !== -1 && originalPhonemeIndex !== -1) {
      playAudio(correctAudio);
      setFeedbackMessage('🎉 Correct!');
      setFeedbackType('correct');
      setCoins(coins + 10);
  
      // Mark both the letter and image indices as matched
      setMatchedIndices((prev) => [
        ...prev,
        draggedLetterIndex,
        index
      ]);
  
      // Calculate the new progress
      const newProgress = ((matchedIndices.length + 2) / (phonemes.length * 2)) * 100;
      setProgress(newProgress);
  
      setTimeout(() => {
        setFeedbackMessage('');
        if ((matchedIndices.length + 2) === (phonemes.length * 2)) {
          alert('🎉 You completed the game!');
          setIsGameStarted(false);
        }
      }, 1000);
    } else {
      playAudio(incorrectAudio);
      setFeedbackMessage('❌ Try Again!');
      setFeedbackType('incorrect');
      setTimeout(() => setFeedbackMessage(''), 1000);
    }
  
    setDraggedPhoneme(null);
  };
  

  // const handleDrop = (index) => {
  //   const correctImage = shuffledImages[index];
  //   const draggedLetterIndex = phonemes.findIndex(
  //     entry => entry.letter === draggedPhoneme
  //   );

  //   if (
  //     draggedLetterIndex !== -1 &&
  //     phonemes[draggedLetterIndex].image === correctImage.image
  //   ) {
  //     playAudio(correctAudio);
  //     setFeedbackMessage('🎉 Correct!');
  //     setFeedbackType('correct');
  //     setCoins(coins + 10);

  //     // Add the indices to the matchedIndices array correctly
  //     setMatchedIndices((prev) => [...prev, index, draggedLetterIndex]);

  //     const newProgress = ((matchedIndices.length + 2) / (phonemes.length * 2)) * 100;
  //     setProgress(newProgress);

  //     setTimeout(() => {
  //       setFeedbackMessage('');
  //       if ((matchedIndices.length + 2) === (phonemes.length * 2)) {
  //         alert('🎉 You completed the game!');
  //         setIsGameStarted(false);
  //       }
  //     }, 1000);
  //   } else {
  //     playAudio(incorrectAudio);
  //     setFeedbackMessage('❌ Try Again!');
  //     setFeedbackType('incorrect');
  //     setTimeout(() => setFeedbackMessage(''), 1000);
  //   }

  //   setDraggedPhoneme(null);
  // };

  const handleBackClick = () => {
    playAudio(backAudio);
    setTimeout(() => navigate('/activity-selection'), 0);
  };

  const handleExitClick = () => {
    playAudio(backAudio);
    setTimeout(() => navigate('/'), 0);
  };

  return (
    <div
      className="phoneme-matching-game"
      style={
        isGameStarted && selectedBackground
          ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover' }
          : {}
      }
    >
      {!isGameStarted ? (
        <>
          <header className="teacher-header">
            <nav className="teacher-nav">
              <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
              <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
              <button className="nav-button" onClick={handleBackClick}>خلف</button>
            </nav>
          </header>

          <div className="custom-word-image-match-container">
            <div className="custom-word-input-form scrollable-container">
              <h2 style={{ color: '#4caf50' }}>أدخل الحروف وارفع الصور</h2>
              {phonemes.map((entry, index) => (
                <div key={index} className="word-block">
                  <div className="word-header">
                    <h3>{`حرف ${index + 1}`}</h3>
                    <button className="cancel-button" onClick={() => handleRemovePhoneme(index)}>✖</button>
                  </div>
                  <input
                    type="text"
                    placeholder={`أدخل الحرف ${index + 1}`}
                    value={entry.letter}
                    onChange={(e) => handleLetterChange(index, e.target.value)}
                  />
                  <UploadButton
                    label="الصورة المرتبطة"
                    onUpload={(e) => handleImageUpload(index, e)}
                  />
                  <hr className="divider" />
                </div>
              ))}

              <div className="button-group">
                <button className="custom-add-word-button" onClick={handleAddPhoneme}>+ أضف حرف</button>
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
              <img src={backButtonImage} alt="Back" className="nav-icon" onClick={handleBackClick} />
              <img src={exitButtonImage} alt="Exit" className="nav-icon" onClick={handleExitClick} />
            </div>
          </div>

          <ProgressBar progress={progress} />
          <div className="game-content-container" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
            <div className="phoneme-draggable-container">
              {shuffledLetters.map((entry, index) => (
                !matchedIndices.includes(index) && (
                  <div
                    key={`phoneme-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(entry.letter)}
                    className="draggable-phoneme"
                  >
                    {entry.letter}
                  </div>
                )
              ))}
            </div>

            <div className="phoneme-drop-container">
              {shuffledImages.map((entry, index) => (
                !matchedIndices.includes(index) && (
                  <div
                    key={`drop-${index}`}
                    className="drop-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                  >
                    <img src={entry.image} alt={`Phoneme ${index + 1}`} className="drop-image" />
                  </div>
                )
              ))}
            </div>
          </div>
          {feedbackMessage && (
            <div className={`feedback-message ${feedbackType}`}>{feedbackMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhonemeMatchingGame;
