// RC Helicopter 3D Models
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    // Common settings for all helicopter models
    const modelSettings = {
        cameraPosition: { x: 2, y: 1, z: 2 },
        lightIntensity: 1.5,
        rotationSpeed: 0.5,
        backgroundColor: 0xf0f0f0
    };

    // Helicopter model definitions
    const helicopterModels = [
        {
            id: 1,
            name: 'Sky Hawk Trainer',
            color: 0x3498db, // Blue
            rotorColor: 0x333333,
            type: 'beginner',
            size: { width: 1.2, height: 0.3, depth: 1.2 }
        },
        {
            id: 2,
            name: 'Military Apache',
            color: 0x2c3e50, // Olive green
            rotorColor: 0x111111,
            type: 'scale',
            size: { width: 1.5, height: 0.4, depth: 1.8 },
            hasWeapons: true
        },
        {
            id: 3,
            name: 'Aerobatic Master 3D',
            color: 0xe74c3c, // Red
            rotorColor: 0x333333,
            type: 'stunt',
            size: { width: 1.3, height: 0.25, depth: 1.5 },
            isRacing: true
        },
        {
            id: 4,
            name: 'Stable Flyer Pro',
            color: 0x3498db, // Blue
            rotorColor: 0x333333,
            type: 'coaxial',
            size: { width: 1.2, height: 0.35, depth: 1.2 }
        },
        {
            id: 5,
            name: 'Nano Chopper',
            color: 0x27ae60, // Green
            rotorColor: 0x111111,
            type: 'micro',
            size: { width: 0.6, height: 0.15, depth: 0.6 }
        },
        {
            id: 6,
            name: 'Rescue Chopper',
            color: 0xe67e22, // Orange
            rotorColor: 0x333333,
            type: 'scale',
            size: { width: 1.6, height: 0.45, depth: 1.9 },
            hasSearchlight: true
        },
        {
            id: 7,
            name: 'Stunt Master Elite',
            color: 0x000000, // Black
            rotorColor: 0x444444,
            type: 'stunt',
            size: { width: 1.4, height: 0.3, depth: 1.7 },
            isRacing: true,
            premium: true
        },
        {
            id: 8,
            name: 'Beginner Heli',
            color: 0x00bcd4, // Light blue
            rotorColor: 0x222222,
            type: 'beginner',
            size: { width: 1.1, height: 0.25, depth: 1.1 }
        },
        {
            id: 9,
            name: 'Camera Flyer Pro',
            color: 0x607d8b, // Gray
            rotorColor: 0x333333,
            type: 'coaxial',
            size: { width: 1.3, height: 0.35, depth: 1.3 },
            hasCamera: true
        },
        {
            id: 10,
            name: 'Executive Luxury',
            color: 0x000000, // Black
            rotorColor: 0x666666,
            type: 'scale',
            size: { width: 1.8, height: 0.5, depth: 2.0 },
            premium: true,
            hasGoldAccents: true
        }
    ];

    // Create 3D models for each helicopter
    helicopterModels.forEach(helicopter => {
        createHelicopterModel(`helicopter-model-${helicopter.id}`, helicopter, modelSettings);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update all rendered scenes
        helicopterModels.forEach(helicopter => {
            if (helicopter.scene && helicopter.renderer) {
                updateHelicoptersAnimation(helicopter.scene, modelSettings);
                helicopter.renderer.render(helicopter.scene, helicopter.camera);
            }
        });
    }
    
    // Start animation
    animate();

    // Function to create and render a helicopter model in a container
    function createHelicopterModel(containerId, modelData, settings) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(settings.backgroundColor);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(
            settings.cameraPosition.x, 
            settings.cameraPosition.y, 
            settings.cameraPosition.z
        );
        camera.lookAt(0, 0, 0);
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, settings.lightIntensity);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Create helicopter model based on its type
        const createFunction = getModelCreationFunction(modelData.type);
        const helicopter = createFunction(modelData);
        scene.add(helicopter);
        
        // Store scene and renderer in model data for animation
        modelData.scene = scene;
        modelData.camera = camera;
        modelData.renderer = renderer;
        
        // IMPORTANT: Store the scene in the container element for reference in the animation loop
        container._scene = scene;
        container._camera = camera;
        container._renderer = renderer;
        container._helicopter = helicopter;
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // Add initial rotation
        helicopter.rotation.y = Math.random() * Math.PI;
        
        return {
            scene,
            camera,
            renderer,
            helicopter
        };
    }

    // Create specific helicopter types
    function createHelicopterByType(config) {
        switch(config.type) {
            case 'beginner':
                return createBeginnerHelicopter(config);
            case 'military':
                return createMilitaryHelicopter(config);
            case 'stunt':
                return createStuntHelicopter(config);
            case 'coaxial':
                return createCoaxialHelicopter(config);
            case 'micro':
                return createMicroHelicopter(config);
            case 'rescue':
                return createRescueHelicopter(config);
            case 'executive':
                return createExecutiveHelicopter(config);
            default:
                return createBeginnerHelicopter(config);
        }
    }

    // Create a beginner helicopter model
    function createBeginnerHelicopter(config) {
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(
            config.size.width * 0.5, 
            config.size.height, 
            config.size.depth * 0.8
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Cockpit
        const cockpitGeometry = new THREE.SphereGeometry(
            config.size.width * 0.25, 
            16, 
            16, 
            0, 
            Math.PI * 2, 
            0, 
            Math.PI / 2
        );
        
        const cockpitMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.7,
            shininess: 90 
        });
        
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.z = config.size.depth * 0.2;
        cockpit.position.y = config.size.height * 0.15;
        cockpit.rotation.x = -Math.PI / 2;
        group.add(cockpit);
        
        // Tail boom
        const tailBoomGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.05, 
            config.size.width * 0.05, 
            config.size.depth * 0.8, 
            8
        );
        
        const tailBoomMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
        tailBoom.rotation.z = Math.PI / 2;
        tailBoom.position.z = -config.size.depth * 0.6;
        group.add(tailBoom);
        
        // Tail fin
        const tailFinGeometry = new THREE.BoxGeometry(
            config.size.width * 0.3, 
            config.size.height * 0.6, 
            config.size.width * 0.05
        );
        
        const tailFinMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
        tailFin.position.z = -config.size.depth;
        tailFin.position.y = config.size.height * 0.3;
        group.add(tailFin);
        
        // Tail rotor
        const tailRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.4, 
            config.size.width * 0.05, 
            config.size.width * 0.01
        );
        
        const tailRotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 50 
        });
        
        const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
        tailRotor.position.z = -config.size.depth - config.size.width * 0.05;
        tailRotor.userData.isTailRotor = true;
        group.add(tailRotor);
        
        // Main rotor holder
        const mainRotorHolderGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.05, 
            config.size.width * 0.05, 
            config.size.height * 0.3, 
            8
        );
        
        const mainRotorHolderMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 30 
        });
        
        const mainRotorHolder = new THREE.Mesh(mainRotorHolderGeometry, mainRotorHolderMaterial);
        mainRotorHolder.position.y = config.size.height * 0.5;
        group.add(mainRotorHolder);
        
        // Main rotor
        const mainRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 1.5, 
            config.size.width * 0.05, 
            config.size.width * 0.1
        );
        
        const mainRotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 30 
        });
        
        const mainRotor = new THREE.Mesh(mainRotorGeometry, mainRotorMaterial);
        mainRotor.position.y = config.size.height * 0.6;
        mainRotor.userData.isMainRotor = true;
        group.add(mainRotor);
        
        // Skids
        const skidGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.03, 
            config.size.width * 0.03, 
            config.size.width * 0.8, 
            8
        );
        
        const skidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 30 
        });
        
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.rotation.z = Math.PI / 2;
        leftSkid.position.x = config.size.width * 0.25;
        leftSkid.position.y = -config.size.height * 0.4;
        group.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.rotation.z = Math.PI / 2;
        rightSkid.position.x = -config.size.width * 0.25;
        rightSkid.position.y = -config.size.height * 0.4;
        group.add(rightSkid);
        
        // Skid connectors
        const skidConnectorGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.02, 
            config.size.width * 0.02, 
            config.size.width * 0.5, 
            8
        );
        
        const frontSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        frontSkidConnector.position.y = -config.size.height * 0.4;
        frontSkidConnector.position.z = config.size.depth * 0.2;
        group.add(frontSkidConnector);
        
        const rearSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        rearSkidConnector.position.y = -config.size.height * 0.4;
        rearSkidConnector.position.z = -config.size.depth * 0.2;
        group.add(rearSkidConnector);
        
        return group;
    }

    // Create a military helicopter model
    function createMilitaryHelicopter(config) {
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(
            config.size.width * 0.6, 
            config.size.height, 
            config.size.depth * 0.8
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Cockpit with angular design
        const cockpitShape = new THREE.Shape();
        cockpitShape.moveTo(-config.size.width * 0.25, -config.size.height * 0.3);
        cockpitShape.lineTo(config.size.width * 0.25, -config.size.height * 0.3);
        cockpitShape.lineTo(config.size.width * 0.15, config.size.height * 0.3);
        cockpitShape.lineTo(-config.size.width * 0.15, config.size.height * 0.3);
        cockpitShape.lineTo(-config.size.width * 0.25, -config.size.height * 0.3);
        
        const extrudeSettings = {
            steps: 1,
            depth: config.size.depth * 0.4,
            bevelEnabled: false
        };
        
        const cockpitGeometry = new THREE.ExtrudeGeometry(cockpitShape, extrudeSettings);
        
        const cockpitMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x222222,
            shininess: 90 
        });
        
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.rotation.x = -Math.PI / 2;
        cockpit.position.z = config.size.depth * 0.2;
        cockpit.position.y = config.size.height * 0.1;
        group.add(cockpit);
        
        // Tail boom
        const tailBoomGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.08, 
            config.size.width * 0.05, 
            config.size.depth, 
            8
        );
        
        const tailBoomMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
        tailBoom.rotation.z = Math.PI / 2;
        tailBoom.position.z = -config.size.depth * 0.6;
        group.add(tailBoom);
        
        // Tail fins (both vertical and horizontal)
        const verticalFinGeometry = new THREE.BoxGeometry(
            config.size.width * 0.35, 
            config.size.height * 0.7, 
            config.size.width * 0.05
        );
        
        const tailFinMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const verticalFin = new THREE.Mesh(verticalFinGeometry, tailFinMaterial);
        verticalFin.position.z = -config.size.depth * 1.1;
        verticalFin.position.y = config.size.height * 0.2;
        group.add(verticalFin);
        
        const horizontalFinGeometry = new THREE.BoxGeometry(
            config.size.width * 0.05, 
            config.size.width * 0.35, 
            config.size.width * 0.35
        );
        
        const horizontalFin = new THREE.Mesh(horizontalFinGeometry, tailFinMaterial);
        horizontalFin.position.z = -config.size.depth * 1.0;
        horizontalFin.position.y = config.size.height * 0.3;
        group.add(horizontalFin);
        
        // Tail rotor
        const tailRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.45, 
            config.size.width * 0.05, 
            config.size.width * 0.01
        );
        
        const tailRotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 50 
        });
        
        const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
        tailRotor.position.z = -config.size.depth * 1.15;
        tailRotor.position.x = config.size.width * 0.2;
        tailRotor.userData.isTailRotor = true;
        group.add(tailRotor);
        
        // Main rotor system
        const mainRotorHubGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.1, 
            config.size.width * 0.1, 
            config.size.height * 0.2, 
            8
        );
        
        const mainRotorHubMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 50 
        });
        
        const mainRotorHub = new THREE.Mesh(mainRotorHubGeometry, mainRotorHubMaterial);
        mainRotorHub.position.y = config.size.height * 0.5;
        group.add(mainRotorHub);
        
        // Main rotor blades (4 blades for military)
        const rotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.15, 
            config.size.width * 0.02, 
            config.size.width * 0.8
        );
        
        const rotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 30 
        });
        
        const rotorGroup = new THREE.Group();
        rotorGroup.position.y = config.size.height * 0.6;
        rotorGroup.userData.isMainRotor = true;
        
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(rotorGeometry, rotorMaterial);
            blade.rotation.y = (i * Math.PI / 2);
            blade.position.z = config.size.width * 0.4;
            rotorGroup.add(blade);
        }
        
        group.add(rotorGroup);
        
        // Weapon systems if needed
        if (config.hasWeapons) {
            // Left weapon pod
            const weaponPodGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.06, 
                config.size.width * 0.06, 
                config.size.width * 0.5, 
                8
            );
            
            const weaponPodMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x333333,
                shininess: 30 
            });
            
            const leftWeaponPod = new THREE.Mesh(weaponPodGeometry, weaponPodMaterial);
            leftWeaponPod.rotation.z = Math.PI / 2;
            leftWeaponPod.position.x = config.size.width * 0.4;
            leftWeaponPod.position.z = config.size.depth * 0.1;
            group.add(leftWeaponPod);
            
            // Right weapon pod
            const rightWeaponPod = new THREE.Mesh(weaponPodGeometry, weaponPodMaterial);
            rightWeaponPod.rotation.z = Math.PI / 2;
            rightWeaponPod.position.x = -config.size.width * 0.4;
            rightWeaponPod.position.z = config.size.depth * 0.1;
            group.add(rightWeaponPod);
            
            // Missiles
            const missileGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.02, 
                config.size.width * 0.02, 
                config.size.width * 0.25, 
                8
            );
            
            const missileMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x222222,
                shininess: 70 
            });
            
            for (let i = 0; i < 3; i++) {
                const leftMissile = new THREE.Mesh(missileGeometry, missileMaterial);
                leftMissile.rotation.z = Math.PI / 2;
                leftMissile.position.x = config.size.width * 0.4;
                leftMissile.position.z = config.size.depth * 0.1 - i * config.size.width * 0.1;
                leftMissile.position.y = -config.size.height * 0.1;
                group.add(leftMissile);
                
                const rightMissile = new THREE.Mesh(missileGeometry, missileMaterial);
                rightMissile.rotation.z = Math.PI / 2;
                rightMissile.position.x = -config.size.width * 0.4;
                rightMissile.position.z = config.size.depth * 0.1 - i * config.size.width * 0.1;
                rightMissile.position.y = -config.size.height * 0.1;
                group.add(rightMissile);
            }
        }
        
        // Landing gear - sturdy for military helicopters
        const skidGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.04, 
            config.size.width * 0.04, 
            config.size.width * 0.9, 
            8
        );
        
        const skidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 30 
        });
        
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.rotation.z = Math.PI / 2;
        leftSkid.position.x = config.size.width * 0.25;
        leftSkid.position.y = -config.size.height * 0.4;
        group.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.rotation.z = Math.PI / 2;
        rightSkid.position.x = -config.size.width * 0.25;
        rightSkid.position.y = -config.size.height * 0.4;
        group.add(rightSkid);
        
        // Skid connectors
        const skidConnectorGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.025, 
            config.size.width * 0.025, 
            config.size.width * 0.5, 
            8
        );
        
        const frontSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        frontSkidConnector.position.y = -config.size.height * 0.4;
        frontSkidConnector.position.z = config.size.depth * 0.2;
        group.add(frontSkidConnector);
        
        const rearSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        rearSkidConnector.position.y = -config.size.height * 0.4;
        rearSkidConnector.position.z = -config.size.depth * 0.2;
        group.add(rearSkidConnector);
        
        return group;
    }

    // Create a stunt helicopter model
    function createStuntHelicopter(config) {
        const group = new THREE.Group();
        
        // Main body - sleek and aerodynamic
        const bodyGeometry = new THREE.BoxGeometry(
            config.size.width * 0.4, 
            config.size.height * 0.8, 
            config.size.depth * 0.6
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: config.premium ? 90 : 50 
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Aerodynamic canopy
        const canopyShape = new THREE.Shape();
        canopyShape.moveTo(-config.size.width * 0.2, -config.size.height * 0.2);
        canopyShape.lineTo(config.size.width * 0.2, -config.size.height * 0.2);
        canopyShape.lineTo(config.size.width * 0.1, config.size.height * 0.2);
        canopyShape.lineTo(-config.size.width * 0.1, config.size.height * 0.2);
        canopyShape.lineTo(-config.size.width * 0.2, -config.size.height * 0.2);
        
        const extrudeSettings = {
            steps: 1,
            depth: config.size.depth * 0.4,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
        };
        
        const canopyGeometry = new THREE.ExtrudeGeometry(canopyShape, extrudeSettings);
        
        const canopyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x222222,
            transparent: true,
            opacity: 0.7,
            shininess: 100 
        });
        
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.rotation.x = -Math.PI / 2;
        canopy.position.z = config.size.depth * 0.15;
        canopy.position.y = config.size.height * 0.2;
        group.add(canopy);
        
        // Thin tail boom for aerodynamics
        const tailBoomGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.05, 
            config.size.width * 0.03, 
            config.size.depth, 
            8
        );
        
        const tailBoomMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 50 
        });
        
        const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
        tailBoom.rotation.z = Math.PI / 2;
        tailBoom.position.z = -config.size.depth * 0.6;
        group.add(tailBoom);
        
        // Tail fin - smaller and more streamlined
        const tailFinGeometry = new THREE.BoxGeometry(
            config.size.width * 0.25, 
            config.size.height * 0.5, 
            config.size.width * 0.03
        );
        
        const tailFinMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 50 
        });
        
        const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
        tailFin.position.z = -config.size.depth * 1.1;
        tailFin.position.y = config.size.height * 0.15;
        group.add(tailFin);
        
        // Tail rotor
        const tailRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.3, 
            config.size.width * 0.03, 
            config.size.width * 0.01
        );
        
        const tailRotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 70 
        });
        
        const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
        tailRotor.position.z = -config.size.depth * 1.15;
        tailRotor.userData.isTailRotor = true;
        group.add(tailRotor);
        
        // Main rotor system - high performance
        const mainRotorHubGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.06, 
            config.size.width * 0.06, 
            config.size.height * 0.15, 
            8
        );
        
        const mainRotorHubMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 70 
        });
        
        const mainRotorHub = new THREE.Mesh(mainRotorHubGeometry, mainRotorHubMaterial);
        mainRotorHub.position.y = config.size.height * 0.4;
        group.add(mainRotorHub);
        
        // Main rotor blades - thin and carbon fiber look
        const rotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.1, 
            config.size.width * 0.01, 
            config.size.width * 1.2
        );
        
        const rotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 70 
        });
        
        const rotorGroup = new THREE.Group();
        rotorGroup.position.y = config.size.height * 0.5;
        rotorGroup.userData.isMainRotor = true;
        
        // 2 blades for racing/stunt performance
        for (let i = 0; i < 2; i++) {
            const blade = new THREE.Mesh(rotorGeometry, rotorMaterial);
            blade.rotation.y = (i * Math.PI);
            blade.position.z = config.size.width * 0.6;
            rotorGroup.add(blade);
        }
        
        group.add(rotorGroup);
        
        // Performance exhaust (decorative)
        if (config.isRacing) {
            const exhaustGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.04, 
                config.size.width * 0.06, 
                config.size.width * 0.2, 
                8
            );
            
            const exhaustMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x333333,
                shininess: 70 
            });
            
            const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
            exhaust.rotation.x = Math.PI / 2;
            exhaust.position.z = -config.size.depth * 0.3;
            exhaust.position.y = -config.size.height * 0.2;
            group.add(exhaust);
            
            // Add racing stripes if premium
            if (config.premium) {
                const stripesGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.41, 
                    config.size.height * 0.05, 
                    config.size.depth * 0.61
                );
                
                const stripesMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0xff0000,
                    shininess: 90 
                });
                
                const stripes = new THREE.Mesh(stripesGeometry, stripesMaterial);
                stripes.position.y = 0;
                group.add(stripes);
            }
        }
        
        // Skids - lightweight racing style
        const skidGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.02, 
            config.size.width * 0.02, 
            config.size.width * 0.7, 
            8
        );
        
        const skidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x222222,
            shininess: 50 
        });
        
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.rotation.z = Math.PI / 2;
        leftSkid.position.x = config.size.width * 0.2;
        leftSkid.position.y = -config.size.height * 0.35;
        group.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.rotation.z = Math.PI / 2;
        rightSkid.position.x = -config.size.width * 0.2;
        rightSkid.position.y = -config.size.height * 0.35;
        group.add(rightSkid);
        
        // Skid connectors - minimal for weight reduction
        const skidConnectorGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.015, 
            config.size.width * 0.015, 
            config.size.width * 0.4, 
            8
        );
        
        const frontSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        frontSkidConnector.position.y = -config.size.height * 0.35;
        frontSkidConnector.position.z = config.size.depth * 0.15;
        group.add(frontSkidConnector);
        
        const rearSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        rearSkidConnector.position.y = -config.size.height * 0.35;
        rearSkidConnector.position.z = -config.size.depth * 0.15;
        group.add(rearSkidConnector);
        
        return group;
    }

    // Create a coaxial helicopter model
    function createCoaxialHelicopter(config) {
        const group = new THREE.Group();
        
        // Main body - rounded shape
        const bodyGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.35, 
            config.size.width * 0.35, 
            config.size.height, 
            16
        );
        
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        group.add(body);
        
        // Cockpit window
        const cockpitGeometry = new THREE.SphereGeometry(
            config.size.width * 0.3, 
            16, 
            16, 
            0, 
            Math.PI * 2, 
            0, 
            Math.PI / 2
        );
        
        const cockpitMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.7,
            shininess: 90 
        });
        
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.z = config.size.depth * 0.1;
        cockpit.rotation.x = -Math.PI / 2;
        group.add(cockpit);
        
        // Tail boom - shorter for coaxial helicopters
        const tailBoomGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.08, 
            config.size.width * 0.04, 
            config.size.depth * 0.6, 
            8
        );
        
        const tailBoomMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
        tailBoom.rotation.z = Math.PI / 2;
        tailBoom.position.z = -config.size.depth * 0.4;
        group.add(tailBoom);
        
        // Tail fin
        const tailFinGeometry = new THREE.BoxGeometry(
            config.size.width * 0.2, 
            config.size.height * 0.4, 
            config.size.width * 0.05
        );
        
        const tailFinMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 30 
        });
        
        const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
        tailFin.position.z = -config.size.depth * 0.7;
        tailFin.position.y = config.size.height * 0.1;
        group.add(tailFin);
        
        // Horizontal stabilizer
        const stabilizerGeometry = new THREE.BoxGeometry(
            config.size.width * 0.6, 
            config.size.width * 0.05, 
            config.size.width * 0.15
        );
        
        const stabilizer = new THREE.Mesh(stabilizerGeometry, tailFinMaterial);
        stabilizer.position.z = -config.size.depth * 0.7;
        stabilizer.position.y = -config.size.height * 0.1;
        group.add(stabilizer);
        
        // Main rotor system - coaxial design with two counter-rotating rotors
        // Bottom rotor hub
        const bottomRotorHubGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.1, 
            config.size.width * 0.1, 
            config.size.height * 0.1, 
            16
        );
        
        const rotorHubMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 50 
        });
        
        const bottomRotorHub = new THREE.Mesh(bottomRotorHubGeometry, rotorHubMaterial);
        bottomRotorHub.position.y = config.size.height * 0.45;
        group.add(bottomRotorHub);
        
        // Top rotor hub
        const topRotorHubGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.08, 
            config.size.width * 0.08, 
            config.size.height * 0.1, 
            16
        );
        
        const topRotorHub = new THREE.Mesh(topRotorHubGeometry, rotorHubMaterial);
        topRotorHub.position.y = config.size.height * 0.65;
        group.add(topRotorHub);
        
        // Main shaft connecting the rotors
        const shaftGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.03, 
            config.size.width * 0.03, 
            config.size.height * 0.3, 
            8
        );
        
        const shaft = new THREE.Mesh(shaftGeometry, rotorHubMaterial);
        shaft.position.y = config.size.height * 0.55;
        group.add(shaft);
        
        // Bottom rotor blades
        const bottomRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.1, 
            config.size.width * 0.02, 
            config.size.width * 1.4
        );
        
        const rotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 30 
        });
        
        const bottomRotorGroup = new THREE.Group();
        bottomRotorGroup.position.y = config.size.height * 0.4;
        bottomRotorGroup.userData.isMainRotor = true;
        
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(bottomRotorGeometry, rotorMaterial);
            blade.rotation.y = (i * Math.PI * 2 / 3);
            blade.position.z = config.size.width * 0.7;
            bottomRotorGroup.add(blade);
        }
        
        group.add(bottomRotorGroup);
        
        // Top rotor blades - counter-rotating
        const topRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.1, 
            config.size.width * 0.02, 
            config.size.width * 1.2
        );
        
        const topRotorGroup = new THREE.Group();
        topRotorGroup.position.y = config.size.height * 0.7;
        topRotorGroup.userData.isMainRotor = true;
        topRotorGroup.rotation.y = Math.PI / 3; // Offset from bottom rotor
        
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(topRotorGeometry, rotorMaterial);
            blade.rotation.y = (i * Math.PI * 2 / 3);
            blade.position.z = config.size.width * 0.6;
            topRotorGroup.add(blade);
        }
        
        group.add(topRotorGroup);
        
        // Camera mount if applicable
        if (config.hasCamera) {
            const cameraMountGeometry = new THREE.BoxGeometry(
                config.size.width * 0.2, 
                config.size.width * 0.2, 
                config.size.width * 0.2
            );
            
            const cameraMountMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x222222,
                shininess: 30 
            });
            
            const cameraMount = new THREE.Mesh(cameraMountGeometry, cameraMountMaterial);
            cameraMount.position.y = -config.size.height * 0.4;
            cameraMount.position.z = config.size.depth * 0.2;
            group.add(cameraMount);
            
            // Camera lens
            const lensGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.06, 
                config.size.width * 0.06, 
                config.size.width * 0.1, 
                16
            );
            
            const lensMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x000000,
                shininess: 100 
            });
            
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.rotation.x = Math.PI / 2;
            lens.position.y = -config.size.height * 0.4;
            lens.position.z = config.size.depth * 0.3;
            group.add(lens);
        }
        
        // Landing skids
        const skidGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.03, 
            config.size.width * 0.03, 
            config.size.width * 0.8, 
            8
        );
        
        const skidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 30 
        });
        
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.rotation.z = Math.PI / 2;
        leftSkid.position.x = config.size.width * 0.25;
        leftSkid.position.y = -config.size.height * 0.4;
        group.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.rotation.z = Math.PI / 2;
        rightSkid.position.x = -config.size.width * 0.25;
        rightSkid.position.y = -config.size.height * 0.4;
        group.add(rightSkid);
        
        // Skid connectors
        const skidConnectorGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.02, 
            config.size.width * 0.02, 
            config.size.width * 0.5, 
            8
        );
        
        const frontSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        frontSkidConnector.position.y = -config.size.height * 0.4;
        frontSkidConnector.position.z = config.size.depth * 0.2;
        group.add(frontSkidConnector);
        
        const rearSkidConnector = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
        rearSkidConnector.position.y = -config.size.height * 0.4;
        rearSkidConnector.position.z = -config.size.depth * 0.2;
        group.add(rearSkidConnector);
        
        return group;
    }

    // Create an executive helicopter model
    function createExecutiveHelicopter(config) {
        const group = new THREE.Group();
        
        // Sleek luxury body
        const bodyGeometry = new THREE.BoxGeometry(
            config.size.width * 0.9, 
            config.size.height * 0.6, 
            config.size.depth * 1.1
        );
        
        // Premium materials for executive model
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 90 
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Streamlined nose section
        const noseShape = new THREE.Shape();
        noseShape.moveTo(-config.size.width * 0.45, -config.size.height * 0.3);
        noseShape.lineTo(config.size.width * 0.45, -config.size.height * 0.3);
        noseShape.lineTo(config.size.width * 0.3, config.size.height * 0.3);
        noseShape.lineTo(-config.size.width * 0.3, config.size.height * 0.3);
        noseShape.lineTo(-config.size.width * 0.45, -config.size.height * 0.3);
        
        const extrudeSettings = {
            steps: 1,
            depth: config.size.depth * 0.5,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
        };
        
        const noseGeometry = new THREE.ExtrudeGeometry(noseShape, extrudeSettings);
        
        const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
        nose.rotation.x = -Math.PI / 2;
        nose.position.z = config.size.depth * 0.8;
        group.add(nose);
        
        // Premium tinted cockpit window
        const cockpitGeometry = new THREE.BoxGeometry(
            config.size.width * 0.85, 
            config.size.height * 0.4, 
            config.size.depth * 0.6
        );
        
        const cockpitMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            transparent: true,
            opacity: 0.8,
            shininess: 100 
        });
        
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.z = config.size.depth * 0.4;
        cockpit.position.y = config.size.height * 0.1;
        group.add(cockpit);
        
        // Executive cabin windows
        const cabinWindowGeometry = new THREE.PlaneGeometry(
            config.size.depth * 0.6, 
            config.size.height * 0.3
        );
        
        const cabinWindowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            transparent: true,
            opacity: 0.8,
            shininess: 100,
            side: THREE.DoubleSide
        });
        
        const leftCabinWindow = new THREE.Mesh(cabinWindowGeometry, cabinWindowMaterial);
        leftCabinWindow.position.x = config.size.width * 0.451;
        leftCabinWindow.position.y = 0;
        leftCabinWindow.position.z = -config.size.depth * 0.1;
        leftCabinWindow.rotation.y = Math.PI / 2;
        group.add(leftCabinWindow);
        
        const rightCabinWindow = new THREE.Mesh(cabinWindowGeometry, cabinWindowMaterial);
        rightCabinWindow.position.x = -config.size.width * 0.451;
        rightCabinWindow.position.y = 0;
        rightCabinWindow.position.z = -config.size.depth * 0.1;
        rightCabinWindow.rotation.y = Math.PI / 2;
        group.add(rightCabinWindow);
        
        // Tail boom - sleek and premium
        const tailBoomGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.12, 
            config.size.width * 0.08, 
            config.size.depth * 1.5, 
            16
        );
        
        const tailBoomMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 90 
        });
        
        const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
        tailBoom.rotation.z = Math.PI / 2;
        tailBoom.position.z = -config.size.depth * 0.8;
        group.add(tailBoom);
        
        // Elegant tail fin
        const tailFinGeometry = new THREE.BoxGeometry(
            config.size.width * 0.3, 
            config.size.height * 0.7, 
            config.size.width * 0.05
        );
        
        const tailFinMaterial = new THREE.MeshPhongMaterial({ 
            color: config.color,
            shininess: 90 
        });
        
        const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
        tailFin.position.z = -config.size.depth * 1.55;
        tailFin.position.y = config.size.height * 0.25;
        group.add(tailFin);
        
        // Tail rotor - premium finish
        const tailRotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.45, 
            config.size.width * 0.05, 
            config.size.width * 0.02
        );
        
        const tailRotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 100 
        });
        
        const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
        tailRotor.position.z = -config.size.depth * 1.6;
        tailRotor.userData.isTailRotor = true;
        group.add(tailRotor);
        
        // Horizontal stabilizer - premium design
        const stabilizerGeometry = new THREE.BoxGeometry(
            config.size.width * 0.8, 
            config.size.width * 0.05, 
            config.size.width * 0.25
        );
        
        const stabilizer = new THREE.Mesh(stabilizerGeometry, tailFinMaterial);
        stabilizer.position.z = -config.size.depth * 1.5;
        stabilizer.position.y = -config.size.height * 0.15;
        group.add(stabilizer);
        
        // Premium main rotor system
        const mainRotorHubGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.15, 
            config.size.width * 0.15, 
            config.size.height * 0.2, 
            16
        );
        
        const mainRotorHubMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 100 
        });
        
        const mainRotorHub = new THREE.Mesh(mainRotorHubGeometry, mainRotorHubMaterial);
        mainRotorHub.position.y = config.size.height * 0.4;
        group.add(mainRotorHub);
        
        // Main rotor - 5-blade premium design
        const rotorGeometry = new THREE.BoxGeometry(
            config.size.width * 0.12, 
            config.size.width * 0.025, 
            config.size.width * 1.8
        );
        
        const rotorMaterial = new THREE.MeshPhongMaterial({ 
            color: config.rotorColor,
            shininess: 100 
        });
        
        const rotorGroup = new THREE.Group();
        rotorGroup.position.y = config.size.height * 0.5;
        rotorGroup.userData.isMainRotor = true;
        
        for (let i = 0; i < 5; i++) {
            const blade = new THREE.Mesh(rotorGeometry, rotorMaterial);
            blade.rotation.y = (i * Math.PI * 2 / 5);
            blade.position.z = config.size.width * 0.9;
            rotorGroup.add(blade);
        }
        
        group.add(rotorGroup);
        
        // Gold trim accents for premium model
        if (config.premium && config.hasGoldAccents) {
            // Gold stripe along body
            const goldStripeGeometry = new THREE.BoxGeometry(
                config.size.width * 0.92, 
                config.size.height * 0.05, 
                config.size.depth * 1.12
            );
            
            const goldMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xDAA520, // Gold color
                shininess: 100,
                emissive: 0x665000,
                emissiveIntensity: 0.2
            });
            
            const goldStripe = new THREE.Mesh(goldStripeGeometry, goldMaterial);
            goldStripe.position.y = -config.size.height * 0.1;
            group.add(goldStripe);
            
            // Gold tail boom stripe
            const tailStripeGeometry = new THREE.CylinderGeometry(
                config.size.width * 0.121, 
                config.size.width * 0.081, 
                config.size.width * 0.02, 
                16
            );
            
            const tailGoldStripe = new THREE.Mesh(tailStripeGeometry, goldMaterial);
            tailGoldStripe.rotation.z = Math.PI / 2;
            tailGoldStripe.position.z = -config.size.depth * 0.5;
            group.add(tailGoldStripe);
            
            // Gold tail fin tip
            const tailFinTipGeometry = new THREE.BoxGeometry(
                config.size.width * 0.31, 
                config.size.width * 0.1, 
                config.size.width * 0.06
            );
            
            const tailFinTip = new THREE.Mesh(tailFinTipGeometry, goldMaterial);
            tailFinTip.position.z = -config.size.depth * 1.55;
            tailFinTip.position.y = config.size.height * 0.6;
            group.add(tailFinTip);
        }
        
        // Executive landing skids - elegant design
        const skidGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.05, 
            config.size.width * 0.05, 
            config.size.width * 1.4, 
            16
        );
        
        const skidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x222222,
            shininess: 90 
        });
        
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.rotation.z = Math.PI / 2;
        leftSkid.position.x = config.size.width * 0.4;
        leftSkid.position.y = -config.size.height * 0.5;
        group.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.rotation.z = Math.PI / 2;
        rightSkid.position.x = -config.size.width * 0.4;
        rightSkid.position.y = -config.size.height * 0.5;
        group.add(rightSkid);
        
        // Premium skid connectors with angled design
        const frontSkidConnectorGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.04, 
            config.size.width * 0.04, 
            config.size.height * 0.5, 
            16
        );
        
        const frontLeftConnector = new THREE.Mesh(frontSkidConnectorGeometry, skidMaterial);
        frontLeftConnector.rotation.x = Math.PI / 8;
        frontLeftConnector.position.x = config.size.width * 0.4;
        frontLeftConnector.position.y = -config.size.height * 0.25;
        frontLeftConnector.position.z = config.size.depth * 0.4;
        group.add(frontLeftConnector);
        
        const frontRightConnector = new THREE.Mesh(frontSkidConnectorGeometry, skidMaterial);
        frontRightConnector.rotation.x = Math.PI / 8;
        frontRightConnector.position.x = -config.size.width * 0.4;
        frontRightConnector.position.y = -config.size.height * 0.25;
        frontRightConnector.position.z = config.size.depth * 0.4;
        group.add(frontRightConnector);
        
        const rearSkidConnectorGeometry = new THREE.CylinderGeometry(
            config.size.width * 0.04, 
            config.size.width * 0.04, 
            config.size.height * 0.4, 
            16
        );
        
        const rearLeftConnector = new THREE.Mesh(rearSkidConnectorGeometry, skidMaterial);
        rearLeftConnector.rotation.x = -Math.PI / 12;
        rearLeftConnector.position.x = config.size.width * 0.4;
        rearLeftConnector.position.y = -config.size.height * 0.3;
        rearLeftConnector.position.z = -config.size.depth * 0.2;
        group.add(rearLeftConnector);
        
        const rearRightConnector = new THREE.Mesh(rearSkidConnectorGeometry, skidMaterial);
        rearRightConnector.rotation.x = -Math.PI / 12;
        rearRightConnector.position.x = -config.size.width * 0.4;
        rearRightConnector.position.y = -config.size.height * 0.3;
        rearRightConnector.position.z = -config.size.depth * 0.2;
        group.add(rearRightConnector);
        
        return group;
    }
    
    // Function to update helicopter animations based on elapsed time
    function updateHelicoptersAnimation(scene, modelSettings) {
        if (!scene) {
            console.warn('Invalid scene passed to updateHelicoptersAnimation');
            return;
        }
        
        const currentTime = Date.now() * 0.001; // Convert to seconds
        
        // Traverse all objects in the scene to find helicopter parts
        scene.traverse((object) => {
            // Check if it's a main rotor
            if (object.userData && object.userData.isMainRotor) {
                // Rotate main rotors around the Y axis
                object.rotation.y = currentTime * modelSettings.rotationSpeed * 10;
            }
            
            // Check if it's a tail rotor
            if (object.userData && object.userData.isTailRotor) {
                // Rotate tail rotors around the Z axis
                object.rotation.z = currentTime * modelSettings.rotationSpeed * 15;
            }
        });
    }
    
    // Helper function to get appropriate creation function based on helicopter type
    function getModelCreationFunction(type) {
        // Define fallback functions for micro and rescue types if they don't exist
        if (typeof createMicroHelicopter !== 'function') {
            createMicroHelicopter = function(config) {
                // Simple fallback implementation for micro helicopters
                const group = new THREE.Group();
                
                // Main body - small and compact
                const bodyGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.4, 
                    config.size.height * 0.6, 
                    config.size.depth * 0.6
                );
                
                const bodyMaterial = new THREE.MeshPhongMaterial({ 
                    color: config.color,
                    shininess: 30 
                });
                
                const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
                group.add(body);
                
                // Simple cockpit
                const cockpitGeometry = new THREE.SphereGeometry(
                    config.size.width * 0.2, 
                    12, 
                    12, 
                    0, 
                    Math.PI * 2, 
                    0, 
                    Math.PI / 2
                );
                
                const cockpitMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x87CEEB,
                    transparent: true,
                    opacity: 0.7,
                    shininess: 50 
                });
                
                const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
                cockpit.position.z = config.size.depth * 0.15;
                cockpit.rotation.x = -Math.PI / 2;
                group.add(cockpit);
                
                // Simple main rotor
                const rotorGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.05, 
                    config.size.width * 0.01, 
                    config.size.width * 0.8
                );
                
                const rotorMaterial = new THREE.MeshPhongMaterial({ 
                    color: config.rotorColor,
                    shininess: 30 
                });
                
                const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
                rotor.position.y = config.size.height * 0.3;
                rotor.userData.isMainRotor = true;
                group.add(rotor);
                
                // Simple tail rotor
                const tailRotorGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.2, 
                    config.size.width * 0.03, 
                    config.size.width * 0.01
                );
                
                const tailRotor = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
                tailRotor.position.z = -config.size.depth * 0.3;
                tailRotor.userData.isTailRotor = true;
                group.add(tailRotor);
                
                return group;
            };
        }
        
        if (typeof createRescueHelicopter !== 'function') {
            createRescueHelicopter = function(config) {
                // Simple fallback implementation for rescue helicopters
                const group = new THREE.Group();
                
                // Main body - larger
                const bodyGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.6, 
                    config.size.height * 0.7, 
                    config.size.depth * 0.9
                );
                
                const bodyMaterial = new THREE.MeshPhongMaterial({ 
                    color: config.color, // Usually orange for rescue
                    shininess: 30 
                });
                
                const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
                group.add(body);
                
                // Cockpit
                const cockpitGeometry = new THREE.SphereGeometry(
                    config.size.width * 0.3, 
                    16, 
                    16, 
                    0, 
                    Math.PI * 2, 
                    0, 
                    Math.PI / 2
                );
                
                const cockpitMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x87CEEB,
                    transparent: true,
                    opacity: 0.7,
                    shininess: 70 
                });
                
                const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
                cockpit.position.z = config.size.depth * 0.3;
                cockpit.rotation.x = -Math.PI / 2;
                group.add(cockpit);
                
                // Main rotor - 4 blades for rescue
                const rotorGroup = new THREE.Group();
                rotorGroup.position.y = config.size.height * 0.4;
                rotorGroup.userData.isMainRotor = true;
                
                const rotorGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.1, 
                    config.size.width * 0.02, 
                    config.size.width * 1.2
                );
                
                const rotorMaterial = new THREE.MeshPhongMaterial({ 
                    color: config.rotorColor,
                    shininess: 50 
                });
                
                for (let i = 0; i < 4; i++) {
                    const blade = new THREE.Mesh(rotorGeometry, rotorMaterial);
                    blade.rotation.y = (i * Math.PI / 2);
                    blade.position.z = config.size.width * 0.6;
                    rotorGroup.add(blade);
                }
                
                group.add(rotorGroup);
                
                // Tail boom and rotor
                const tailBoomGeometry = new THREE.CylinderGeometry(
                    config.size.width * 0.07, 
                    config.size.width * 0.05, 
                    config.size.depth * 1.1, 
                    8
                );
                
                const tailBoomMaterial = new THREE.MeshPhongMaterial({ 
                    color: config.color,
                    shininess: 30 
                });
                
                const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
                tailBoom.rotation.z = Math.PI / 2;
                tailBoom.position.z = -config.size.depth * 0.7;
                group.add(tailBoom);
                
                // Tail rotor
                const tailRotorGeometry = new THREE.BoxGeometry(
                    config.size.width * 0.4, 
                    config.size.width * 0.05, 
                    config.size.width * 0.02
                );
                
                const tailRotorMaterial = new THREE.MeshPhongMaterial({ 
                    color: config.rotorColor,
                    shininess: 50 
                });
                
                const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
                tailRotor.position.z = -config.size.depth * 1.3;
                tailRotor.userData.isTailRotor = true;
                group.add(tailRotor);
                
                // Searchlight if specified
                if (config.hasSearchlight) {
                    const searchlightGeometry = new THREE.CylinderGeometry(
                        config.size.width * 0.08, 
                        config.size.width * 0.12, 
                        config.size.width * 0.1, 
                        16
                    );
                    
                    const searchlightMaterial = new THREE.MeshPhongMaterial({ 
                        color: 0xFFFF99,
                        emissive: 0xFFFF99,
                        emissiveIntensity: 0.5,
                        shininess: 90
                    });
                    
                    const searchlight = new THREE.Mesh(searchlightGeometry, searchlightMaterial);
                    searchlight.rotation.x = Math.PI / 2;
                    searchlight.position.y = -config.size.height * 0.3;
                    searchlight.position.z = config.size.depth * 0.2;
                    group.add(searchlight);
                }
                
                return group;
            };
        }
        
        const typeFunctions = {
            'beginner': createBeginnerHelicopter,
            'military': createMilitaryHelicopter,
            'stunt': createStuntHelicopter,
            'coaxial': createCoaxialHelicopter,
            'micro': createMicroHelicopter,
            'rescue': createRescueHelicopter,
            'executive': createExecutiveHelicopter
        };
        
        // Check if the requested helicopter type exists in our mapping
        if (!typeFunctions[type]) {
            console.warn(`Helicopter type '${type}' not found, defaulting to beginner type`);
            
            // For RC helicopters page, map the scale type to military (most similar)
            if (type === 'scale') {
                return createMilitaryHelicopter;
            }
            
            return createBeginnerHelicopter; // Default
        }
        
        return typeFunctions[type];
    }
    
    // Export functions for use in the main application
    window.RC_HELICOPTER_MODELS = {
        createHelicopterModel,
        updateHelicoptersAnimation,
        getModelCreationFunction
    };
}); 