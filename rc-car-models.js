// RC Cars 3D Models
document.addEventListener('DOMContentLoaded', () => {
    // Car model definitions with different colors and shapes
    const carModels = [
        {
            id: 1,
            name: 'Turbo Blaze X1',
            color: 0xff4500, // Orange Red
            type: 'sport'
        },
        {
            id: 2,
            name: 'Velocity Pro 4WD',
            color: 0x0088ff, // Blue
            type: 'racing'
        },
        {
            id: 3,
            name: 'Drift King GT',
            color: 0x222222, // Dark Gray
            type: 'drift'
        },
        {
            id: 4,
            name: 'Thunder Bolt Pro',
            color: 0xffcc00, // Yellow
            type: 'racing'
        },
        {
            id: 5,
            name: 'Desert Raider 4x4',
            color: 0x8b4513, // Brown
            type: 'offroad'
        },
        {
            id: 6,
            name: 'Royal Racer Elite',
            color: 0xd4af37, // Gold
            type: 'luxury'
        },
        {
            id: 7,
            name: 'Junior Speedster',
            color: 0x00cc44, // Green
            type: 'beginner'
        },
        {
            id: 8,
            name: 'Phantom X-70',
            color: 0x990099, // Purple
            type: 'racing'
        },
        {
            id: 9,
            name: 'Monster Crawler',
            color: 0x008800, // Dark Green
            type: 'crawler'
        },
        {
            id: 10,
            name: 'Nitro Fury',
            color: 0xcc0000, // Red
            type: 'nitro'
        }
    ];

    // Function to create a 3D model for each car
    const createCarModel = (containerId, carModel) => {
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

        // Create car model based on type
        let car;
        
        switch(carModel.type) {
            case 'racing':
                car = createRacingCar(carModel.color);
                break;
            case 'offroad':
                car = createOffroadCar(carModel.color);
                break;
            case 'drift':
                car = createDriftCar(carModel.color);
                break;
            case 'luxury':
                car = createLuxuryCar(carModel.color);
                break;
            case 'crawler':
                car = createRockCrawler(carModel.color);
                break;
            case 'nitro':
                car = createNitroCar(carModel.color);
                break;
            case 'beginner':
                car = createBeginnerCar(carModel.color);
                break;
            default:
                car = createSportCar(carModel.color);
        }
        
        scene.add(car);
        camera.position.z = 5;

        // Animation function
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Rotate car
            car.rotation.y += 0.01;
            
            // Small floating animation
            car.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            
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

    // Create different car types
    const createSportCar = (color) => {
        const carGroup = new THREE.Group();
        
        // Car body
        const carBodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 3);
        const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.6,
            roughness: 0.3,
        });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carGroup.add(carBody);
        
        // Car top/cockpit
        const carTopGeometry = new THREE.BoxGeometry(1, 0.4, 1.5);
        const carTopMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.5,
            roughness: 0.5,
        });
        const carTop = new THREE.Mesh(carTopGeometry, carTopMaterial);
        carTop.position.y = 0.45;
        carTop.position.z = -0.2;
        carGroup.add(carTop);
        
        // Create wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7,
        });
        
        // Front-left wheel
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.position.set(-0.8, -0.3, 1);
        carGroup.add(wheelFL);
        
        // Front-right wheel
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.position.set(0.8, -0.3, 1);
        carGroup.add(wheelFR);
        
        // Rear-left wheel
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.position.set(-0.8, -0.3, -1);
        carGroup.add(wheelRL);
        
        // Rear-right wheel
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.position.set(0.8, -0.3, -1);
        carGroup.add(wheelRR);
        
        // Spoiler
        const spoilerGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.3);
        const spoilerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.6,
            roughness: 0.3,
        });
        const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        spoiler.position.set(0, 0.4, -1.4);
        carGroup.add(spoiler);
        
        // Spoiler stands
        const standGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        const standMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
        });
        
        const standLeft = new THREE.Mesh(standGeometry, standMaterial);
        standLeft.position.set(-0.5, 0.25, -1.4);
        carGroup.add(standLeft);
        
        const standRight = new THREE.Mesh(standGeometry, standMaterial);
        standRight.position.set(0.5, 0.25, -1.4);
        carGroup.add(standRight);
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightLeft.position.set(-0.5, 0, 1.5);
        carGroup.add(headlightLeft);
        
        const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightRight.position.set(0.5, 0, 1.5);
        carGroup.add(headlightRight);
        
        return carGroup;
    };

    const createRacingCar = (color) => {
        const carGroup = new THREE.Group();
        
        // Car body - more streamlined and lower
        const carBodyGeometry = new THREE.BoxGeometry(1.5, 0.4, 3);
        const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.2,
        });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carGroup.add(carBody);
        
        // Car top/cockpit - more aerodynamic
        const carTopGeometry = new THREE.BoxGeometry(1, 0.3, 1.2);
        const carTopMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.3,
        });
        const carTop = new THREE.Mesh(carTopGeometry, carTopMaterial);
        carTop.position.y = 0.35;
        carTop.position.z = -0.2;
        carGroup.add(carTop);
        
        // Create racing wheels - larger and wider
        const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.6,
            roughness: 0.5,
        });
        
        // Add wheels
        const wheelPositions = [
            [-0.8, -0.3, 1], // Front-left
            [0.8, -0.3, 1],  // Front-right
            [-0.8, -0.3, -1], // Rear-left
            [0.8, -0.3, -1]  // Rear-right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            carGroup.add(wheel);
        });
        
        // Large racing spoiler
        const spoilerGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.5);
        const spoilerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.3,
        });
        const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        spoiler.position.set(0, 0.6, -1.4);
        carGroup.add(spoiler);
        
        // Taller spoiler stands
        const standGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
        const standMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
        });
        
        const standPositions = [
            [-0.7, 0.3, -1.4],
            [0.7, 0.3, -1.4]
        ];
        
        standPositions.forEach(position => {
            const stand = new THREE.Mesh(standGeometry, standMaterial);
            stand.position.set(...position);
            carGroup.add(stand);
        });
        
        // Add racing stripes
        const stripeGeometry = new THREE.BoxGeometry(0.2, 0.01, 2.5);
        const stripeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
        });
        
        const leftStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        leftStripe.position.set(-0.3, 0.26, 0);
        carGroup.add(leftStripe);
        
        const rightStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        rightStripe.position.set(0.3, 0.26, 0);
        carGroup.add(rightStripe);
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const headlightPositions = [
            [-0.5, 0, 1.5],
            [0.5, 0, 1.5]
        ];
        
        headlightPositions.forEach(position => {
            const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
            headlight.position.set(...position);
            carGroup.add(headlight);
        });
        
        return carGroup;
    };

    const createOffroadCar = (color) => {
        const carGroup = new THREE.Group();
        
        // Truck-like body - higher off the ground
        const carBodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 2.8);
        const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.5,
            roughness: 0.5,
        });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carBody.position.y = 0.2;
        carGroup.add(carBody);
        
        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(1.6, 0.5, 1.2);
        const cabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.4,
            roughness: 0.6,
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 0.7, 0.1);
        carGroup.add(cabin);
        
        // Large off-road wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.4,
            roughness: 0.8,
        });
        
        // Add wheels
        const wheelPositions = [
            [-0.9, -0.1, 1], // Front-left
            [0.9, -0.1, 1],  // Front-right
            [-0.9, -0.1, -1], // Rear-left
            [0.9, -0.1, -1]  // Rear-right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            carGroup.add(wheel);
        });
        
        // Roof rack
        const rackGeometry = new THREE.BoxGeometry(1.4, 0.1, 1);
        const rackMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
        });
        const rack = new THREE.Mesh(rackGeometry, rackMaterial);
        rack.position.set(0, 1.0, 0.1);
        carGroup.add(rack);
        
        // Front bumper
        const bumperGeometry = new THREE.BoxGeometry(1.6, 0.2, 0.3);
        const bumperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.6,
            roughness: 0.5,
        });
        const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        bumper.position.set(0, 0.2, 1.5);
        carGroup.add(bumper);
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const headlightPositions = [
            [-0.6, 0.2, 1.6],
            [0.6, 0.2, 1.6]
        ];
        
        headlightPositions.forEach(position => {
            const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
            headlight.position.set(...position);
            carGroup.add(headlight);
        });
        
        return carGroup;
    };

    const createDriftCar = (color) => {
        // Implementation for drift car model
        const carGroup = new THREE.Group();
        
        // Lower, wider body
        const carBodyGeometry = new THREE.BoxGeometry(1.8, 0.4, 3);
        const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.3,
        });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carGroup.add(carBody);
        
        // Car top
        const carTopGeometry = new THREE.BoxGeometry(1.6, 0.4, 1.2);
        const carTopMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.4,
        });
        const carTop = new THREE.Mesh(carTopGeometry, carTopMaterial);
        carTop.position.y = 0.4;
        carTop.position.z = -0.4;
        carGroup.add(carTop);
        
        // Wide drift tires - angled for drifting
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7,
        });
        
        // Front wheels - turned for drift
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.rotation.x = Math.PI / 12; // Slight angle
        wheelFL.position.set(-0.9, -0.3, 1);
        carGroup.add(wheelFL);
        
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.rotation.x = Math.PI / 12; // Slight angle
        wheelFR.position.set(0.9, -0.3, 1);
        carGroup.add(wheelFR);
        
        // Rear wheels
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.position.set(-0.9, -0.3, -1);
        carGroup.add(wheelRL);
        
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.position.set(0.9, -0.3, -1);
        carGroup.add(wheelRR);
        
        // Large rear wing
        const wingGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.5);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.6,
            roughness: 0.4,
        });
        const wing = new THREE.Mesh(wingGeometry, wingMaterial);
        wing.position.set(0, 0.7, -1.4);
        carGroup.add(wing);
        
        // Wing stands
        const standGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        
        const standLeft = new THREE.Mesh(standGeometry, wingMaterial);
        standLeft.position.set(-0.8, 0.45, -1.4);
        carGroup.add(standLeft);
        
        const standRight = new THREE.Mesh(standGeometry, wingMaterial);
        standRight.position.set(0.8, 0.45, -1.4);
        carGroup.add(standRight);
        
        // Side skirts
        const skirtGeometry = new THREE.BoxGeometry(0.1, 0.15, 2);
        const skirtMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
        });
        
        const leftSkirt = new THREE.Mesh(skirtGeometry, skirtMaterial);
        leftSkirt.position.set(-0.9, -0.15, 0);
        carGroup.add(leftSkirt);
        
        const rightSkirt = new THREE.Mesh(skirtGeometry, skirtMaterial);
        rightSkirt.position.set(0.9, -0.15, 0);
        carGroup.add(rightSkirt);
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightLeft.position.set(-0.6, 0, 1.5);
        carGroup.add(headlightLeft);
        
        const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightRight.position.set(0.6, 0, 1.5);
        carGroup.add(headlightRight);
        
        return carGroup;
    };

    const createLuxuryCar = (color) => {
        // Implementation for luxury car model
        const carGroup = new THREE.Group();
        
        // Sleek body
        const carBodyGeometry = new THREE.BoxGeometry(1.6, 0.5, 3.2);
        const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.9,
            roughness: 0.1,
        });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carGroup.add(carBody);
        
        // Elegant top
        const carTopGeometry = new THREE.BoxGeometry(1.4, 0.4, 2);
        const carTopMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2,
        });
        const carTop = new THREE.Mesh(carTopGeometry, carTopMaterial);
        carTop.position.y = 0.45;
        carTop.position.z = -0.2;
        carGroup.add(carTop);
        
        // Luxury wheels with chrome rims
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.5,
            roughness: 0.7,
        });
        
        const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.21, 16);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc, 
            metalness: 1.0,
            roughness: 0.1,
        });
        
        // Add wheels with rims
        const wheelPositions = [
            [-0.8, -0.3, 1.2], // Front-left
            [0.8, -0.3, 1.2],  // Front-right
            [-0.8, -0.3, -1], // Rear-left
            [0.8, -0.3, -1]  // Rear-right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            carGroup.add(wheel);
            
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI / 2;
            rim.position.set(...position);
            carGroup.add(rim);
        });
        
        // Chrome grille
        const grilleGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.1);
        const grilleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 1.0,
            roughness: 0.1,
        });
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.set(0, 0, 1.6);
        carGroup.add(grille);
        
        // LED headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffcc,
            emissiveIntensity: 0.7
        });
        
        const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightLeft.position.set(-0.5, 0, 1.6);
        carGroup.add(headlightLeft);
        
        const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightRight.position.set(0.5, 0, 1.6);
        carGroup.add(headlightRight);
        
        // Chrome trim
        const trimGeometry = new THREE.BoxGeometry(1.62, 0.05, 3.22);
        const trimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 1.0,
            roughness: 0.1,
        });
        const trim = new THREE.Mesh(trimGeometry, trimMaterial);
        trim.position.set(0, -0.23, 0);
        carGroup.add(trim);
        
        return carGroup;
    };

    const createRockCrawler = (color) => {
        // Add more detailed implementations for these models as needed
        const offroadCar = createOffroadCar(color);
        offroadCar.scale.set(1.2, 1.2, 1);
        offroadCar.position.y = 0.2;
        return offroadCar;
    };

    const createNitroCar = (color) => {
        const racingCar = createRacingCar(color);
        
        // Add nitro tanks
        const tankGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
        const tankMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2,
        });
        
        const leftTank = new THREE.Mesh(tankGeometry, tankMaterial);
        leftTank.rotation.z = Math.PI / 2;
        leftTank.position.set(-0.4, 0.1, -1.2);
        racingCar.add(leftTank);
        
        const rightTank = new THREE.Mesh(tankGeometry, tankMaterial);
        rightTank.rotation.z = Math.PI / 2;
        rightTank.position.set(0.4, 0.1, -1.2);
        racingCar.add(rightTank);
        
        return racingCar;
    };

    const createBeginnerCar = (color) => {
        const sportCar = createSportCar(color);
        sportCar.scale.set(0.8, 0.8, 0.8);
        return sportCar;
    };

    // Initialize all 3D models
    carModels.forEach(car => {
        createCarModel(`car-model-${car.id}`, car);
    });
}); 