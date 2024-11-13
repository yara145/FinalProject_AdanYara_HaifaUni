import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.png'; // Ensure the path to the logo is correct
import teacherIcon from '../assets/teacher.png'; // Ensure the path to the teacher icon is correct
import studentIcon from '../assets/student.png'; // Ensure the path to the student icon is correct
import guestIcon from '../assets/guest.png'; // Ensure the path to the guest icon is correct

const LandingPage = () => {
  const navigate = useNavigate();

  const handleTeacherLogin = () => {
    navigate('/login/teacher');
  };

  const handleStudentLogin = () => {
    navigate('/login/student');
  };

  const handleGuestLogin = () => {
    localStorage.setItem('studentNumber', 'guest');
    localStorage.setItem('isGuest', 'true');
    navigate('/home'); // Navigate directly to the home page
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <img src={logo} alt="Logo" className="landing-logo" />
        <div className="landing-buttons">
          <div className="landing-button-wrapper">
            <img src={teacherIcon} alt="Teacher Icon" className="button-icon" />
            <button className="landing-button" onClick={handleTeacherLogin}>أنا معلم</button>
          </div>
          <div className="landing-button-wrapper">
            <img src={studentIcon} alt="Student Icon" className="button-icon" />
            <button className="landing-button" onClick={handleStudentLogin}>أنا طالب</button>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
