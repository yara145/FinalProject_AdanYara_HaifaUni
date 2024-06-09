// src/components/LogIn.js
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import loginAnimationData from '../assets/login-animation.json';
import './LogIn.css';

const Login = () => {
    const navigate = useNavigate();
    const animationContainer = useRef(null);

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

    const handleLogin = (e) => {
        e.preventDefault();
        // Authentication logic here
        navigate('/dashboard');
    };

    const handleYara = () => {
        navigate('/activity'); // Navigate to LetterActivity
    };

    const handleAdam = () => {
        navigate('../user/pages/ChooseAvatar.js');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div ref={animationContainer} style={{ height: '150px', width: '150px' }} />
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Username" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
            <button className="button-left" onClick={handleAdam}>Adam</button>
            <button className="button-right" onClick={handleYara}>Yara</button>
        </div>
    );
};

export default Login;
