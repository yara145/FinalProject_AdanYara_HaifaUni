import React, { useEffect, useRef } from 'react'; // Removed `useMemo`
import { useNavigate } from 'react-router-dom';
import Island from '../components/Island';
import Mountain from '../components/Mountain';
import Park from '../components/Park';
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import cloudImage from '../../assets/images/cloud1.png';
import tigerAnimation from '../../assets/animation/login-animation.json';
import speechBubbleImage from '../../assets/speech-bubble.png';
import sunAnimation from '../../assets/animation/sun.json';
import birdsAnimation from '../../assets/animation/birds.json';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const tigerRef = useRef(null);
  const sunRef = useRef(null);
  const birdsRef = useRef(null);

  // Define cloudRefs directly without a callback
  const cloudRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    lottie.loadAnimation({
      container: tigerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: tigerAnimation,
    });

    lottie.loadAnimation({
      container: sunRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: sunAnimation,
    });

    lottie.loadAnimation({
      container: birdsRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: birdsAnimation,
    });

    cloudRefs.forEach((ref, index) => {
      gsap.to(ref.current, {
        x: index % 2 === 0 ? '+=200px' : '-=200px',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 10,
      });
    });
  }, [cloudRefs]);

  // Retrieve studentId from localStorage
  const studentId = localStorage.getItem('studentId');

  const handleClick = (type) => {
    const studentId = localStorage.getItem('studentId'); // Retrieve studentId from localStorage
    console.log("Navigating from HomePage with studentId:", studentId); // Log studentId in HomePage
  
    if (!studentId) {
      console.error("Student ID not found in localStorage");
      return;
    }
    if (type === 'island') {
      navigate(`/student-island/${studentId}`); // Include studentId in the URL
    }
    if (type === 'mountain') {
      navigate(`/student-mountain/${studentId}`); // Navigate to the mountain page with studentId
    }
  };
  

  return (
    <div className="home-page">
      <button className="back-button" onClick={() => navigate(-1)}>
  رجوع
</button>

      <div className="clouds">
        <div className="cloud cloud1" ref={cloudRefs[0]}>
          <img src={cloudImage} alt="Cloud 1" />
        </div>
        <div className="cloud cloud2" ref={cloudRefs[1]}>
          <img src={cloudImage} alt="Cloud 2" />
        </div>
      </div>
      <div className="sun-animation" ref={sunRef}></div>
      <div className="birds-animation" ref={birdsRef}></div>
      <div className="land">
        <div className="item island" onClick={() => handleClick('island')}>
          <div className="island-title">حلوى المقاطع والكلمات</div>
          <Island />
        </div>
        <div className="item mountain" onClick={() => handleClick('mountain')}>
          <div className="title">تلة الوعي الصوتي</div>
          <Mountain />
        </div>
        <div className="item park" onClick={() => handleClick('park')}>
          <div className="title">جزيرة الفهم المقروء</div>
          <Park />
        </div>
      </div>
      <div className="welcome-message">
        <div className="message-bubble">
          <img src={speechBubbleImage} alt="Speech Bubble" className="bubble-image" />
          <div className="message-text">
            مرحبًا بك في مغامرتنا التعليمية, بامكانك اختيار المرحلة التي تريدها
          </div>
        </div>
        <div className="tiger-animation" ref={tigerRef}></div>
      </div>
    </div>
  );
};

export default HomePage;
