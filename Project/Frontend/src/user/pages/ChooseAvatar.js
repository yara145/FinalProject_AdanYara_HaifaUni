import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChooseAvatar.css';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct

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
    const studentNumber = localStorage.getItem('studentNumber');

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % animals.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + animals.length) % animals.length);
    };
 
    const handleSubmit = async () => {
        const selectedAnimal = animals[currentIndex];
        localStorage.setItem('avatar', JSON.stringify(selectedAnimal));
        try {
            if (studentNumber === 'guest') {
                localStorage.setItem('isGuest', 'true');
                navigate('/home');
            } else {
                await axios.post('http://localhost:5000/api/set-avatar', { number: studentNumber, avatar: selectedAnimal });
                localStorage.removeItem('isGuest');
                navigate('/home');
            }
        } catch (error) {
            console.error('Error setting avatar:', error);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="choose-avatar-container">
            <header className="choose-avatar-header">
                <button className="back-button" onClick={handleBack}>رجوع</button>
                <img src={logo} alt="Logo" className="login-logo" />
            </header>
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
