// RC Tank Models - 3D Rendering with Three.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Please include the library.');
        return;
    }

    // Common settings for all models
    const commonSettings = {
        cameraPosition: { x: 5, y: 3, z: 5 },
        lightIntensity: 1.2,
        rotationSpeed: 0.005,
        backgroundColor: 0xf5f5f5
    };

    // Define all tank models with their attributes
    const tankModels = [
        {
            id: 'tank-model-1',
            type: 'battle',
            dimensions: { length: 1.4, height: 0.6, width: 0.7 },
            mainColor: 0x3a5e52, // dark green
            trackColor: 0x1a1a1a,
            turretColor: 0x395144,
            hasSmoke: true
        },
        {
            id: 'tank-model-2',
            type: 'modern',
            dimensions: { length: 1.6, height: 0.5, width: 0.8 },
            mainColor: 0x5d6b64, // military green
            trackColor: 0x1a1a1a,
            turretColor: 0x4d5a4f,
            hasWeapons: true
        },
        {
            id: 'tank-model-3',
            type: 'vintage',
            dimensions: { length: 1.4, height: 0.65, width: 0.7 },
            mainColor: 0x6b695e, // khaki color
            trackColor: 0x333333,
            turretColor: 0x6b695e,
            weathered: true
        },
        {
            id: 'tank-model-4',
            type: 'light',
            dimensions: { length: 1.2, height: 0.4, width: 0.6 },
            mainColor: 0x6a8ebf, // light blue
            trackColor: 0x1a1a1a,
            turretColor: 0x5a7eaf,
            hasLights: true
        },
        {
            id: 'tank-model-5',
            type: 'heavy',
            dimensions: { length: 1.8, height: 0.8, width: 0.9 },
            mainColor: 0x4a5446, // olive green
            trackColor: 0x222222,
            turretColor: 0x3a4436,
            extraArmor: true
        },
        {
            id: 'tank-model-6',
            type: 'battle',
            dimensions: { length: 1.5, height: 0.55, width: 0.75 },
            mainColor: 0xc2a883, // sand color
            trackColor: 0x333333,
            turretColor: 0xb29873,
            hasInfrared: true
        },
        {
            id: 'tank-model-7',
            type: 'vintage',
            dimensions: { length: 1.4, height: 0.6, width: 0.7 },
            mainColor: 0x6c7a55, // olive drab
            trackColor: 0x2a2a2a,
            turretColor: 0x6c7a55,
            hasCrew: true
        },
        {
            id: 'tank-model-8',
            type: 'modern',
            dimensions: { length: 1.7, height: 0.5, width: 0.8 },
            mainColor: 0x2a3439, // dark grey
            trackColor: 0x1a1a1a,
            turretColor: 0x2a3439,
            hasCamera: true
        },
        {
            id: 'tank-model-9',
            type: 'light',
            dimensions: { length: 1.3, height: 0.45, width: 0.65 },
            mainColor: 0x38424a, // slate
            trackColor: 0x1a1a1a,
            turretColor: 0x38424a,
            hasCamouflage: true
        },
        {
            id: 'tank-model-10',
            type: 'heavy',
            dimensions: { length: 1.9, height: 0.7, width: 0.95 },
            mainColor: 0x1a1a1a, // black
            trackColor: 0x333333,
            turretColor: 0x1a1a1a,
            hasGoldAccents: true
        }
    ];

    // Initialize each tank model
    tankModels.forEach(model => {
        const container = document.getElementById(model.id);
        if (container) {
            createTankModel(container, model, commonSettings);
        }
    });

    // Create and render a tank model
    function createTankModel(container, model, settings) {
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(settings.backgroundColor);

        // Create camera
        const camera = new THREE.PerspectiveCamera(
            45, container.clientWidth / container.clientHeight, 0.1, 1000
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

        // Create lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, settings.lightIntensity);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Create tank based on model type
        let tank;
        switch(model.type) {
            case 'battle':
                tank = createBattleTank(model);
                break;
            case 'modern':
                tank = createModernTank(model);
                break;
            case 'vintage':
                tank = createVintageTank(model);
                break;
            case 'light':
                tank = createLightTank(model);
                break;
            case 'heavy':
                tank = createHeavyTank(model);
                break;
            default:
                tank = createBattleTank(model);
        }
        
        scene.add(tank);

        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate tank for display
            tank.rotation.y += settings.rotationSpeed;
            
            // Animate tracks if model has this feature
            if (tank.tracks) {
                tank.tracks.forEach(track => {
                    track.material.map.offset.x -= 0.01;
                });
            }
            
            // Animate turret if model has special features
            if (model.hasInfrared && tank.turret) {
                tank.turret.rotation.y += settings.rotationSpeed * 0.5;
            }
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        // Start animation
        animate();
    }

    // Create tank models based on type
    function createBattleTank(config) {
        return createBasicTankModel(config, {
            turretSize: 1.2,
            gunLength: 1.5,
            extraDetails: true
        });
    }

    function createModernTank(config) {
        return createBasicTankModel(config, {
            turretSize: 1.0,
            gunLength: 1.8,
            angularBody: true,
            modernDesign: true
        });
    }

    function createVintageTank(config) {
        return createBasicTankModel(config, {
            turretSize: 1.1,
            gunLength: 1.3,
            vintage: true,
            weathered: config.weathered
        });
    }

    function createLightTank(config) {
        return createBasicTankModel(config, {
            turretSize: 0.8,
            gunLength: 1.2,
            lightweight: true,
            hasLights: config.hasLights
        });
    }

    function createHeavyTank(config) {
        return createBasicTankModel(config, {
            turretSize: 1.4,
            gunLength: 1.6,
            heavyArmor: true,
            extraArmor: config.extraArmor
        });
    }

    // Base tank model creation
    function createBasicTankModel(config, options) {
        const tank = new THREE.Group();
        
        // Body dimensions from config
        const length = config.dimensions.length;
        const height = config.dimensions.height;
        const width = config.dimensions.width;
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(length, height, width);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: config.mainColor,
            flatShading: options.vintage || false
        });
        
        // Apply weathered look if vintage
        if (options.weathered) {
            bodyMaterial.roughness = 0.9;
            bodyMaterial.metalness = 0.1;
        }
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = height / 2 + 0.1; // Slightly lift from ground
        tank.add(body);
        
        // Tracks
        const trackWidth = width * 0.25;
        const trackGeometry = new THREE.BoxGeometry(length, height * 0.4, trackWidth);
        
        // Create track texture
        const trackCanvas = document.createElement('canvas');
        trackCanvas.width = 64;
        trackCanvas.height = 64;
        const trackContext = trackCanvas.getContext('2d');
        
        // Draw track pattern
        trackContext.fillStyle = '#222222';
        trackContext.fillRect(0, 0, 64, 64);
        trackContext.fillStyle = '#444444';
        
        for (let i = 0; i < 8; i++) {
            trackContext.fillRect(0, i * 8, 64, 4);
        }
        
        const trackTexture = new THREE.CanvasTexture(trackCanvas);
        trackTexture.wrapS = THREE.RepeatWrapping;
        trackTexture.wrapT = THREE.RepeatWrapping;
        trackTexture.repeat.set(8, 1);
        
        const trackMaterial = new THREE.MeshPhongMaterial({ 
            color: config.trackColor,
            map: trackTexture
        });
        
        // Left track
        const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        leftTrack.position.set(0, height * 0.2, -width / 2 - trackWidth / 2 + 0.05);
        tank.add(leftTrack);
        
        // Right track
        const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        rightTrack.position.set(0, height * 0.2, width / 2 + trackWidth / 2 - 0.05);
        tank.add(rightTrack);
        
        // Store tracks for animation
        tank.tracks = [leftTrack, rightTrack];
        
        // Turret
        const turretSize = options.turretSize || 1.0;
        const turretGeometry = options.angularBody ? 
            new THREE.BoxGeometry(length * 0.6 * turretSize, height * 0.6, width * 0.7 * turretSize) :
            new THREE.CylinderGeometry(width * 0.4 * turretSize, width * 0.4 * turretSize, height * 0.6, 16);
            
        const turretMaterial = new THREE.MeshPhongMaterial({ color: config.turretColor });
        const turret = new THREE.Mesh(turretGeometry, turretMaterial);
        
        if (options.angularBody) {
            turret.position.set(0, height + height * 0.3, 0);
        } else {
            turret.rotation.x = Math.PI / 2;
            turret.position.set(0, height + height * 0.3, 0);
        }
        
        tank.add(turret);
        tank.turret = turret; // Store for animation
        
        // Main gun
        const gunLength = options.gunLength || 1.5;
        const gunGeometry = new THREE.CylinderGeometry(0.08, 0.08, length * gunLength, 12);
        const gunMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const gun = new THREE.Mesh(gunGeometry, gunMaterial);
        
        gun.rotation.z = Math.PI / 2;
        gun.position.set(length * gunLength / 2, 0, 0);
        
        // Barrel group to position correctly
        const barrelGroup = new THREE.Group();
        barrelGroup.add(gun);
        
        if (options.angularBody) {
            barrelGroup.position.set(length * 0.25, height + height * 0.3, 0);
        } else {
            barrelGroup.position.set(turret.position.x, turret.position.y, 0);
        }
        
        tank.add(barrelGroup);
        
        // Special features based on tank type
        if (options.extraDetails || options.modernDesign) {
            addAntennas(tank, height, config.mainColor);
        }
        
        if (options.heavyArmor || options.extraArmor) {
            addExtraArmor(tank, length, height, width, config.mainColor);
        }
        
        if (config.hasWeapons) {
            addWeapons(tank, length, height, width);
        }
        
        if (config.hasGoldAccents) {
            addGoldAccents(tank, length, height, width);
        }
        
        if (config.hasLights) {
            addLights(tank, length, height, width);
        }
        
        // Position adjustment
        tank.position.y = 0.1; // Slight lift from ground
        
        return tank;
    }

    // Additional detail functions
    function addAntennas(tank, height, color) {
        const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.01, height * 2, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
        
        const antenna1 = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna1.position.set(-0.2, height * 1.5, 0.2);
        tank.add(antenna1);
        
        const antenna2 = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna2.position.set(-0.3, height * 1.3, -0.2);
        tank.add(antenna2);
    }

    function addExtraArmor(tank, length, height, width, color) {
        const armorGeometry = new THREE.BoxGeometry(length * 0.8, height * 0.15, width * 1.1);
        const armorMaterial = new THREE.MeshPhongMaterial({ color: color });
        
        const sideArmor = new THREE.Mesh(armorGeometry, armorMaterial);
        sideArmor.position.set(0, height * 0.6, 0);
        tank.add(sideArmor);
        
        // Additional armor plates
        const frontArmorGeometry = new THREE.BoxGeometry(length * 0.2, height * 0.8, width * 1.05);
        const frontArmor = new THREE.Mesh(frontArmorGeometry, armorMaterial);
        frontArmor.position.set(length * 0.4, height * 0.4, 0);
        tank.add(frontArmor);
    }

    function addWeapons(tank, length, height, width) {
        const machineGunGeometry = new THREE.CylinderGeometry(0.05, 0.05, length * 0.4, 8);
        const machineGunMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
        
        const machineGun = new THREE.Mesh(machineGunGeometry, machineGunMaterial);
        machineGun.rotation.z = Math.PI / 2;
        machineGun.position.set(0, height * 1.4, width * 0.25);
        tank.add(machineGun);
        
        // Mount
        const mountGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const mountMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const mount = new THREE.Mesh(mountGeometry, mountMaterial);
        mount.position.set(-length * 0.2, height * 1.4, width * 0.25);
        tank.add(mount);
    }

    function addGoldAccents(tank, length, height, width) {
        // Gold trim around turret
        const trimGeometry = new THREE.TorusGeometry(width * 0.42, 0.04, 8, 32);
        const goldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd4af37,
            metalness: 1,
            roughness: 0.2
        });
        
        const trim = new THREE.Mesh(trimGeometry, goldMaterial);
        trim.rotation.x = Math.PI / 2;
        trim.position.set(0, height * 1.2, 0);
        tank.add(trim);
        
        // Gold details on hull
        const detailGeometry = new THREE.BoxGeometry(length * 0.1, height * 0.05, width * 0.8);
        const detail = new THREE.Mesh(detailGeometry, goldMaterial);
        detail.position.set(length * 0.4, height * 0.5, 0);
        tank.add(detail);
    }

    function addLights(tank, length, height, width) {
        // Light meshes
        const lightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const lightMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffaa,
            emissiveIntensity: 0.5
        });
        
        // Front lights
        const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
        leftLight.position.set(length * 0.45, height * 0.4, width * 0.3);
        tank.add(leftLight);
        
        const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
        rightLight.position.set(length * 0.45, height * 0.4, -width * 0.3);
        tank.add(rightLight);
        
        // Actual light sources (for visual effect)
        const spotLight1 = new THREE.PointLight(0xffffcc, 0.5, 3);
        spotLight1.position.copy(leftLight.position);
        tank.add(spotLight1);
        
        const spotLight2 = new THREE.PointLight(0xffffcc, 0.5, 3);
        spotLight2.position.copy(rightLight.position);
        tank.add(spotLight2);
    }
}); 