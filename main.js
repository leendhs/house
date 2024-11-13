import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// GUI setup
const gui = new dat.GUI();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load the dragon model
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/a_cute_burning_dragon.glb', // Path to your dragon model
  (gltf) => {
    const dragon = gltf.scene;
    dragon.scale.set(0.8, 0.8, 0.8); // Increase size slightly
    dragon.position.set(0.8, 0.8, 3.5); // Position it next to the front door

    dragon.castShadow = true;
    scene.add(dragon);

    // Optional: animate the dragon
    function animateDragon() {
      dragon.rotation.y += 0.01; // Rotate the dragon slowly
    }
    renderer.setAnimationLoop(() => {
      animateDragon();
      renderer.render(scene, camera);
    });
  },
  undefined,
  (error) => {
    console.error('Error loading the dragon model:', error);
  }
);



// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Material for walls and roof
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffe4b5 });
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x87ceeb });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
plane.receiveShadow = true;
scene.add(plane);

// House walls as separate objects (on the ground)
const wallHeight = 3;
const wallThickness = 0.2;

// Front Wall (met ruimte voor een deur)
const frontWallGeometry = new THREE.BoxGeometry(5, wallHeight, wallThickness);
const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
frontWall.position.set(0, wallHeight / 2, -2.5);
frontWall.castShadow = true;
scene.add(frontWall);


// Verplaats deur naar achterwand
const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 1, 2.6);  // Plaats de deur aan de achterkant
door.castShadow = true;
scene.add(door);


// Achterwand
const backWallGeometry = new THREE.BoxGeometry(5, wallHeight, wallThickness);
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.position.set(0, wallHeight / 2, 2.5);
backWall.castShadow = true;
scene.add(backWall);

// Linkerzijmuur
const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 5);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.set(-2.5, wallHeight / 2, 0);
leftWall.castShadow = true;
scene.add(leftWall);

// Rechterzijmuur
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 5);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.set(2.5, wallHeight / 2, 0);
rightWall.castShadow = true;
scene.add(rightWall);

// Roof
const roofGeometry = new THREE.ConeGeometry(3.6, 2, 4);
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, wallHeight + 1, 0);  // Dak boven de muren
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
scene.add(roof);




// Painting (naam/foto kaart) op de voorwand
const textureLoader = new THREE.TextureLoader();
const paintingTexture = textureLoader.load('/leen.jpg');
const paintingGeometry = new THREE.PlaneGeometry(1, 1.5);
const paintingMaterial = new THREE.MeshStandardMaterial({ map: paintingTexture });
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.set(-1.5, 1.5, -2.4);
scene.add(painting);



// Trees using a loop
const treeGeometry = new THREE.CylinderGeometry(0.2, 0.5, 2, 8);
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const treeLeavesGeometry = new THREE.SphereGeometry(0.7, 8, 8);
const treeLeavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

for (let i = -2; i <= 2; i += 2) {
  const trunk = new THREE.Mesh(treeGeometry, treeMaterial);
  trunk.position.set(i * 2, 1, -4);
  trunk.castShadow = true;
  scene.add(trunk);

  const leaves = new THREE.Mesh(treeLeavesGeometry, treeLeavesMaterial);
  leaves.position.set(i * 2, 2.2, -4);
  leaves.castShadow = true;
  scene.add(leaves);
}

// Camera position and animation
camera.position.set(10, 5, 10);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Move the camera gradually to go through the front of the house
  camera.position.z -= 0.01;
  camera.position.x -= 0.005;
  camera.lookAt(0, 1.5, 0);  // Gericht op het midden van het huis
  
  if (camera.position.z < -2) {
    camera.position.set(10, 5, 10);  // Reset camera voor continue loop
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
