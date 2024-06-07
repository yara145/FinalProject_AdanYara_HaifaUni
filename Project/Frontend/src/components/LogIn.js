import React from 'react';
import { useHistory } from 'react-router-dom';
import Lottie from 'react-lottie';
import loginAnimationData from '../assets/login-animation.json'; // Ensure you have a Lottie JSON file

import './LogIn.css';

const Login = () => {
    const history = useHistory();

    const handleLogin = (e) => {
        e.preventDefault();
        // Authentication logic here
        history.push('/dashboard');
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loginAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    console.log(loginAnimationData);
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
            </div>
        </div>
    );
};

export default Login;