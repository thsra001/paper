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
camera.position.y = 1.6;
// add random functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const imgLoader = new THREE.TextureLoader()
// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#c"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);
//add Controls
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject())
// add eventListners
var ft, lf, bk, rt, sprint = false
const instructions = renderer.domElement.addEventListener( 'click', function () {
controls.lock();
} );
renderer.domElement.addEventListener('keydown',keydown);
renderer.domElement.addEventListener('keyup',keyup);
//Attach listeners to functions
function keydown(e){
  console.log(e.code)
	switch ( e.code ) {

  case 'ArrowUp':
  case 'KeyW':
			ft = true;
			break;

  case 'ArrowLeft':
	case 'KeyA':
			lf = true;
			break;

  case 'ArrowDown':
	case 'KeyS':
			bk = true;
			break;

  case 'ArrowRight':
	case 'KeyD':
			rt = true;
			break;

  case 'ShiftRight':
	case 'ShiftLeft':
		  sprint = !sprint
			break;
  }
}
function keyup(e){
	switch ( e.code ) {

  case 'ArrowUp':
  case 'KeyW':
			ft = false;
			break;

  case 'ArrowLeft':
	case 'KeyA':
			lf = false;
			break;

  case 'ArrowDown':
	case 'KeyS':
			bk = false;
			break;

  case 'ArrowRight':
	case 'KeyD':
			rt = false;
			break;
  }
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
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);

scene.add(cube.mesh);
cube.mesh.position.y = -1;
// flying cube
const cube2 = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshPhysicalMaterial( {color: 0x33ff33, normalMap:texture2, roughnessMap:texture3} )
};
cube2.mesh = new THREE.Mesh(cube2.geometry, cube2.material);

scene.add(cube2.mesh);
cube2.mesh.position.set(0,1.2,-5)
//add ambientLight
const color = 0xFFFFFF;
const intensity = 0.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// add pointLight
const light2 = new THREE.PointLight(color, intensity);
light2.position.set(0, 10, 0);
scene.add(light2);
console.log(renderer.domElement)
// Make the camera further from the cube so we can see it better


let speed=0.15
// RENDER LOOP
function render() {
  // move player 
  if(ft){
controls.moveForward(speed);
}
if(bk){
controls.moveForward(0-speed);
}
if(lf){
controls.moveRight(0-speed);
}
if(rt){
controls.moveRight(speed);
}
if(sprint){ 
  speed=0.25
} else{
  speed=0.1
}

cube2.mesh.rotateX(0.0125)
cube2.mesh.rotateY(0.025)
  // Render the scene and the camera
  renderer.render(scene, camera);

  // Rotate the cube every frame
  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();