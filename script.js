// The three.js scene: the 3D world where you put objects
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

const scene = new THREE.Scene();

// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
// add random functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const imgLoader = new THREE.TextureLoader()
// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);
//add Controls
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject())
// add eventListners
const instructions = renderer.domElement.addEventListener( 'click', function () {
controls.lock();
} );
let keys = [];//Define array

renderer.domElement.addEventListener('keydown',keydown);
renderer.domElement.addEventListener('keyup',keyup);
//Attach listeners to functions
function keydown(e){
keys[e.key] = true;
}
function keyup(e){
keys[e.key] = false;
}
// add textures for floor
const texture = imgLoader.load( 'tex/floor/color.jpg' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const texture2 = imgLoader.load( 'tex/floor/normal.jpg' );
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const texture3 = imgLoader.load( 'tex/floor/color.jpg' );
texture3.wrapS = THREE.RepeatWrapping;
texture3.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
// the floor
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(30, 1, 30),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshPhysicalMaterial( {color: 0xffffff, map: texture, normalMap:texture2, roughnessMap:texture3} )
};
//add ambientLight
const color = 0xFFFFFF;
const intensity = 0.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// add pointLight
const light2 = new THREE.PointLight(color, intensity);
light2.position.set(0, 10, 0);
scene.add(light2);
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);

// Add the cube into the scene
scene.add(cube.mesh);

// Make the camera further from the cube so we can see it better
console.log(scene)
function render() {
  // move player 
if(keys['w']){
controls.moveForward(.1);
}
if(keys['s']){
controls.moveForward(-.1);
}
if(keys['a']){
controls.moveRight(-.1);
}
if(keys['d']){
controls.moveRight(.1);
  console.log("d");
}
if(keys['c']){
  controls.lock();
}
  // Render the scene and the camera
  renderer.render(scene, camera);

  // Rotate the cube every frame
  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();