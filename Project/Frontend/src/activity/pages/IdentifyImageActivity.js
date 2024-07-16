import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import './IdentifyImageActivity.css';
import { useReward } from 'react-rewards';
import gsap from 'gsap';
import CoinsDisplay from '../components/CoinsDisplay';
import LevelDisplay from '../components/LevelDisplay';
import home from '../../assets/home.jpg';
import court from '../../assets/court.jpg';
import pencil from '../../assets/pencil.jpg';
import dad from '../../assets/dad.jpg';
import cry from '../../assets/cry.jpg';
import island from '../../assets/island.jpg';
import sand from '../../assets/sand.jpg';
import airplaneBanner from '../../assets/images/Air.png';
import sandClockAnimation from '../../assets/animation/sand-clock.json';
import cloudAnimation from '../../assets/animation/cloud.json';
import balloonAnimation from '../../assets/animation/balloon.json';
import celebrationAnimation from '../../assets/animation/celebration.json';
import backButtonImage from '../../assets/images/back.png';
import exitButtonImage from '../../assets/images/exit.png';
import restartButtonImage from '../../assets/images/restart.png';
import backButtonSound from '../../assets/sound/backBT.wav'; 
import homeButtonSound from '../../assets/sound/backBT.wav'; 
import correctSound from '../../assets/sound/true.mp3';
import incorrectSound from '../../assets/sound/false.mp3';

const words = [
  { word: 'دار', correctImage: home, images: [court, island, home, cry] },
  { word: 'ملعب', correctImage: court, images: [court, home, dad, island] },
  { word: 'قلم', correctImage: pencil, images: [dad, sand, home, pencil] },
  { word: 'أبي', correctImage: dad, images: [pencil, dad, court, sand] }
];

