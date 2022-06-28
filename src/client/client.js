// Rewriting the original test code in the new framework

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es'
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
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 10;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Set up orbital controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.target.y = 0.5;
/*
    Create a new physics world
*/
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)   //m/s^2
});
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;
//world.allowSleep = true;

// Creating a cube
const cube_geometry = new THREE.BoxGeometry(1,1,1);
const cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true});
const cube = new THREE.Mesh(cube_geometry, cube_material);
cube.position.x = -3;
cube.position.y = 3;
scene.add(cube);

// Create the cube's physical body in the world
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const cubeBody = new CANNON.Body({ mass: 1 });
cubeBody.addShape(cubeShape);
cubeBody.position.set(cube.position.x, cube.position.y, cube.position.z);
world.addBody(cubeBody);

// Creating a plane
const plane_geometry = new THREE.PlaneGeometry(20,20,20);
const plane_material = new THREE.MeshBasicMaterial({ color:0xffffff});
const plane = new THREE.Mesh(plane_geometry, plane_material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

// Create the plane's physical body in the world
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.position.set(plane.position.x, plane.position.y, plane.position.z);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
world.addBody(planeBody);




// Make sure the renderer reacts to the window being resized
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Create new GUI
const gui = new dat.GUI({name: 'Camera Settings'});

// Add Camera settings to GUI
const cameraFolder = gui.addFolder('Camera Settings');
cameraFolder.add(camera.position, 'x', -10, 10);
cameraFolder.add(camera.position, 'y', -10, 10);
cameraFolder.add(camera.position, 'z', -10, 10);
cameraFolder.open();
const cubeFolder = gui.addFolder('Cube Settings');
cubeFolder.add(cube.position, 'x', -10, 10);
cubeFolder.add(cube.position, 'y', -10, 10);
cubeFolder.add(cube.position, 'z', -10, 10);
cubeFolder.open();
const physicsFolder = gui.addFolder('Physics Settings');
physicsFolder.add(world.gravity, 'x', -10, 10, 0.1);
physicsFolder.add(world.gravity, 'y', -10, 10, 0.1);
physicsFolder.add(world.gravity, 'z', -10, 10, 0.1);
physicsFolder.open();

orbitControls.addEventListener('change', render);


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

    // Update the controls
    orbitControls.update();

    // Update the cube position
    requestAnimationFrame(animate);

    // Step the physics world
    worldStep();
    // Update object positions
    updatePositions();
    // Render the scene
    render();
    stats.end();
}

// Isolate the render function to be able to call it from multiple functions
function render() {
    renderer.render(scene, camera);
}

function updatePositions() {
    cube.position.copy(cubeBody.position);
    cube.quaternion.copy(cubeBody.quaternion);
    plane.position.copy(planeBody.position);
    plane.quaternion.copy(planeBody.quaternion);
}

function worldStep() {
    world.fixedStep();
}

animate();