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
import axios from 'axios';

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const backAudio = new Audio(backSound);
correctAudio.preload = 'auto'; // Preload correct answer sound
incorrectAudio.preload = 'auto'; // Preload incorrect answer sound
backAudio.preload = 'auto'; // Preload back button sound

const UploadButton = ({ label, onUpload, imageUrl }) => (
  <div className="upload-container">
    <label className="upload-label">{label}</label>
    <input
      type="file"
      className="upload-input"
      onChange={onUpload}
      style={{ display: 'none' }} // Hide the default file input
      id={`file-upload-${label}`} // Unique ID for the input
    />
    <label htmlFor={`file-upload-${label}`} className="custom-upload-button">
      {imageUrl ? 'تغيير الصورة' : 'رفع صورة'}
    </label>
    {imageUrl && <img src={imageUrl} alt="Uploaded" className="uploaded-image-preview" />}
  </div>
);

const CustomWordImageMatch = () => {
  const [words, setWords] = useState([ 
    { word: '', correctImage: null, otherImages: [null, null, null] },
  ]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [activityName, setActivityName] = useState(""); // Added activity name field
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

  // Frontend for uploading images for each word and background
  const handleImageUpload = async (wordIndex, type, imageIndex, event) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      try {
        const response = await axios.post('http://localhost:5000/api/upload/activities', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const updatedWords = [...words];
        const imageUrl = response.data.file;

        if (type === 'correct') {
          updatedWords[wordIndex].correctImage = imageUrl; // Correct image for the word
        } else {
          updatedWords[wordIndex].otherImages[imageIndex] = imageUrl; // Other images for the word
        }
        setWords(updatedWords); // Update the word's images
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image');
      }
    }
  };

  // Frontend for uploading background image
  const handleBackgroundUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      try {
        const response = await axios.post('http://localhost:5000/api/upload/backgrounds', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSelectedBackground(response.data.file); // Save background URL
      } catch (error) {
        console.error('Failed to upload background:', error);
        alert('Failed to upload background');
      }
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
    // Keep current activity information before going back
    const activityInfo = {
      words,
      selectedBackground,
      activityName,
      level,
    };
    // Store it in localStorage to persist data across pages
    localStorage.setItem('activityInfo', JSON.stringify(activityInfo));
    navigate('/activity-selection'); // Redirect to activity selection
  };

  const handleExitClick = () => {
    backAudio.play().catch((error) => console.log('Exit button sound playback failed:', error));
    setTimeout(() => navigate('/'), 0); // Immediate navigation
  };

  const handleSaveGame = async () => {
    // Validate that all necessary info is filled in
    if (activityName && words.every(entry => entry.word && entry.correctImage && entry.otherImages.every(img => img))) {
      const activityData = {
        name: activityName, // Name entered by teacher
        type: 'word-image-match', // Type of activity
        words: words.map(entry => ({
          word: entry.word,
          correctImage: entry.correctImage,
          otherImages: entry.otherImages,
        })),
        background: selectedBackground,
        level: 1, // Default to level 1
      };

      // Arabic confirmation message only if info is complete
      const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حفظ النشاط؟");

      if (isConfirmed) {
        try {
          const response = await axios.post('http://localhost:5000/api/activities/create-custom-activity', activityData);

          // Check the response and alert user
          if (response.status === 201) {
            alert('تم حفظ النشاط بنجاح!');
          } else {
            alert('فشل في حفظ النشاط');
          }
        } catch (error) {
          console.error('Error saving activity:', error);
          alert('فشل في حفظ النشاط');
        }
      }
    } else {
      alert('الرجاء ملء جميع الحقول');
    }
  };

  return (
    <div
      className="custom-word-image-match"
      style={isGameStarted && selectedBackground
        ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover' }
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
              <h2 style={{ color: '#4caf50', marginBottom: '20px' }}>أدخل كلمات وارفع صور</h2>
              <input
                type="text"
                className="activity-name-input"
                placeholder="أدخل اسم النشاط"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
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
                      imageUrl={entry.correctImage} // Show selected image
                    />
                    {entry.otherImages.map((_, imageIndex) => (
                      <UploadButton
                        key={imageIndex}
                        label={`صورة ${imageIndex + 1}`}
                        onUpload={(e) => handleImageUpload(wordIndex, 'other', imageIndex, e)}
                        imageUrl={entry.otherImages[imageIndex]} // Show selected image
                      />
                    ))}
                  </div>
                  <hr className="divider" />
                </div>
              ))}

              <div className="button-group">
                <button className="custom-add-word-button" onClick={handleAddWord}>+ أضف كلمة</button>
                <button className="custom-background-button" onClick={() => setIsBgModalOpen(true)}>اختر خلفية</button>

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
              <button className="save-activity-button" onClick={handleSaveGame}>احفظ النشاط</button>
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
              <button className="save-game-button" onClick={handleSaveGame}>احفظ اللعبة</button>
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

      {/* Activity Explanation Section */}
      <div className="activity-explanation">
        <h3>شرح النشاط:</h3>
        <p>
          في هذه اللعبة، عليك مطابقة الكلمات مع الصور الصحيحة. قم بتحميل الكلمات والصور، ثم ابدأ اللعبة.
          ستحصل على نقاط مقابل كل مطابقة صحيحة!
        </p>
      </div>
    </div>
  );
};

export default CustomWordImageMatch;
