import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure the path to the logo is correct
import './TeacherLogin.css';

const TeacherLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Hard-coded teacher credentials
        const teacherUsername = 'adan';
        const teacherPassword = 'adan2000';

        if (username === teacherUsername && password === teacherPassword) {
            navigate('/teacher'); // Navigate to the teacher's home page
        } else {
            setError('Invalid username or password');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="login-container teacher-login-rtl">
            <header className="login-header">
                <img src={logo} alt="Logo" className="login-logo" />
                <button className="back-button-teacher" onClick={handleBack}>رجوع</button>
            </header>
            <div className="login-card">
                <h2>تسجيل دخول المعلم</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="كلمة السر"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">تسجيل دخول</button>
                </form>
            </div>
        </div>
    );
};

export default TeacherLogin;
