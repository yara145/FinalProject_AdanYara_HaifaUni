// src/Teacher/TeacherPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudent from './AddStudent';
import Modal from './Modal';
import logo from '../assets/logo.png';
import './TeacherPage.css';
import './Modal.css';

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = (student) => {
    // Check for duplicate student numbers
    if (students.some(s => s.name === student.name)) {
      return 'رقم الطالب موجود بالفعل';
    }

    fetch('http://localhost:5000/api/add-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add student');
        }
        return response.json();
      })
      .then(newStudent => {
        setStudents([...students, newStudent]);
        setShowAddStudentModal(false); // Close modal after adding student
      })
      .catch(error => {
        console.error('Error adding student:', error);
      });
  };

  return (
    <div className={`teacher-page ${showAddStudentModal ? 'modal-open' : ''}`}>
      <header className="teacher-header">
        <img src={logo} alt="Logo" className="teacher-logo" />
        <nav className="teacher-nav">
          <button className="nav-button" onClick={() => navigate('/')}>خروج</button>
        </nav>
      </header>
      <main className="teacher-main">
        <h2 className="teacher-title">صفحة المعلم</h2>
        <p>مرحبا بك في صفحة المعلم. بإمكانك رؤية قائمة الطلاب او إضافة طالب.</p>
        <div className="students-section">
          <h3>قائمة الطلاب</h3>
          <ul className="students-list">
            {students.map((student, index) => (
              <li key={index} className="student-item">
                <span className="student-number">{student.name}</span>
                <ul className="difficulties-list">
                  {student.difficulties.map((difficulty, i) => (
                    <li key={i} className="difficulty-item">{difficulty}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <button className="nav-button add-student-button" onClick={() => setShowAddStudentModal(true)}>إضافة طالب</button>
        <Modal isOpen={showAddStudentModal} onClose={() => setShowAddStudentModal(false)}>
          <AddStudent onAddStudent={addStudent} />
        </Modal>
      </main>
    </div>
  );
};

export default TeacherPage;
