// src/components/SignIn.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', { username, password });
      navigate('/choose-avatar');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error connecting to the server');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>التسجيل</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">تسجيل</button>
        </form>
        <p>لديك حساب؟ <Link to="/login">تسجيل الدخول</Link></p>
      </div>
    </div>
  );
};

export default Signup;
