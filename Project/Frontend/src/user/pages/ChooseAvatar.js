import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import { gsap } from 'gsap';
import './ChooseAvatar.css';

const animals = [
    { name: 'Cat', image: '/cat.png' },
    { name: 'Dog', image: '/dog.png' },
    { name: 'Rabbit', image: '/rabbit.png' },
    { name: 'Elephant', image: '/elephant.png' },
    { name: 'Bear', image: '/bear.png' },
];

const ChooseAvatar = () => {
    const pixiContainer = useRef(null);
    const appRef = useRef(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animalSprites, setAnimalSprites] = useState({});
    const [hat, setHat] = useState(null);

    useEffect(() => {
        const pixiApp = new PIXI.Application({ resizeTo: pixiContainer.current, backgroundColor: 0xffffff });
        pixiContainer.current.appendChild(pixiApp.view);
        appRef.current = pixiApp;

        const loadResources = async () => {
            const resources = {};
            for (const animal of animals) {
                resources[animal.name] = await Assets.load(animal.image);
            }
            resources.hat = await Assets.load('/hat.png');

            const newAnimalSprites = {};
            let xOffset = 100;

            animals.forEach(animal => {
                const sprite = new PIXI.Sprite(resources[animal.name]);
                sprite.x = xOffset;
                sprite.y = pixiApp.screen.height / 2;
                sprite.anchor.set(0.5);
                sprite.width = 150; // Set width
                sprite.height = 150; // Set height
                sprite.interactive = true;
                sprite.buttonMode = true;

                sprite.on('pointerdown', () => handleAnimalClick(animal, sprite));

                pixiApp.stage.addChild(sprite);
                newAnimalSprites[animal.name] = sprite;
                xOffset += 180;
            });

            setAnimalSprites(newAnimalSprites);

            const hatSprite = new PIXI.Sprite(resources.hat);
            hatSprite.anchor.set(0.5);
            hatSprite.scale.set(0.5);
            hatSprite.visible = false;
            setHat(hatSprite);
            pixiApp.stage.addChild(hatSprite);
        };

        loadResources();

        window.addEventListener('resize', () => {
            pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        });

        return () => {
            pixiApp.destroy(true, true);
            appRef.current = null;
        };
    }, []);

    const handleAnimalClick = useCallback((animal, sprite) => {
        if (!appRef.current) {
            console.log('App is not initialized');
            return;
        }

        console.log(`Clicked on: ${animal.name}`);

        if (selectedAnimal && selectedAnimal.name !== animal.name) {
            const oldSprite = animalSprites[selectedAnimal.name];
            console.log(`Returning ${selectedAnimal.name} to original size`);
            gsap.to(oldSprite, { duration: 0.5, width: 150, height: 150 });
        }

        console.log(`Animating ${animal.name} to larger size`);
        gsap.to(sprite, { duration: 0.5, width: 180, height: 180 });
        setSelectedAnimal(animal);
    }, [animalSprites, selectedAnimal]);

    const handleWearHat = () => {
        if (hat && selectedAnimal) {
            hat.visible = true;
            const sprite = animalSprites[selectedAnimal.name];
            console.log(`Wearing hat on ${selectedAnimal.name}`);
            gsap.to(hat, { x: sprite.x, y: sprite.y - sprite.height / 2, duration: 0.5 });
        }
    };

    const handleSubmit = () => {
        if (selectedAnimal) {
            alert(`You selected: ${selectedAnimal.name}`);
            const sprite = animalSprites[selectedAnimal.name];
            console.log(`Moving ${selectedAnimal.name} to bottom`);
            gsap.to(sprite, { y: appRef.current.screen.height - 50, duration: 1, onComplete: () => alert(`${selectedAnimal.name} moved to bottom`) });
        }
    };

    return (
        <div>
            <div ref={pixiContainer} className="pixi-container" />
            <div className="button-container">
                <button onClick={handleWearHat}>Wear Hat</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default ChooseAvatar;
