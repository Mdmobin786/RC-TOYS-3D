// RC Boats 3D Models
document.addEventListener('DOMContentLoaded', () => {
    // Boat model definitions with different colors and shapes
    const boatModels = [
        {
            id: 1,
            name: 'Hydro Thunder Pro',
            color: 0xff3333, // Red
            type: 'speed'
        },
        {
            id: 2,
            name: 'Royal Clipper Yacht',
            color: 0xffffff, // White
            type: 'sail'
        },
        {
            id: 3,
            name: 'Deep Diver Submarine',
            color: 0xffcc00, // Yellow
            type: 'submarine'
        },
        {
            id: 4,
            name: 'Wave Ripper Turbo',
            color: 0x33ccff, // Light Blue
            type: 'speed'
        },
        {
            id: 5,
            name: 'Harbor Master Trawler',
            color: 0x995533, // Brown
            type: 'fishing'
        },
        {
            id: 6,
            name: 'Aqua Dart Mini',
            color: 0x00cc99, // Teal
            type: 'speed'
        },
        {
            id: 7,
            name: 'Velocity X Hydroplane',
            color: 0xff6600, // Orange
            type: 'speed'
        },
        {
            id: 8,
            name: 'Explorer ROV',
            color: 0x666666, // Dark Gray
            type: 'submarine'
        },
        {
            id: 9,
            name: 'Wind Master Catamaran',
            color: 0x3366cc, // Blue
            type: 'sail'
        },
        {
            id: 10,
            name: 'Royal Yacht Cruiser',
            color: 0xd4af37, // Gold
            type: 'fishing'
        }
    ];

    // Create 3D models for each boat
    boatModels.forEach(boat => {
        createBoatModel(`boat-model-${boat.id}`, boat);
    });

    // Function to create a 3D model for each boat
    function createBoatModel(containerId, boatModel) {
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

        // Create boat model based on type
        let boat;
        
        switch(boatModel.type) {
            case 'sail':
                boat = createSailboat(boatModel.color);
                break;
            case 'submarine':
                boat = createSubmarine(boatModel.color);
                break;
            case 'fishing':
                boat = createFishingBoat(boatModel.color);
                break;
            case 'speed':
            default:
                boat = createSpeedBoat(boatModel.color);
        }
        
        scene.add(boat);
        camera.position.z = 5;

        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate boat
            boat.rotation.y += 0.01;
            
            // Small floating animation
            boat.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
    }

    // Create different boat types
    function createSpeedBoat(color) {
        const boatGroup = new THREE.Group();
        
        // Hull
        const hullGeometry = new THREE.BoxGeometry(0.8, 0.4, 2.5);
        const hullMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.6,
            roughness: 0.4,
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.position.y = 0;
        boatGroup.add(hull);
        
        // Cockpit
        const cockpitGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.8);
        const cockpitMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.5,
            roughness: 0.5,
        });
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.set(0, 0.3, 0.2);
        boatGroup.add(cockpit);
        
        // Windshield
        const windshieldGeometry = new THREE.BoxGeometry(0.55, 0.25, 0.1);
        const windshieldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x88ccff,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(0, 0.35, 0.6);
        windshield.rotation.x = Math.PI / 6; // Angle the windshield
        boatGroup.add(windshield);
        
        // Add motor at the back
        const motorGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.4);
        const motorMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.3,
        });
        const motor = new THREE.Mesh(motorGeometry, motorMaterial);
        motor.position.set(0, 0.15, -1.1);
        boatGroup.add(motor);
        
        // Add propeller
        const propellerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8);
        const propellerMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2,
        });
        const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
        propeller.rotation.x = Math.PI / 2; // Make propeller horizontal
        propeller.position.set(0, 0, -1.3);
        boatGroup.add(propeller);
        
        return boatGroup;
    }

    function createSailboat(color) {
        const boatGroup = new THREE.Group();
        
        // Hull
        const hullGeometry = new THREE.BoxGeometry(0.7, 0.4, 2.2);
        const hullMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.4,
            roughness: 0.6,
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.position.y = 0;
        boatGroup.add(hull);
        
        // Mast
        const mastGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
        const mastMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x885533, // Wood color
            metalness: 0.3,
            roughness: 0.7,
        });
        const mast = new THREE.Mesh(mastGeometry, mastMaterial);
        mast.position.set(0, 1, 0.3);
        boatGroup.add(mast);
        
        // Main sail
        const sailGeometry = new THREE.PlaneGeometry(0.8, 1, 1, 1);
        const sailMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide,
            metalness: 0.1,
            roughness: 0.9,
        });
        const sail = new THREE.Mesh(sailGeometry, sailMaterial);
        sail.position.set(0.2, 0.8, 0.3);
        sail.rotation.y = Math.PI / 6;
        boatGroup.add(sail);
        
        return boatGroup;
    }

    function createSubmarine(color) {
        const boatGroup = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 16, 1, false);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.3,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        boatGroup.add(body);
        
        // Conning tower
        const towerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
        const towerMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.7,
            roughness: 0.3,
        });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(0, 0.45, 0);
        boatGroup.add(tower);
        
        // Periscope
        const periscopeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
        const periscopeMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8, 
            roughness: 0.2,
        });
        const periscope = new THREE.Mesh(periscopeGeometry, periscopeMaterial);
        periscope.position.set(0, 0.8, 0);
        boatGroup.add(periscope);
        
        // Front and rear fins
        const finGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.3);
        const finMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.6,
            roughness: 0.4,
        });
        
        const topFin = new THREE.Mesh(finGeometry, finMaterial);
        topFin.position.set(0, 0, 0);
        topFin.rotation.x = Math.PI / 2;
        boatGroup.add(topFin);
        
        return boatGroup;
    }

    function createFishingBoat(color) {
        const boatGroup = new THREE.Group();
        
        // Hull
        const hullGeometry = new THREE.BoxGeometry(1, 0.4, 2.2);
        const hullMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.5,
            roughness: 0.5,
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.position.y = 0;
        boatGroup.add(hull);
        
        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.8);
        const cabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.4,
            roughness: 0.6,
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 0.4, 0.4);
        boatGroup.add(cabin);
        
        // Fishing tower
        const towerGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        const towerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x999999,
            metalness: 0.7,
            roughness: 0.3,
        });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(0, 0.7, -0.5);
        boatGroup.add(tower);
        
        // Fishing line
        const lineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0.3, -0.9);
        line.rotation.x = Math.PI / 4;
        boatGroup.add(line);
        
        return boatGroup;
    }
}); 