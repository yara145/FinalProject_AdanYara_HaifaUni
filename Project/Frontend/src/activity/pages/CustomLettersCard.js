import React, { useState } from 'react';
import './CustomLettersCard.css';
import { useNavigate } from 'react-router-dom';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import ProgressBar from '../components/ProgressBar'; // Import ProgressBar
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import buttonSound from '../../assets/sound/backBT.wav';
import CreateActivityForm from '../../Teacher/ChooseBg';
import BackgroundModal from '../../Teacher/Modal';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import axios from 'axios'; // Import axios for API calls
const CustomLettersCard = () => {
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [letters, setLetters] = useState(['']);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // New feedback state
  const [feedbackType, setFeedbackType] = useState(''); // Feedback type
  const [progress, setProgress] = useState(0); // Progress state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [activityName, setActivityName] = useState('');  // Define activityName state
  const [showConfirmModal, setShowConfirmModal] = useState(false);  // For confirmation dialog

  const navigate = useNavigate();
  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);
  const buttonAudio = new Audio(buttonSound);

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    setIsBgModalOpen(false);
  };

  const handleOpenBgModal = () => {
    setIsBgModalOpen(true);
  };

  const handleCloseBgModal = () => {
    setIsBgModalOpen(false);
  };

  const handleLetterChange = (index, value) => {
    const updatedLetters = [...letters];
    updatedLetters[index] = value;
    setLetters(updatedLetters);
  };

  const handleAddLetterField = () => {
    setLetters([...letters, '']);
  };

  const handleRemoveLetter = (index) => {
    const updatedLetters = letters.filter((_, i) => i !== index);
    setLetters(updatedLetters);
  };

  const handleStartGame = () => {
    if (letters.every((letter) => letter.trim() !== '')) {
      setIsGameStarted(true);
      setFeedbackMessage('');
      setProgress(0); // Reset progress
    }
  };

  const handleCorrect = () => {
    correctAudio.play();
    setCoins(coins + 1);
    setLevel(level + 1);

    const newProgress = ((currentLetterIndex + 1) / letters.length) * 100;
    setProgress(newProgress);

    setFeedbackMessage('🎉 أحسنت! إجابة صحيحة');
    setFeedbackType('correct');

    setTimeout(() => {
      setFeedbackMessage('');
      moveToNextLetter();
    }, 1000);
  };

  const handleIncorrect = () => {
    if (attempts < 1) {
      incorrectAudio.play();
      setAttempts(attempts + 1);
      setFeedbackMessage('❌ حاول مرة أخرى!');
      setFeedbackType('try-again');
    } else {
      incorrectAudio.play();
      setFeedbackMessage('❌ إجابة غير صحيحة!');
      setFeedbackType('incorrect');

      setTimeout(() => {
        setFeedbackMessage('');
        moveToNextLetter();
      }, 1000);
    }
  };
  const handleConfirmSave = () => {
    if (activityName.trim() === '' || letters.some(letter => letter.trim() === '')) {
      setFeedbackMessage('❌ يجب عليك ملء جميع الحقول!');
      setFeedbackType('incorrect');
      return;
    }
    
    setShowConfirmModal(true);  // Show confirmation modal only when fields are filled
  };
  const handleSaveActivity = async () => {
    if (activityName.trim() === '' || letters.some(letter => letter.trim() === '')) {
      setFeedbackMessage('❌ يجب عليك ملء جميع الحقول!');
      setFeedbackType('incorrect');
      return;
    }
  
    // Allow the activity to be saved even if no background is selected
    const activityData = {
      name: activityName,
      type: 'CustomLettersCard',
      wordsWithPhotos: letters.filter(letter => letter.trim() !== '').map(letter => ({
        word: letter,
        photo: " ",  // Assuming you will handle photos later
      })),
      
      background: selectedBackground || '',  // Allow empty string for background
      level: 1,
    };
  
    console.log("Activity Data to Save: ", activityData); // For debugging
  
    try {
      const response = await axios.post('http://localhost:5000/api/activities/create-activity-three', activityData);
      alert('تم حفظ النشاط بنجاح!');
    
    } catch (error) {
      alert('فشل في حفظ النشاط');
      console.error('Error saving activity:', error);
    }
  };
  
  const moveToNextLetter = () => {
    setAttempts(0);
    if (currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    } else {
      setIsGameStarted(false);
    }
  };

  const handleBackClick = () => {
    buttonAudio.play();
    navigate('/activity-selection');
  };

  const handleExitClick = () => {
    buttonAudio.play();
    navigate('/');
  };

  return (
    <div
      className="custom-letters-card-container"
      style={
        isGameStarted && selectedBackground
          ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {}
      }
    >
      {!isGameStarted ? (
  <div className="custom-letters-card-input-form">
    <header className="teacher-header">
      <nav className="teacher-nav">
        <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
        <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
        <button className="nav-button" onClick={() => navigate('/activity-selection')}>خلف</button>
      </nav>
    </header>
    
    {/* Add the header instruction */}
    <h2 className="input-phase-header" style={{ color: '#4caf50' }}>أدخل الحروف التي سيقوم الطفل بقراءتها</h2>
    {/* Activity Name Input */}
<input
  type="text"
  placeholder="أدخل اسم النشاط"
  value={activityName}
  onChange={(e) => setActivityName(e.target.value)}
  style={{ marginBottom: '20px' }}
  className="activity-name-input"
/>
    <p>قم بإدخال الحروف التي سيقوم الطفل بقراءتها:</p>
    <div className="scrollable-inputs">
      {letters.map((letter, index) => (
        <div key={index} className="custom-letters-card-input-pair">
          <input
            type="text"
            placeholder={`أدخل الحرف ${index + 1}`}
            value={letter}
            onChange={(e) => handleLetterChange(index, e.target.value)}
          />
          <button
            className="custom-letters-card-cancel-button"
            onClick={() => handleRemoveLetter(index)}
          >
            X
          </button>
        </div>
      ))}
    </div>
    <div className="custom-letters-card-button-group">
      <button className="custom-letters-card-add-letter-button" onClick={handleAddLetterField}>
        + أضف حرف آخر
      </button>
      <button className="custom-letters-card-background-button" onClick={handleOpenBgModal}>
        اختر خلفية
      </button>
      <BackgroundModal isOpen={isBgModalOpen} onClose={handleCloseBgModal}>
        <CreateActivityForm onBackgroundSelect={handleBackgroundSelect} />
      </BackgroundModal>
    </div>
    {selectedBackground && (
      <div className="custom-letters-card-selected-background-preview">
        <h4>الخلفية المختارة:</h4>
        <img src={selectedBackground} alt="Selected Background" />
      </div>
    )}
    <button className="custom-letters-card-start-game-button" onClick={handleStartGame}>
      بدء اللعبة
    </button>
    <button className="save-activity-button" onClick={handleConfirmSave}>
  حفظ النشاط
</button>
{showConfirmModal && (
  <div className="confirmation-modal">
    <p>هل أنت متأكد من حفظ هذا النشاط؟</p>
    <button onClick={handleSaveActivity}>نعم</button>
    <button onClick={() => setShowConfirmModal(false)}>إلغاء</button>
  </div>
)}

  </div>
) : (
        <>
          <div className="custom-letters-card-top-bar">
            <div className="custom-letters-card-button-container">
              <img
                src={backButtonImage}
                alt="Back"
                className="nav-button-image"
                onClick={handleBackClick}
              />
              <img
                src={exitButtonImage}
                alt="Exit"
                className="nav-button-image"
                onClick={handleExitClick}
              />
            </div>
            <div className="custom-letters-card-score-display">
              <CoinsDisplay coins={coins} />
              <LevelDisplay level={level} />
            </div>
          </div>

          <ProgressBar progress={progress} /> {/* Add ProgressBar */}

          <div className="custom-letters-card-content">
            <div className="letter-card">
              <h1>{letters[currentLetterIndex]}</h1>
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
              <div className={`custom-letters-card-feedback-message ${feedbackType}`}>{feedbackMessage}</div>

            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomLettersCard;
