import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudent from './AddStudent';
import EditExerciseModal from './EditExerciseModal';
import Modal from './Modal';  // Make sure Modal component is imported
import ProgressModal from './ProgressModal';  // New modal for activity progress
import logo from '../assets/logo.png';
import './TeacherPage.css';
import './Modal.css';

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);  // State to control ProgressModal visibility

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
    setSelectedStudent(null); // Ensures modal closes by clearing selected student
    setShowProgressModal(false); // Close ProgressModal
  };

  const viewProgress = async (studentId) => {
    console.log(`Fetching activities for student with ID: ${studentId}`);
  
    try {
      const response = await fetch(`http://localhost:5000/api/${studentId}/activities`);
      const data = await response.json();
      console.log('API Response:', data);  // Log the response
  
      if (response.ok) {
        setSelectedStudent(data);  // Update with the student's progress data
        console.log("Selected student data set:", data);  // Check if the state is being updated
        setShowProgressModal(true);  // Open the modal to show progress
      } else {
        console.error('Failed to fetch student activities:', data);  // Log error if the response is not OK
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  return (
    <div className="teacher-page">
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
                        <strong>{difficulty}</strong>
                      </div>
                    ))}
                  </td>
                  <td>
                    <button className="details-button" onClick={() => viewProgress(student._id)}>
                      عرض التقدم
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
            <EditExerciseModal onSave={saveEditedExercise} onClose={() => setShowEditExerciseModal(false)} />
          </Modal>
        )}

        {/* Modal for showing student activity progress */}
        <ProgressModal isOpen={showProgressModal} onClose={handleCloseModal} activities={selectedStudent} />
      </main>
    </div>
  );
};

export default TeacherPage;
