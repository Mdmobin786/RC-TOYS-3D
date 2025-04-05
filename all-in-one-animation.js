// All-in-One RC Toys 3D Animation
// This script combines all RC toys in a single animated showcase

// Initialize the combined 3D scene
const initAllInOneAnimation = () => {
    console.log("Initializing all-in-one animation...");
    
    // Create simple placeholder models since the window.createRC* functions may not be available
    function createSimpleCarModel() {
        const group = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 3);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcc0000, 
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7
        });
        
        const wheelPositions = [
            [-0.7, -0.3, 0.8],  // front left
            [0.7, -0.3, 0.8],   // front right
            [-0.7, -0.3, -0.8], // rear left
            [0.7, -0.3, -0.8]   // rear right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(position[0], position[1], position[2]);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        });
        
        return group;
    }
    
    function createSimpleDroneModel() {
        const group = new THREE.Group();
        
        // Drone body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.3, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(3, 0.1, 0.1);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const arm1 = new THREE.Mesh(armGeometry, armMaterial);
        const arm2 = new THREE.Mesh(armGeometry, armMaterial);
        arm2.rotation.y = Math.PI / 2;
        arm1.castShadow = true;
        arm2.castShadow = true;
        group.add(arm1);
        group.add(arm2);
        
        // Propellers
        const propGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.1);
        const propMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        
        const propPositions = [
            [-1.5, 0.1, 0],   // left
            [1.5, 0.1, 0],    // right
            [0, 0.1, -1.5],   // front
            [0, 0.1, 1.5]     // back
        ];
        
        const propellers = [];
        propPositions.forEach(position => {
            const prop = new THREE.Mesh(propGeometry, propMaterial);
            prop.position.set(position[0], position[1], position[2]);
            prop.castShadow = true;
            group.add(prop);
            propellers.push(prop);
        });
        
        // Expose propellers for animation
        group.propellers = propellers;
        
        return group;
    }
    
    function createSimpleHelicopterModel() {
        const group = new THREE.Group();
        
        // Helicopter body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
        bodyGeometry.rotateX(Math.PI / 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0066cc, 
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Tail boom
        const tailGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x0055aa });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(0, 0, -1.8);
        tail.rotation.x = Math.PI / 2;
        tail.castShadow = true;
        group.add(tail);
        
        // Main rotor
        const rotorGeometry = new THREE.BoxGeometry(4, 0.1, 0.2);
        const rotorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const mainRotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
        mainRotor.position.set(0, 1, 0);
        mainRotor.castShadow = true;
        group.add(mainRotor);
        
        // Tail rotor
        const tailRotorGeometry = new THREE.BoxGeometry(1, 0.08, 0.15);
        const tailRotor = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
        tailRotor.position.set(0, 0.5, -2.8);
        tailRotor.rotation.y = Math.PI / 2;
        tailRotor.castShadow = true;
        group.add(tailRotor);
        
        // Skids
        const skidGeometry = new THREE.BoxGeometry(0.1, 0.6, 1.5);
        const skidMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.position.set(-0.5, -0.7, 0);
        rightSkid.position.set(0.5, -0.7, 0);
        leftSkid.castShadow = true;
        rightSkid.castShadow = true;
        group.add(leftSkid);
        group.add(rightSkid);
        
        // Expose rotors for animation
        group.mainRotor = mainRotor;
        group.tailRotor = tailRotor;
        
        return group;
    }
    
    function createSimpleTankModel() {
        const group = new THREE.Group();
        
        // Tank hull
        const hullGeometry = new THREE.BoxGeometry(1.5, 0.6, 2.5);
        const hullMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4d5d53, 
            metalness: 0.5,
            roughness: 0.5
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.castShadow = true;
        group.add(hull);
        
        // Tank turret
        const turretGeometry = new THREE.BoxGeometry(1.2, 0.5, 1.2);
        const turretMaterial = new THREE.MeshStandardMaterial({ color: 0x445548 });
        const turret = new THREE.Mesh(turretGeometry, turretMaterial);
        turret.position.set(0, 0.5, 0);
        turret.castShadow = true;
        group.add(turret);
        
        // Tank cannon
        const cannonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const cannonMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
        cannon.position.set(0, 0.5, 1.2);
        cannon.rotation.x = Math.PI / 2;
        cannon.castShadow = true;
        turret.add(cannon);
        
        // Tank tracks
        const trackGeometry = new THREE.BoxGeometry(0.4, 0.3, 2.5);
        const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        leftTrack.position.set(-0.9, -0.3, 0);
        rightTrack.position.set(0.9, -0.3, 0);
        leftTrack.castShadow = true;
        rightTrack.castShadow = true;
        group.add(leftTrack);
        group.add(rightTrack);
        
        // Expose turret for animation
        group.turret = turret;
        
        return group;
    }

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122); // Dark blue background

    // Create camera with good perspective for multiple models
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);

    // Enhanced renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        logarithmicDepthBuffer: true,
        powerPreference: "high-performance"
    });
    
    // Get container dimensions
    const container = document.getElementById('all-in-one-animation');
    if (!container) {
        console.error("Could not find container element with id 'all-in-one-animation'");
        return;
    }
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 500; // Default height if empty
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Append to DOM
    container.innerHTML = ''; // Clear any existing content
    container.appendChild(renderer.domElement);

    // Add composer if possible
    let composer = null;
    try {
        // Set up post-processing
        composer = new THREE.EffectComposer(renderer);
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Add bloom effect for highlights
        if (THREE.UnrealBloomPass) {
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(containerWidth, containerHeight),
                0.3,    // strength
                0.5,    // radius
                0.7     // threshold
            );
            composer.addPass(bloomPass);
        }
        
        // Add vignette effect
        if (THREE.VignetteShader) {
            const vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
            vignettePass.uniforms.offset.value = 0.95;
            vignettePass.uniforms.darkness.value = 1.6;
            composer.addPass(vignettePass);
        }
    } catch (e) {
        console.warn("Could not initialize post-processing effects:", e);
        // We'll continue without effects
    }

    // Create lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffeb, 1.5);
    mainLight.position.set(10, 15, 8);
    mainLight.castShadow = true;
    
    // Setup shadow properties if possible
    try {
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        mainLight.shadow.normalBias = 0.05;
        mainLight.shadow.bias = -0.0005;
    } catch (e) {
        console.warn("Could not setup shadow properties:", e);
    }
    
    scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xfffffd, 1.0);
    fillLight.position.set(-8, 6, -7);
    scene.add(fillLight);

    // Create a circular platform
    const platformGeometry = new THREE.CylinderGeometry(6, 6, 0.2, 36);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333344, 
        metalness: 0.7,
        roughness: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // Add glowing edge to platform
    const edgeGeometry = new THREE.TorusGeometry(6, 0.12, 16, 100);
    const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = -0.4;
    scene.add(edge);

    // Create model containers and positions
    const positions = [
        { x: 0, y: 0, z: -3.5 },  // Car
        { x: -3, y: 0, z: 1.5 },  // Drone
        { x: 3, y: 0, z: 1.5 },   // Helicopter
        { x: 0, y: 0, z: 3.5 }    // Tank
    ];

    // Create containers for the models
    const carContainer = new THREE.Group();
    const droneContainer = new THREE.Group();
    const helicopterContainer = new THREE.Group();
    const tankContainer = new THREE.Group();

    // Position containers
    carContainer.position.set(positions[0].x, positions[0].y, positions[0].z);
    droneContainer.position.set(positions[1].x, positions[1].y, positions[1].z);
    helicopterContainer.position.set(positions[2].x, positions[2].y, positions[2].z);
    tankContainer.position.set(positions[3].x, positions[3].y, positions[3].z);

    // Add containers to scene
    scene.add(carContainer);
    scene.add(droneContainer);
    scene.add(helicopterContainer);
    scene.add(tankContainer);

    // Create information panels for each model
    const createInfoPanel = (name, position) => {
        const group = new THREE.Group();
        
        // Panel background
        const panelGeometry = new THREE.PlaneGeometry(2, 0.5);
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.7
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Create canvas for text
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Draw text
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 32px Arial';
        context.fillStyle = '#d4af37';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(name, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        const textMesh = new THREE.Mesh(panelGeometry, textMaterial);
        textMesh.position.z = 0.01; // Slightly in front of background
        
        group.add(panel);
        group.add(textMesh);
        
        // Position the panel
        group.position.set(position.x, position.y - 0.8, position.z);
        group.rotation.x = -Math.PI / 4; // Tilt slightly for better visibility
        
        return group;
    };

    // Create and add info panels
    const carPanel = createInfoPanel("RC Car", positions[0]);
    const dronePanel = createInfoPanel("RC Drone", positions[1]);
    const helicopterPanel = createInfoPanel("RC Helicopter", positions[2]);
    const tankPanel = createInfoPanel("RC Tank", positions[3]);
    
    scene.add(carPanel);
    scene.add(dronePanel);
    scene.add(helicopterPanel);
    scene.add(tankPanel);

    // Create models using our simple implementations
    const rcCar = createSimpleCarModel();
    const rcDrone = createSimpleDroneModel();
    const rcHelicopter = createSimpleHelicopterModel();
    const rcTank = createSimpleTankModel();

    // Add models to respective containers
    carContainer.add(rcCar);
    droneContainer.add(rcDrone);
    helicopterContainer.add(rcHelicopter);
    tankContainer.add(rcTank);

    // Add orbit controls if available
    let controls = null;
    try {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 20;
        controls.enablePan = false;
    } catch (e) {
        console.warn("Could not initialize OrbitControls:", e);
    }

    // Add responsive resize handler
    window.addEventListener('resize', () => {
        // Get updated container dimensions
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight || 500;
        
        // Update camera
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer
        renderer.setSize(newWidth, newHeight);
        
        // Update composer if available
        if (composer) {
            composer.setSize(newWidth, newHeight);
        }
    });

    // Create main animation group that rotates all models
    const allModelsGroup = new THREE.Group();
    allModelsGroup.add(platform);
    allModelsGroup.add(edge);
    allModelsGroup.add(carContainer);
    allModelsGroup.add(droneContainer);
    allModelsGroup.add(helicopterContainer);
    allModelsGroup.add(tankContainer);
    allModelsGroup.add(carPanel);
    allModelsGroup.add(dronePanel);
    allModelsGroup.add(helicopterPanel);
    allModelsGroup.add(tankPanel);
    scene.add(allModelsGroup);

    // Animation variables
    let rotationSpeed = 0.003;
    let hoverAmplitude = 0.05;
    let time = 0;

    // Animation function
    const animate = () => {
        requestAnimationFrame(animate);
        
        time += 0.01;
        
        // Rotate the entire platform
        allModelsGroup.rotation.y += rotationSpeed;
        
        // Make individual models hover slightly
        carContainer.position.y = positions[0].y + Math.sin(time) * hoverAmplitude;
        droneContainer.position.y = positions[1].y + Math.sin(time + 1) * hoverAmplitude;
        helicopterContainer.position.y = positions[2].y + Math.sin(time + 2) * hoverAmplitude;
        tankContainer.position.y = positions[3].y + Math.sin(time + 3) * hoverAmplitude;
        
        // Add specific model animations
        if (rcHelicopter.mainRotor) {
            rcHelicopter.mainRotor.rotation.y += 0.2;
        }
        if (rcHelicopter.tailRotor) {
            rcHelicopter.tailRotor.rotation.z += 0.3;
        }
        if (rcDrone.propellers) {
            rcDrone.propellers.forEach(prop => {
                prop.rotation.y += 0.25;
            });
        }
        if (rcTank.turret) {
            rcTank.turret.rotation.y = Math.sin(time * 0.5) * 0.5;
        }
        
        // Animate edge glow
        try {
            edge.material.color.setHSL((time * 0.1) % 1, 0.8, 0.5);
        } catch (e) {
            // Ignore errors with color animation
        }
        
        // Update controls if available
        if (controls) {
            controls.update();
        }
        
        // Render scene with effects if possible
        if (composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
    };

    // Start animation
    animate();

    // Add interactivity
    container.addEventListener('mouseenter', () => {
        rotationSpeed = 0.001; // Slow down rotation on hover
    });
    
    container.addEventListener('mouseleave', () => {
        rotationSpeed = 0.003; // Resume normal rotation
    });

    // Double click to focus on a model
    container.addEventListener('dblclick', (event) => {
        if (!controls) return;
        
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Create a raycaster to detect model clicks
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(x, y);
        raycaster.setFromCamera(mouse, camera);
        
        // Get clicked objects
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            // Get the clicked object
            const object = intersects[0].object;
            
            // Determine which model was clicked
            let targetPosition;
            if (carContainer.contains(object)) {
                targetPosition = new THREE.Vector3().copy(carContainer.position);
            } else if (droneContainer.contains(object)) {
                targetPosition = new THREE.Vector3().copy(droneContainer.position);
            } else if (helicopterContainer.contains(object)) {
                targetPosition = new THREE.Vector3().copy(helicopterContainer.position);
            } else if (tankContainer.contains(object)) {
                targetPosition = new THREE.Vector3().copy(tankContainer.position);
            }
            
            // If we found a target position, move camera to it (without GSAP since it might not be available)
            if (targetPosition) {
                // Transform target position to world coordinates including allModelsGroup rotation
                const worldPosition = targetPosition.clone();
                allModelsGroup.updateMatrixWorld();
                worldPosition.applyMatrix4(allModelsGroup.matrixWorld);
                
                // Set target
                controls.target.set(worldPosition.x, worldPosition.y, worldPosition.z);
                
                // Also move camera closer
                const direction = new THREE.Vector3().subVectors(camera.position, worldPosition).normalize();
                camera.position.set(
                    worldPosition.x + direction.x * 5,
                    worldPosition.y + direction.y * 5,
                    worldPosition.z + direction.z * 5
                );
            }
        }
    });
    
    console.log("All-in-one animation initialized successfully");
};

// Initialize when DOM is loaded and try several times if needed
let initAttempts = 0;
const maxAttempts = 5;
const attemptInitialization = () => {
    if (document.getElementById('all-in-one-animation')) {
        console.log("Found animation container, attempt:", initAttempts + 1);
        
        try {
            initAllInOneAnimation();
            console.log("Animation initialized successfully");
        } catch (e) {
            console.error("Error initializing animation:", e);
            
            // Try again if we haven't exceeded max attempts
            if (++initAttempts < maxAttempts) {
                console.log("Retrying in 1 second...");
                setTimeout(attemptInitialization, 1000);
            }
        }
    } else {
        console.log("Animation container not found, retrying in 1 second...");
        if (++initAttempts < maxAttempts) {
            setTimeout(attemptInitialization, 1000);
        }
    }
};

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', attemptInitialization);
} else {
    attemptInitialization();
} 