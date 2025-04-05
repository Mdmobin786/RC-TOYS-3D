// RC Planes 3D Models
document.addEventListener('DOMContentLoaded', () => {
    // Plane model definitions with different colors and shapes
    const planeModels = [
        {
            id: 1,
            name: 'Sky Trainer Pro',
            color: 0x4CAF50, // Green
            type: 'trainer'
        },
        {
            id: 2,
            name: 'Eagle Sport 3D',
            color: 0xFF9800, // Orange
            type: 'sport'
        },
        {
            id: 3,
            name: 'Spitfire Mk IX',
            color: 0x795548, // Brown
            type: 'warbird'
        },
        {
            id: 4,
            name: 'Thermal Soarer XL',
            color: 0x00BCD4, // Cyan
            type: 'glider'
        },
        {
            id: 5,
            name: 'Aerobatic Master',
            color: 0x9C27B0, // Purple
            type: 'stunt'
        },
        {
            id: 6,
            name: 'Mini Cub Trainer',
            color: 0xFFEB3B, // Yellow
            type: 'trainer'
        },
        {
            id: 7,
            name: 'P-51 Mustang Elite',
            color: 0xF44336, // Red
            type: 'warbird'
        },
        {
            id: 8,
            name: 'Delta Racer Pro',
            color: 0x2196F3, // Blue
            type: 'sport'
        },
        {
            id: 9,
            name: 'Alpine Soarer',
            color: 0xE0E0E0, // Light Grey
            type: 'glider'
        },
        {
            id: 10,
            name: 'Extreme Acrobat',
            color: 0x673AB7, // Deep Purple
            type: 'stunt'
        }
    ];

    // Create 3D models for each plane
    planeModels.forEach(plane => {
        createPlaneModel(`plane-model-${plane.id}`, plane);
    });

    // Function to create a 3D model for each plane
    function createPlaneModel(containerId, planeModel) {
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

        // Create plane model based on type
        let plane;
        
        switch(planeModel.type) {
            case 'trainer':
                plane = createTrainerPlane(planeModel.color);
                break;
            case 'sport':
                plane = createSportPlane(planeModel.color);
                break;
            case 'warbird':
                plane = createWarbirdPlane(planeModel.color);
                break;
            case 'glider':
                plane = createGliderPlane(planeModel.color);
                break;
            case 'stunt':
                plane = createStuntPlane(planeModel.color);
                break;
            default:
                plane = createBasicPlane(planeModel.color);
        }
        
        scene.add(plane);
        camera.position.z = 5;

        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate plane
            plane.rotation.y += 0.01;
            
            // Flying animation
            plane.position.y = Math.sin(Date.now() * 0.001) * 0.2;
            plane.rotation.z = Math.sin(Date.now() * 0.0015) * 0.05;
            
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

    // Create different plane types
    function createBasicPlane(color) {
        const planeGroup = new THREE.Group();
        
        // Fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
        const fuselageMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.3,
            roughness: 0.7,
        });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.rotation.z = Math.PI / 2;
        planeGroup.add(fuselage);
        
        // Main wing
        const wingGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.4);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.1,
            roughness: 0.8,
        });
        const wing = new THREE.Mesh(wingGeometry, wingMaterial);
        wing.position.set(0, 0, 0);
        planeGroup.add(wing);
        
        // Tail wing
        const tailWingGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.2);
        const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
        tailWing.position.set(0, 0, -0.9);
        planeGroup.add(tailWing);
        
        // Vertical stabilizer
        const stabilizerGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.3);
        const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
        stabilizer.position.set(0, 0.15, -0.9);
        planeGroup.add(stabilizer);
        
        // Propeller
        const propellerGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.05);
        const propellerMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.6,
            roughness: 0.4,
        });
        const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
        propeller.position.set(0, 0, 1.05);
        planeGroup.add(propeller);
        
        return planeGroup;
    }

    function createTrainerPlane(color) {
        const planeGroup = createBasicPlane(color);
        
        // Additional features for trainer planes - wider wings and stable design
        const widerWingGeometry = new THREE.BoxGeometry(2, 0.05, 0.5);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.1,
            roughness: 0.8,
        });
        
        // Replace the main wing with a wider one
        planeGroup.children[1].geometry.dispose();
        planeGroup.children[1].geometry = widerWingGeometry;
        
        // Add landing gear
        const gearGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
        const gearMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2,
        });
        
        const leftGear = new THREE.Mesh(gearGeometry, gearMaterial);
        leftGear.position.set(-0.5, -0.2, 0.3);
        leftGear.rotation.x = Math.PI / 2;
        
        const rightGear = new THREE.Mesh(gearGeometry, gearMaterial);
        rightGear.position.set(0.5, -0.2, 0.3);
        rightGear.rotation.x = Math.PI / 2;
        
        planeGroup.add(leftGear);
        planeGroup.add(rightGear);
        
        return planeGroup;
    }

    function createSportPlane(color) {
        const planeGroup = createBasicPlane(color);
        
        // Sleeker fuselage for speed
        planeGroup.children[0].geometry.dispose();
        const sportFuselageGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2.2, 16);
        planeGroup.children[0].geometry = sportFuselageGeometry;
        
        // Swept-back wings
        const wingGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.5);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.3,
            roughness: 0.6,
        });
        
        // Replace main wing
        planeGroup.children[1].geometry.dispose();
        planeGroup.children[1].geometry = wingGeometry;
        planeGroup.children[1].rotation.y = Math.PI * 0.05; // Swept back angle
        
        // Add winglets at the tips
        const wingletGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.2);
        const leftWinglet = new THREE.Mesh(wingletGeometry, wingMaterial);
        leftWinglet.position.set(-0.9, 0.05, 0);
        
        const rightWinglet = new THREE.Mesh(wingletGeometry, wingMaterial);
        rightWinglet.position.set(0.9, 0.05, 0);
        
        planeGroup.add(leftWinglet);
        planeGroup.add(rightWinglet);
        
        return planeGroup;
    }

    function createWarbirdPlane(color) {
        const planeGroup = createBasicPlane(color);
        
        // Warbird has a more robust fuselage
        planeGroup.children[0].geometry.dispose();
        const warbirdFuselageGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1.8, 16);
        planeGroup.children[0].geometry = warbirdFuselageGeometry;
        
        // More robust wings
        const wingGeometry = new THREE.BoxGeometry(2, 0.08, 0.6);
        
        // Replace main wing
        planeGroup.children[1].geometry.dispose();
        planeGroup.children[1].geometry = wingGeometry;
        
        // Add gun barrels
        const gunGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const gunMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.9,
            roughness: 0.1,
        });
        
        const leftGun = new THREE.Mesh(gunGeometry, gunMaterial);
        leftGun.position.set(-0.5, 0, 1.1);
        leftGun.rotation.x = Math.PI / 2;
        
        const rightGun = new THREE.Mesh(gunGeometry, gunMaterial);
        rightGun.position.set(0.5, 0, 1.1);
        rightGun.rotation.x = Math.PI / 2;
        
        planeGroup.add(leftGun);
        planeGroup.add(rightGun);
        
        // Add canopy
        const canopyGeometry = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const canopyMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            metalness: 0.2,
            roughness: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(0, 0.2, 0.3);
        canopy.scale.set(0.8, 0.5, 1);
        
        planeGroup.add(canopy);
        
        return planeGroup;
    }

    function createGliderPlane(color) {
        const planeGroup = new THREE.Group();
        
        // Long slim fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(0.12, 0.15, 2.5, 16);
        const fuselageMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.2,
            roughness: 0.8,
        });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.rotation.z = Math.PI / 2;
        planeGroup.add(fuselage);
        
        // Very long wings
        const wingGeometry = new THREE.BoxGeometry(3, 0.04, 0.3);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.1,
            roughness: 0.9,
        });
        const wing = new THREE.Mesh(wingGeometry, wingMaterial);
        wing.position.set(0, 0.1, 0);
        planeGroup.add(wing);
        
        // Long tail boom
        const tailBoomGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
        const tailBoom = new THREE.Mesh(tailBoomGeometry, fuselageMaterial);
        tailBoom.position.set(0, 0, -0.8);
        tailBoom.rotation.x = Math.PI / 2;
        planeGroup.add(tailBoom);
        
        // T-tail
        const tailWingGeometry = new THREE.BoxGeometry(0.8, 0.04, 0.2);
        const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
        tailWing.position.set(0, 0.2, -1.3);
        planeGroup.add(tailWing);
        
        // Vertical stabilizer
        const stabilizerGeometry = new THREE.BoxGeometry(0.04, 0.4, 0.3);
        const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
        stabilizer.position.set(0, 0, -1.3);
        planeGroup.add(stabilizer);
        
        // Cockpit
        const cockpitGeometry = new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const cockpitMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            metalness: 0.2,
            roughness: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.set(0, 0.15, 0.2);
        cockpit.scale.set(1, 0.5, 1.2);
        
        planeGroup.add(cockpit);
        
        return planeGroup;
    }

    function createStuntPlane(color) {
        const planeGroup = createBasicPlane(color);
        
        // More powerful-looking fuselage
        planeGroup.children[0].geometry.dispose();
        const stuntFuselageGeometry = new THREE.CylinderGeometry(0.22, 0.18, 1.8, 16);
        planeGroup.children[0].geometry = stuntFuselageGeometry;
        
        // Symmetrical wings for aerobatics
        const wingGeometry = new THREE.BoxGeometry(1.7, 0.06, 0.5);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.3,
            roughness: 0.6,
        });
        
        // Replace main wing
        planeGroup.children[1].geometry.dispose();
        planeGroup.children[1].geometry = wingGeometry;
        
        // Large control surfaces
        const aileronGeometry = new THREE.BoxGeometry(0.4, 0.04, 0.15);
        const leftAileron = new THREE.Mesh(aileronGeometry, wingMaterial);
        leftAileron.position.set(-0.65, 0, 0.18);
        
        const rightAileron = new THREE.Mesh(aileronGeometry, wingMaterial);
        rightAileron.position.set(0.65, 0, 0.18);
        
        planeGroup.add(leftAileron);
        planeGroup.add(rightAileron);
        
        // Add canopy
        const canopyGeometry = new THREE.SphereGeometry(0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const canopyMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            metalness: 0.2,
            roughness: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(0, 0.2, 0.3);
        canopy.scale.set(0.8, 0.5, 1);
        
        planeGroup.add(canopy);
        
        // Large propeller
        planeGroup.children[4].geometry.dispose();
        const propellerGeometry = new THREE.BoxGeometry(0.05, 0.7, 0.07);
        planeGroup.children[4].geometry = propellerGeometry;
        
        return planeGroup;
    }
}); 