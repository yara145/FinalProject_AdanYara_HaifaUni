import React from 'react';
import { useHistory } from 'react-router-dom';
import Lottie from 'react-lottie';
import signupAnimationData from '../assets/signup-animation.json'; // Ensure you have a Lottie JSON file

import './SignIn.css';

const Signup = () => {
    const history = useHistory();

    const handleSignup = (e) => {
        e.preventDefault();
        // Registration logic here
        history.push('/dashboard');
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: signupAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <Lottie options={defaultOptions} height={150} width={150} />
                <h2>Signup</h2>
                <form onSubmit={handleSignup}>
                    <input type="text" placeholder="Username" required />
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Signup</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;