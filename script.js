// Scene setup with optimized settings
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // Reduced FOV for better perspective
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance",
    alpha: true
});
renderer.setSize(window.innerWidth - 300, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Adjusted camera position for better overall view
camera.position.set(0, 80, 120);
camera.lookAt(0, 0, 0);

// Optimized lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2.5, 500); // Increased light range
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
scene.add(sunLight);

// Add subtle blue light for atmosphere effect
const atmosphereLight = new THREE.PointLight(0x4444ff, 0.5, 200);
scene.add(atmosphereLight);

// Optimized stars background
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starsVertices = new Float32Array(15000 * 3);
    for (let i = 0; i < 15000; i++) {
        const i3 = i * 3;
        starsVertices[i3] = (Math.random() - 0.5) * 2000;
        starsVertices[i3 + 1] = (Math.random() - 0.5) * 2000;
        starsVertices[i3 + 2] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Adjusted planet data for better spacing and visibility
const planetData = {
    mercury: { radius: 0.6, distance: 12, speed: 1, color: 0x8C8C8C, rotationSpeed: 2.5 },
    venus: { radius: 0.9, distance: 18, speed: 1, color: 0xE6E6FA, rotationSpeed: 1.8 },
    earth: { radius: 1.0, distance: 24, speed: 1, color: 0x0000FF, rotationSpeed: 2.0 },
    mars: { radius: 0.8, distance: 30, speed: 1, color: 0xFF4500, rotationSpeed: 2.2 },
    jupiter: { radius: 2.2, distance: 40, speed: 1, color: 0xFFA500, rotationSpeed: 3.0 },
    saturn: { radius: 1.8, distance: 50, speed: 1, color: 0xFFD700, rotationSpeed: 2.8 },
    uranus: { radius: 1.5, distance: 60, speed: 1, color: 0x00FFFF, rotationSpeed: 2.3 },
    neptune: { radius: 1.5, distance: 70, speed: 1, color: 0x000080, rotationSpeed: 2.1 }
};

// Optimized planet creation
const planets = {};
const planetMeshes = {};

const textureLoader = new THREE.TextureLoader();

function createPlanet(name, data) {
    // Increased polygon count for better quality
    const geometry = new THREE.SphereGeometry(data.radius, 48, 48);
    let material;
    if (name === 'earth') {
        material = new THREE.MeshPhongMaterial({
            map: textureLoader.load('path/to/earth_texture.jpg'),
            shininess: 30,
            specular: 0x444444,
            emissive: new THREE.Color(data.color).multiplyScalar(0.1)
        });
    } else {
        material = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 30,
            specular: 0x444444,
            emissive: new THREE.Color(data.color).multiplyScalar(0.1)
        });
    }
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.receiveShadow = true;
    
    // Enhanced orbit visualization
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    // Enhanced glow effect
    const glowGeometry = new THREE.SphereGeometry(data.radius * 1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    planet.add(glow);

    planets[name] = {
        mesh: planet,
        orbit: orbit,
        angle: Math.random() * Math.PI * 2,
        speed: data.speed,
        distance: data.distance,
        rotationSpeed: data.rotationSpeed
    };
    scene.add(planet);
    planetMeshes[name] = planet;
}

// Enhanced Sun creation
const sunGeometry = new THREE.SphereGeometry(4, 48, 48);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.9
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Enhanced sun effects
const sunGlowGeometry = new THREE.SphereGeometry(4.5, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.4,
    side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
sun.add(sunGlow);

const coronaGeometry = new THREE.SphereGeometry(5, 32, 32);
const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
});
const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
sun.add(corona);

scene.add(sun);

// Create all planets
Object.entries(planetData).forEach(([name, data]) => {
    createPlanet(name, data);
});

// Animation state with optimized timing
let isPaused = false;
const clock = new THREE.Clock();
let lastTime = 0;
const targetFPS = 60;
const frameTime = 1000 / targetFPS;

// Optimized animation loop
function animate(currentTime) {
    requestAnimationFrame(animate);

    if (!isPaused) {
        const delta = clock.getDelta();
        
        if (currentTime - lastTime < frameTime) {
            return;
        }
        lastTime = currentTime;

        // Update planet positions with optimized calculations
        Object.entries(planets).forEach(([name, planet]) => {
            planet.angle += delta * planet.speed * 0.5;
            const x = Math.cos(planet.angle) * planet.distance;
            const z = Math.sin(planet.angle) * planet.distance;
            planet.mesh.position.set(x, 0, z);
            planet.mesh.rotation.y += delta * planet.rotationSpeed;
        });

        // Optimized sun rotation
        sun.rotation.y += delta * 0.5;
        sunGlow.rotation.y -= delta * 0.2;
        corona.rotation.y += delta * 0.3;
    }

    renderer.render(scene, camera);
}

// Optimized event listeners
Object.keys(planetData).forEach(planet => {
    const slider = document.getElementById(`${planet}-speed`);
    slider.addEventListener('input', (e) => {
        planets[planet].speed = parseFloat(e.target.value);
    });
});

// Pause/Resume button
const pauseButton = document.getElementById('pause-resume');
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

// Optimized tooltip
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

// Optimized raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPlanet = null;

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(planetMeshes));

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        if (hoveredPlanet !== planet) {
            if (hoveredPlanet) {
                hoveredPlanet.material.emissive.setHex(0x000000);
            }
            hoveredPlanet = planet;
            planet.material.emissive.setHex(0x333333);
            
            const planetName = Object.keys(planetMeshes).find(key => planetMeshes[key] === planet);
            tooltip.style.display = 'block';
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY + 10 + 'px';
            tooltip.textContent = planetName.charAt(0).toUpperCase() + planetName.slice(1);
        }
    } else if (hoveredPlanet) {
        hoveredPlanet.material.emissive.setHex(0x000000);
        hoveredPlanet = null;
        tooltip.style.display = 'none';
    }
}

// Optimized camera controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const cameraSpeed = 0.01;

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        camera.position.x += deltaMove.x * cameraSpeed;
        camera.position.y -= deltaMove.y * cameraSpeed;
        camera.lookAt(scene.position);

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    }
    onMouseMove(e);
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

// Adjusted zoom limits for better visibility
const minZoom = 40;
const maxZoom = 150;
const zoomSpeed = 0.1;

renderer.domElement.addEventListener('wheel', (e) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    const newZ = camera.position.z + direction * zoomSpeed * camera.position.z;
    
    if (newZ > minZoom && newZ < maxZoom) {
        camera.position.z = newZ;
    }
});

// Optimized window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Calculate new sizes
        const controlPanel = document.querySelector('.control-panel');
        const panelWidth = controlPanel ? controlPanel.offsetWidth : 0;
        const width = window.innerWidth - panelWidth;
        const height = window.innerHeight;

        // Update camera and renderer
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        // Optionally, reposition tooltips if visible
        tooltip.style.display = 'none';
    }, 250);
});

// Initialize
createStars();
animate(0); 