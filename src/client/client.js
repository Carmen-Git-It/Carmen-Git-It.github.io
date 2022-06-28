// Rewriting the original test code in the new framework

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
const Stats = require("stats-js");

// Initialization
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 2;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Set up orbital controls
new OrbitControls(camera, renderer.domElement);

// Creating a cube
const cube_geometry = new THREE.BoxGeometry();
const cube_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
const cube = new THREE.Mesh(cube_geometry, cube_material);

// Add the cube to the scene
scene.add(cube);

// Creating a plane
const plane_geometry = new THREE.PlaneGeometry(20,20,20);
const plane_material = new THREE.MeshBasicMaterial({ color:0xff0000});
const plane = new THREE.Mesh(plane_geometry, plane_material);

// Move the plane position and add it to the scene
plane.position.z = -2;
scene.add(plane);

// Make sure the renderer reacts to the window being resized
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Create a new stats object
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.position = 'absolute';
// Add it to the DOM over the canvas
document.body.appendChild(stats.dom);

// Animate the objects in the scene
function animate() {
    // Begin tracking the performance of the render
    stats.begin();

    // Update the cube position
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    render();
    stats.end();
}

// Isolate the render function to be able to call it from multiple functions
function render() {
    renderer.render(scene, camera);
}

animate();