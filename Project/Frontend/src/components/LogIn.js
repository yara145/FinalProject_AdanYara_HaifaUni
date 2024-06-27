// src/components/LogIn.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import lottie from 'lottie-web';
import loginAnimationData from '../assets/animation/login-animation.json';
import './LogIn.css';

const Login = () => {
    const navigate = useNavigate();
    const animationContainer = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            await axios.post('http://localhost:5000/api/login', { username, password });
            // Simulate avatar choice for now, this should be set during the signup or avatar selection process
            if (!localStorage.getItem('avatar')) {
                localStorage.setItem('avatar', JSON.stringify({ name: 'Elephant', image: '/elephant.png' }));
            }
            localStorage.setItem('username', username);
            navigate('/home');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleYara = () => {
        navigate('/activity'); // Navigate to LetterActivity
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div ref={animationContainer} style={{ height: '150px', width: '150px' }} />
                <h2>تسجيل دخول</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">تسجيل دخول</button>
                </form>
                <p>ليس لديك حساب؟ <Link to="/signup">تسجيل</Link></p>
            </div>
            <button className="button-right" onClick={handleYara}>Yara</button>
        </div>
    );
};

export default Login;
