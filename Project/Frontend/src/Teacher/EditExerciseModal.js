// src/Teacher/EditExerciseModal.js
import React, { useState } from 'react';
import './EditExerciseModal.css';

const EditExerciseModal = ({ onSave, onClose }) => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [word, setWord] = useState('');
  const [letters, setLetters] = useState([]);
  const [words, setWords] = useState([]);

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  const handleAddWord = () => {
    const newWord = {
      word,
      letters: word.split(''),
    };
    setWords([...words, newWord]);
    setWord('');
    setLetters([]);
  };

  const handleSave = () => {
    const editedExercise = {
      exercise: selectedExercise,
      words,
    };
    onSave(editedExercise);
    onClose();
  };

  return (
    <div className="edit-exercise-modal">
      <h3>تعديل التمرين</h3>
      <label>
        اختر التمرين:
        <select value={selectedExercise} onChange={handleExerciseChange}>
          <option value="">اختر التمرين</option>
          <option value="wordShuffle">مرحلة 1: تمرين تجميع الحروف</option>
          <option value="anotherExercise">مرحلة 2: تمرين آخر</option>
          {/* Add more exercises here */}
        </select>
      </label>
      {selectedExercise === 'wordShuffle' && (
        <>
          <label>
            كلمة جديدة:
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </label>
          <button onClick={handleAddWord}>إضافة كلمة</button>
          <div className="added-words">
            <h4>الكلمات المضافة:</h4>
            <ul>
              {words.map((w, index) => (
                <li key={index}>{w.word}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <button onClick={handleSave}>حفظ</button>
    
    </div>
  );
};

export default EditExerciseModal;
