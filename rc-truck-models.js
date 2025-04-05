// RC Trucks 3D Models
document.addEventListener('DOMContentLoaded', () => {
    // Truck model definitions with different colors and shapes
    const truckModels = [
        {
            id: 1,
            name: 'Terrain Crusher 4x4',
            color: 0xff4500, // Orange Red
            type: 'monster'
        },
        {
            id: 2,
            name: 'Mountain Climber Pro',
            color: 0x555555, // Dark Gray
            type: 'crawler'
        },
        {
            id: 3,
            name: 'Thunder Rumbler',
            color: 0x3366ff, // Blue
            type: 'monster'
        },
        {
            id: 4,
            name: 'Highway Commander',
            color: 0x990000, // Dark Red
            type: 'semi'
        },
        {
            id: 5,
            name: 'Mud Warrior',
            color: 0x006600, // Green
            type: 'monster'
        },
        {
            id: 6,
            name: 'Power Excavator',
            color: 0xffcc00, // Yellow
            type: 'construction'
        },
        {
            id: 7,
            name: 'Junior Monster',
            color: 0x00cccc, // Teal
            type: 'monster'
        },
        {
            id: 8,
            name: 'Extreme Crawler 6x6',
            color: 0x333333, // Dark Gray
            type: 'crawler'
        },
        {
            id: 9,
            name: 'Dump Titan',
            color: 0xcc6600, // Brown
            type: 'construction'
        },
        {
            id: 10,
            name: 'Royal Hauler',
            color: 0xd4af37, // Gold
            type: 'semi'
        }
    ];

    // Function to create a 3D model for each truck
    const createTruckModel = (containerId, truckModel) => {
        // Create scene, camera, renderer
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, -5, 5);
        scene.add(pointLight);

        // Create truck model based on type
        let truck;
        
        switch(truckModel.type) {
            case 'crawler':
                truck = createRockCrawler(truckModel.color);
                break;
            case 'semi':
                truck = createSemiTruck(truckModel.color);
                break;
            case 'construction':
                truck = createConstructionTruck(truckModel.color);
                break;
            case 'monster':
            default:
                truck = createMonsterTruck(truckModel.color);
        }
        
        scene.add(truck);
        camera.position.z = 5;

        // Animation function
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Rotate truck
            truck.rotation.y += 0.01;
            
            // Small floating animation
            truck.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            
            renderer.render(scene, camera);
        };

        // Handle window resize
        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
    };

    // Create different truck types
    const createMonsterTruck = (color) => {
        const truckGroup = new THREE.Group();
        
        // Truck body - higher with monster truck shape
        const bodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 2.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.6,
            roughness: 0.4,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.7;
        truckGroup.add(body);
        
        // Cab
        const cabGeometry = new THREE.BoxGeometry(1.6, 0.8, 1);
        const cabMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.5,
            roughness: 0.5,
        });
        const cab = new THREE.Mesh(cabGeometry, cabMaterial);
        cab.position.set(0, 1, 0.7);
        truckGroup.add(cab);
        
        // Create giant monster truck wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7,
        });
        
        // Add wheels
        const wheelPositions = [
            [-0.9, 0, 0.8], // Front-left
            [0.9, 0, 0.8],  // Front-right
            [-0.9, 0, -0.8], // Rear-left
            [0.9, 0, -0.8]  // Rear-right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            truckGroup.add(wheel);
        });
        
        // Wheel hubs
        const hubGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.52, 8);
        const hubMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2,
        });
        
        wheelPositions.forEach(position => {
            const hub = new THREE.Mesh(hubGeometry, hubMaterial);
            hub.rotation.z = Math.PI / 2;
            hub.position.set(...position);
            truckGroup.add(hub);
        });
        
        // Lift kit/suspension
        wheelPositions.forEach(position => {
            const shockGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
            const shockMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xcccccc,
                metalness: 0.9,
                roughness: 0.2,
            });
            
            const shock = new THREE.Mesh(shockGeometry, shockMaterial);
            shock.position.set(position[0], position[1] + 0.35, position[2]);
            truckGroup.add(shock);
        });
        
        // Roll cage
        const cageGeometry = new THREE.TorusGeometry(0.9, 0.05, 8, 12, Math.PI);
        const cageMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.7,
            roughness: 0.3,
        });
        
        const cage = new THREE.Mesh(cageGeometry, cageMaterial);
        cage.rotation.x = Math.PI / 2;
        cage.position.set(0, 1.5, 0);
        truckGroup.add(cage);
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const headlightPositions = [
            [-0.6, 1, 1.3],
            [0.6, 1, 1.3]
        ];
        
        headlightPositions.forEach(position => {
            const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
            headlight.position.set(...position);
            truckGroup.add(headlight);
        });
        
        // Roof lights
        const roofLightGeometry = new THREE.BoxGeometry(1.4, 0.1, 0.2);
        const roofLightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            emissive: 0xffffcc,
            emissiveIntensity: 0.2
        });
        
        const roofLight = new THREE.Mesh(roofLightGeometry, roofLightMaterial);
        roofLight.position.set(0, 1.5, 0.5);
        truckGroup.add(roofLight);
        
        return truckGroup;
    };

    const createRockCrawler = (color) => {
        const truckGroup = new THREE.Group();
        
        // Lower, wider body for rock crawlers
        const bodyGeometry = new THREE.BoxGeometry(1.6, 0.4, 2.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.5,
            roughness: 0.5,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        truckGroup.add(body);
        
        // Simple cab
        const cabGeometry = new THREE.BoxGeometry(1.4, 0.6, 0.8);
        const cabMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.4,
            roughness: 0.6,
        });
        const cab = new THREE.Mesh(cabGeometry, cabMaterial);
        cab.position.set(0, 0.8, 0.5);
        truckGroup.add(cab);
        
        // Rock crawler wheels - larger with aggressive tread
        const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.4,
            roughness: 0.8,
        });
        
        // Add wheels
        const wheelPositions = [
            [-0.9, 0, 0.8], // Front-left
            [0.9, 0, 0.8],  // Front-right
            [-0.9, 0, -0.8], // Rear-left
            [0.9, 0, -0.8]  // Rear-right
        ];
        
        // For the 6x6 model, add middle wheels if truck id is 8
        if (truckModels.find(m => m.id === 8 && m.type === 'crawler')) {
            wheelPositions.push(
                [-0.9, 0, 0], // Middle-left
                [0.9, 0, 0]   // Middle-right
            );
        }
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            truckGroup.add(wheel);
            
            // Add aggressive tread pattern with small cubes
            for (let i = 0; i < 8; i++) {
                const treadGeometry = new THREE.BoxGeometry(0.1, 0.62, 0.1);
                const treadMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x222222, 
                });
                const tread = new THREE.Mesh(treadGeometry, treadMaterial);
                const angle = (i / 8) * Math.PI * 2;
                tread.position.set(
                    position[0],
                    position[1] + Math.sin(angle) * 0.6,
                    position[2] + Math.cos(angle) * 0.6
                );
                truckGroup.add(tread);
            }
        });
        
        // Shocks/suspension
        wheelPositions.forEach(position => {
            const shockGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
            const shockMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa,
                metalness: 0.7,
                roughness: 0.3,
            });
            
            const shock = new THREE.Mesh(shockGeometry, shockMaterial);
            shock.position.set(position[0], position[1] + 0.25, position[2]);
            truckGroup.add(shock);
        });
        
        // Rock sliders (side steps)
        const sliderGeometry = new THREE.BoxGeometry(0.1, 0.1, 2);
        const sliderMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.6,
            roughness: 0.4,
        });
        
        const leftSlider = new THREE.Mesh(sliderGeometry, sliderMaterial);
        leftSlider.position.set(-0.8, 0.3, 0);
        truckGroup.add(leftSlider);
        
        const rightSlider = new THREE.Mesh(sliderGeometry, sliderMaterial);
        rightSlider.position.set(0.8, 0.3, 0);
        truckGroup.add(rightSlider);
        
        // Front bumper with winch
        const bumperGeometry = new THREE.BoxGeometry(1.4, 0.2, 0.3);
        const bumperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.6,
            roughness: 0.4,
        });
        
        const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        bumper.position.set(0, 0.3, 1.1);
        truckGroup.add(bumper);
        
        // Winch
        const winchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
        const winchMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            metalness: 0.7,
            roughness: 0.3,
        });
        
        const winch = new THREE.Mesh(winchGeometry, winchMaterial);
        winch.rotation.x = Math.PI / 2;
        winch.position.set(0, 0.4, 1.2);
        truckGroup.add(winch);
        
        return truckGroup;
    };

    const createSemiTruck = (color) => {
        const truckGroup = new THREE.Group();
        
        // Cab
        const cabGeometry = new THREE.BoxGeometry(1.4, 1.2, 1.8);
        const cabMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.3,
        });
        const cab = new THREE.Mesh(cabGeometry, cabMaterial);
        cab.position.set(0, 0.9, 0.4);
        truckGroup.add(cab);
        
        // Windshield
        const windshieldGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.1);
        const windshieldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x88ccff,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.6
        });
        
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(0, 1.1, 1.2);
        windshield.rotation.x = Math.PI / 6; // Angled windshield
        truckGroup.add(windshield);
        
        // Trailer connection
        const trailerConnectGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.5);
        const trailerConnectMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.6,
            roughness: 0.4,
        });
        
        const trailerConnect = new THREE.Mesh(trailerConnectGeometry, trailerConnectMaterial);
        trailerConnect.position.set(0, 0.6, -0.5);
        truckGroup.add(trailerConnect);
        
        // Simple trailer
        const trailerGeometry = new THREE.BoxGeometry(1.4, 1, 3);
        const trailerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.5,
            roughness: 0.5,
        });
        
        const trailer = new THREE.Mesh(trailerGeometry, trailerMaterial);
        trailer.position.set(0, 0.9, -2);
        truckGroup.add(trailer);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7,
        });
        
        // Cab wheels
        const cabWheelPositions = [
            [-0.8, 0.4, 0.8], // Front-left
            [0.8, 0.4, 0.8],  // Front-right
            [-0.8, 0.4, 0], // Rear-left
            [0.8, 0.4, 0]  // Rear-right
        ];
        
        cabWheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            truckGroup.add(wheel);
        });
        
        // Trailer wheels (dual wheels)
        const trailerWheelPositions = [
            [-0.8, 0.4, -1], // Trailer-left-front
            [0.8, 0.4, -1],  // Trailer-right-front
            [-0.8, 0.4, -2], // Trailer-left-middle
            [0.8, 0.4, -2],  // Trailer-right-middle
            [-0.8, 0.4, -3], // Trailer-left-rear
            [0.8, 0.4, -3]   // Trailer-right-rear
        ];
        
        trailerWheelPositions.forEach(position => {
            // Inner wheel
            const innerWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            innerWheel.rotation.z = Math.PI / 2;
            innerWheel.position.set(position[0] - 0.05, position[1], position[2]);
            truckGroup.add(innerWheel);
            
            // Outer wheel
            const outerWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            outerWheel.rotation.z = Math.PI / 2;
            outerWheel.position.set(position[0] + (position[0] < 0 ? -0.3 : 0.3), position[1], position[2]);
            truckGroup.add(outerWheel);
        });
        
        // Exhaust stacks
        const exhaustGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const exhaustMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            metalness: 0.7,
            roughness: 0.3,
        });
        
        const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        leftExhaust.position.set(-0.5, 1.6, 0.3);
        truckGroup.add(leftExhaust);
        
        const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        rightExhaust.position.set(0.5, 1.6, 0.3);
        truckGroup.add(rightExhaust);
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-0.5, 0.7, 1.3);
        truckGroup.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(0.5, 0.7, 1.3);
        truckGroup.add(rightHeadlight);
        
        // If this is the Royal Hauler, add gold accents
        if (color === 0xd4af37) {
            // Gold trim
            const trimGeometry = new THREE.BoxGeometry(1.42, 0.1, 1.82);
            const trimMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xd4af37,
                metalness: 1.0,
                roughness: 0.1,
            });
            
            const trim = new THREE.Mesh(trimGeometry, trimMaterial);
            trim.position.set(0, 0.4, 0.4);
            truckGroup.add(trim);
            
            // Gold roof ornament
            const ornamentGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
            const ornament = new THREE.Mesh(ornamentGeometry, trimMaterial);
            ornament.position.set(0, 1.6, 0.4);
            ornament.rotation.x = Math.PI / 2;
            truckGroup.add(ornament);
        }
        
        return truckGroup;
    };

    const createConstructionTruck = (color) => {
        const truckGroup = new THREE.Group();
        
        // Truck base/chassis
        const baseGeometry = new THREE.BoxGeometry(1.6, 0.4, 3);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.5,
            roughness: 0.5,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.5;
        truckGroup.add(base);
        
        // Cab
        const cabGeometry = new THREE.BoxGeometry(1.4, 1, 1);
        const cabMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.4,
            roughness: 0.6,
        });
        const cab = new THREE.Mesh(cabGeometry, cabMaterial);
        cab.position.set(0, 1.1, 1);
        truckGroup.add(cab);
        
        // Construction feature based on truck type (excavator or dump truck)
        if (color === 0xffcc00) {
            // Excavator
            // Arm base (turntable)
            const turntableGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
            const turntableMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                metalness: 0.6,
                roughness: 0.4,
            });
            
            const turntable = new THREE.Mesh(turntableGeometry, turntableMaterial);
            turntable.position.set(0, 0.85, -0.5);
            truckGroup.add(turntable);
            
            // Arm boom
            const boomGeometry = new THREE.BoxGeometry(0.3, 0.2, 1.5);
            const boomMaterial = new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.6,
                roughness: 0.4,
            });
            
            const boom = new THREE.Mesh(boomGeometry, boomMaterial);
            boom.position.set(0, 1.2, -1.1);
            boom.rotation.x = -Math.PI / 6; // Angled up
            truckGroup.add(boom);
            
            // Arm stick
            const stickGeometry = new THREE.BoxGeometry(0.2, 0.15, 1.2);
            const stick = new THREE.Mesh(stickGeometry, boomMaterial);
            stick.position.set(0, 1.6, -1.8);
            stick.rotation.x = Math.PI / 3; // Angled down
            truckGroup.add(stick);
            
            // Bucket
            const bucketGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.5);
            const bucketMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x666666,
                metalness: 0.7,
                roughness: 0.3,
            });
            
            const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
            bucket.position.set(0, 1.3, -2.2);
            bucket.rotation.x = Math.PI / 4; // Bucket angle
            truckGroup.add(bucket);
            
            // Bucket teeth
            const teethGeometry = new THREE.BoxGeometry(0.35, 0.05, 0.1);
            const teethMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xcccccc,
                metalness: 0.8,
                roughness: 0.2,
            });
            
            const teeth = new THREE.Mesh(teethGeometry, teethMaterial);
            teeth.position.set(0, 1.15, -2.4);
            truckGroup.add(teeth);
        } else {
            // Dump truck
            const bedGeometry = new THREE.BoxGeometry(1.4, 0.8, 1.5);
            const bedMaterial = new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.5,
                roughness: 0.5,
            });
            
            const bed = new THREE.Mesh(bedGeometry, bedMaterial);
            bed.position.set(0, 1, -0.5);
            bed.rotation.x = Math.PI / 12; // Slightly tilted
            truckGroup.add(bed);
            
            // Hydraulic lift
            const liftGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
            const liftMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x666666,
                metalness: 0.7,
                roughness: 0.3,
            });
            
            const lift = new THREE.Mesh(liftGeometry, liftMaterial);
            lift.position.set(0, 0.8, -1.2);
            lift.rotation.x = -Math.PI / 6; // Angled to support bed
            truckGroup.add(lift);
        }
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7,
        });
        
        // Add wheels
        const wheelPositions = [
            [-0.8, 0.4, 1.2], // Front-left
            [0.8, 0.4, 1.2],  // Front-right
            [-0.8, 0.4, 0], // Middle-left
            [0.8, 0.4, 0],  // Middle-right
            [-0.8, 0.4, -1.2], // Rear-left
            [0.8, 0.4, -1.2]  // Rear-right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            truckGroup.add(wheel);
        });
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-0.5, 0.7, 1.5);
        truckGroup.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(0.5, 0.7, 1.5);
        truckGroup.add(rightHeadlight);
        
        // Warning beacon
        const beaconGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const beaconMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff9900,
            emissive: 0xff6600,
            emissiveIntensity: 0.5
        });
        
        const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
        beacon.position.set(0, 1.7, 1);
        truckGroup.add(beacon);
        
        return truckGroup;
    };

    // Initialize all 3D models
    truckModels.forEach(truck => {
        createTruckModel(`truck-model-${truck.id}`, truck);
    });
});