// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Set camera position
camera.position.set(0, 20, 40);
camera.lookAt(0, 0, 0);

// Create a grid of vectors (arrows) to represent the gradient field
const arrowHelperArray = [];
const arrowLength = 1.5;
const gridSize = 10;
const gridSpacing = 2;

for (let x = -gridSize; x <= gridSize; x += gridSpacing) {
    for (let y = -gridSize; y <= gridSize; y += gridSpacing) {
        for (let z = -gridSize; z <= gridSize; z += gridSpacing) {
            // Compute the gradient (example: f(x, y, z) = x^2 + y^2 + z^2)
            const gradient = new THREE.Vector3(2 * x, 2 * y, 2 * z).normalize();

            // Create an arrow to represent the vector
            const arrowHelper = new THREE.ArrowHelper(
                gradient,
                new THREE.Vector3(x, y, z),
                arrowLength,
                0xffffff
            );

            scene.add(arrowHelper);
            arrowHelperArray.push(arrowHelper);
        }
    }
}

// Lighting for better visibility
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Animate the gradient vectors
    arrowHelperArray.forEach(arrow => {
        // Apply a rotation to each vector over time
        arrow.setDirection(new THREE.Vector3(
            arrow.position.x + Math.sin(Date.now() * 0.001),
            arrow.position.y + Math.cos(Date.now() * 0.001),
            arrow.position.z + Math.sin(Date.now() * 0.001)
        ).normalize());
    });

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    camera.aspect = window.innerWidth / window.innerHeight * 0.8;
    camera.updateProjectionMatrix();
});
