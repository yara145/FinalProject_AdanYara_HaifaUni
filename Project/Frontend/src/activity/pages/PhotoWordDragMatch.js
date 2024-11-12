import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import BackgroundModal from '../../Teacher/Modal';
import CreateActivityForm from '../../Teacher/ChooseBg';
import './PhotoWordDragMatch.css';
import { useNavigate } from 'react-router-dom';
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import leftArrowIcon from '../../assets/images/right-arrow.png';
import rightArrowIcon from '../../assets/images/left-arrow.png';

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const PhotoWordDragMatch = () => {

  const [isGameEnded, setIsGameEnded] = useState(false);
  const [items, setItems] = useState([{ word: '', image: null }]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [coins, setCoins] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [draggedWord, setDraggedWord] = useState(null);
  const [draggedImage, setDraggedImage] = useState(null);
  const [droppedPhoto, setDroppedPhoto] = useState(null);
  const [droppedWord, setDroppedWord] = useState(null);
  const [displayedImageIndex, setDisplayedImageIndex] = useState(0);
  const [displayedWordIndex, setDisplayedWordIndex] = useState(0);
  const [words, setWords] = useState([]); // State for shuffled words
  const [images, setImages] = useState([]); // State for shuffled images
  const navigate = useNavigate();
  const [isWordDropped, setIsWordDropped] = useState(false); // New state to track drop
  const [isPhotoDropped, setIsPhotoDropped] = useState(false); // New state to track photo drop
  const [photoDropClass, setPhotoDropClass] = useState(''); // For photo drop area
  const [wordDropClass, setWordDropClass] = useState('');   // For word drop area
  const itemsPerPage = 4;

  // Shuffle function to randomize array elements effectively, ensuring a new order even for small arrays
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Copy the array

  // Keep shuffling until the order is different from the original
  do {
    shuffledArray = shuffledArray
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  } while (shuffledArray.every((val, index) => val === array[index]));

  return shuffledArray;
};


  const handleAddItem = () => setItems([...items, { word: '', image: null }]);
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleWordChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].word = value;
    setItems(updatedItems);
  };
  const handleImageUpload = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      const updatedItems = [...items];
      updatedItems[index].image = imageUrl;
      setItems(updatedItems);
    }
  };

  const handleStartGame = () => {
    if (items.every(item => item.word && item.image)) {
      setIsGameStarted(true);
      setWords(shuffleArray(items.map(item => item.word))); // Shuffle words
      setImages(shuffleArray(items.map(item => item.image))); // Shuffle images
      setProgress(0);
    } else {
      alert('Please complete all fields and upload all images.');
    }
  };

  const handleWordDragStart = (word) => setDraggedWord(word);
  const handleImageDragStart = (image) => setDraggedImage(image);


  const handlePhotoDrop = (e) => {
    e.preventDefault();
    if (draggedImage && !droppedPhoto) { // Ensure only a photo can be dropped here
        setDroppedPhoto(draggedImage);
        setDraggedImage(null);
        setIsPhotoDropped(true); // Set true when photo is dropped
        checkMatch(draggedImage, droppedWord);
    }
};

const handleWordDrop = (e) => {
    e.preventDefault();
    if (draggedWord && !droppedWord) { // Ensure only a word can be dropped here
        setDroppedWord(draggedWord);
        setDraggedWord(null);
        setIsWordDropped(true); // Set true when word is dropped
        checkMatch(droppedPhoto, draggedWord);
    }
};




