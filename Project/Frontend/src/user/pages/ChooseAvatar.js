// src/user/pages/ChooseAvatar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChooseAvatar.css';

const animals = [
    { name: 'Cat', image: '/cat.png' },
    { name: 'Dog', image: '/dog.png' },
    { name: 'Rabbit', image: '/rabbit.png' },
    { name: 'Elephant', image: '/elephant.png' },
    { name: 'Bear', image: '/bear.png' },
];

const ChooseAvatar = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % animals.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + animals.length) % animals.length);
    };

    const handleSubmit = () => {
        const selectedAnimal = animals[currentIndex];
        localStorage.setItem('avatar', JSON.stringify(selectedAnimal));
        navigate('/home');
    };

    return (
        <div className="choose-avatar-container">
            <div className="navigation-container">
                <button className="nav-button" onClick={handlePrevious}>{'<'}</button>
                <div className="animal-container">
                    {animals.map((animal, index) => (
                        <div
                            key={animal.name}
                            className={`animal-wrapper ${currentIndex === index ? 'visible' : 'hidden'}`}
                        >
                            <img
                                src={animal.image}
                                alt={animal.name}
                                className="animal"
                            />
                        </div>
                    ))}
                </div>
                <button className="nav-button" onClick={handleNext}>{'>'}</button>
            </div>
            <div className="button-container">
                <button onClick={handleSubmit} className="submit-button">اختيار</button>
            </div>
        </div>
    );
};

export default ChooseAvatar;
