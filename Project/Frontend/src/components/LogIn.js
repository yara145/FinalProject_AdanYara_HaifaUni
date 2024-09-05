import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import lottie from 'lottie-web';
import loginAnimationData from '../assets/animation/login-animation.json';
import logo from '../assets/logo.png';
import './LogIn.css';

const Login = () => {
  const navigate = useNavigate();
  const animationContainer = useRef(null);
  const [studentNumber, setStudentNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loginAnimationData,
    });

    return () => anim.destroy(); // Cleanup on unmount
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/student-login', { number: studentNumber });
      localStorage.setItem('studentNumber', studentNumber);
      localStorage.setItem('firstLogin', response.data.firstLogin);
      navigate('/home'); // Navigate directly to the home page
    } catch (err) {
      console.error(err); // Log the full error object
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem('studentNumber', 'guest');
    localStorage.setItem('isGuest', 'true');
    navigate('/home'); // Navigate directly to the home page
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="login-container login-rtl">
      <header className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
        <button className="back-button-login" onClick={handleBack}>رجوع</button>
      </header>
      <div className="login-card">
        <div ref={animationContainer} style={{ height: '150px', width: '150px' }} />
        <h2>تسجيل دخول الطالب</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="رقم الطالب"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
          <button type="submit">تسجيل دخول</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
