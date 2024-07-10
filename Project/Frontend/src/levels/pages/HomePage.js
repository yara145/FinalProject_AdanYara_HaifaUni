import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Island from '../components/Island';
import Mountain from '../components/Mountain';
import Park from '../components/Park';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import cloudsAnimation from '../../assets/animation/clouds.json';
import balloonAnimation from '../../assets/balloon.png';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const avatar = JSON.parse(localStorage.getItem('avatar'));
  const studentNumber = localStorage.getItem('studentNumber');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000); // Show message after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (type) => {
    const target = `.${type}`;
    gsap.to(target, {
      duration: 0.5,
      scale: 1.5,
      onComplete: () => {
        gsap.to(target, { duration: 0.5, scale: 1, onComplete: () => navigate(`/levels/${type}`) });
      }
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="home-page">
      
      <div className="clouds">
        <Lottie animationData={cloudsAnimation} loop={true} />
      </div>
      <div className="land">
        <div className="item island" onClick={() => handleClick('island')}>
          <Island />
          <div className="title">جزيرة المقاطع والكلمات</div>
        </div>
        <div className="item mountain" onClick={() => handleClick('mountain')}>
          <Mountain />
          <div className="title">تلة الوعي الصوتي</div>
        </div>
        <div className="item park" onClick={() => handleClick('park')}>
          <Park />
          <div className="title">حديقة الفهم المقروء والفهم المسموع</div>
        </div>
      </div>
      <div className="welcome-message">
        <div className="balloon">
          <img src={balloonAnimation} alt="Balloon" className="balloon-image" />
          {avatar && <img src={avatar.image} alt={avatar.name} className="avatar" />}
        </div>
        {showMessage && (
          <div className="message">
            <div className="message-icon">💬</div>
            <div className="message-text">مرحبًا {studentNumber}!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
