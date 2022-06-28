// Rewriting the original test code in the new framework

import * as THREE from 'three';

// Initialization
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creating a cube
const cube_geometry = new THREE.BoxGeometry();
const cube_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
const cube = new THREE.Mesh(cube_geometry, cube_material);

// Add the cube to the scene
scene.add(cube);

// Creating a plane
const plane_geometry = new THREE.PlaneGeometry();
const plane_material = new THREE.MeshBasicMaterial({ color:0xff0000, wireframe: true});
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

// Animate the objects in the scene
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    render();
}

// Isolate the render function to be able to call it from multiple functions
function render() {
    renderer.render(scene, camera);
}

animate();