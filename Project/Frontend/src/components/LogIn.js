import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import lottie from 'lottie-web';
import loginAnimationData from '../assets/login-animation.json';
import './LogIn.css';

const Login = () => {
    const navigate = useNavigate(); // Updated initialization
    const animationContainer = useRef(null);

    useEffect(() => {
        const anim = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: loginAnimationData,
        });

        anim.addEventListener('DOMLoaded', () => {
            console.log('DOM Loaded for animation:', anim);
        });

        anim.addEventListener('complete', () => {
            console.log('Animation complete:', anim);
        });

        console.log('Animation loaded:', anim);
        console.log('Animation container:', animationContainer.current);

        return () => anim.destroy(); // Cleanup on unmount
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        // Authentication logic here
        navigate('/dashboard'); // Updated navigation
    };

    const handleYara = () => {
        // Logic for Yara button
        navigate('/yara');
    };

    const handleAdam = () => {
        // Logic for Adam button
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
