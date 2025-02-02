import * as THREE from 'three'
import Experience from './Experience/Experience.js';
import { gsap } from "gsap"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



const canvas = document.querySelector('canvas.webgl');
const experience = new Experience(canvas);
window.experience = experience; // Store globally

let particles = experience.world.particles;  // Will be updated after `resources.on('ready')`
const stages = experience.world.stage;

let currentStageNumber = null;


function hideElements(selector) {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('hide'));
}

function showElements(selector) {
    document.querySelectorAll(selector).forEach((el) => el.classList.remove('hide'));
}

// Color of Stages
function getStageClass(stageNumber) {
    const stageMap = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four'
    };
    return `stage-${stageMap[stageNumber]}`;
}

const stageColors = {
    1: '#CCB7C4', 
    2: '#997D92', 
    3: '#776273',  
    4: '#2E2A34'
    // initial: '#211d20' 
};

function changeSceneBackgroundColor(color) {
    if (color) {
        experience.scene.background = new THREE.Color(color); // Set solid color
    } else {
        experience.scene.background = null; // Set transparent
    }
}


// Show Stage
function showStageSection(stageNumber) {
    document.querySelectorAll('.canvas.stages').forEach((stage) => stage.classList.remove('visible'));
    
    const stageClass = `.canvas.stages.${getStageClass(stageNumber)}`;
    const stageElement = document.querySelector(stageClass);
    if (stageElement) {
        stageElement.classList.add('visible');
        currentStageNumber = stageNumber;
        console.log(`Stage section for stage ${stageNumber} shown.`);
        
        // Change the canvas background color
        changeSceneBackgroundColor(stageColors[stageNumber]);
    } else {
        console.error(`Stage section for stage ${stageNumber} not found.`);
    }
}


// Hide Stage
function hideStageSection(stageNumber) {
    const stageClass = `.canvas.stages.${getStageClass(stageNumber)}`;
    const stageElement = document.querySelector(stageClass);
    if (stageElement) {
        stageElement.classList.remove('visible');
        console.log(`Stage section for stage ${stageNumber} hidden.`);
        currentStageNumber = null;
    }
}

// Destroy Particles
function destroyParticles() {
    console.log('Destroying particles...');
    particles.destroy(); 
}


// Load Stage
function loadStage(stageNumber) {
    hideElements('.show-initial');
    hideElements('section.scroll');
    destroyParticles();  // Destroy particles instead of just hiding

    if (currentStageNumber !== null) {
        hideStageSection(currentStageNumber);
    }

    stages.loadStage(stageNumber);
    showStageSection(stageNumber);

    const wholeModelLi = document.querySelector('.whole-model');
    if (wholeModelLi && stages.initialCameraPosition) {
        const { x, y, z } = stages.initialCameraPosition;
        wholeModelLi.setAttribute('data-camera-position', `${x},${y},${z}`);
    }

    experience.renderer.instance.compile(stages.scene, experience.camera.instance);
}

// Destroy Stage
function destroyStage() {
    console.log('Destroying current stage...');
    stages.destroy();

    if (currentStageNumber !== null) {
        hideStageSection(currentStageNumber);
    }
}


document.querySelectorAll('.explore').forEach((button) => 
    {
        button.addEventListener('click', () =>
        {
            document.querySelectorAll('.explore').forEach((el) => el.classList.add('active'));
            document.querySelectorAll('.grain').forEach((el) => el.classList.add('active'));
            document.querySelectorAll('.stages-section').forEach((el) => {
                el.classList.add('active'); 
    
                // GSAP Fade-in Effect
                gsap.fromTo(el, 
                    { opacity: 0 },  // Start from opacity 0
                    { opacity: 1, duration: 5, ease: "power3.out" } // Fade-in over 1 second
                );
            });
        })
    })

    

