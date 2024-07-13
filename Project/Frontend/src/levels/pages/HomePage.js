import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Island from '../components/Island';
import Mountain from '../components/Mountain';
import Park from '../components/Park';
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import cloudsAnimation from '../../assets/animation/cloud.json'; // Adjust path if needed
import tigerAnimation from '../../assets/animation/login-animation.json';
import speechBubbleImage from '../../assets/speech-bubble.png';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const tigerRef = useRef(null);
  const cloudRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    lottie.loadAnimation({
      container: tigerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: tigerAnimation,
    });

    cloudRefs.forEach((ref, index) => {
      lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: cloudsAnimation,
      });

      gsap.to(ref.current, {
        x: index % 2 === 0 ? '+=200px' : '-=200px', // Move some clouds to the right and some to the left
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 10, // Duration of one full movement (left to right and back)
      });
    });
  }, [cloudRefs]);

  const handleClick = (type) => {
    const target = `.${type}`;
    gsap.to(target, {
      duration: 0.5,
      scale: 1.5,
      onComplete: () => {
        gsap.to(target, {
          duration: 0.5,
          scale: 1,
          onComplete: () => navigate(`/levels/${type}`),
        });
      },
    });
  };

  return (
    <div className="home-page">
      <button className="back-button" onClick={() => navigate('/login')}>
        رجوع
      </button>
      <div className="clouds">
        <div className="cloud cloud1" ref={cloudRefs[0]}></div>
        <div className="cloud cloud2" ref={cloudRefs[1]}></div>
        <div className="cloud cloud3" ref={cloudRefs[2]}></div>
        <div className="cloud cloud4" ref={cloudRefs[3]}></div>
      </div>
      <div className="land">
        <div className="item island" onClick={() => handleClick('island')}>
          <div className="title">جزيرة المقاطع والكلمات</div>
          <Island />
        </div>
        <div className="item mountain" onClick={() => handleClick('mountain')}>
          <div className="title">تلة الوعي الصوتي</div>
          <Mountain />
        </div>
        <div className="item park" onClick={() => handleClick('park')}>
          <div className="title">حديقة الفهم المقروء والفهم المسموع</div>
          <Park />
        </div>
      </div>
      <div className="welcome-message">
        <div className="tiger-animation" ref={tigerRef}></div>
        <div className="message-bubble">
          <img src={speechBubbleImage} alt="Speech Bubble" className="bubble-image" />
          <div className="message-text">
            مرحبًا بك في مغامرتنا التعليمية, بامكانك اختيار المرحلة التي تريدها
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
