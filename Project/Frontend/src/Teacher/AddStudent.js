// src/Teacher/AddStudent.js
import React, { useState } from 'react';
import './AddStudent.css';

const learningDifficulties = [
  'الوعي الصوتي ومعرفة صوت الحرف',
  'قراءة مقاطع وكلمات',
  'فهم مقروء وفهم مسموع'
];

const AddStudent = ({ onAddStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckboxChange = (difficulty) => {
    setSelectedDifficulties((prevSelected) =>
      prevSelected.includes(difficulty)
        ? prevSelected.filter((item) => item !== difficulty)
        : [...prevSelected, difficulty]
    );
  };

  const handleInputChange = (e) => {
    setStudentName(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName && selectedDifficulties.length > 0) {
      const student = { name: studentName, difficulties: selectedDifficulties };
      const error = onAddStudent(student);
      if (error) {
        setErrorMessage('رقم الطالب موجود بالفعل.');
      } else {
        setErrorMessage('');
        setStudentName('');
        setSelectedDifficulties([]);
      }
    }
  };

  return (
    <div className="add-student-container">
      <h2>إضافة طالب</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="رقم الطالب"
          value={studentName}
          onChange={handleInputChange}
          required
        />
        <div className="checkbox-container">
          {learningDifficulties.map((difficulty) => (
            <label key={difficulty} className="checkbox-label">
              <input
                type="checkbox"
                value={difficulty}
                checked={selectedDifficulties.includes(difficulty)}
                onChange={() => handleCheckboxChange(difficulty)}
              />
              {difficulty}
            </label>
          ))}
        </div>
        <button type="submit">إضافة</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default AddStudent;
