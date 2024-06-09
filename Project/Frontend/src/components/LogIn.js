// src/components/LogIn.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import loginAnimationData from '../assets/login-animation.json';
import './LogIn.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Authentication logic here
    navigate('/dashboard');
  };

  const redirectToActivity = () => {
    navigate('/activity');
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Lottie options={defaultOptions} height={150} width={150} />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <button onClick={redirectToActivity} className="continue-button">Continue without Logging In</button>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
