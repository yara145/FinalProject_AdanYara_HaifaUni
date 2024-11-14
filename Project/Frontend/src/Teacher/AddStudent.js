import React, { useState } from 'react';
import './AddStudent.css';

const learningDifficulties = [
  'قراءة مقاطع ',
  'قراءة مقاطع وكلمات',
  'فهم مقروء'
];

const AddStudent = ({ onAddStudent }) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckboxChange = (difficulty) => {
    setSelectedDifficulties((prevSelected) =>
      prevSelected.includes(difficulty)
        ? prevSelected.filter((item) => item !== difficulty)
        : [...prevSelected, difficulty]
    );
  };

  const handleNumberChange = (e) => {
    setStudentNumber(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (studentNumber && selectedDifficulties.length > 0) {
        const student = { number: studentNumber, difficulties: selectedDifficulties }; // Send difficulties as an array of strings
        const error = await onAddStudent(student);
        if (error) throw new Error(error);
      } else {
        throw new Error("Please fill all fields and select at least one difficulty.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="add-student-container">
      <h2>إضافة طالب</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="رقم الطالب"
          value={studentNumber}
          onChange={handleNumberChange}
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
