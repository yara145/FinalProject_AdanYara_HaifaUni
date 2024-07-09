// src/Teacher/ShowStudentsPage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShowStudentsPage.css';
import logo from '../assets/logo.png';

const ShowStudentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students } = location.state || { students: [] };

  return (
    <div className="show-students-page">
      <header className="teacher-header">
        <img src={logo} alt="Logo" className="teacher-logo" />
        <nav className="teacher-nav">
          <button className="nav-button" onClick={() => navigate('/teacher')}>عودة</button>
          <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
        </nav>
      </header>
      <main className="teacher-main">
        <h2>عرض الطلاب</h2>
        <ul className="students-list">
          {students.map((student, index) => (
            <li key={index} className="student-item">
              <span className="student-number">{index + 1}</span> {student.name}
              <ul className="difficulties-list">
                {student.difficulties.map((difficulty, i) => (
                  <li key={i} className="difficulty-item">{difficulty}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default ShowStudentsPage;