const checkMatch = (photo, word) => {
  if (photo && word) {
    const currentMatch = items.find(item => item.image === photo && item.word === word);

    // Reset classes first to avoid overlap
    setPhotoDropClass('');
    setWordDropClass('');

    setTimeout(() => {
      if (currentMatch) {
        correctAudio.play();
        setCoins(coins + 10);
        setFeedbackMessage('🎉 أحسنت! تطابق صحيح');
        setFeedbackType('correct');

        // Apply green laser effect for correct answer
        setPhotoDropClass('correct-laser');
        setWordDropClass('correct-laser');

        // Update items after correct match
        const updatedItems = items.filter(item => item !== currentMatch);
        const updatedWords = words.filter(w => w !== word);
        const updatedImages = images.filter(img => img !== photo);

        setItems(updatedItems);
        setWords(updatedWords);
        setImages(updatedImages);

        // Update progress
        const progressPercentage = ((items.length - updatedItems.length) / items.length) * 100;
        setProgress(progressPercentage);

        if (progressPercentage === 100) {
          setIsGameEnded(true);
        }
      } else {
        incorrectAudio.play();
        setFeedbackMessage('❌ حاول مرة أخرى!');
        setFeedbackType('incorrect');

        // Apply red laser effect for incorrect answer
        setPhotoDropClass('incorrect-laser');
        setWordDropClass('incorrect-laser');
      }

      // Clear feedback and laser effect after a short delay
      setTimeout(() => {
        setFeedbackMessage('');
        resetDrops();
        setPhotoDropClass(''); // Clear laser effect
        setWordDropClass('');  // Clear laser effect
      }, 3000);

    }, 1900);
  }
};













  const resetDrops = () => {
    setDroppedPhoto(null);
    setDroppedWord(null);
    setIsWordDropped(false); // Reset visibility effect for word
    setIsPhotoDropped(false); // Reset visibility effect for photo
};


  // Scroll control functions with bounds checking
  const handleNextImage = () => {
    if (displayedImageIndex + itemsPerPage < images.length) {
      setDisplayedImageIndex(displayedImageIndex + itemsPerPage);
    }
  };

  const handlePreviousImage = () => {
    if (displayedImageIndex > 0) {
      setDisplayedImageIndex(displayedImageIndex - itemsPerPage);
    }
  };

  const handleNextWord = () => {
    if (displayedWordIndex + itemsPerPage < words.length) {
      setDisplayedWordIndex(displayedWordIndex + itemsPerPage);
    }
  };

  const handlePreviousWord = () => {
    if (displayedWordIndex > 0) {
      setDisplayedWordIndex(displayedWordIndex - itemsPerPage);
    }
  };

  return (
    <div
      className="photo-word-drag-match"
      style={isGameStarted && selectedBackground
        ? { backgroundImage: `url(${selectedBackground})`, backgroundSize: 'cover' }
        : {}
      }
    >

{isGameStarted ? (
  <>
    <ProgressBar progress={progress} /> {/* Display progress bar */}
    <p className="g-instruction">اسحب الكلمة والصورة المطابقة : </p> {/* Instruction text */}
    <div className="top-bar">
      <div className="score-display">
        <CoinsDisplay coins={coins} />
        <LevelDisplay level={1} />
      </div>
      <div className="button-container">
        <img src={backButtonImage} alt="Back" className="nav-icon" onClick={() => navigate('/activity-selection')} />
        <img src={exitButtonImage} alt="Exit" className="nav-icon" onClick={() => navigate('/')} />
      </div>
    </div>


          <div className="game-play-container">
          <div className="photo-gallery">
    {!isGameEnded && (
        <img
            src={leftArrowIcon}
            alt="Previous"
            onClick={handlePreviousImage}
            className={`scroll-button ${displayedImageIndex === 0 ? 'disabled' : ''}`}
        />
    )}
    {images.slice(displayedImageIndex, displayedImageIndex + itemsPerPage).map((image, index) => (
        <img
            key={index}
            src={image}
            draggable
            onDragStart={() => handleImageDragStart(image)}
            className="draggable-image"
            alt="Draggable item"
        />
    ))}
    {!isGameEnded && (
        <img
            src={rightArrowIcon}
            alt="Next"
            onClick={handleNextImage}
            className={`scroll-button ${displayedImageIndex + itemsPerPage >= images.length ? 'disabled' : ''}`}
        />
    )}
</div>

<div className="word-gallery">
    {!isGameEnded && (
        <img
            src={leftArrowIcon}
            alt="Previous"
            onClick={handlePreviousWord}
            className={`scroll-button ${displayedWordIndex === 0 ? 'disabled' : ''}`}
        />
    )}
    {words.slice(displayedWordIndex, displayedWordIndex + itemsPerPage).map((word, index) => (
        <div
            key={index}
            draggable
            onDragStart={() => handleWordDragStart(word)}
            className="draggable-word"
        >
            {word}
        </div>
    ))}
    {!isGameEnded && (
        <img
            src={rightArrowIcon}
            alt="Next"
            onClick={handleNextWord}
            className={`scroll-button ${displayedWordIndex + itemsPerPage >= words.length ? 'disabled' : ''}`}
        />
    )}
</div>


            <div className="drag-zone-row">
            <div className={`drop-area photo-drop ${isPhotoDropped ? 'highlighted-drop-area' : ''} ${photoDropClass}`}
     onDrop={handlePhotoDrop}
     onDragOver={(e) => e.preventDefault()}>
    {droppedPhoto ? (
        <img src={droppedPhoto} alt="Dropped" className="dropped-image" />
    ) : (
        'اسحب الصورة'
    )}
</div>

<div className={`drop-area word-drop ${isWordDropped ? 'highlighted-drop-area' : ''} ${wordDropClass}`}
     onDrop={handleWordDrop}
     onDragOver={(e) => e.preventDefault()}>
    {droppedWord || 'اسحب الكلمة'}
</div>


            </div>
          </div>

          {feedbackMessage && (
            <div className={`feedback-message ${feedbackType}`}>
              {feedbackMessage}
            </div>
          )}
        </>
      ) : (
        <div className="setup-phase">
          <header className="teacher-header">
            <nav className="teacher-nav">
              <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
              <button className="nav-button" onClick={() => navigate('/teacher')}>الصفحة الرئيسية</button>
              <button className="nav-button" onClick={() => navigate('/activity-selection')}>خلف</button>
            </nav>
          </header>

          <div className="photo-word-drag-match-container">
            <div className="custom-word-input-form scrollable-container">
              <h2 style={{ color: '#4caf50' }}>أدخل كلمات وارفع صور</h2>
              {items.map((item, index) => (
                <div key={index} className="word-block">
                  <div className="word-header">
                    <h3>{`كلمة ${index + 1}`}</h3>
                    <button className="cancel-button" onClick={() => handleRemoveItem(index)}>✖</button>
                  </div>
                  <input
                    type="text"
                    value={item.word}
                    onChange={(e) => handleWordChange(index, e.target.value)}
                    placeholder="أدخل الكلمة"
                  />
                  <input type="file" onChange={(e) => handleImageUpload(index, e)} className="upload-input" />
                  <hr className="divider" />
                </div>
              ))}
              <div className="button-group">
                <button className="custom-add-word-button" onClick={handleAddItem}>+ أضف كلمة</button>
                <button className="custom-background-button" onClick={() => setIsBgModalOpen(true)}>
                  اختر خلفية
                </button>
              </div>
              <BackgroundModal isOpen={isBgModalOpen} onClose={() => setIsBgModalOpen(false)}>
                <CreateActivityForm onBackgroundSelect={(background) => {
                  setSelectedBackground(background);
                  setIsBgModalOpen(false);
                }} />
              </BackgroundModal>
              <button className="start-game-button" onClick={handleStartGame}>ابدأ اللعبة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoWordDragMatch;
