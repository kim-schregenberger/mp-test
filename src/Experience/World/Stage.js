import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Stage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.renderer = this.experience.renderer.instance
        this.camera = this.experience.camera.instance

        // Detect device type
        this.isMobile = this.detectMobileDevice()

        this.resources.on('ready', () => {
            this.resource = this.isMobile 
                // Mobile model
                ? this.resources.items.stagesModel
                // Desktop model
                : this.resources.items.stagesModel

            this.ready = true // Resource is loaded
            console.log(`Resource loaded in Stage (${this.isMobile ? 'Mobile' : 'Desktop'})`, this.resource)
        })

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stages')
        }

        this.currentStage = null  // Track the current stage model

        // Initialize raycaster and mouse vector
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

    // Listen for mouse clicks
    window.addEventListener('click', (event) => this.onMouseClick(event));
    }

    // Device detection function
    detectMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent) || window.innerWidth <= 768
    }
    

    // Loads the 3D model for a specific stage
    loadStage(stageNumber) {
        if (!this.resource || !this.resource.scene) {
            console.error('GLTF resource not loaded yet');
            return;
        }
    
        // Clone the scene to avoid modifying the original resource
        const sceneClone = this.resource.scene.clone(true);
    
        // Validate the requested model index
        const childIndex = stageNumber;
        if (!sceneClone.children[childIndex]) {
            console.error(`No model found at children index: ${childIndex}`);
            console.log('GLTF Children:', sceneClone.children);
            return;
        }
    
        // Cleanup: Remove the previous stage model
        if (this.gltfChild) {
            this.scene.remove(this.gltfChild);
            this.destroy(); // Dispose of resources
        }
    
        // Select the model for the stage
        this.gltfChild = sceneClone.children[childIndex];
    
        // **RESET TRANSFORMATIONS**: Ensure the model starts with default settings
        this.gltfChild.scale.set(1, 1, 1); 
        this.gltfChild.position.set(0, 0, 0);
    
        // **APPLY DEVICE-SPECIFIC TRANSFORMATIONS**
        if (this.isMobile) {
            this.gltfChild.scale.set(1.2, 1.2, 1.2);
            console.log("gltfScale",this.gltfChild.scale);

            this.gltfChild.position.set(0, -2.5, 0);
            console.log("gltfPosition",this.gltfChild.position);

            this.initialCameraPosition = { x: -15, y: 0, z: 1.5 };
            console.log("initialCameraPosition",this.initialCameraPosition);

            
        } else {
            this.gltfChild.scale.set(2, 2, 2);
            console.log("gltfScale",this.gltfChild.scale);

            this.gltfChild.position.set(1, -1, -3.5);
            console.log("gltfPosition",this.gltfChild.position);

            this.initialCameraPosition = { x: -15, y: 0, z: 1.5 };
            console.log("initialCameraPosition",this.initialCameraPosition);
        }
                // Store the initial model state
                this.initialModelState = 
                {
                    position: this.gltfChild.position.clone(),
                    scale: this.gltfChild.scale.clone(),
                    rotation: this.gltfChild.rotation.clone(),
                };
        
    
        // Add the model to the scene
        this.scene.add(this.gltfChild);
    
        console.log(`Loaded Stage ${stageNumber} with model:`, this.gltfChild);
    
        // Track the current stage model
        this.currentStage = this.gltfChild;

        // if (this.gltfChild.children.length > 0) {
        //     this.gltfChild.children.forEach((child, index) => {
        //         console.log(`Child ${index}: Name: ${child.name}, Position:`, child.position);
        //     });
        // }
        
    }

    resetStage() {
        if (!this.currentStage || !this.initialModelState || !this.initialCameraPosition) {
            console.error('No current stage or initial states to reset.');
            return;
        }

        // Reset model transformations
        this.currentStage.position.copy(this.initialModelState.position);
        this.currentStage.scale.copy(this.initialModelState.scale);
        this.currentStage.rotation.copy(this.initialModelState.rotation);

        // Reset camera position
        this.camera.position.set(-15, 0, 1.5);
        this.camera.lookAt(0, 0, 0); // Ensure the camera looks at the center of the scene

        console.log('Stage and camera have been reset to their initial states.');
    }

    
    // Check clicked position on model
    onMouseClick(event) {
        if (!this.currentStage) return; // No model loaded yet
    
        // Convert mouse position to normalized device coordinates (-1 to +1)
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        // Check for intersections
        const intersects = this.raycaster.intersectObject(this.currentStage, true);
    
        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            console.log('Clicked position:', intersectionPoint);
        }
    }
    

    // Update method (called every frame)
    update() {
        if (this.gltfChild) {
            // Add animation or updates if needed
        }
    }

    // Cleanup
    destroy() {
        if (this.gltfChild) {
            this.gltfChild.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose()
                    if (child.material.dispose) child.material.dispose()
                }
            })
            this.scene.remove(this.gltfChild)
        }
    }


}
