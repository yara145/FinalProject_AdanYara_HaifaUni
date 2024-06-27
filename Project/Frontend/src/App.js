import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LogIn';
import Signup from './components/SignIn';
import ChooseAvatar from './user/pages/ChooseAvatar';
import LetterActivity from './activity/pages/LetterActivity';
import HomePage from './levels/pages/HomePage';
import IslandLevels from './levels/pages/IslandLevels';
import ClipActivity from './activity/pages/ClipActivity';
import ClipPhotoMatch from './activity/pages/ClipPhotoMatch'; // Import ClipPhotoMatch
import './LetterCheck.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activity" element={<LetterActivity />} />
          <Route path="/clip-activity" element={<ClipActivity />} />
          <Route path="/clip-photo-match" element={<ClipPhotoMatch />} /> {/* Add ClipPhotoMatch route */}
          <Route path="/" element={<Login />} />
          <Route path="/choose-avatar" element={<ChooseAvatar />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/levels/island" element={<IslandLevels />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;