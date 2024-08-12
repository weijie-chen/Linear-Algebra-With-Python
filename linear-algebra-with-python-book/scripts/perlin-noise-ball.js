import * as THREE from 'https://cdn.jsdelivr.net/npm/three@v0.167.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@v0.167.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'https://cdn.jsdelivr.net/npm/three@v0.167.0/examples/jsm/math/ImprovedNoise.js';

function initBlobAnimation(containerId) {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id "${containerId}" not found`);
        return;
    }

    // Create the scene
    let scene = new THREE.Scene();

    // Create a camera
    let camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Create a renderer
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add orbit controls for mouse interaction
    let controls = new OrbitControls(camera, renderer.domElement);

    // Create a geometry
    let geometry = new THREE.SphereGeometry(2.3, 128, 128);

    // Create a shader material
    const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float noiseScale;
        uniform float burstTime;
        uniform float burstStrength;

        

        // Improved Perlin Noise Function
        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r) {
            return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //  x0 = x0 - 0.0 + 0.0 * C.xxx;
            //  x1 = x0 - i1  + 1.0 * C.xxx;
            //  x2 = x0 - i2  + 2.0 * C.xxx;
            //  x3 = x0 - 1.0 + 3.0 * C.xxx;
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            //Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vNormal = normal;
            vPosition = position;

            // Apply Perlin noise
            float speed = 0.5; // Adjust this value to change the speed
            vec3 newPosition = position + normal * snoise(position * noiseScale + time * speed) * 0.4;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            // Define the two colors
            vec3 color1 = vec3(20.0 / 255.0, 181.0 / 255.0, 217.0 / 255.0); // #14B5D9
            vec3 color2 = vec3(189.0 / 255.0, 36.0 / 255.0, 155.0 / 255.0); // #BD249B

            // Calculate the interpolation factor
            float h = 0.5 + 0.5 * vPosition.y;

            // Interpolate between the two colors
            vec3 color = mix(color1, color2, h);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const uniforms = {
        time: { value: 0.0 },
        noiseScale: { value: 1.5 }
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5).normalize();
    scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
    }

    animate();
}

// Initialize the visualization
document.addEventListener('DOMContentLoaded', function () {
    initBlobAnimation('title-page-animation');
});