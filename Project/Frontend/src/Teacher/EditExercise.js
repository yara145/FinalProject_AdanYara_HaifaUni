// src/Teacher/EditExercise.js
import React, { useState } from 'react';
import './EditExercise.css';

const EditExercise = ({ exercise, onSave, onClose }) => {
  const [word, setWord] = useState('');
  const [letters, setLetters] = useState([]);

  const handleAddWord = () => {
    const newWord = {
      word,
      letters: word.split(''),
    };
    // Here you would save the new word to your exercise data
    console.log('Added word:', newWord);
    setWord('');
    setLetters([]);
  };

  return (
    <div className="edit-exercise-container">
      <h3>تعديل التمرين</h3>
      <label>
        كلمة جديدة:
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
      </label>
      <button onClick={handleAddWord}>إضافة كلمة</button>
      <button onClick={onClose}>إغلاق</button>
    </div>
  );
};

export default EditExercise;
