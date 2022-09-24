// The three.js scene: the 3D world where you put objects
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import{FontLoader} from "three/examples/jsm/loaders/FontLoader"
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry"
const scene = new THREE.Scene(); //threeJS
const world = new CANNON.World({ //cannonJS
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})
world.solver.iterations = 50;
world.defaultContactMaterial.contactEquationStiffness = 5e6; world.defaultContactMaterial.contactEquationRelaxation = 3;
// world.allowSleep = true -- fixy
let physicObj=[];
//CannonDebugger
const cannonDebugger = new CannonDebugger(scene, world, {
  // options...
})
// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.y = 1.6;

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
var ft, lf, bk, rt, debug ,sprint = false
const instructions = renderer.domElement.addEventListener( 'click', function () {
controls.lock();
} );
renderer.domElement.addEventListener('keydown',keydown);
renderer.domElement.addEventListener('keyup',keyup);
//Attach listeners to functions
var camPos=camera.position
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
  case 'KeyT':
			debug = true;
			break;
  case 'KeyE':
      holdHold.start()
			break;
  case 'KeyC':
    let holde= new THREE.Object3D();
      holde.quaternion.copy(camera.quaternion);
      holde.position.copy(camera.position);
      holde.translateZ(-3)
      create(holde.position) //create a cube
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
var faar=3
// raycast and hold if hold
var isHolding=false // if u ar holding sumtin
let holding // what ur holding

class hold {
  constructor() {}
  cast(){ 
     raycaster.setFromCamera( new THREE.Vector2(), camera );  
	   const intersects = raycaster.intersectObjects( 
     pickable.children ); 
	   if (intersects.length ) { 
		   return intersects[0].object
	   } 
     else{return false}
  }
  start(){
    let item = this.cast();
    if(item){
      if(!isHolding){// start holding
      isHolding=true
      holding=item
      item.isPhysic=false
      } else {  // end holding 
        isHolding=false
        item.isPhysic=true
        holding=false
      }
    }
  }
  tick(){ // run every frame to move holding item
  if(isHolding){ 
    holding.quaternion.copy(camera.quaternion);
    holding.position.copy(camera.position);
    holding.translateZ(-3)
    let pos=holding.position
    let cam=camera.position
    holding.lookAt(cam.x,pos.y,cam.z)
  }
  }
  
}
const holdHold= new hold()

// objectDestroyer
function removeObject3D(object3D) {
    if (!(object3D instanceof THREE.Object3D)) return false;

    // for better memory management and performance
    if (object3D.geometry) object3D.geometry.dispose();
    if (object3D.physic) world.removeBody(object3D.physic);
    if (object3D.material) {
        if (object3D.material instanceof Array) {
            // for better memory management and performance
            object3D.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object3D.material.dispose();
        }
    }
    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
}
// add object for pickables
let pickable = new THREE.Object3D();
  scene.add(pickable);
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
cube.mesh.physic=groundBody

// physics cube
for (let fi = -1; fi < 25; fi++) {create(new THREE.Vector3(randInt(-15,15), 3, randInt(-15,15)))}
create(new THREE.Vector3(0,3,0))
function create(pos){
let texture4 = loadImg('tex/blocks/block'+randInt(1,10)+'.jpg',1,1);
let cube2 = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshStandardMaterial( {
color: 0xffffff,map: texture4,} )
};
cube2.mesh = new THREE.Mesh(cube2.geometry, cube2.material);
scene.add(cube2.mesh);
cube2.mesh.position.copy(pos)
cube2.mesh.rotateY(randInt(1,360))
//cannonJS
let cubeBody = new CANNON.Body({
  mass: 100, // kg
  shape: new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5)),
position: cube2.mesh.position,
quaternion: cube2.mesh.quaternion
})
world.addBody(cubeBody)
cube2.mesh.physic=cubeBody
cube2.mesh.isPhysic=true
physicObj.push(cube2)
pickable.add(cube2.mesh); 
  return cube2
} // font text load
const loader = new FontLoader();

loader.load( './tex/oxygen.json', function ( font ) {

	const geometry = new TextGeometry( 'cube stacking simulator 4', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	});
let mat = new THREE.MeshStandardMaterial({color: 0xffffff});
  let textMesh1 = new THREE.Mesh( geometry, mat );
      textMesh1.scale.set(0.01,0.01,0.01)
      textMesh1.position.set(-6,3,-15)
      console.log(textMesh1);scene.add(textMesh1)                             
  
} ); 
//add ambientLight
const color = 0xFFFFFF;
const intensity = 0.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// add pointLight
const light2 = new THREE.PointLight(color, intensity);
light2.position.set(0, 10, 0);
scene.add(light2);

// mr grabby
const raycaster = new THREE.Raycaster();
let lookingAt=[]
function reset() { 
    // restore the colors
    lookingAt.forEach((object) => { 
      if (object.material  ) {
      object.material.emissive.setHex(0x000000); 
      lookingAt.pop()
      }
    });
}   
raycaster.far=faar
function stare() { 
  reset()
  raycaster.setFromCamera( new THREE.Vector2(), camera );  
	const intersects = raycaster.intersectObjects( pickable.children );
	if (intersects.length) { 
		if (intersects[0].object.material.emissive){
    lookingAt.push(intersects[0].object)
    intersects[0].object.material.emissive.setHex(0x3d3d3d);
    }
	}
}
window.addEventListener( 'pointermove', stare );
let speed=0.15
// RENDER LOOP -----------------------------
function render() { 
  if(debug){
 cannonDebugger.update()}
  world.fixedStep()
  
  for (let x = 0; x < physicObj.length; x++) {
if  (physicObj[x].mesh.isPhysic) {physicObj[x].mesh.position.copy(physicObj[x].mesh.physic.position)
 physicObj[x].mesh.quaternion.copy(physicObj[x].mesh.physic.quaternion) 
if(physicObj[x].mesh.physic.position.y<-10 ){ // remove item
  removeObject3D(physicObj[x].mesh)
  removeObject3D(physicObj[x])
}     
} else { //physicObj[x].mesh.physic.wakeUp(); --fixy
        physicObj[x].mesh.physic.position.copy(physicObj[x].mesh.position)
  physicObj[x].mesh.physic.quaternion.copy(physicObj[x].mesh.quaternion) 
physicObj[x].mesh.physic.velocity=new CANNON.Vec3(0,0,0)
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
// do a tick on holder holder
holdHold.tick()
  // Render the scene and the camera
  renderer.render(scene, camera);

  // Rotate the cube every frame
  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();