import React, { useState, useEffect } from 'react';
import './CustomWordShuffle.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animation/loading-animation.json';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav';
import CreateActivityForm from '../../Teacher/ChooseBg'; // Ensure correct path
import BackgroundModal from '../../Teacher/Modal'; // Import the shared modal component
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import axios from 'axios';

const getShuffledLetters = (letters) => {
  let shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }
  return shuffledLetters;
};

const CustomWordShuffle = () => {
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
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
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [activityName, setActivityName] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // To display image preview
  const [isGameFinished, setIsGameFinished] = useState(false); // New state to track if the game finished

  const navigate = useNavigate(); // Navigate to another page
  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);
  const buttonAudio = new Audio(buttonSound);

  // For receiving data passed through navigate
  const location = useLocation();
  const { activityName: passedActivityName, wordsWithPhotos: passedWordsWithPhotos, selectedBackground: passedSelectedBackground } = location.state || {};

  useEffect(() => {
    if (passedActivityName && passedWordsWithPhotos && passedSelectedBackground) {
      setActivityName(passedActivityName);
      setWordsWithPhotos(passedWordsWithPhotos);
      setSelectedBackground(passedSelectedBackground);
    }
  }, [passedActivityName, passedWordsWithPhotos, passedSelectedBackground]);

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    setIsBgModalOpen(false); // Close modal after selecting background
  };

  const handleImageUpload = async (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/api/upload/activities', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const updatedWords = [...wordsWithPhotos];
        updatedWords[index].photo = response.data.file; // Save returned file path
        setWordsWithPhotos(updatedWords);
        setImagePreview(URL.createObjectURL(file)); // Display the image preview
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image');
      }
    }
  };

  const handleWordChange = (index, value) => {
    const updatedWords = [...wordsWithPhotos];
    updatedWords[index].word = value;
    setWordsWithPhotos(updatedWords);
  };

  const handleOpenBgModal = () => {
    setIsBgModalOpen(true);
  };

  const handleCloseBgModal = () => {
    setIsBgModalOpen(false);
  };

  const handleRemoveWord = (index) => {
    const updatedWords = wordsWithPhotos.filter((_, i) => i !== index);
    setWordsWithPhotos(updatedWords);
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
    } else {
      alert('يرجى ملء جميع الحقول.');
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
      setFeedback('صحيح!');
      setTimeout(() => {
        setCoins(coins + 1);
        setLevel(level + 1);
        const nextWordIndex = (currentWordIndex + 1) % wordsWithPhotos.length;
        setCurrentWordIndex(nextWordIndex);
        setLetters(getShuffledLetters(wordsWithPhotos[nextWordIndex].word.split('')));
        resetGame();
      }, 2000);
    } else if (newSelectedLetters.length === letters.length) {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        incorrectAudio.play();
        setFeedback('حاول مرة أخرى');
        setTimeout(() => resetGame(), 2000);
      } else {
        setFeedback('حاول مرة أخرى');
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
    setIsGameFinished(true); // Set the game as finished
  };

  const handleBackClick = () => {
    buttonAudio.play();
    navigate('/activity-selection');
  };

  const handleExitClick = () => {
    buttonAudio.play();
    navigate('/');
  };

  const handleCreateActivity = async () => {
    if (!activityName || wordsWithPhotos.some(entry => !entry.word || !entry.photo)) {
      alert('يرجى ملء جميع الحقول قبل الحفظ.');
      return;
    }

    const confirmSave = window.confirm('هل أنت متأكد أنك تريد حفظ هذا النشاط؟');
    if (!confirmSave) return;

    const activityData = {
      name: activityName, // Name of the activity
      type: 'word-shuffle', // The type is fixed to word-shuffle
      words: wordsWithPhotos.map(entry => ({
        word: entry.word,
        photo: entry.photo, // Ensure this is the path returned by the server, not a blob URL
      })),
      background: selectedBackground, // The background selected
      level: 1, // Default to level 1 for now
    };

    try {
      await axios.post('http://localhost:5000/api/activities/create-activity', activityData);
      alert('تم حفظ النشاط بنجاح!');
      // Navigate to the activity selection page after saving
      navigate('/activity-selection');
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('فشل في حفظ النشاط');
    }
  };

  return (
    <div className="custom-word-shuffle-container"
      style={isGameStarted && selectedBackground ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <header className="teacher-header">
        {!isGameStarted && (
          <nav className="teacher-nav">
            <button className="nav-button" onClick={handleExitClick}>خروج</button>
            <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
            <button className="nav-button" onClick={handleBackClick}>خلف</button>
          </nav>
        )}
      </header>

      {!isGameStarted ? (
        <div className="custom-word-input-form">
          <h2>أدخل كلماتك وارفع صورة لكل منها:</h2>
          <input
            type="text"
            placeholder="اسم النشاط"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required
            className="activity-name-input"
          />
          <div className="scrollable-inputs">
            {wordsWithPhotos.map((entry, index) => (
              <div key={index} className="custom-word-input-pair">
                <input
                  type="text"
                  placeholder={`أدخل الكلمة ${index + 1}`}
                  value={entry.word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                />
                <label htmlFor={`file-upload-${index}`} className="custom-file-upload">رفع صورة</label>
                <input
                  id={`file-upload-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  className="file-input"
                />
                <button className="cancel-button" onClick={() => handleRemoveWord(index)}>X</button>
                {/* Image Preview */}
                {entry.photo && (
                  <div className="image-preview">
                    <img
                      src={entry.photo}
                      alt={`Preview ${index}`}
                      className="image-thumbnail"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="button-group">
            <button className="custom-add-word-button" onClick={handleAddWordPhotoField}>+ أضف كلمة وصورة أخرى</button>
            <button className="custom-background-button" onClick={handleOpenBgModal}>اختر خلفية</button>
            <BackgroundModal isOpen={isBgModalOpen} onClose={handleCloseBgModal}>
              <CreateActivityForm onBackgroundSelect={handleBackgroundSelect} />
            </BackgroundModal>
         
          {selectedBackground && (
            <div className="selected-background-preview">
              <h4>الخلفية المختارة:</h4>
              <img src={selectedBackground} alt="Selected Background" />
            </div>
          )}
          <button className="" onClick={handleStartGame}>بدء اللعبة</button>
          <button className="savebtn" onClick={handleCreateActivity}>حفظ النشاط</button>
     
          </div>
          
        </div>
      ) : isLoading ? (
        <div className="custom-word-shuffle-loading-container">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : (
        <>
          <div className="custom-word-shuffle-top-bar" style={{ direction: 'ltr' }}>
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
            {/* Save Activity Button Inside Game */}
            <button className="custom-add-word-button" onClick={handleCreateActivity}>
              حفظ النشاط
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomWordShuffle;