const IdentifyImageActivity = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const [showAirplane, setShowAirplane] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(1);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const { reward, isAnimating } = useReward('rewardId', 'emoji', {
    emoji: ['🎉', '🎈'],
    lifetime: 500,
  });
  const [feedback, setFeedback] = useState(null);
  const [balloonHeight, setBalloonHeight] = useState(0);
  const [activityComplete, setActivityComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const airplaneRef = useRef(null);
  const lottieRef = useRef(null);
  const cloudRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const wordContainerRef = useRef(null);
  const balloonRef = useRef(null);
  const celebrationRef = useRef(null);
  const backAudioRef = useRef(null);
  const homeAudioRef = useRef(null);
  const correctAudioRef = useRef(null);
  const incorrectAudioRef = useRef(null);

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    backAudioRef.current = new Audio(backButtonSound);
    homeAudioRef.current = new Audio(homeButtonSound);
    correctAudioRef.current = new Audio(correctSound);
    incorrectAudioRef.current = new Audio(incorrectSound);
    backAudioRef.current.load();
    homeAudioRef.current.load();
    correctAudioRef.current.load();
    incorrectAudioRef.current.load();
  }, []);

  useEffect(() => {
    const startTimer = () => {
      setShowImages(false);
      setShowAirplane(false);
      gsap.set(wordContainerRef.current, { opacity: 1 });
    };

    startTimer();

    return () => {
      clearTimeout(startTimer);
    };
  }, [currentWordIndex]);

  useEffect(() => {
    if (lottieRef.current) {
      lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: sandClockAnimation,
      });
    }
  }, [currentWordIndex]);

  useEffect(() => {
    cloudRefs.forEach((ref) => {
      if (ref.current) {
        lottie.loadAnimation({
          container: ref.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: cloudAnimation,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (balloonRef.current) {
      lottie.loadAnimation({
        container: balloonRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: balloonAnimation,
      });
    }
  }, []);

  useEffect(() => {
    if (activityComplete && correctAnswers === words.length && celebrationRef.current) {
      lottie.loadAnimation({
        container: celebrationRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: celebrationAnimation,
      });
    }
  }, [activityComplete, correctAnswers]);

  const handleSkip = () => {
    gsap.to(wordContainerRef.current, {
      opacity: 0,
      duration: 1,
      onComplete: () => setShowImages(true)
    });
  };

  const handleImageClick = (image) => {
    if (image === currentWord.correctImage) {
      correctAudioRef.current.play();
      setFeedback('correct');
      setPoints(points + 10);
      setCoins(coins + 5);
      setCorrectAnswers(correctAnswers + 1);
      reward();
      setBalloonHeight((prevHeight) => Math.min(prevHeight + 20, 100));
      setTimeout(() => {
        setFeedback(null);
        if (currentWordIndex < words.length - 1) {
          animateAirplane();
        } else {
          setBalloonHeight(120);
          setActivityComplete(true);
        }
      }, 2000);
    } else {
      incorrectAudioRef.current.play();
      setFeedback('incorrect');
      if (attemptsLeft > 0) {
        setAttemptsLeft(attemptsLeft - 1);
      } else {
        setTimeout(() => {
          setFeedback(null);
          animateAirplane();
        }, 2000);
      }
    }
  };

  const animateAirplane = () => {
    setShowAirplane(true);
    if (currentWordIndex < words.length - 1) {
      if (airplaneRef.current) {
        gsap.fromTo(
          airplaneRef.current,
          { x: '-100vw', y: '-100vh' },
          {
            x: '50vw',
            y: '50vh',
            duration: 4,
            ease: 'power3.out',
            onComplete: () => {
              gsap.to(
                airplaneRef.current,
                {
                  x: '100vw',
                  y: '100vh',
                  duration: 4,
                  ease: 'power3.in',
                  onComplete: () => {
                    setShowAirplane(false);
                    moveToNextWord();
                  },
                },
              );
            },
          },
        );
      }
    } else {
      setBalloonHeight(120);
      setActivityComplete(true);
    }
  };

  const moveToNextWord = () => {
    setAttemptsLeft(1);
    setCurrentWordIndex((prevIndex) => (prevIndex < words.length - 1 ? prevIndex + 1 : 0));
    gsap.set(wordContainerRef.current, { opacity: 1 });
  };

  useEffect(() => {
    if (!isAnimating) {
      document.getElementById('rewardId').innerHTML = '';
    }
  }, [currentWordIndex, isAnimating]);

  const handleBackClick = () => {
    if (backAudioRef.current) {
      backAudioRef.current.currentTime = 0;
      backAudioRef.current.play().catch(error => {
        console.error('Error playing back button sound:', error);
      });
    }
    navigate('/login');
  };

  const handleHomeClick = () => {
    if (homeAudioRef.current) {
      homeAudioRef.current.currentTime = 0;
      homeAudioRef.current.play().catch(error => {
        console.error('Error playing home button sound:', error);
      });
    }
    navigate('/');
  };

  return (
    <div className="identify-image-activity">
      <div className="header">
        <div className="button-container">
          <div className="exit-button-wrapper">
            <img 
              src={exitButtonImage} 
              alt="Exit" 
              className="exit-button-image"
              onClick={handleHomeClick}
            />
          </div>
          <div className="back-button-wrapper">
            <img 
              src={backButtonImage} 
              alt="Back" 
              className="back-button-image"
              onClick={handleBackClick}
            />
          </div>
        </div>
        <div className="score-display">
          <CoinsDisplay coins={coins} />
          <LevelDisplay level={level} />
        </div>
      </div>
      <div className="content">
        <div className="cloud cloud1" ref={cloudRefs[0]}></div>
        <div className="cloud cloud2" ref={cloudRefs[1]}></div>
        <div className="cloud cloud3" ref={cloudRefs[2]}></div>
        <div className="cloud cloud4" ref={cloudRefs[3]}></div>
        <div className="cloud cloud5" ref={cloudRefs[4]}></div>
        <div className="cloud cloud6" ref={cloudRefs[5]}></div>
        <div className="balloon-container" style={{ bottom: `${balloonHeight}%` }} ref={balloonRef}></div>
        {!showImages && !activityComplete && (
          <div className="word-container" ref={wordContainerRef}>
            <h1>{currentWord.word}</h1>
            <div className="timer">
              <div ref={lottieRef} className="sand-clock-animation"></div>
            </div>
            <button className="skip-button" onClick={handleSkip}>تخطي</button>
          </div>
        )}
        {showAirplane && !activityComplete && (
          <div className="airplane-container" ref={airplaneRef}>
            <img src={airplaneBanner} alt="Airplane Banner" className="airplane-image" />
          </div>
        )}
        {showImages && !showAirplane && !activityComplete && (
          <div className="images-display">
            {currentWord.images.map((image, index) => (
              <img key={index} src={image} alt="option" onClick={() => handleImageClick(image)} className="animate__animated animate__zoomIn animate__delay-1s" />
            ))}
          </div>
        )}
        {feedback && (
          <div className={`feedback-message ${feedback === 'correct' ? 'animate__animated animate__fadeOutUp' : 'animate__animated animate__shakeX'}`}>
            {feedback === 'correct' ? 'صحيح!' : 'خطأ! حاول مرة أخرى'}
          </div>
        )}
        {activityComplete && correctAnswers === words.length && (
          <div className="celebration-container" ref={celebrationRef}></div>
        )}
        {activityComplete && (
          <div className="feedback-modal summary-modal">
            <div className="summary-content">
              <div>{`لقد أجبت على جميع الأسئلة!`}</div>
              <div>{`مجموع النقاط: ${points}`}</div>
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
                onClick={handleHomeClick}
              />
            </div>
          </div>
        )}
        <div id="rewardId" style={{ position: 'relative' }}></div>
      </div>
    </div>
  );
}

export default IdentifyImageActivity;
