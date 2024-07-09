import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IdentifyImageActivity.css';
import { useReward } from 'react-rewards';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import home from '../../assets/home.jpg';
import court from '../../assets/court.jpg';
import pencil from '../../assets/pencil.jpg';
import dad from '../../assets/dad.jpg';
import cry from '../../assets/cry.jpg';
import island from '../../assets/island.jpg';
import sand from '../../assets/sand.jpg';
import airplaneBanner from '../../assets/images/bannerPlan.png'; // Add airplane banner image
import cloud from '../../assets/images/cloud.png'; // Add cloud image

const words = [
  { word: 'دار', correctImage: home, images: [ court, island,home, cry] },
  { word: 'ملعب', correctImage: court, images: [court, home, dad, island] },
  { word: 'قلم', correctImage: pencil, images: [dad, sand, home,pencil] },
  { word: 'أبي', correctImage: dad, images: [ pencil,dad, court, sand] }
];

const IdentifyImageActivity = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(1);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const { reward: rewardEmoji } = useReward('rewardId', 'emoji', {
    emoji: ['🌟', '👍']
  });
  const [feedback, setFeedback] = useState(null);

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImages(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [currentWordIndex]);

  const handleImageClick = (image) => {
    if (image === currentWord.correctImage) {
      setFeedback('correct');
      setPoints(points + 10);
      setCoins(coins + 5);
      rewardEmoji();
      setTimeout(() => {
        setFeedback(null);
        moveToNextWord();
      }, 2000);
    } else {
      setFeedback('incorrect');
      if (attemptsLeft > 0) {
        setAttemptsLeft(attemptsLeft - 1);
      } else {
        setTimeout(() => {
          setFeedback(null);
          moveToNextWord();
        }, 2000);
      }
    }
  };

  const moveToNextWord = () => {
    setShowImages(false);
    setAttemptsLeft(1);
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  return (
    <div className="identify-image-activity">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/login')}>رجوع</button>
        <div className="score-display">
          <CoinsDisplay coins={coins} />
          <LevelDisplay level={level} />
        </div>
      </div>
      <div className="content">
        {!showImages ? (
          <>
            <div className="cloud cloud1"><img src={cloud} alt="Cloud" /></div>
            <div className="cloud cloud2"><img src={cloud} alt="Cloud" /></div>
            <div className="cloud cloud3"><img src={cloud} alt="Cloud" /></div>
            <div className="airplane-container">
              <img src={airplaneBanner} alt="Airplane Banner" className="airplane-image" />
              <div className="banner-text">{currentWord.word}</div>
            </div>
          </>
        ) : (
          <div className="images-display">
            {currentWord.images.map((image, index) => (
              <img key={index} src={image} alt="option" onClick={() => handleImageClick(image)} className="animate__animated animate__zoomIn animate__delay-1s"/>
            ))}
          </div>
        )}
        {feedback && (
          <div className={`feedback-message ${feedback === 'correct' ? 'animate__animated animate__fadeOutUp' : 'animate__animated animate__shakeX'}`}>
            {feedback === 'correct' ? 'صحيح!' : 'خطأ! حاول مرة أخرى'}
          </div>
        )}
        <div id="rewardId" style={{ position: 'relative' }}></div>
      </div>
    </div>
  );
};

export default IdentifyImageActivity;
