// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LogIn';
import Signup from './components/SignIn';
import ChooseAvatar from './user/pages/ChooseAvatar';
import LetterActivity from './activity/pages/LetterActivity';
import './LetterCheck.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activity" element={<LetterActivity />} />
          <Route path="/" element={<Login />} />
          <Route path="/choose-avatar" element={<ChooseAvatar/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
