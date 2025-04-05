// Initialize Three.js scene
const init3DModel = () => {
    // Create scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Create camera with better perspective
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);

    // Enhanced renderer with better antialiasing and shadows
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        logarithmicDepthBuffer: true,
        physicallyCorrectLights: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    
    // Append to DOM
    document.getElementById('3d-model').appendChild(renderer.domElement);

    // Set up post-processing for enhanced realism
    const composer = new THREE.EffectComposer(renderer);
    
    // Add basic render pass
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add subtle bloom effect for highlights
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.2,    // strength
        0.5,    // radius
        0.7     // threshold
    );
    composer.addPass(bloomPass);
    
    // Add color correction
    const colorCorrectionPass = new THREE.ShaderPass(THREE.ColorCorrectionShader);
    colorCorrectionPass.uniforms.powRGB.value = new THREE.Vector3(1.1, 1.1, 1.2); // Slight blue boost
    colorCorrectionPass.uniforms.mulRGB.value = new THREE.Vector3(1.2, 1.1, 1.0); // Warm tint
    composer.addPass(colorCorrectionPass);
    
    // Add subtle film grain for realism
    const filmPass = new THREE.ShaderPass(THREE.FilmShader);
    filmPass.uniforms.nIntensity.value = 0.15; // Noise intensity
    filmPass.uniforms.sIntensity.value = 0.05; // Scanline intensity
    filmPass.uniforms.sCount.value = 512; // Scanline count
    filmPass.uniforms.grayscale.value = false; // Keep color
    composer.addPass(filmPass);
    
    // Add subtle vignette effect
    const vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
    vignettePass.uniforms.offset.value = 0.95;
    vignettePass.uniforms.darkness.value = 1.6;
    composer.addPass(vignettePass);

    // Create realistic lighting setup
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Main key light (like sun) with shadows
    const mainLight = new THREE.DirectionalLight(0xffffeb, 1.8);
    mainLight.position.set(10, 15, 8);
    mainLight.castShadow = true;
    // Improve shadow quality
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    mainLight.shadow.normalBias = 0.05;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    // Fill light for reducing harsh shadows (from opposite side)
    const fillLight = new THREE.DirectionalLight(0xfffffd, 1.0);
    fillLight.position.set(-8, 6, -7);
    scene.add(fillLight);

    // Rim light for edge highlights
    const rimLight = new THREE.DirectionalLight(0xffffee, 0.8);
    rimLight.position.set(0, 8, -12);
    scene.add(rimLight);

    // Soft light for reflections
    const softLight = new THREE.HemisphereLight(0xd9efff, 0x444b2e, 0.8);
    scene.add(softLight);

    // Create a high-quality environment map for reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    // Generate environment map (studio lighting setup)
    const envMapSize = 512;
    const envMapRenderTarget = new THREE.WebGLCubeRenderTarget(envMapSize, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter
    });
    
    const cubeCamera = new THREE.CubeCamera(0.1, 100, envMapRenderTarget);
    scene.background = new THREE.Color(0x333333); // Temporary for env map generation
    cubeCamera.update(renderer, scene);
    scene.background = null; // Reset to transparent
    
    // Apply the environment map
    const envMap = pmremGenerator.fromCubemap(envMapRenderTarget.texture).texture;
    pmremGenerator.dispose();
    scene.environment = envMap;

    // Add a realistic ground with reflections
    const groundGeometry = new THREE.CircleGeometry(15, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        metalness: 0.2,
        roughness: 0.4,
        envMap: envMap,
        envMapIntensity: 0.8,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add subtle ground fog
    const fogColor = new THREE.Color(0x222222);
    scene.fog = new THREE.Fog(fogColor, 15, 30);

    // Create RC Car model
    const createRCCar = () => {
        const carGroup = new THREE.Group();
        
        // Create ultra-realistic paint texture
        const createCarPaintTexture = (baseColor, flakeColor) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Base color
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, 1024, 1024);
            
            // Add metallic flakes
            ctx.fillStyle = flakeColor;
            for (let i = 0; i < 10000; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 1024;
                const size = 0.2 + Math.random() * 0.8;
                ctx.globalAlpha = 0.1 + Math.random() * 0.2;
                ctx.fillRect(x, y, size, size);
            }
            
            // Add subtle color variations
            ctx.globalAlpha = 0.05;
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 1024;
                const radius = 50 + Math.random() * 150;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1024, 1024);
            }
            
            ctx.globalAlpha = 1.0;
            return new THREE.CanvasTexture(canvas);
        };
        
        // Create realistic car body with aerodynamic shape
        const carBodyGroup = new THREE.Group();
        
        // Create metallic paint texture
        const paintTexture = createCarPaintTexture('#cc0000', '#ffe0e0');
        
        // Create advanced materials
        const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xcc0000, // Bright red
            metalness: 0.7,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            map: paintTexture,
            envMapIntensity: 1.5,
            reflectivity: 1.0
        });
        
        // Main body - streamlined aerodynamic shape
        const bodyPoints = [];
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const x = t * 3 - 1.5; // -1.5 to 1.5
            
            // Create height profile for aerodynamic shape
            let y = 0;
            if (t < 0.2) {
                y = 0.3 * (t / 0.2); // Nose rises
            } else if (t < 0.6) {
                y = 0.3; // Cockpit level
            } else {
                y = 0.3 * (1 - (t - 0.6) / 0.4); // Tail slopes down
            }
            
            // Create width profile (narrower at front and back)
            let w = 1.3 * Math.sin(t * Math.PI) + 0.2;
            
            bodyPoints.push(new THREE.Vector3(x, y, 0));
        }
        
        const bodyPath = new THREE.CatmullRomCurve3(bodyPoints);
        
        // Create extruded shape for car body
        const bodyShape = new THREE.Shape();
        const bodyWidth = 1.5;
        bodyShape.moveTo(0, -bodyWidth/2);
        bodyShape.lineTo(0, bodyWidth/2);
        bodyShape.absarc(0, 0, bodyWidth/2, Math.PI/2, -Math.PI/2, true);
        
        const extrudeSettings = {
            steps: 40,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 10,
            extrudePath: bodyPath
        };
        
        const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
        const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        carBody.rotation.y = Math.PI / 2;
        carBody.castShadow = true;
        carBody.receiveShadow = true;
        carBodyGroup.add(carBody);
        
        // Add windshield with realistic glass material
        const windshieldGeometry = new THREE.BoxGeometry(0.8, 0.15, 1.2);
        windshieldGeometry.translate(0, 0.35, 0);
        
        const glassTexture = createCarPaintTexture('#e0f0ff', '#ffffff');
        
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd9f2ff,
            metalness: 0.0,
            roughness: 0.05,
            transmission: 0.95,
            transparent: true,
            envMapIntensity: 2.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            map: glassTexture,
            thickness: 0.1,
            side: THREE.DoubleSide
        });
        
        const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
        windshield.position.set(0, 0, 0.2);
        windshield.castShadow = true;
        windshield.receiveShadow = true;
        carBodyGroup.add(windshield);
        
        // Create realistic wheels with detailed tire tread
        const createDetailedWheel = (x, y, z) => {
            const wheelGroup = new THREE.Group();
            
            // Create detailed tire with realistic rubber material
            const tireGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 32);
            
            // Create detailed tread pattern using texture
            const tireCanvas = document.createElement('canvas');
            tireCanvas.width = 512;
            tireCanvas.height = 512;
            const ctx = tireCanvas.getContext('2d');
            
            // Draw tire base
            ctx.fillStyle = '#111111';
            ctx.fillRect(0, 0, 512, 512);
            
            // Draw realistic tire pattern
            ctx.fillStyle = '#222222';
            
            // Draw circumferential grooves
            for (let i = 0; i < 4; i++) {
                const y = 128 + i * 80;
                ctx.fillRect(0, y, 512, 20);
            }
            
            // Draw lateral zigzag treads
            ctx.fillStyle = '#1a1a1a';
            for (let i = 0; i < 32; i++) {
                const x = i * 32;
                for (let j = 0; j < 3; j++) {
                    const y = 180 + j * 80;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 16, y + 20);
                    ctx.lineTo(x + 32, y);
                    ctx.lineTo(x + 32, y - 10);
                    ctx.lineTo(x, y - 10);
                    ctx.closePath();
                    ctx.fill();
                }
            }
            
            // Add subtle texture variations
            ctx.fillStyle = '#0a0a0a';
            for (let i = 0; i < 1000; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const size = 1 + Math.random() * 3;
                ctx.globalAlpha = 0.2 + Math.random() * 0.2;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1.0;
            
            // Create bump texture for tread depth
            const bumpCanvas = document.createElement('canvas');
            bumpCanvas.width = 512;
            bumpCanvas.height = 512;
            const bumpCtx = bumpCanvas.getContext('2d');
            
            // Fill with mid-gray (neutral height)
            bumpCtx.fillStyle = '#808080';
            bumpCtx.fillRect(0, 0, 512, 512);
            
            // Draw grooves as darker pixels (indentations)
            bumpCtx.fillStyle = '#303030';
            
            // Draw circumferential grooves
            for (let i = 0; i < 4; i++) {
                const y = 128 + i * 80;
                bumpCtx.fillRect(0, y, 512, 20);
            }
            
            // Draw lateral zigzag treads
            for (let i = 0; i < 32; i++) {
                const x = i * 32;
                for (let j = 0; j < 3; j++) {
                    const y = 180 + j * 80;
                    
                    bumpCtx.beginPath();
                    bumpCtx.moveTo(x, y);
                    bumpCtx.lineTo(x + 16, y + 20);
                    bumpCtx.lineTo(x + 32, y);
                    bumpCtx.lineTo(x + 32, y - 10);
                    bumpCtx.lineTo(x, y - 10);
                    bumpCtx.closePath();
                    bumpCtx.fill();
                }
            }
            
            const tireTexture = new THREE.CanvasTexture(tireCanvas);
            const tireBumpMap = new THREE.CanvasTexture(bumpCanvas);
            
            // Create rubber material with anisotropic effect
            const tireMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x111111, 
                metalness: 0.0,
                roughness: 0.9,
                map: tireTexture,
                bumpMap: tireBumpMap,
                bumpScale: 0.05,
                clearcoat: 0.1,
                clearcoatRoughness: 0.8
            });
            
            const tire = new THREE.Mesh(tireGeometry, tireMaterial);
            tire.rotation.x = Math.PI / 2;
            tire.castShadow = true;
            tire.receiveShadow = true;
            wheelGroup.add(tire);
            
            // Create realistic rim with chrome material
            const rimGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.26, 24);
            const rimMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xdddddd, 
                metalness: 1.0,
                roughness: 0.05,
                envMapIntensity: 2.0
            });
            
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.x = Math.PI / 2;
            rim.castShadow = true;
            rim.receiveShadow = true;
            wheelGroup.add(rim);
            
            // Create complex spoke pattern
            const createSpokes = () => {
                const spokesGroup = new THREE.Group();
                
                // Create 8 intricate spokes
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    
                    // Main spoke
                    const spokeGeometry = new THREE.BoxGeometry(0.35, 0.04, 0.03);
                    spokeGeometry.translate(0.1, 0, 0);
                    const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
                    spoke.position.x = 0;
                    spoke.position.z = 0;
                    spoke.rotation.y = angle;
                    
                    // Add detail to spoke
                    const detailGeometry = new THREE.BoxGeometry(0.1, 0.06, 0.02);
                    detailGeometry.translate(0.25, 0, 0);
                    const detail = new THREE.Mesh(detailGeometry, rimMaterial);
                    detail.rotation.y = angle + Math.PI/16;
                    
                    spokesGroup.add(spoke);
                    spokesGroup.add(detail);
                }
                
                return spokesGroup;
            };
            
            const spokes = createSpokes();
            rim.add(spokes);
            
            // Hub cap with detailed emblem
            const hubCapGroup = new THREE.Group();
            
            const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.27, 16);
            const hubMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xd4af37, // Gold color
                metalness: 1.0,
                roughness: 0.1,
                envMapIntensity: 1.5
            });
            
            const hubcap = new THREE.Mesh(hubGeometry, hubMaterial);
            hubcap.rotation.x = Math.PI / 2;
            hubcap.castShadow = true;
            hubCapGroup.add(hubcap);
            
            // Add emblem to hubcap
            const emblemGeometry = new THREE.CircleGeometry(0.05, 16);
            const emblemMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x330000
            });
            
            const emblem = new THREE.Mesh(emblemGeometry, emblemMaterial);
            emblem.position.set(0, 0, 0.14);
            emblem.rotation.x = Math.PI / 2;
            hubCapGroup.add(emblem);
            
            wheelGroup.add(hubCapGroup);
            
            // Add brake caliper
            const caliperGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.05);
            const caliperMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const caliper = new THREE.Mesh(caliperGeometry, caliperMaterial);
            caliper.position.set(0, 0.2, 0);
            wheelGroup.add(caliper);
            
            // Position the wheel
            wheelGroup.position.set(x, y, z);
            return wheelGroup;
        };
        
        // Add wheels
        const wheelFL = createDetailedWheel(-0.8, 0, 1);
        const wheelFR = createDetailedWheel(0.8, 0, 1);
        const wheelRL = createDetailedWheel(-0.8, 0, -1);
        const wheelRR = createDetailedWheel(0.8, 0, -1);
        
        carGroup.add(wheelFL);
        carGroup.add(wheelFR);
        carGroup.add(wheelRL);
        carGroup.add(wheelRR);
        
        // Store wheels for animation
        carGroup.wheels = [wheelFL, wheelFR, wheelRL, wheelRR];
        
        // Add car body to main group
        carGroup.add(carBodyGroup);
        
        // Add spoiler with real-world styling
        const spoilerWingGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.3);
        spoilerWingGeometry.translate(0, 0.15, 0);
        const spoilerWing = new THREE.Mesh(spoilerWingGeometry, bodyMaterial);
        spoilerWing.position.set(0, 0.3, -1.35);
        spoilerWing.castShadow = true;
        spoilerWing.receiveShadow = true;
        carGroup.add(spoilerWing);
        
        // Spoiler stands - curved design
        const standCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.1, 0.2, 0),
            new THREE.Vector3(0, 0.3, 0)
        );
        
        const standPoints = standCurve.getPoints(10);
        const standGeometry = new THREE.BufferGeometry().setFromPoints(standPoints);
        const standMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, // Dark blue
            metalness: 0.5,
            roughness: 0.5
        });
        
        // Convert the curve to a proper 3D object with some thickness
        const extrudeStandGeometry = new THREE.TubeGeometry(standCurve, 20, 0.05, 8, false);
        
        const standLeft = new THREE.Mesh(extrudeStandGeometry, standMaterial);
        standLeft.position.set(-0.5, 0, -1.35);
        standLeft.castShadow = true;
        standLeft.receiveShadow = true;
        carGroup.add(standLeft);
        
        const standRight = new THREE.Mesh(extrudeStandGeometry, standMaterial);
        standRight.position.set(0.5, 0, -1.35);
        standRight.castShadow = true;
        standRight.receiveShadow = true;
        carGroup.add(standRight);
        
        // Enhanced headlights with glow effect
        const createHeadlight = (x, z) => {
            const headlightGroup = new THREE.Group();
            
            // Headlight lens
            const lensGeometry = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
            const lensMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0xffffff,
                transmission: 0.9,
                metalness: 0.1,
                roughness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });
            
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.rotation.x = Math.PI / 2;
            lens.castShadow = true;
            headlightGroup.add(lens);
            
            // Headlight housing
            const housingGeometry = new THREE.SphereGeometry(0.13, 16, 16, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4);
            const housingMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x888888,
                metalness: 1.0,
                roughness: 0.2
            });
            
            const housing = new THREE.Mesh(housingGeometry, housingMaterial);
            housing.rotation.x = Math.PI / 2;
            housing.castShadow = true;
            headlightGroup.add(housing);
            
            // Add a point light for glow
            const light = new THREE.PointLight(0xffffcc, 0.8, 5);
            light.position.set(0, 0, 0.1);
            headlightGroup.add(light);
            
            // Position the headlight
            headlightGroup.position.set(x, 0.2, z);
            headlightGroup.rotation.y = Math.PI;
            
            return headlightGroup;
        };
        
        // Add headlights
        const headlightLeft = createHeadlight(-0.5, 1.5);
        const headlightRight = createHeadlight(0.5, 1.5);
        
        carGroup.add(headlightLeft);
        carGroup.add(headlightRight);
        
        // Add taillights
        const createTaillight = (x) => {
            const taillightGroup = new THREE.Group();
            
            // Red lens
            const lensGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.05);
            const lensMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0xff2200,
                emissive: 0xff0000,
                emissiveIntensity: 0.5,
                transmission: 0.5,
                metalness: 0.1,
                roughness: 0.2
            });
            
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.castShadow = true;
            taillightGroup.add(lens);
            
            // Add a point light for glow
            const light = new THREE.PointLight(0xff0000, 0.5, 2);
            light.position.set(0, 0, -0.1);
            taillightGroup.add(light);
            
            // Position the taillight
            taillightGroup.position.set(x, 0.2, -1.45);
            
            return taillightGroup;
        };
        
        // Add taillights
        const taillightLeft = createTaillight(-0.5);
        const taillightRight = createTaillight(0.5);
        
        carGroup.add(taillightLeft);
        carGroup.add(taillightRight);
        
        // Add driver
        const driverHeadGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const driverBodyGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.4, 16);
        const driverMaterial = new THREE.MeshStandardMaterial({ color: 0xE0C080 }); // Skin tone
        
        const driverHead = new THREE.Mesh(driverHeadGeometry, driverMaterial);
        driverHead.position.set(0, 0.8, 0);
        driverHead.castShadow = true;
        carGroup.add(driverHead);
        
        const driverBody = new THREE.Mesh(driverBodyGeometry, driverMaterial);
        driverBody.position.set(0, 0.5, 0);
        driverBody.castShadow = true;
        carGroup.add(driverBody);
        
        // Add helmet
        const helmetGeometry = new THREE.SphereGeometry(0.17, 16, 16);
        const helmetMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFF0000,
            metalness: 0.5,
            roughness: 0.2
        });
        
        // Cut the bottom part of the helmet
        const helmetCutGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.4);
        const helmetBSP = new ThreeBSP(helmetGeometry);
        const cutBSP = new ThreeBSP(helmetCutGeometry);
        cutBSP.position.set(0, -0.1, 0);
        const resultBSP = helmetBSP.subtract(cutBSP);
        
        const helmet = resultBSP.toMesh(helmetMaterial);
        helmet.position.set(0, 0.8, 0);
        helmet.castShadow = true;
        //carGroup.add(helmet);
        
        // Add exhaust pipes
        const exhaustPipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
        const exhaustPipeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const exhaustLeft = new THREE.Mesh(exhaustPipeGeometry, exhaustPipeMaterial);
        exhaustLeft.rotation.z = Math.PI / 2;
        exhaustLeft.position.set(-0.6, 0.1, -1.4);
        exhaustLeft.castShadow = true;
        carGroup.add(exhaustLeft);
        
        const exhaustRight = new THREE.Mesh(exhaustPipeGeometry, exhaustPipeMaterial);
        exhaustRight.rotation.z = Math.PI / 2;
        exhaustRight.position.set(0.6, 0.1, -1.4);
        exhaustRight.castShadow = true;
        carGroup.add(exhaustRight);
        
        return carGroup;
    };
    
    // Create Enhanced RC Drone model with professional details and animations
    const createRCDrone = () => {
        const droneGroup = new THREE.Group();
        
        // Create ultra-realistic carbon fiber texture
        const createCarbonFiberTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Base carbon color
            ctx.fillStyle = '#111111';
            ctx.fillRect(0, 0, 1024, 1024);
            
            // Draw carbon fiber weave pattern
            const tileSize = 32; // Smaller for more detailed pattern
            
            // Draw first layer of carbon fiber
            ctx.fillStyle = '#171717';
            for (let y = 0; y < 1024; y += tileSize) {
                for (let x = 0; x < 1024; x += tileSize) {
                    // Draw a carbon fiber strand
                    ctx.fillRect(x + 2, y + tileSize/2 - 2, tileSize - 4, 4);
                }
            }
            
            // Draw perpendicular layer
            ctx.fillStyle = '#1a1a1a';
            for (let y = 0; y < 1024; y += tileSize) {
                for (let x = 0; x < 1024; x += tileSize) {
                    // Draw perpendicular carbon fiber strand
                    ctx.fillRect(x + tileSize/2 - 2, y + 2, 4, tileSize - 4);
                }
            }
            
            // Add weave pattern overlay
            ctx.fillStyle = '#0a0a0a';
            for (let y = 0; y < 1024; y += tileSize*2) {
                for (let x = 0; x < 1024; x += tileSize*2) {
                    // Create weave pattern
                    ctx.fillRect(x, y, tileSize, tileSize);
                    ctx.fillRect(x + tileSize, y + tileSize, tileSize, tileSize);
                }
            }
            
            // Add subtle highlight variations
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < 500; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 1024;
                const size = 1 + Math.random() * 3;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1.0;
            
            // Create bump map for texture
            const bumpCanvas = document.createElement('canvas');
            bumpCanvas.width = 1024;
            bumpCanvas.height = 1024;
            const bumpCtx = bumpCanvas.getContext('2d');
            
            // Base height (mid gray)
            bumpCtx.fillStyle = '#808080';
            bumpCtx.fillRect(0, 0, 1024, 1024);
            
            // Add weave pattern as height variation
            bumpCtx.fillStyle = '#909090'; // Slightly raised
            for (let y = 0; y < 1024; y += tileSize) {
                for (let x = 0; x < 1024; x += tileSize) {
                    // Horizontal strands slightly raised
                    bumpCtx.fillRect(x + 2, y + tileSize/2 - 2, tileSize - 4, 4);
                }
            }
            
            bumpCtx.fillStyle = '#888888'; // Slightly less raised
            for (let y = 0; y < 1024; y += tileSize) {
                for (let x = 0; x < 1024; x += tileSize) {
                    // Vertical strands slightly less raised
                    bumpCtx.fillRect(x + tileSize/2 - 2, y + 2, 4, tileSize - 4);
                }
            }
            
            return {
                diffuse: new THREE.CanvasTexture(canvas),
                bump: new THREE.CanvasTexture(bumpCanvas)
            };
        };
        
        const carbonTextures = createCarbonFiberTexture();
        
        // Create advanced drone body with more realistic geometry
        // Use a custom shape for the drone body with beveled edges
        const bodyShape = new THREE.Shape();
        bodyShape.moveTo(-0.6, -0.6);
        bodyShape.lineTo(0.6, -0.6);
        bodyShape.lineTo(0.6, 0.6);
        bodyShape.lineTo(-0.6, 0.6);
        bodyShape.lineTo(-0.6, -0.6);
        
        const bodyExtrudeSettings = {
            steps: 1,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        };
        
        const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
        
        // Create advanced carbon fiber material with realistic properties
        const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x222222,
            metalness: 0.5,
            roughness: 0.3,
            map: carbonTextures.diffuse,
            bumpMap: carbonTextures.bump,
            bumpScale: 0.02,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            envMapIntensity: 1.0
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        droneGroup.add(body);
        
        // Add advanced panel details
        const createPanelDetail = (width, height, x, y, z) => {
            const panelGeometry = new THREE.PlaneGeometry(width, height);
            const panelMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.7,
                roughness: 0.2,
                map: carbonTextures.diffuse,
                side: THREE.DoubleSide
            });
            
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.set(x, y, z);
            panel.castShadow = true;
            panel.receiveShadow = true;
            return panel;
        };
        
        // Add detailed panels
        const topPanel = createPanelDetail(0.8, 0.8, 0, 0.13, 0);
        topPanel.rotation.x = -Math.PI / 2;
        droneGroup.add(topPanel);
        
        // Add realistic status indicators and vents
        const createStatusIndicator = (x, y, z, color) => {
            const indicatorGroup = new THREE.Group();
            
            // Indicator housing
            const housingGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16);
            const housingMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const housing = new THREE.Mesh(housingGeometry, housingMaterial);
            housing.rotation.x = Math.PI / 2;
            indicatorGroup.add(housing);
            
            // LED lens
            const lensGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16);
            const lensMaterial = new THREE.MeshPhysicalMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                transparent: true,
                transmission: 0.4,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });
            
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.position.y = 0.01;
            lens.rotation.x = Math.PI / 2;
            indicatorGroup.add(lens);
            
            // Add light for glow effect
            const light = new THREE.PointLight(color, 0.5, 0.3);
            light.position.set(0, 0.02, 0);
            indicatorGroup.add(light);
            
            indicatorGroup.position.set(x, y, z);
            return indicatorGroup;
        };
        
        // Add various status indicators around the drone body
        droneGroup.add(createStatusIndicator(0, 0.12, 0.5, 0x00ff00)); // Front status
        droneGroup.add(createStatusIndicator(0.4, 0.12, 0.4, 0xff0000)); // Corner status
        droneGroup.add(createStatusIndicator(-0.4, 0.12, 0.4, 0x00ff00)); // Corner status
        droneGroup.add(createStatusIndicator(0.4, 0.12, -0.4, 0xff0000)); // Corner status
        droneGroup.add(createStatusIndicator(-0.4, 0.12, -0.4, 0x00ff00)); // Corner status
        droneGroup.add(createStatusIndicator(0, 0.12, -0.5, 0x0066ff)); // Back status
        
        // Create realistic drone camera gimbal
        const createCamera = () => {
            const cameraGroup = new THREE.Group();
            
            // Camera body
            const bodyGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
            bodyGeometry.translate(0, -0.075, 0);
            const bodyMaterial = new THREE.MeshStandardMaterial({
                color: 0x222222,
                metalness: 0.7,
                roughness: 0.3,
                map: carbonTextures.diffuse
            });
            
            const cameraBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
            cameraGroup.add(cameraBody);
            
            // Lens assembly
            const lensGroup = new THREE.Group();
            
            // Lens housing
            const housingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 32);
            const housing = new THREE.Mesh(housingGeometry, bodyMaterial);
            housing.rotation.x = Math.PI / 2;
            lensGroup.add(housing);
            
            // Lens glass
            const glassGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.01, 32);
            const glassMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x000000,
                metalness: 0.0,
                roughness: 0.0,
                transmission: 0.9,
                thickness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0.01
            });
            
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.set(0, 0, 0.04);
            glass.rotation.x = Math.PI / 2;
            lensGroup.add(glass);
            
            // Lens interior
            const interiorGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.05, 32);
            const interiorMaterial = new THREE.MeshStandardMaterial({
                color: 0x0a0a0a,
                metalness: 0.0,
                roughness: 1.0
            });
            
            const interior = new THREE.Mesh(interiorGeometry, interiorMaterial);
            interior.position.set(0, 0, 0.02);
            interior.rotation.x = Math.PI / 2;
            lensGroup.add(interior);
            
            // Lens details (focus rings)
            const ringGeometry = new THREE.TorusGeometry(0.06, 0.005, 16, 32);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
            ring1.position.set(0, 0, 0.01);
            ring1.rotation.x = Math.PI / 2;
            lensGroup.add(ring1);
            
            const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
            ring2.position.set(0, 0, -0.01);
            ring2.rotation.x = Math.PI / 2;
            lensGroup.add(ring2);
            
            lensGroup.position.set(0, -0.15, 0.08);
            cameraGroup.add(lensGroup);
            
            // Create gimbal mount
            const mountGeometry = new THREE.BoxGeometry(0.2, 0.03, 0.2);
            const mountMaterial = new THREE.MeshStandardMaterial({
                color: 0xaaaaaa,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const mount = new THREE.Mesh(mountGeometry, mountMaterial);
            mount.position.set(0, 0, 0);
            cameraGroup.add(mount);
            
            return cameraGroup;
        };
        
        const camera = createCamera();
        camera.position.set(0, -0.02, 0.35);
        droneGroup.add(camera);
        
        // Create motor arms with realistic design
        const createArm = (angle, x, z) => {
            const armGroup = new THREE.Group();
            
            // Create a more detailed arm with improved geometry
            const armPoints = [];
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                // Create more complex curve for the arm
                const x = t * 0.8;
                // Curve the arm slightly
                const y = 0.02 * Math.sin(t * Math.PI);
                // Taper the arm
                const width = 0.05 * (1 - t * 0.3);
                armPoints.push(new THREE.Vector3(x, y, 0));
            }
            
            const armPath = new THREE.CatmullRomCurve3(armPoints);
            const armGeometry = new THREE.TubeGeometry(armPath, 30, 0.02, 8, false);
            const armMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xff0000, // Red arm color
                metalness: 0.6,
                roughness: 0.4,
                envMapIntensity: 1.0
            });
            
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.castShadow = true;
            arm.receiveShadow = true;
            armGroup.add(arm);
            
            // Add detailed motor at the end of arm
            const createMotor = () => {
                const motorGroup = new THREE.Group();
                
                // Motor housing
                const housingGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16);
                const housingMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x111111,
                    metalness: 0.5,
                    roughness: 0.7,
                });
                
                const housing = new THREE.Mesh(housingGeometry, housingMaterial);
                housing.rotation.x = Math.PI / 2;
                motorGroup.add(housing);
                
                // Motor windings (visible through cooling vents)
                const windingsGeometry = new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16);
                const windingsMaterial = new THREE.MeshStandardMaterial({
                    color: 0xdd9944,
                    metalness: 0.6,
                    roughness: 0.4
                });
                
                const windings = new THREE.Mesh(windingsGeometry, windingsMaterial);
                windings.rotation.x = Math.PI / 2;
                motorGroup.add(windings);
                
                // Motor shaft
                const shaftGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.06, 8);
                const shaftMaterial = new THREE.MeshStandardMaterial({
                    color: 0xdddddd,
                    metalness: 0.9,
                    roughness: 0.1
                });
                
                const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
                shaft.position.set(0, 0, 0.09);
                shaft.rotation.x = Math.PI / 2;
                motorGroup.add(shaft);
                
                // Motor cooling vents
                const createVent = () => {
                    const ventGeometry = new THREE.BoxGeometry(0.01, 0.08, 0.02);
                    const ventMaterial = new THREE.MeshStandardMaterial({
                        color: 0x333333,
                        metalness: 0.7,
                        roughness: 0.3
                    });
                    
                    return new THREE.Mesh(ventGeometry, ventMaterial);
                };
                
                // Add vents around the motor
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const vent = createVent();
                    vent.position.set(0.07 * Math.cos(angle), 0.07 * Math.sin(angle), 0);
                    vent.rotation.z = angle;
                    motorGroup.add(vent);
                }
                
                return motorGroup;
            };
            
            const motor = createMotor();
            motor.position.set(0.8, 0, 0);
            armGroup.add(motor);
            
            // Add realistic propeller with blur effect
            const createPropeller = () => {
                const propGroup = new THREE.Group();
                
                // Static propeller (visible when not spinning)
                const propGeometry = new THREE.BoxGeometry(0.6, 0.01, 0.05);
                const propTipGeometry = new THREE.BoxGeometry(0.1, 0.015, 0.08);
                
                const propMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x333333,
                    metalness: 0.4,
                    roughness: 0.6,
                });
                
                // Two-blade propeller with details
                const prop1 = new THREE.Mesh(propGeometry, propMaterial);
                prop1.castShadow = true;
                propGroup.add(prop1);
                
                // Add blade tips for more realistic shape
                const tip1a = new THREE.Mesh(propTipGeometry, propMaterial);
                tip1a.position.set(0.35, 0, 0);
                prop1.add(tip1a);
                
                const tip1b = new THREE.Mesh(propTipGeometry, propMaterial);
                tip1b.position.set(-0.35, 0, 0);
                prop1.add(tip1b);
                
                const prop2 = new THREE.Mesh(propGeometry, propMaterial);
                prop2.rotation.y = Math.PI / 2;
                prop2.castShadow = true;
                propGroup.add(prop2);
                
                const tip2a = new THREE.Mesh(propTipGeometry, propMaterial);
                tip2a.position.set(0.35, 0, 0);
                prop2.add(tip2a);
                
                const tip2b = new THREE.Mesh(propTipGeometry, propMaterial);
                tip2b.position.set(-0.35, 0, 0);
                prop2.add(tip2b);
                
                // Blurred propeller effect with advanced gradient
                const blurGeometry = new THREE.CircleGeometry(0.35, 32);
                
                // Create propeller blur texture
                const blurCanvas = document.createElement('canvas');
                blurCanvas.width = 512;
                blurCanvas.height = 512;
                const blurCtx = blurCanvas.getContext('2d');
                
                // Create more realistic blur effect
                const gradient = blurCtx.createRadialGradient(
                    256, 256, 0,
                    256, 256, 256
                );
                gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
                gradient.addColorStop(0.2, 'rgba(200,200,200,0.3)');
                gradient.addColorStop(0.5, 'rgba(150,150,150,0.2)');
                gradient.addColorStop(0.7, 'rgba(100,100,100,0.1)');
                gradient.addColorStop(1, 'rgba(50,50,50,0)');
                
                blurCtx.fillStyle = gradient;
                blurCtx.fillRect(0, 0, 512, 512);
                
                // Add motion streak effect
                blurCtx.strokeStyle = 'rgba(255,255,255,0.3)';
                blurCtx.lineWidth = 2;
                
                // Create two-blade effect
                for (let i = 0; i < 32; i++) {
                    const angle = (i / 32) * Math.PI * 2;
                    const intensity = 0.5 + 0.5 * Math.cos(angle * 2); // Two-blade pattern
                    
                    blurCtx.globalAlpha = intensity * 0.3;
                    blurCtx.beginPath();
                    blurCtx.moveTo(256, 256);
                    blurCtx.lineTo(
                        256 + 250 * Math.cos(angle),
                        256 + 250 * Math.sin(angle)
                    );
                    blurCtx.stroke();
                }
                
                blurCtx.globalAlpha = 1.0;
                
                const blurTexture = new THREE.CanvasTexture(blurCanvas);
                
                const blurMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    map: blurTexture,
                    transparent: true,
                    opacity: 0.7,
                    depthWrite: false,
                    side: THREE.DoubleSide
                });
                
                const propBlur = new THREE.Mesh(blurGeometry, blurMaterial);
                propBlur.rotation.x = -Math.PI / 2;
                propGroup.add(propBlur);
                
                // Toggle between static and spinning states
                propGroup.toggleSpinning = (isSpinning) => {
                    prop1.visible = !isSpinning;
                    prop2.visible = !isSpinning;
                    propBlur.visible = isSpinning;
                };
                
                // Default state - not spinning
                propGroup.toggleSpinning(false);
                
                return propGroup;
            };
            
            const propeller = createPropeller();
            propeller.position.set(0.8, 0.06, 0);
            armGroup.add(propeller);
            
            // Store propeller reference for animation
            armGroup.propeller = propeller;
            
            // Position the arm
            armGroup.rotation.y = angle;
            armGroup.position.set(x, 0, z);
            
            return armGroup;
        };
        
        // Add arms with proper angles
        const armFL = createArm(Math.PI * 0.25, 0, 0);
        const armFR = createArm(Math.PI * 0.75, 0, 0);
        const armBL = createArm(Math.PI * 1.75, 0, 0);
        const armBR = createArm(Math.PI * 1.25, 0, 0);
        
        droneGroup.add(armFL);
        droneGroup.add(armFR);
        droneGroup.add(armBL);
        droneGroup.add(armBR);
        
        // Store arm references for animation
        droneGroup.arms = [armFL, armFR, armBL, armBR];
        
        // Start propellers spinning
        droneGroup.togglePropellers = (isSpinning) => {
            droneGroup.arms.forEach(arm => {
                arm.propeller.toggleSpinning(isSpinning);
            });
        };
        
        // Default state - spinning
        droneGroup.togglePropellers(true);
        
        return droneGroup;
    };
    
    // Create RC Helicopter model with ultra-realistic details
    const createRCHelicopter = () => {
        const heliGroup = new THREE.Group();
        
        // Create advanced metal texture with realistic wear patterns
        const createMetalTexture = (baseColor, scratchColor) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Base metal color
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, 1024, 1024);
            
            // Add subtle panel lines
            ctx.strokeStyle = '#000000';
            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 1;
            
            // Horizontal panel lines
            for (let i = 1; i < 8; i++) {
                const y = i * (1024 / 8);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(1024, y);
                ctx.stroke();
            }
            
            // Vertical panel lines
            for (let i = 1; i < 6; i++) {
                const x = i * (1024 / 6);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 1024);
                ctx.stroke();
            }
            
            // Add rivets along panel lines
            ctx.fillStyle = '#000000';
            ctx.globalAlpha = 0.2;
            
            // Horizontal rivets
            for (let i = 1; i < 8; i++) {
                const y = i * (1024 / 8);
                for (let j = 0; j < 30; j++) {
                    const x = (j + 0.5) * (1024 / 30);
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Vertical rivets
            for (let i = 1; i < 6; i++) {
                const x = i * (1024 / 6);
                for (let j = 0; j < 20; j++) {
                    const y = (j + 0.5) * (1024 / 20);
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Add realistic scratches and wear
            ctx.strokeStyle = scratchColor;
            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 1;
            
            for (let i = 0; i < 200; i++) {
                const x1 = Math.random() * 1024;
                const y1 = Math.random() * 1024;
                const length = 5 + Math.random() * 30;
                const angle = Math.random() * Math.PI * 2;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(
                    x1 + Math.cos(angle) * length,
                    y1 + Math.sin(angle) * length
                );
                ctx.stroke();
            }
            
            // Add dirt/grime in corners and edges
            ctx.fillStyle = '#000000';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 1024;
                const radius = 5 + Math.random() * 30;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.globalAlpha = 0.2 + Math.random() * 0.3;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1.0;
            return new THREE.CanvasTexture(canvas);
        };
        
        // Create bump map from texture
        const createBumpMap = (texture) => {
            // Create a canvas that's a copy of the texture
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Draw the texture onto the canvas
            const tempImage = new Image();
            tempImage.src = texture.image.toDataURL();
            ctx.drawImage(tempImage, 0, 0);
            
            // Process the image data to create a bump map
            const imageData = ctx.getImageData(0, 0, 1024, 1024);
            const data = imageData.data;
            
            // Convert to grayscale and increase contrast for bump effect
            for (let i = 0; i < data.length; i += 4) {
                const gray = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);
                // Adjust contrast
                const contrast = 1.5; // Higher values = more contrast
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                const newGray = factor * (gray - 128) + 128;
                
                data[i] = newGray;     // R
                data[i + 1] = newGray; // G
                data[i + 2] = newGray; // B
                // Alpha remains unchanged
            }
            
            ctx.putImageData(imageData, 0, 0);
            return new THREE.CanvasTexture(canvas);
        };
        
        // Create textures for different parts
        const bodyTexture = createMetalTexture('#ffcc00', '#ffe066'); // Gold/yellow
        const bodyBumpMap = createBumpMap(bodyTexture);
        
        const tailTexture = createMetalTexture('#2c3e50', '#546e7a'); // Dark blue
        const tailBumpMap = createBumpMap(tailTexture);
        
        // Helicopter body - more aerodynamic with complex shape
        const bodyGroup = new THREE.Group();
        
        // Main body
        const bodyPoints = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const z = t * 2.5 - 1.3; // -1.3 to 1.2
            
            // Create body profile
            let radius;
            if (t < 0.2) { // Nose
                radius = 0.2 + t * 1.5;
            } else if (t < 0.7) { // Main cabin
                radius = 0.5;
            } else { // Tail section
                radius = 0.5 - (t - 0.7) * 1.25;
            }
            
            // Add vertical offset for streamlined shape
            let y = 0;
            if (t < 0.2) { // Nose points down
                y = -0.1 + t * 0.5;
            } else if (t < 0.8) { // Cabin is level
                y = 0;
            } else { // Tail tapers up
                y = (t - 0.8) * 0.3;
            }
            
            bodyPoints.push(new THREE.Vector3(0, y, z));
        }
        
        const bodyPath = new THREE.CatmullRomCurve3(bodyPoints);
        const bodyPathPoints = bodyPath.getPoints(50);
        
        // Create body using lathe geometry for smooth shape
        const bodyLathePts = [];
        for (let i = 0; i < 10; i++) {
            const t = i / 9;
            const angle = t * Math.PI;
            const x = 0.4 * Math.sin(angle); // Half-circle for the top half
            const y = -0.4 * Math.cos(angle);
            bodyLathePts.push(new THREE.Vector2(x, y));
        }
        
        const bodyGeometry = new THREE.LatheGeometry(bodyLathePts, 24);
        const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xffcc00, // Gold/yellow
            metalness: 0.7,
            roughness: 0.3,
            map: bodyTexture,
            bumpMap: bodyBumpMap,
            bumpScale: 0.02,
            clearcoat: 0.4,
            clearcoatRoughness: 0.3
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.scale.set(1, 0.8, 1);
        body.castShadow = true;
        body.receiveShadow = true;
        bodyGroup.add(body);
        
        // Create cockpit with realistic glass
        const cockpitGroup = new THREE.Group();
        
        // Cockpit frame
        const frameShape = new THREE.Shape();
        frameShape.moveTo(0, 0);
        frameShape.quadraticCurveTo(0.3, 0.3, 0.6, 0);
        frameShape.lineTo(0.6, -0.4);
        frameShape.quadraticCurveTo(0.3, -0.6, 0, -0.4);
        frameShape.lineTo(0, 0);
        
        const frameGeometry = new THREE.ExtrudeGeometry(frameShape, {
            steps: 1,
            depth: 0.4,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        });
        
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(-0.3, 0, 0.6);
        frame.castShadow = true;
        cockpitGroup.add(frame);
        
        // Cockpit glass
        const glassShape = new THREE.Shape();
        glassShape.moveTo(0.05, -0.05);
        glassShape.quadraticCurveTo(0.3, 0.25, 0.55, -0.05);
        glassShape.lineTo(0.55, -0.35);
        glassShape.quadraticCurveTo(0.3, -0.5, 0.05, -0.35);
        glassShape.lineTo(0.05, -0.05);
        
        const glassGeometry = new THREE.ExtrudeGeometry(glassShape, {
            steps: 1,
            depth: 0.35,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 2
        });
        
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.0,
            roughness: 0.1,
            transmission: 0.9,
            transparent: true,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 2.0,
            side: THREE.DoubleSide
        });
        
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(-0.3, 0, 0.6);
        glass.castShadow = true;
        cockpitGroup.add(glass);
        
        bodyGroup.add(cockpitGroup);
        
        // Add to helicopter group
        heliGroup.add(bodyGroup);
        
        // Create detailed main rotor system
        const rotorGroup = new THREE.Group();
        
        // Rotor hub with detailed shape
        const hubGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.2, 16);
        const hubMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2,
        });
        
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.castShadow = true;
        rotorGroup.add(hub);
        
        // Rotor mast connecting body to hub
        const mastGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 12);
        const mastMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.9,
            roughness: 0.1,
        });
        
        const mast = new THREE.Mesh(mastGeometry, mastMaterial);
        mast.position.set(0, -0.2, 0);
        mast.castShadow = true;
        rotorGroup.add(mast);
        
        // Create realistic rotor blades with airfoil shape
        const createRotorBlade = (angle) => {
            const bladeGroup = new THREE.Group();
            
            // Create blade with airfoil profile
            const bladeProfile = new THREE.Shape();
            bladeProfile.moveTo(0, 0);
            bladeProfile.quadraticCurveTo(0.05, 0.05, 0.2, 0.01);
            bladeProfile.lineTo(0.2, -0.01);
            bladeProfile.quadraticCurveTo(0.05, -0.05, 0, 0);
            
            const extrudeSettings = {
                steps: 1,
                depth: 2.0,
                bevelEnabled: false
            };
            
            const bladeGeometry = new THREE.ExtrudeGeometry(bladeProfile, extrudeSettings);
            const bladeMaterial = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.3,
                roughness: 0.5,
                side: THREE.DoubleSide
            });
            
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.y = Math.PI / 2;
            blade.castShadow = true;
            blade.receiveShadow = true;
            
            // Add structural detail - blade spar
            const sparGeometry = new THREE.BoxGeometry(1.95, 0.02, 0.01);
            const sparMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,
                metalness: 0.5,
                roughness: 0.5
            });
            
            const spar = new THREE.Mesh(sparGeometry, sparMaterial);
            spar.position.set(0, 0, 1.0);
            blade.add(spar);
            
            // Add colored tip to blade
            const tipGeometry = new THREE.BoxGeometry(0.05, 0.03, 0.22);
            const tipMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                metalness: 0.4,
                roughness: 0.4
            });
            
            const tip = new THREE.Mesh(tipGeometry, tipMaterial);
            tip.position.set(0, 0, 1.95);
            blade.add(tip);
            
            // Add rotor cuff at connection point
            const cuffGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
            const cuffMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const cuff = new THREE.Mesh(cuffGeometry, cuffMaterial);
            cuff.rotation.x = Math.PI / 2;
            cuff.position.set(0, 0, 0.1);
            blade.add(cuff);
            
            bladeGroup.rotation.y = angle;
            bladeGroup.add(blade);
            
            return bladeGroup;
        };
        
        // Add main rotor blades - typically 2-4 blades for an RC helicopter
        const mainRotorBlades = [
            createRotorBlade(0),
            createRotorBlade(Math.PI / 2),
            createRotorBlade(Math.PI),
            createRotorBlade(Math.PI * 3 / 2)
        ];
        
        mainRotorBlades.forEach(blade => {
            rotorGroup.add(blade);
        });
        
        rotorGroup.position.set(0, 0.7, 0);
        heliGroup.add(rotorGroup);
        
        // Create detailed tail boom
        const tailBoomGroup = new THREE.Group();
        
        // Tapered tail boom
        const tailPoints = [];
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const radius = 0.08 * (1 - t * 0.5); // Taper the boom
            tailPoints.push(new THREE.Vector2(radius, t * 2.5));
        }
        
        const tailGeometry = new THREE.LatheGeometry(tailPoints, 16);
        const tailMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, // Dark blue
            metalness: 0.6,
            roughness: 0.4,
            map: tailTexture,
            bumpMap: tailBumpMap,
            bumpScale: 0.01
        });
        
        const tailBoom = new THREE.Mesh(tailGeometry, tailMaterial);
        tailBoom.rotation.z = Math.PI / 2;
        tailBoom.castShadow = true;
        tailBoomGroup.add(tailBoom);
        
        // Add vertical stabilizer
        const stabilizerGeometry = new THREE.ExtrudeGeometry(
            new THREE.Shape()
                .moveTo(0, 0)
                .lineTo(0.3, 0.6)
                .lineTo(0, 0.7)
                .lineTo(-0.1, 0.1)
                .lineTo(0, 0),
            {
                steps: 1,
                depth: 0.05,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        );
        
        const stabilizerMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc00, // Match body color
            metalness: 0.7,
            roughness: 0.3,
            map: bodyTexture
        });
        
        const stabilizer = new THREE.Mesh(stabilizerGeometry, stabilizerMaterial);
        stabilizer.position.set(0, 0.3, 2.4);
        stabilizer.castShadow = true;
        tailBoomGroup.add(stabilizer);
        
        // Add tail rotor
        const tailRotorGroup = new THREE.Group();
        
        // Tail rotor housing
        const housingGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16);
        const housingMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        housing.rotation.x = Math.PI / 2;
        tailRotorGroup.add(housing);
        
        // Tail rotor blades - typically 2 blades
        const createTailBlade = (angle) => {
            const bladeGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.02);
            const bladeMaterial = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.3,
                roughness: 0.5
            });
            
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.z = angle;
            blade.castShadow = true;
            
            // Add colored tip
            const tipGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.02);
            const tipMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                metalness: 0.4,
                roughness: 0.4
            });
            
            const tip1 = new THREE.Mesh(tipGeometry, tipMaterial);
            tip1.position.set(0.3, 0, 0);
            blade.add(tip1);
            
            const tip2 = new THREE.Mesh(tipGeometry, tipMaterial);
            tip2.position.set(-0.3, 0, 0);
            blade.add(tip2);
            
            return blade;
        };
        
        tailRotorGroup.add(createTailBlade(0));
        tailRotorGroup.add(createTailBlade(Math.PI / 2));
        
        tailRotorGroup.position.set(0.1, 0.3, 2.6);
        tailBoomGroup.add(tailRotorGroup);
        
        // Position tail boom
        tailBoomGroup.position.set(0, 0, -0.5);
        heliGroup.add(tailBoomGroup);
        
        // Create detailed landing skids
        const skidGroup = new THREE.Group();
        
        // Create curved skid
        const createSkid = (xOffset) => {
            const skidGroup = new THREE.Group();
            
            // Create curved skid shape
            const skidCurve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0, 0.8),
                new THREE.Vector3(0, -0.3, 0.6),
                new THREE.Vector3(0, -0.4, -0.6),
                new THREE.Vector3(0, -0.2, -0.8)
            );
            
            const skidGeometry = new THREE.TubeGeometry(skidCurve, 30, 0.04, 8, false);
            const skidMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const skid = new THREE.Mesh(skidGeometry, skidMaterial);
            skid.castShadow = true;
            skidGroup.add(skid);
            
            // Add skid details - cross supports
            const createSupport = (zPos) => {
                const supportCurve = new THREE.QuadraticBezierCurve3(
                    new THREE.Vector3(xOffset, -0.05, zPos),
                    new THREE.Vector3(xOffset/2, -0.25, zPos),
                    new THREE.Vector3(0, -0.30, zPos)
                );
                
                const supportGeometry = new THREE.TubeGeometry(supportCurve, 20, 0.015, 8, false);
                const support = new THREE.Mesh(supportGeometry, skidMaterial);
                support.castShadow = true;
                return support;
            };
            
            skidGroup.add(createSupport(0.6));
            skidGroup.add(createSupport(0));
            skidGroup.add(createSupport(-0.6));
            
            skidGroup.position.set(xOffset, 0, 0);
            return skidGroup;
        };
        
        skidGroup.add(createSkid(0.5));
        skidGroup.add(createSkid(-0.5));
        
        skidGroup.position.set(0, -0.3, 0);
        heliGroup.add(skidGroup);
        
        // Add helicopter details
        
        // Fuel tank
        const tankGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
        tankGeometry.rotateZ(Math.PI/2);
        const tankMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const tank = new THREE.Mesh(tankGeometry, tankMaterial);
        tank.position.set(0, -0.1, -0.5);
        tank.castShadow = true;
        heliGroup.add(tank);
        
        // Engine exhaust
        const exhaustGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.1, 16);
        const exhaustMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.4,
            emissive: 0x331100,
            emissiveIntensity: 0.2
        });
        
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(0.2, 0.3, -0.3);
        exhaust.rotation.z = Math.PI/2;
        exhaust.castShadow = true;
        heliGroup.add(exhaust);
        
        // Add animated properties
        heliGroup.mainRotor = rotorGroup;
        heliGroup.tailRotor = tailRotorGroup;
        
        return heliGroup;
    };
    
    // Create RC Tank model with realistic battlefield details
    const createRCTank = () => {
        const tankGroup = new THREE.Group();
        
        // Create detailed weathered metal texture
        const createMetalTexture = (baseColor, weatherColor) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Base metal color
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, 1024, 1024);
            
            // Add panel lines and rivets
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            
            // Horizontal panel lines
            for (let i = 0; i < 8; i++) {
                const y = 100 + i * 100;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(1024, y);
                ctx.stroke();
                
                // Add rivets along lines
                for (let j = 0; j < 20; j++) {
                    const x = 30 + j * 50;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#222222';
                    ctx.fill();
                }
            }
            
            // Vertical panel lines
            for (let i = 0; i < 8; i++) {
                const x = 100 + i * 100;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 1024);
                ctx.stroke();
                
                // Add rivets along lines
                for (let j = 0; j < 20; j++) {
                    const y = 30 + j * 50;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#222222';
                    ctx.fill();
                }
            }
            
            // Add weathering and battle damage
            ctx.globalAlpha = 0.1;
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 1024;
                const radius = 10 + Math.random() * 50;
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, weatherColor);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Add scratches
            ctx.strokeStyle = weatherColor;
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = 1;
            for (let i = 0; i < 80; i++) {
                const x1 = Math.random() * 1024;
                const y1 = Math.random() * 1024;
                const length = 10 + Math.random() * 50;
                const angle = Math.random() * Math.PI * 2;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(
                    x1 + Math.cos(angle) * length,
                    y1 + Math.sin(angle) * length
                );
                ctx.stroke();
            }
            
            // Add a few bullet impacts
            ctx.globalAlpha = 0.7;
            for (let i = 0; i < 8; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 1024;
                const radius = 5 + Math.random() * 10;
                
                // Dark center
                ctx.fillStyle = '#111111';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Add impact marks around bullet hole
                ctx.fillStyle = '#000000';
                ctx.globalAlpha = 0.3;
                for (let j = 0; j < 8; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = radius * (1 + Math.random());
                    const splatX = x + Math.cos(angle) * distance;
                    const splatY = y + Math.sin(angle) * distance;
                    const splatRadius = 1 + Math.random() * 4;
                    
                    ctx.beginPath();
                    ctx.arc(splatX, splatY, splatRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1.0;
            return new THREE.CanvasTexture(canvas);
        };
        
        // Generate textures for different parts
        const hullTexture = createMetalTexture('#3a5e52', '#222222'); // Military green with dark weathering
        const turretTexture = createMetalTexture('#395144', '#222222'); // Darker green with dark weathering
        const trackTexture = createMetalTexture('#333333', '#555555'); // Dark metal with light weathering
        
        // Create bump maps from texture
        const createBumpMap = (texture) => {
            // Create canvas copy of texture for processing
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Draw texture to canvas
            const tempImage = document.createElement('img');
            tempImage.src = texture.image.toDataURL();
            ctx.drawImage(tempImage, 0, 0);
            
            // Process image data to create bump effect
            const imageData = ctx.getImageData(0, 0, 1024, 1024);
            const data = imageData.data;
            
            // Convert to grayscale and increase contrast
            for (let i = 0; i < data.length; i += 4) {
                // Convert to grayscale
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                
                // Enhance contrast for bump effect
                const contrast = 1.5;
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                const value = factor * (avg - 128) + 128;
                
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                // Alpha channel unchanged
            }
            
            ctx.putImageData(imageData, 0, 0);
            return new THREE.CanvasTexture(canvas);
        };
        
        // Create bump maps
        const hullBumpMap = createBumpMap(hullTexture);
        const turretBumpMap = createBumpMap(turretTexture);
        
        // Create tank hull with angled armor plating
        const createHull = () => {
            const hullGroup = new THREE.Group();
            
            // Main hull body - more realistic tank shape
            const hullGeometry = new THREE.BoxGeometry(1.2, 0.4, 2.0);
            const hullMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x3a5e52, // Military green
                metalness: 0.4,
                roughness: 0.6,
                map: hullTexture,
                bumpMap: hullBumpMap,
                bumpScale: 0.03,
                clearcoat: 0.3,
                clearcoatRoughness: 0.8
            });
            
            const hull = new THREE.Mesh(hullGeometry, hullMaterial);
            hull.position.y = 0.35;
            hull.castShadow = true;
            hull.receiveShadow = true;
            hullGroup.add(hull);
            
            // Add angled front armor plate
            const frontArmorGeometry = new THREE.BoxGeometry(1.1, 0.3, 0.5);
            const frontArmor = new THREE.Mesh(frontArmorGeometry, hullMaterial);
            frontArmor.position.set(0, 0.35, 1.1);
            frontArmor.rotation.x = -Math.PI / 8; // Angled front armor
            frontArmor.castShadow = true;
            frontArmor.receiveShadow = true;
            hullGroup.add(frontArmor);
            
            // Add side skirts
            const sideSkirtGeometry = new THREE.BoxGeometry(0.1, 0.15, 1.8);
            
            const leftSkirt = new THREE.Mesh(sideSkirtGeometry, hullMaterial);
            leftSkirt.position.set(-0.65, 0.2, 0);
            leftSkirt.castShadow = true;
            leftSkirt.receiveShadow = true;
            hullGroup.add(leftSkirt);
            
            const rightSkirt = new THREE.Mesh(sideSkirtGeometry, hullMaterial);
            rightSkirt.position.set(0.65, 0.2, 0);
            rightSkirt.castShadow = true;
            rightSkirt.receiveShadow = true;
            hullGroup.add(rightSkirt);
            
            // Add engine deck details
            const engineDeckGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.7);
            const engineDeck = new THREE.Mesh(engineDeckGeometry, hullMaterial);
            engineDeck.position.set(0, 0.58, -0.6);
            engineDeck.castShadow = true;
            engineDeck.receiveShadow = true;
            hullGroup.add(engineDeck);
            
            // Add engine grilles
            const createGrille = (x, z) => {
                const grilleGroup = new THREE.Group();
                
                const grilleBaseGeometry = new THREE.BoxGeometry(0.2, 0.01, 0.3);
                const grilleBase = new THREE.Mesh(grilleBaseGeometry, hullMaterial);
                grilleBase.position.set(0, 0, 0);
                grilleGroup.add(grilleBase);
                
                // Add grille details - metal grates
                const grateMaterial = new THREE.MeshStandardMaterial({
                    color: 0x111111,
                    metalness: 0.7,
                    roughness: 0.6
                });
                
                for (let i = 0; i < 5; i++) {
                    const barGeometry = new THREE.BoxGeometry(0.18, 0.02, 0.02);
                    const bar = new THREE.Mesh(barGeometry, grateMaterial);
                    bar.position.set(0, 0.01, -0.12 + i * 0.06);
                    grilleGroup.add(bar);
                }
                
                grilleGroup.position.set(x, 0.58, z);
                return grilleGroup;
            };
            
            hullGroup.add(createGrille(-0.25, -0.6));
            hullGroup.add(createGrille(0.25, -0.6));
            
            // Add fuel tanks and tools - common tank details
            const fuelTankGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
            const fuelTankMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.5,
                roughness: 0.7
            });
            
            const leftFuelTank = new THREE.Mesh(fuelTankGeometry, fuelTankMaterial);
            leftFuelTank.rotation.z = Math.PI / 2;
            leftFuelTank.position.set(-0.7, 0.4, -0.5);
            leftFuelTank.castShadow = true;
            hullGroup.add(leftFuelTank);
            
            const rightFuelTank = new THREE.Mesh(fuelTankGeometry, fuelTankMaterial);
            rightFuelTank.rotation.z = Math.PI / 2;
            rightFuelTank.position.set(0.7, 0.4, -0.5);
            rightFuelTank.castShadow = true;
            hullGroup.add(rightFuelTank);
            
            return hullGroup;
        };
        
        // Create turret with realistic details
        const createTurret = () => {
            const turretGroup = new THREE.Group();
            
            // Base turret shape
            const turretBaseGeometry = new THREE.CylinderGeometry(0.45, 0.5, 0.2, 16);
            const turretMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x395144, // Darker green
                metalness: 0.5,
                roughness: 0.5,
                map: turretTexture,
                bumpMap: turretBumpMap,
                bumpScale: 0.02,
                clearcoat: 0.3,
                clearcoatRoughness: 0.8
            });
            
            const turretBase = new THREE.Mesh(turretBaseGeometry, turretMaterial);
            turretBase.castShadow = true;
            turretBase.receiveShadow = true;
            turretGroup.add(turretBase);
            
            // Main turret body - more complex shape using multiple geometries
            const turretUpperGeometry = new THREE.BoxGeometry(0.9, 0.2, 1.0);
            const turretUpper = new THREE.Mesh(turretUpperGeometry, turretMaterial);
            turretUpper.position.set(0, 0.2, 0);
            turretUpper.castShadow = true;
            turretUpper.receiveShadow = true;
            turretGroup.add(turretUpper);
            
            // Turret front with angled armor
            const turretFrontGeometry = new THREE.BoxGeometry(0.8, 0.25, 0.4);
            const turretFront = new THREE.Mesh(turretFrontGeometry, turretMaterial);
            turretFront.position.set(0, 0.2, 0.6);
            turretFront.rotation.x = -Math.PI / 12; // Slight forward angle
            turretFront.castShadow = true;
            turretFront.receiveShadow = true;
            turretGroup.add(turretFront);
            
            // Add realistic tank cannon
            const createCannon = () => {
                const cannonGroup = new THREE.Group();
                
                // Main gun barrel
                const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.6, 16);
                const barrelMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x222222,
                    metalness: 0.7,
                    roughness: 0.3
                });
                
                const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
                barrel.rotation.z = Math.PI / 2;
                barrel.position.set(0.8, 0, 0);
                barrel.castShadow = true;
                cannonGroup.add(barrel);
                
                // Muzzle brake at the end of barrel
                const muzzleGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.15, 16);
                const muzzle = new THREE.Mesh(muzzleGeometry, barrelMaterial);
                muzzle.rotation.z = Math.PI / 2;
                muzzle.position.set(1.55, 0, 0);
                muzzle.castShadow = true;
                cannonGroup.add(muzzle);
                
                // Gun mantlet - the armored cover where the gun connects to the turret
                const mantletGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
                const mantlet = new THREE.Mesh(mantletGeometry, turretMaterial);
                mantlet.rotation.z = Math.PI / 2;
                mantlet.position.set(0.1, 0, 0);
                mantlet.castShadow = true;
                cannonGroup.add(mantlet);
                
                // Add barrel details
                const createBarrelDetail = (position) => {
                    const detailGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12);
                    const detail = new THREE.Mesh(detailGeometry, barrelMaterial);
                    detail.rotation.z = Math.PI / 2;
                    detail.position.copy(position);
                    detail.castShadow = true;
                    return detail;
                };
                
                cannonGroup.add(createBarrelDetail(new THREE.Vector3(0.4, 0, 0)));
                cannonGroup.add(createBarrelDetail(new THREE.Vector3(0.8, 0, 0)));
                cannonGroup.add(createBarrelDetail(new THREE.Vector3(1.2, 0, 0)));
                
                return cannonGroup;
            };
            
            const cannon = createCannon();
            cannon.position.set(0, 0.2, 0.7);
            turretGroup.add(cannon);
            
            // Add commander's hatch
            const hatchGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
            const hatch = new THREE.Mesh(hatchGeometry, turretMaterial);
            hatch.position.set(-0.25, 0.4, -0.2);
            hatch.castShadow = true;
            turretGroup.add(hatch);
            
            // Add gunner's periscope
            const periscopeGeometry = new THREE.BoxGeometry(0.1, 0.08, 0.15);
            const periscope = new THREE.Mesh(periscopeGeometry, turretMaterial);
            periscope.position.set(0.2, 0.4, 0.2);
            periscope.castShadow = true;
            turretGroup.add(periscope);
            
            // Add radio antenna
            const antennaGeometry = new THREE.CylinderGeometry(0.01, 0.005, 0.5, 8);
            const antennaMaterial = new THREE.MeshStandardMaterial({
                color: 0x111111,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(-0.35, 0.6, -0.4);
            antenna.castShadow = true;
            turretGroup.add(antenna);
            
            // Position the turret
            turretGroup.position.set(0, 0.5, 0);
            
            return turretGroup;
        };
        
        // Create tank treads
        const createTreads = (side) => {
            const treadGroup = new THREE.Group();
            const offsetX = side * 0.6; // Position on left or right side
            
            // Create the main tread belt
            const treadGeometry = new THREE.BoxGeometry(0.2, 0.05, 2.0);
            const treadMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x222222,
                metalness: 0.4,
                roughness: 0.8,
                map: trackTexture
            });
            
            const mainTread = new THREE.Mesh(treadGeometry, treadMaterial);
            mainTread.position.set(offsetX, 0, 0);
            mainTread.castShadow = true;
            mainTread.receiveShadow = true;
            treadGroup.add(mainTread);
            
            // Add realistic tread patterns
            const addTreadSegments = () => {
                const segmentGroup = new THREE.Group();
                
                for (let i = 0; i < 24; i++) {
                    const segmentGeometry = new THREE.BoxGeometry(0.22, 0.07, 0.08);
        }
        
        const metalTexture = new THREE.CanvasTexture(metalCanvas);
        metalTexture.wrapS = THREE.RepeatWrapping;
            roughness: 0.2,
        });
        const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
        cannon.rotation.x = Math.PI / 2;
        cannon.position.set(0, 0.45, 1.0);
        tankGroup.add(cannon);
        
        // Create tank treads
        const createTread = (xOffset) => {
            const treadGroup = new THREE.Group();
            
            // Main tread
            const treadGeometry = new THREE.BoxGeometry(0.35, 0.15, 3);
            const treadMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x111111,
                metalness: 0.5,
                roughness: 0.7,
            });
            const tread = new THREE.Mesh(treadGeometry, treadMaterial);
            tread.position.set(xOffset, -0.3, 0);
            treadGroup.add(tread);
            
            // Tread details - add tread segments
            const segmentCount = 12;
            const segmentGeometry = new THREE.BoxGeometry(0.37, 0.05, 0.2);
            
            for (let i = 0; i < segmentCount; i++) {
                const segment = new THREE.Mesh(segmentGeometry, treadMaterial);
                segment.position.set(xOffset, -0.23, -1.4 + (i * 0.25));
                treadGroup.add(segment);
            }
            
            return treadGroup;
        };
        
        // Add left and right treads
        tankGroup.add(createTread(-0.74));
        tankGroup.add(createTread(0.74));
        
        return tankGroup;
    };
    
    // Create all models and add to scene
    const models = [
        { model: createRCCar(), name: 'car' },
        { model: createRCDrone(), name: 'drone' },
        { model: createRCHelicopter(), name: 'helicopter' },
        { model: createRCTank(), name: 'tank' }
    ];
    
    // Prepare models with appropriate scaling and positioning
    models.forEach(modelData => {
        // Hide models initially
        modelData.model.visible = false;
        
        // Apply appropriate scaling and positioning
        switch(modelData.name) {
            case 'car':
                modelData.model.scale.set(0.9, 0.9, 0.9);
                modelData.model.position.y = -0.8;
                break;
            case 'drone':
                modelData.model.scale.set(1.2, 1.2, 1.2);
                modelData.model.position.y = 0;
                break;
            case 'helicopter':
                modelData.model.scale.set(0.7, 0.7, 0.7);
                modelData.model.position.y = -0.2;
                break;
            case 'tank':
                modelData.model.scale.set(0.8, 0.8, 0.8);
                modelData.model.position.y = -1.2;
                break;
        }
        
        // Add to scene
        scene.add(modelData.model);
    });
    
    // Set initial model
    let currentModelIndex = 0;
    models[currentModelIndex].model.visible = true;
    
    // Advanced model switching with transition effects
    const animationSettings = {
        lastModelSwitchTime: Date.now(),
        transitionDuration: 1000, // Transition time in ms
        autoSwitchInterval: 8000, // Time between auto-switches in ms
        autoSwitchEnabled: true
    };
    
    // Function to switch models with transition effects
    const switchToNextModel = () => {
        // Record time for animation timing
        animationSettings.lastModelSwitchTime = Date.now();
        
        // Hide current model
        models[currentModelIndex].model.visible = false;
        
        // Move to next model
        currentModelIndex = (currentModelIndex + 1) % models.length;
        
        // Show new model
        const newModel = models[currentModelIndex].model;
        newModel.visible = true;
        newModel.rotation.set(0, 0, 0); // Reset rotation
        
        // Reset special animation states for specific models
        if (models[currentModelIndex].name === 'drone') {
            // Ensure propellers are spinning
            newModel.togglePropellers(true);
        } else if (models[currentModelIndex].name === 'helicopter') {
            // Reset rotor positions
            if (newModel.mainRotor) newModel.mainRotor.rotation.y = 0;
            if (newModel.tailRotor) newModel.tailRotor.rotation.x = 0;
        } else if (models[currentModelIndex].name === 'tank') {
            // Reset turret position
            if (newModel.turret) newModel.turret.rotation.y = 0;
        }
        
        // Update model name display if it exists
        const modelNameElement = document.getElementById('current-model-name');
        if (modelNameElement) {
            const modelNames = ['RC Car', 'RC Drone', 'RC Helicopter', 'RC Tank'];
            modelNameElement.textContent = modelNames[currentModelIndex];
            modelNameElement.classList.add('fade-in');
            setTimeout(() => {
                modelNameElement.classList.remove('fade-in');
            }, 500);
        }
        
        // Update active button state if buttons exist
        const switchButtons = document.querySelectorAll('.model-switch-btn');
        if (switchButtons.length > 0) {
            switchButtons.forEach((btn, i) => {
                if (i === currentModelIndex) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    };
    
    // Auto-switch models on interval
    if (animationSettings.autoSwitchEnabled) {
        setInterval(() => {
            if (Date.now() - animationSettings.lastModelSwitchTime > animationSettings.autoSwitchInterval) {
                switchToNextModel();
            }
        }, 1000); // Check every second
    }
    
    // Animate with advanced effects for each model type
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Get current model
        const currentModel = models[currentModelIndex].model;
        const modelType = models[currentModelIndex].name;
        
        // Calculate time since last switch for transition effects
        const timeSinceSwitch = (Date.now() - animationSettings.lastModelSwitchTime) / 1000;
        
        // Common animation - gentle rotation with easing
        const rotationSpeed = 0.005 * Math.min(timeSinceSwitch, 1); // Ease in rotation
        currentModel.rotation.y += rotationSpeed;
        
        // Add subtle floating movement
        const floatAmplitude = 0.1;
        const floatSpeed = 1; // Cycles per second
        currentModel.position.y += Math.sin(Date.now() * 0.001 * Math.PI * 2 * floatSpeed) * 0.001 * floatAmplitude;
        
        // Model-specific animations
        switch(modelType) {
            case 'car':
                // Animate wheels rotating
                if (currentModel.wheels) {
                    currentModel.wheels.forEach(wheel => {
                        wheel.rotation.x += 0.1;
                    });
                }
                break;
                
            case 'drone':
                // Animate propellers spinning and add slight tilt during motion
                if (currentModel.arms) {
                    // Add subtle wobble motion to drone
                    currentModel.rotation.x = Math.sin(Date.now() * 0.002) * 0.03;
                    currentModel.rotation.z = Math.sin(Date.now() * 0.0015) * 0.03;
                }
                break;
                
            case 'helicopter':
                // Rotate main rotor and tail rotor
                if (currentModel.mainRotor) {
                    currentModel.mainRotor.rotation.y += 0.15; // Main rotor
                }
                if (currentModel.tailRotor) {
                    currentModel.tailRotor.rotation.z += 0.3; // Tail rotor
                }
                
                // Subtle forward/backward tilting
                currentModel.rotation.x = Math.sin(Date.now() * 0.001) * 0.02;
                break;
                
            case 'tank':
                // Slowly rotate turret
                if (currentModel.turret) {
                    currentModel.turret.rotation.y = Math.sin(Date.now() * 0.0005) * 0.2;
                }
                
                // Add subtle track movement (visual effect since we don't animate individual links)
                const trackMeshes = [];
                currentModel.traverse(child => {
                    if (child.isMesh && child.material && child.material.map && 
                        child.name.includes('tread') || (child.parent && child.parent.name && child.parent.name.includes('tread'))) {
                        trackMeshes.push(child);
                    }
                });
                
                trackMeshes.forEach(mesh => {
                    if (mesh.material.map) {
                        mesh.material.map.offset.y += 0.01;
                    }
                });
                break;
        }
        
        // Use composer instead of renderer for post-processing
        composer.render();
    };
    
    // Handle window resize for composer
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    animate();

    // Handle model switcher buttons
    document.addEventListener('DOMContentLoaded', () => {
        const switchButtons = document.querySelectorAll('.model-switch-btn');
        
        // If buttons exist, set up event handlers
        if (switchButtons.length > 0) {
            switchButtons.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // If already on this model, just return
                    if (currentModelIndex === index) return;
                    
                    // Hide current model
                    models[currentModelIndex].model.visible = false;
                    
                    // Set index and show new model
                    currentModelIndex = index;
                    const newModel = models[currentModelIndex].model;
                    newModel.visible = true;
                    
                    // Special setup for specific models
                    if (currentModelIndex === 1) { // Drone
                        newModel.togglePropellers(true);
                    }
                    
                    // Reset time to restart animations properly
                    animationSettings.lastModelSwitchTime = Date.now();
                });
            });
        }
    });
    
    // Return control functions for external access
    return {
        forceNextModel: switchToNextModel,
        setModelByIndex: (index) => {
            if (index >= 0 && index < models.length) {
                models[currentModelIndex].model.visible = false;
                currentModelIndex = index;
                const newModel = models[currentModelIndex].model;
                newModel.visible = true;
                newModel.rotation.set(0, 0, 0); // Reset rotation
                
                // Special setup for drone
                if (currentModelIndex === 1) { // Drone
                    newModel.togglePropellers(true);
                }
                
                // Reset time
                animationSettings.lastModelSwitchTime = Date.now();
            }
        },
        toggleAutoSwitch: (enabled) => {
            animationSettings.autoSwitchEnabled = enabled;
        }
    };
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init3DModel); 

// Expose model creation functions to the window object for use in other scripts
window.createRCCar = createRCCar;
window.createRCDrone = createRCDrone;
window.createRCHelicopter = createRCHelicopter;
window.createRCTank = createRCTank;