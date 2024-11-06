import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LogIn';
import Signup from './components/SignIn';
import ChooseAvatar from './user/pages/ChooseAvatar';
import LetterActivity from './activity/pages/LetterActivity';
import HomePage from './levels/pages/HomePage';
import IslandLevels from './levels/pages/IslandLevels';
import ClipActivity from './activity/pages/ClipActivity';
import ClipPhotoMatch from './activity/pages/ClipPhotoMatch';
import LandingPage from './components/LandingPage';
import AddStudent from './Teacher/AddStudent';
import ShowStudentsPage from './Teacher/ShowStudentsPage';
import TeacherLogin from './Teacher/TeacherLogin';
import TeacherPage from './Teacher/TeacherPage';
import IdentifyImageActivity from './activity/pages/IdentifyImageActivity';
import Shuffle from './activity/pages/WordShuffle';
import './LetterCheck.css';
import LetterIdentification from './activity/pages/LetterIdentification';
import CustomWordShuffle from './activity/pages/CustomInputWordShuffle';
import ActivitySelection from './Teacher/ActivitySelection';
import StudentIsland from './user/pages/StudentIsland';
import StudentActivities from './user/pages/StudentActivities';
import WordShuffleGame from './user/pages/WordShuffleGame';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/teacher" element={<TeacherLogin />} />
          <Route path="/login/student" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activity" element={<LetterActivity />} />
          <Route path="/clip-activity" element={<ClipActivity />} />
          <Route path="/clip-photo-match" element={<ClipPhotoMatch />} />
          <Route path="/choose-avatar" element={<ChooseAvatar />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/levels/island" element={<IslandLevels />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/show-students" element={<ShowStudentsPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/identify-image" element={<IdentifyImageActivity />} />
          <Route path="/shuffle" element={<Shuffle />} />
          <Route path="/letter-identification" element={<LetterIdentification />} />
          <Route path="/activity-selection" element={<ActivitySelection />} />
          <Route path="/student-island/:studentId" element={<StudentIsland />} />
          <Route path="/student/activities/:studentId/:activityType" element={<StudentActivities />} />
          <Route path="/custom-word-shuffle" element={<CustomWordShuffle />} />
          {/* Adjusted route to pass activityId, studentId, and level */}
          <Route path="/activities/:activityId/:studentId/:level" element={<WordShuffleGame />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
