// src/Teacher/TeacherPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudent from './AddStudent';
import EditExerciseModal from './EditExerciseModal';
import Modal from './Modal';
import logo from '../assets/logo.png';
import './TeacherPage.css';
import './Modal.css';

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) {
        console.log('Failed to fetch students:', response.statusText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = async (student) => {
    if (students.some(s => s.number === student.number)) {
      alert('رقم الطالب موجود بالفعل');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      const newStudent = await response.json();
      setStudents([...students, newStudent]);
      setShowAddStudentModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleEditExerciseClick = () => {
    setShowEditExerciseModal(true);
  };

  const handleCreateActivityClick = () => {
    navigate('/activity-selection'); // Navigate to the Activity Selection page
  };

  const saveEditedExercise = (exercise) => {
    console.log('Saved exercise:', exercise);
    setShowEditExerciseModal(false);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null); // Ensures modal closes by clearing selected exercise
  };

  return (
    <div className={`teacher-page rtl ${showAddStudentModal || showEditExerciseModal ? 'modal-open' : ''}`}>
      <header className="teacher-header">
        <img src={logo} alt="Logo" className="teacher-logo" />
        <nav className="teacher-nav">
          <button className="nav-button" onClick={handleEditExerciseClick}>تعديل التمارين</button>
          <button className="nav-button create-activity-button" onClick={handleCreateActivityClick}>إنشاء نشاط</button>
          <button className="nav-button btn" onClick={() => navigate('/')}>خروج</button>
        </nav>
      </header>
      <main className="teacher-main">
        <h2 className="teacher-title">صفحة المعلم</h2>
        <p>مرحبا بك في صفحة المعلم. بإمكانك رؤية قائمة الطلاب او إضافة طالب.</p>
        <div className="students-section">
          <h3>قائمة الطلاب</h3>
          <table className="students-table">
            <thead>
              <tr>
                <th>رقم الطالب</th>
                <th>الصعوبة</th>
                <th>التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="student-item">
                  <td>{student.number}</td>
                  <td>
                    {student.difficulties.map((difficulty, i) => (
                      <div key={i}>
                        <strong>{difficulty.name}</strong>
                      </div>
                    ))}
                  </td>
                  <td>
                    <button className="details-button" onClick={() => setSelectedExercise(student)}>
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="add-student-button" onClick={() => setShowAddStudentModal(true)}>إضافة طالب</button>
        <Modal isOpen={showAddStudentModal} onClose={() => setShowAddStudentModal(false)}>
          <AddStudent onAddStudent={addStudent} />
        </Modal>
        {showEditExerciseModal && (
          <Modal isOpen={showEditExerciseModal} onClose={() => setShowEditExerciseModal(false)}>
            <EditExerciseModal
              onSave={saveEditedExercise}
              onClose={() => setShowEditExerciseModal(false)}
            />
          </Modal>
        )}
        {selectedExercise && (
          <Modal isOpen={!!selectedExercise} onClose={handleCloseModal}>
            <div className="student-details">
              <h3>تفاصيل الطالب رقم {selectedExercise.number}</h3>
              {selectedExercise.difficulties.map((difficulty, i) => (
                <div key={i}>
                  <h4>{difficulty.name}</h4>
                  {difficulty.levels.length > 0 ? (
                    difficulty.levels.map((level, j) => (
                      <div key={j}>
                        <span>المرحلة {level.level}: {level.status}</span>
                      </div>
                    ))
                  ) : (
                    <div>لم يتم تنفيذ أي مرحلة في هذه الصعوبة</div>
                  )}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default TeacherPage;