// Leave Stage and go back to Particles
document.querySelectorAll('.go-back').forEach((button) => {
    button.addEventListener('click', () => {
        resetCameraPosition()
        stages.resetStage();
        destroyStage();
        showElements('.show-initial');
        showElements('section.scroll');
        
        // Reset the canvas to the initial color
        changeSceneBackgroundColor(null);

        document.querySelectorAll('.stages-section ul li').forEach((el) => el.classList.remove('active'));
        document.querySelectorAll('.overview').forEach((el) => el.classList.add('active'));
        document.querySelectorAll('.grain').forEach((el) => el.classList.remove('active'));
        document.querySelectorAll('.stages-section').forEach((el) => el.classList.remove('active'));
        document.querySelectorAll('.explore').forEach((el) => el.classList.remove('active'));

        // Scroll to a specific section
        const sectionId = event.target.getAttribute('data-section');
        const targetSection = document.querySelector(`#${sectionId}`);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});


// Load resources and initialize event listeners
experience.world.resources.on('ready', () => {
    console.log('Resources loaded, initializing event listeners...');
    particles = experience.world.particles;  // Ensure particles is set after resources are loaded

    document.getElementById('button-stage-1').addEventListener('click', () => loadStage(1));
    document.getElementById('button-stage-2').addEventListener('click', () => loadStage(2));
    document.getElementById('button-stage-3').addEventListener('click', () => loadStage(3));
    document.getElementById('button-stage-4').addEventListener('click', () => loadStage(4));
});





// Stages Camera move
document.querySelectorAll('.stages-section ul li').forEach((item) => {
    item.addEventListener('click', (event) => {
        const cameraPosition = event.target.getAttribute('data-camera-position');
        
        if (item.classList.contains('whole-model')) {
            resetCameraPosition(); // Reset the model and camera to initial state
        } else if (cameraPosition) {
            const [x, y, z] = cameraPosition.split(',').map(Number);
            moveCameraToPosition(x, y, z);
        }
    });
});


function moveCameraToPosition(x, y, z) {
    const duration = 1.5; // Animation duration in seconds
    gsap.to(experience.camera.instance.position, {
        x: x,
        y: y,
        z: z,
        duration: duration,
        ease: "power3.inOut",
        onUpdate: () => {
            experience.camera.controls.update(); // Ensure controls are updated during the transition
        },
        onComplete: () => {
            console.log(`Camera moved to position: (${x}, ${y}, ${z})`);
        }
    });
}

document.querySelectorAll('.stages-section ul li').forEach((item) => {
    item.addEventListener('click', (event) => {
        // Remove active class from all items
        document.querySelectorAll('.stages-section ul li').forEach((el) => el.classList.remove('active'));

        // Add active class to clicked item
        event.target.classList.add('active');
    });
});

function resetCameraPosition() {
    gsap.to(experience.camera.instance.position, {
        x: -15,
        y: 0,
        z: 1.5,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
            experience.camera.controls.update(); // Ensure controls are updated during the transition
        },
        onComplete: () => {
            console.log("Camera reset to initial position.");
        }
    });
}



// Loading screen

const loadingScreen = document.getElementById('loading-screen');
const enterButton = document.getElementById('enter-button');

const hasLoadedBefore = sessionStorage.getItem('hasLoadedBefore');

if (hasLoadedBefore) {
    // Hide the loading screen immediately
    loadingScreen.style.display = 'none';
    initializeExperience(); // Start the experience without showing the loading screen
} else {
    // Show loading screen only on first load
    enterButton.disabled = true;

    experience.world.resources.on('ready', () => {
        console.log('Resources loaded, enabling Enter button...');
        
        // Enable the button once resources are ready
        enterButton.disabled = false;
        enterButton.classList.add('enabled');
        enterButton.textContent = 'Erkunden';
    });

    enterButton.addEventListener('click', () => {
        if (!enterButton.disabled) {
            console.log('User clicked Enter, starting experience...');
            
            // Fade out loading screen
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500); // Match the transition duration

            // Mark experience as loaded in session storage
            sessionStorage.setItem('hasLoadedBefore', 'true');

            // Initialize the experience
            initializeExperience();
        }
    });
}


// Function to initialize the experience
function initializeExperience() {
    // Add event listeners and start experience
    particles = experience.world.particles; // Ensure particles is set after resources are loaded
    document.getElementById('button-stage-1').addEventListener('click', () => loadStage(1));
    document.getElementById('button-stage-2').addEventListener('click', () => loadStage(2));
    document.getElementById('button-stage-3').addEventListener('click', () => loadStage(3));
    document.getElementById('button-stage-4').addEventListener('click', () => loadStage(4));
}