import React from 'react';
import { useParams } from 'react-router-dom';

const Levels = () => {
  const { type } = useParams();

  return (
    <div>
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Levels</h1>
      {/* Render levels for the specific type here */}
    </div>
  );
};

export default Levels;
