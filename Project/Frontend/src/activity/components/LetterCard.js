// src/components/LetterCard.js
import React from 'react';
import './LetterCard.css';

const LetterCard = ({ letter, onAssess }) => {
  return (
    <div className="card">
      <h1 className="letter">{letter}</h1>
      <div className="buttons">
        <button className="button correct" onClick={() => onAssess(true)}>Correct</button>
        <button className="button incorrect" onClick={() => onAssess(false)}>Incorrect</button>
      </div>
    </div>
  );
};

export default LetterCard;
