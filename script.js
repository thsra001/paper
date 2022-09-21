// The three.js scene: the 3D world where you put objects
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

const scene = new THREE.Scene(); //threeJS
const world = new CANNON.World({ //cannonJS
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})
let physicObj=[];
//CannonDebugger
const cannonDebugger = new CannonDebugger(scene, world, {
  // options...
})
// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.y = 1.6;
console.log(camera)
// add random functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const imgLoader = new THREE.TextureLoader()
function loadImg(url,x,y) {
  let texture = imgLoader.load(url);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(x,y);
return texture
}
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
let texture = loadImg('tex/floor/color.jpg',8,8);
let texture2 =  loadImg('tex/floor/normal.jpg',8,8);
let texture3 = loadImg('tex/floor/color.jpg',8,8);
// the floor
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(30, 1, 30),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshPhysicalMaterial( {color: 0xffffff, map: texture, normalMap:texture2, roughnessMap:texture3} )
};
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);

scene.add(cube.mesh);
cube.mesh.position.y = -0.5;
//cannonJS
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(15,0.5,15)),
  position: new CANNON.Vec3(0,-0.5,0)
})
world.addBody(groundBody)
cube.physic=groundBody
// flying cube
const texture4 = loadImg('tex/blocks/block1.jpg',1,1);
const cube2 = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshStandardMaterial( {
color: 0xffffff,map: texture4,} )
};
cube2.mesh = new THREE.Mesh(cube2.geometry, cube2.material);

scene.add(cube2.mesh);
cube2.mesh.position.set(0,3,-5)
console.log(cube2)
//cannonJS
let cubeBody = new CANNON.Body({
  mass: 1, // kg
  shape: new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5)),
position: cube2.mesh.position,
quaternion: cube2.mesh.quaternion
})
world.addBody(cubeBody)
cube2.physic=cubeBody
cube2.isPhysic=true
physicObj.push(cube2)
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
// RENDER LOOP -----------------------------
function render() {
  // do physics first
  world.fixedStep()
  cannonDebugger.update()
  for (let x = 0; x < physicObj.length; x++) {
if  (physicObj[x].isPhysic) {physicObj[x].mesh.position.copy(physicObj[x].physic.position)
  physicObj[x].mesh.quaternion.copy(physicObj[x].physic.quaternion) 
} else { physicObj[x].physic.position.copy(physicObj[x].mesh.position)
  physicObj[x].physic.quaternion.copy(physicObj[x].mesh.quaternion) 
}
}
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
  speed=0.2
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