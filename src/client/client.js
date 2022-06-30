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
camera.position.y = 7;
camera.position.z = 25;

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

// Add pile of cubes

// Creating a cube
const cube_geometry = new THREE.BoxGeometry(1,1,1);
const cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000});
//Bottom left cube
const cube1 = new THREE.Mesh(cube_geometry, cube_material);
cube1.position.x = -1;
cube1.position.y = 1;
scene.add(cube1);
//Bottom middle cube
const cube2 = new THREE.Mesh(cube_geometry, cube_material);
cube2.position.x = 0;
cube2.position.y = 1;
scene.add(cube2);
//Bottom right cube
const cube3 = new THREE.Mesh(cube_geometry, cube_material);
cube3.position.x = 1;
cube3.position.y = 1;
scene.add(cube3);
//middle left cube
const cube4 = new THREE.Mesh(cube_geometry, cube_material);
cube4.position.x = -0.5;
cube4.position.y = 2;
scene.add(cube4);
//Middle right cube
const cube5 = new THREE.Mesh(cube_geometry, cube_material);
cube5.position.x = 0.5;
cube5.position.y = 2;
scene.add(cube5);
//Top cube
const cube6 = new THREE.Mesh(cube_geometry, cube_material);
cube6.position.x = 0;
cube6.position.y = 3;
scene.add(cube6);

// Create the cube's physical body in the world
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

// Bottom left cube
const cubeBody1 = new CANNON.Body({ mass: 1 });
cubeBody1.addShape(cubeShape);
cubeBody1.position.set(cube1.position.x, cube1.position.y, cube1.position.z);
world.addBody(cubeBody1);
// Bottom middle cube
const cubeBody2 = new CANNON.Body({ mass: 1 });
cubeBody2.addShape(cubeShape);
cubeBody2.position.set(cube2.position.x, cube2.position.y, cube2.position.z);
world.addBody(cubeBody2);
// Bottom right cube
const cubeBody3 = new CANNON.Body({ mass: 1 });
cubeBody3.addShape(cubeShape);
cubeBody3.position.set(cube3.position.x, cube3.position.y, cube3.position.z);
world.addBody(cubeBody3);
// Middle left cube
const cubeBody4 = new CANNON.Body({ mass: 1 });
cubeBody4.addShape(cubeShape);
cubeBody4.position.set(cube4.position.x, cube4.position.y, cube4.position.z);
world.addBody(cubeBody4);
// Middle right cube
const cubeBody5 = new CANNON.Body({ mass: 1});
cubeBody5.addShape(cubeShape);
cubeBody5.position.set(cube5.position.x, cube5.position.y, cube5.position.z);
world.addBody(cubeBody5);
// Top cube
const cubeBody6 = new CANNON.Body({ mass: 1 });
cubeBody6.addShape(cubeShape);
cubeBody6.position.set(cube6.position.x, cube6.position.y, cube6.position.z);
world.addBody(cubeBody6);

// Creating a plane
const plane_geometry = new THREE.PlaneGeometry(500,500,500);
const plane_material = new THREE.MeshBasicMaterial({ color:0xffffff});
const plane = new THREE.Mesh(plane_geometry, plane_material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

// Add friction
const planeMaterial = new CANNON.Material('planeMaterial');
// Create the plane's physical body in the world
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 , material: planeMaterial});
planeBody.addShape(planeShape);
planeBody.position.set(plane.position.x, plane.position.y, plane.position.z);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
world.addBody(planeBody);

const frictionPlane = new CANNON.ContactMaterial(planeMaterial, planeMaterial, {
    friction: 0.5,
    restitution: 0.5,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
});
world.addContactMaterial(frictionPlane);

// Create sphere to acts as user control
const sphere_geometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphere_material = new THREE.MeshBasicMaterial({ color: 0x0000ff});
const user = new THREE.Mesh(sphere_geometry, sphere_material);
user.position.set(0,3,15);
scene.add(user);

// Create the user control physics body
const userShape = new CANNON.Sphere(0.5);
const userBody = new CANNON.Body({ mass: 5 });
userBody.addShape(userShape);
userBody.position.set(user.position.x, user.position.y, user.position.z);
userBody.quaternion.setFromEuler(user.rotation.x, user.rotation.y, user.rotation.z);
world.addBody(userBody);

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
cubeFolder.add(cube1.position, 'x', -10, 10);
cubeFolder.add(cube1.position, 'y', -10, 10);
cubeFolder.add(cube1.position, 'z', -10, 10);
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

// Add event listener for user
document.addEventListener('keydown', handleKeyDownUp);
document.addEventListener('keyup', handleKeyDownUp);

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
    cube1.position.copy(cubeBody1.position);
    cube1.quaternion.copy(cubeBody1.quaternion);
    cube2.position.copy(cubeBody2.position);
    cube2.quaternion.copy(cubeBody2.quaternion);
    cube3.position.copy(cubeBody3.position);
    cube3.quaternion.copy(cubeBody3.quaternion);
    cube4.position.copy(cubeBody4.position);
    cube4.quaternion.copy(cubeBody4.quaternion);
    cube5.position.copy(cubeBody5.position);
    cube5.quaternion.copy(cubeBody5.quaternion);
    cube6.position.copy(cubeBody6.position);
    cube6.quaternion.copy(cubeBody6.quaternion);

    plane.position.copy(planeBody.position);
    plane.quaternion.copy(planeBody.quaternion);
    user.position.copy(userBody.position);
    user.quaternion.copy(userBody.quaternion);

    const userPosition = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    user.getWorldPosition(userPosition);
    camera.getWorldPosition(cameraPosition);

    camera.lookAt(userPosition);
}

function worldStep() {
    world.fixedStep();
}

var keyMap = {};

function handleKeyDownUp(e) {

    keyMap[e.keyCode] = e.type == 'keydown';

    if (keyMap[37]) {
        // Left
        userBody.applyImpulse(new CANNON.Vec3(-1, 0, 0), new CANNON.Vec3(0, 0.5 / 2, 0));
        // userBody.applyLocalImpulse(new CANNON.Vec3(-1, 0, 0));
    }
    if (keyMap[38]) {
        // Up
        userBody.applyImpulse(new CANNON.Vec3(0, 0, -1), new CANNON.Vec3(0, 0.5 / 2, 0));
        // userBody.applyLocalImpulse(new CANNON.Vec3(0, 0, -1));
    }
    if (keyMap[39]) {
        // Right
        userBody.applyImpulse(new CANNON.Vec3(1, 0, 0), new CANNON.Vec3(0, 0.5 / 2, 0));
        // userBody.applyLocalImpulse(new CANNON.Vec3(1, 0, 10));
    }
    if (keyMap[40]) {
        // Down
        userBody.applyImpulse(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(0, 0.5 / 2, 0));
        // userBody.applyLocalImpulse(new CANNON.Vec3(0, 0, 1));
    }
}

animate();