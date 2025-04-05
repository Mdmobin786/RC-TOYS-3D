// RC Drone 3D Models
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize 3D models if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }

    // Common settings for all drone models
    const modelSettings = {
        cameraPosition: { x: 0, y: 0.5, z: 3 },
        lightIntensity: 1,
        rotationSpeed: 0.01,
        backgroundColor: 0xf9f9f9
    };

    // Create drone models
    createDroneModel('drone-model-1', {
        type: 'quadcopter',
        size: { width: 1.2, height: 0.2, depth: 1.2 },
        color: 0x3367d6,
        propColor: 0xcccccc
    });

    createDroneModel('drone-model-2', {
        type: 'quadcopter',
        size: { width: 1.4, height: 0.25, depth: 1.4 },
        color: 0x222222,
        propColor: 0xffcc00,
        hasCamera: true
    });

    createDroneModel('drone-model-3', {
        type: 'racing',
        size: { width: 0.8, height: 0.15, depth: 1.0 },
        color: 0xff3333,
        propColor: 0x333333
    });

    createDroneModel('drone-model-4', {
        type: 'quadcopter',
        size: { width: 1.5, height: 0.3, depth: 1.5 },
        color: 0x666666,
        propColor: 0x999999,
        hasCamera: true,
        premium: true
    });

    createDroneModel('drone-model-5', {
        type: 'mini',
        size: { width: 0.6, height: 0.1, depth: 0.6 },
        color: 0x44cc44,
        propColor: 0xdddddd
    });

    createDroneModel('drone-model-6', {
        type: 'quadcopter',
        size: { width: 1.3, height: 0.25, depth: 1.3 },
        color: 0x555555,
        propColor: 0xaaaaaa,
        hasCamera: true
    });

    createDroneModel('drone-model-7', {
        type: 'hexacopter',
        size: { width: 1.6, height: 0.3, depth: 1.6 },
        color: 0x336699,
        propColor: 0xdddddd,
        hasCamera: true
    });

    createDroneModel('drone-model-8', {
        type: 'racing',
        size: { width: 0.7, height: 0.15, depth: 0.9 },
        color: 0x000000,
        propColor: 0xff6600
    });

    createDroneModel('drone-model-9', {
        type: 'quadcopter',
        size: { width: 1.1, height: 0.2, depth: 1.1 },
        color: 0x4285f4,
        propColor: 0xeeeeee
    });

    createDroneModel('drone-model-10', {
        type: 'quadcopter',
        size: { width: 1.5, height: 0.3, depth: 1.5 },
        color: 0x222222,
        propColor: 0xffcc00,
        hasCamera: true,
        premium: true,
        goldAccents: true
    });

    // Function to create a drone model
    function createDroneModel(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Set up scene, camera, and renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(modelSettings.backgroundColor);

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(
            modelSettings.cameraPosition.x,
            modelSettings.cameraPosition.y,
            modelSettings.cameraPosition.z
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, modelSettings.lightIntensity);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-5, 5, -5);
        scene.add(backLight);

        // Create drone model based on config
        const drone = createDroneByType(config);
        scene.add(drone);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the drone
            drone.rotation.y += modelSettings.rotationSpeed;
            
            // Animate propellers if present
            drone.children.forEach(child => {
                if (child.userData.isPropeller) {
                    child.rotation.y += 0.2;
                }
            });
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        });

        // Start animation
        animate();
    }

    // Create specific drone types
    function createDroneByType(config) {
        switch(config.type) {
            case 'quadcopter':
                return createQuadcopter(config);
            case 'racing':
                return createRacingDrone(config);
            case 'hexacopter':
                return createHexacopter(config);
            case 'mini':
                return createMiniDrone(config);
            default:
                return createQuadcopter(config);
        }
    }

    // Create a standard quadcopter drone
    function createQuadcopter(config) {
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(
            config.size.width * 0.5, 
            config.size.height, 
            config.size.depth * 0.5
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: config.premium ? 100 : 30
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);

        // Add gold accents if premium
        if (config.premium && config.goldAccents) {
            const trimGeometry = new THREE.BoxGeometry(
                config.size.width * 0.52, 
                config.size.height * 0.1, 
                config.size.depth * 0.52
            );
            
            const goldMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFD700,
                shininess: 100
            });
            
            const trim = new THREE.Mesh(trimGeometry, goldMaterial);
            trim.position.y = -config.size.height * 0.35;
            group.add(trim);
        }
        
        // Arms
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: config.premium ? 0x444444 : config.color,
            shininess: 30 
        });
        
        // Create 4 arms
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2);
            
            // Arm
            const armGeometry = new THREE.BoxGeometry(
                config.size.width * 0.6, 
                config.size.height * 0.4, 
                config.size.width * 0.1
            );
            
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            
            // Position the arm
            arm.position.x = Math.cos(angle) * (config.size.width * 0.4);
            arm.position.z = Math.sin(angle) * (config.size.width * 0.4);
            arm.rotation.y = angle;
            
            group.add(arm);
            
            // Propeller for each arm
            const propGeometry = new THREE.BoxGeometry(
                config.size.width * 0.5, 
                config.size.height * 0.05, 
                config.size.width * 0.05
            );
            
            const propMaterial = new THREE.MeshPhongMaterial({ 
                color: config.propColor,
                shininess: 50 
            });
            
            const propeller = new THREE.Mesh(propGeometry, propMaterial);
            propeller.position.x = Math.cos(angle) * (config.size.width * 0.6);
            propeller.position.z = Math.sin(angle) * (config.size.width * 0.6);
            propeller.position.y = config.size.height * 0.1;
            propeller.userData.isPropeller = true;
            
            group.add(propeller);
        }
        
        // Add camera if needed
        if (config.hasCamera) {
            const cameraGeometry = new THREE.SphereGeometry(config.size.width * 0.1, 16, 16);
            const cameraMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x000000,
                shininess: 100 
            });
            
            const cameraLens = new THREE.Mesh(cameraGeometry, cameraMaterial);
            cameraLens.position.y = -config.size.height * 0.3;
            cameraLens.position.z = config.size.depth * 0.2;
            
            group.add(cameraLens);
            
            // Camera mount
            const mountGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.07,
                config.size.width * 0.07,
                config.size.height * 0.2,
                16
            );
            
            const mountMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x666666,
                shininess: 30 
            });
            
            const cameraMount = new THREE.Mesh(mountGeometry, mountMaterial);
            cameraMount.position.y = -config.size.height * 0.1;
            cameraMount.position.z = config.size.depth * 0.2;
            cameraMount.rotation.x = Math.PI / 2;
            
            group.add(cameraMount);
        }
        
        return group;
    }

    // Create a racing drone
    function createRacingDrone(config) {
        const group = new THREE.Group();
        
        // Frame - more angled, flatter
        const frameGeometry = new THREE.BoxGeometry(
            config.size.width, 
            config.size.height * 0.5, 
            config.size.depth
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 50 
        });
        
        const body = new THREE.Mesh(frameGeometry, bodyMaterial);
        body.position.y = 0;
        group.add(body);
        
        // Top cover with sloped shape
        const coverShape = new THREE.Shape();
        coverShape.moveTo(-config.size.width/2, -config.size.depth/2);
        coverShape.lineTo(config.size.width/2, -config.size.depth/2);
        coverShape.lineTo(config.size.width/3, config.size.depth/2);
        coverShape.lineTo(-config.size.width/3, config.size.depth/2);
        coverShape.lineTo(-config.size.width/2, -config.size.depth/2);
        
        const extrudeSettings = {
            steps: 1,
            depth: config.size.height * 0.3,
            bevelEnabled: false
        };
        
        const coverGeometry = new THREE.ExtrudeGeometry(coverShape, extrudeSettings);
        const coverMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 70 
        });
        
        const cover = new THREE.Mesh(coverGeometry, coverMaterial);
        cover.rotation.x = -Math.PI / 2;
        cover.position.y = config.size.height * 0.2;
        group.add(cover);
        
        // Props - racing drones have smaller, faster props
        const propMaterial = new THREE.MeshPhongMaterial({ 
            color: config.propColor,
            shininess: 50 
        });
        
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + (Math.PI / 4); // 45-degree offset
            
            // Create motor
            const motorGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.07,
                config.size.width * 0.07,
                config.size.height * 0.3,
                16
            );
            
            const motorMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x666666,
                shininess: 70 
            });
            
            const motor = new THREE.Mesh(motorGeometry, motorMaterial);
            motor.position.x = Math.cos(angle) * (config.size.width * 0.4);
            motor.position.z = Math.sin(angle) * (config.size.width * 0.4);
            motor.position.y = config.size.height * 0.15;
            
            group.add(motor);
            
            // Create propeller
            const propGeometry = new THREE.BoxGeometry(
                config.size.width * 0.4, 
                config.size.height * 0.03, 
                config.size.width * 0.04
            );
            
            const propeller = new THREE.Mesh(propGeometry, propMaterial);
            propeller.position.x = Math.cos(angle) * (config.size.width * 0.4);
            propeller.position.z = Math.sin(angle) * (config.size.width * 0.4);
            propeller.position.y = config.size.height * 0.3;
            propeller.userData.isPropeller = true;
            
            group.add(propeller);
        }
        
        // FPV camera
        const cameraGeometry = new THREE.BoxGeometry(
            config.size.width * 0.15, 
            config.size.height * 0.15, 
            config.size.width * 0.15
        );
        
        const cameraMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 30 
        });
        
        const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
        camera.position.z = config.size.depth * 0.4;
        camera.position.y = config.size.height * 0.2;
        
        group.add(camera);
        
        // Lens
        const lensGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.05,
            config.size.width * 0.05,
            config.size.height * 0.05,
            16
        );
        
        const lensMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 90 
        });
        
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.z = config.size.depth * 0.48;
        lens.position.y = config.size.height * 0.2;
        lens.rotation.x = Math.PI / 2;
        
        group.add(lens);
        
        return group;
    }

    // Create a hexacopter
    function createHexacopter(config) {
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.3, 
            config.size.width * 0.3, 
            config.size.height, 
            6
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: config.premium ? 100 : 30
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Arms
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 30 
        });
        
        // Create 6 arms
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI / 3);
            
            // Arm
            const armGeometry = new THREE.BoxGeometry(
                config.size.width * 0.6, 
                config.size.height * 0.2, 
                config.size.width * 0.05
            );
            
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            
            // Position the arm
            arm.position.x = Math.cos(angle) * (config.size.width * 0.4);
            arm.position.z = Math.sin(angle) * (config.size.width * 0.4);
            arm.rotation.y = angle;
            
            group.add(arm);
            
            // Propeller for each arm
            const propGeometry = new THREE.BoxGeometry(
                config.size.width * 0.4, 
                config.size.height * 0.03, 
                config.size.width * 0.03
            );
            
            const propMaterial = new THREE.MeshPhongMaterial({ 
                color: config.propColor,
                shininess: 50 
            });
            
            const propeller = new THREE.Mesh(propGeometry, propMaterial);
            propeller.position.x = Math.cos(angle) * (config.size.width * 0.7);
            propeller.position.z = Math.sin(angle) * (config.size.width * 0.7);
            propeller.position.y = config.size.height * 0.1;
            propeller.userData.isPropeller = true;
            
            group.add(propeller);
            
            // Motor housing
            const motorGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.06, 
                config.size.width * 0.06, 
                config.size.height * 0.15, 
                16
            );
            
            const motorMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x666666,
                shininess: 50 
            });
            
            const motor = new THREE.Mesh(motorGeometry, motorMaterial);
            motor.position.x = Math.cos(angle) * (config.size.width * 0.7);
            motor.position.z = Math.sin(angle) * (config.size.width * 0.7);
            
            group.add(motor);
        }
        
        // Add cameras if needed
        if (config.hasCamera) {
            // Main camera
            const cameraGeometry = new THREE.BoxGeometry(
                config.size.width * 0.25, 
                config.size.height * 0.15, 
                config.size.width * 0.25
            );
            
            const cameraMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x222222,
                shininess: 70 
            });
            
            const cameraMount = new THREE.Mesh(cameraGeometry, cameraMaterial);
            cameraMount.position.y = -config.size.height * 0.6;
            
            group.add(cameraMount);
            
            // Camera lens
            const lensGeometry = new THREE.SphereGeometry(
                config.size.width * 0.08, 
                16, 
                16
            );
            
            const lensMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x000000,
                shininess: 100 
            });
            
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.position.y = -config.size.height * 0.7;
            lens.position.z = config.size.width * 0.1;
            
            group.add(lens);
            
            // Second camera (thermal)
            const thermalLensGeometry = new THREE.SphereGeometry(
                config.size.width * 0.06, 
                16, 
                16
            );
            
            const thermalLensMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x990000,
                shininess: 90 
            });
            
            const thermalLens = new THREE.Mesh(thermalLensGeometry, thermalLensMaterial);
            thermalLens.position.y = -config.size.height * 0.7;
            thermalLens.position.z = -config.size.width * 0.1;
            
            group.add(thermalLens);
        }
        
        return group;
    }

    // Create a mini drone
    function createMiniDrone(config) {
        const group = new THREE.Group();
        
        // Body - small and rounded
        const bodyGeometry = new THREE.SphereGeometry(
            config.size.width * 0.25, 
            32, 
            32
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 70 
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Prop guards
        const guardMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xbbbbbb,
            shininess: 30,
            transparent: true,
            opacity: 0.7
        });
        
        // Create 4 props with guards
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2);
            
            // Prop arm
            const armGeometry = new THREE.BoxGeometry(
                config.size.width * 0.4, 
                config.size.height * 0.1, 
                config.size.width * 0.05
            );
            
            const armMaterial = new THREE.MeshPhongMaterial({ 
                color: config.color,
                shininess: 30 
            });
            
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            
            // Position the arm
            arm.position.x = Math.cos(angle) * (config.size.width * 0.2);
            arm.position.z = Math.sin(angle) * (config.size.width * 0.2);
            arm.rotation.y = angle;
            
            group.add(arm);
            
            // Guard ring
            const guardGeometry = new THREE.TorusGeometry(
                config.size.width * 0.15, 
                config.size.width * 0.02, 
                16, 
                32
            );
            
            const guard = new THREE.Mesh(guardGeometry, guardMaterial);
            guard.position.x = Math.cos(angle) * (config.size.width * 0.35);
            guard.position.z = Math.sin(angle) * (config.size.width * 0.35);
            guard.rotation.x = Math.PI / 2;
            
            group.add(guard);
            
            // Propeller
            const propGeometry = new THREE.BoxGeometry(
                config.size.width * 0.25, 
                config.size.height * 0.02, 
                config.size.width * 0.04
            );
            
            const propMaterial = new THREE.MeshPhongMaterial({ 
                color: config.propColor,
                shininess: 50 
            });
            
            const propeller = new THREE.Mesh(propGeometry, propMaterial);
            propeller.position.x = Math.cos(angle) * (config.size.width * 0.35);
            propeller.position.z = Math.sin(angle) * (config.size.width * 0.35);
            propeller.position.y = config.size.height * 0.06;
            propeller.userData.isPropeller = true;
            
            group.add(propeller);
        }
        
        // Add basic camera
        const cameraGeometry = new THREE.SphereGeometry(
            config.size.width * 0.06, 
            16, 
            16
        );
        
        const cameraMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 90 
        });
        
        const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
        camera.position.z = config.size.width * 0.2;
        
        group.add(camera);
        
        return group;
    }
}); 