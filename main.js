import * as THREE from 'three';
import * as dat from 'dat.gui';

import earthMap from './img/earthMap.jpeg';
import moonMap from './img/moon-texture.jpg'
import moonHeightMap from './img/moon-displacement.jpg'
import skyImg from './img/sky.jpeg';
import cloud from './img/clouds.jpeg';
import heightMaping from './img/displaymentMap.png';

import planetVertexShader from './shader/planetVertex.glsl';
import planetFragmentShader from './shader/planetFragment.glsl';

import atmosphereVertexShader from './shader/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shader/atmosphereFragment.glsl';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );

const textureLoarder = new THREE.TextureLoader(); 

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight); 

//earth
const planetGeometry = new THREE.SphereGeometry(7,80,80);

const earthMaterial = new THREE.ShaderMaterial({vertexShader:planetVertexShader,fragmentShader:planetFragmentShader,uniforms:{planetTexure:{value:textureLoarder.load(earthMap)},heightMap:{value:textureLoarder.load(heightMaping)},displacementScale:{value:0.15}}});
const earth = new THREE.Mesh(planetGeometry, earthMaterial);
scene.add(earth);

//monon
const moonGeometry = new THREE.SphereGeometry(1.75,30,30);
const moonTexture =  textureLoarder.load(moonMap);
const moonDisplacementMap = textureLoarder.load(moonHeightMap);
const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: moonTexture,
    displacementMap: moonDisplacementMap,
    displacementScale: 0.05,
    bumpMap: moonDisplacementMap,
    bumpScale: 0.04,
})

const moon = new THREE.Mesh(moonGeometry,moonMaterial);
const moonObject = new THREE.Object3D();
moonObject.add(moon);
moon.position.y -= 1.5;
moon.position.x =11;

//light
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.z += 5;
scene.add(light);

//earth atmosphere 
const atmosphereGeometry = new THREE.SphereGeometry(7.7,20,20);
const atmosphereMaterial = new THREE.ShaderMaterial({vertexShader:atmosphereVertexShader,fragmentShader:atmosphereFragmentShader,blending:THREE.AdditiveBlending, side:THREE.BackSide});
const atmosphere = new THREE.Mesh(atmosphereGeometry,atmosphereMaterial);
scene.add(atmosphere);

//earth clouds
const cloudGeometry = new THREE.SphereGeometry(7.5,70,70);
const cloudMaterial = new THREE.MeshBasicMaterial({map:textureLoarder.load(cloud),transparent:true, opacity:0.3})
const cloudLayer = new THREE.Mesh(cloudGeometry,cloudMaterial);
scene.add(cloudLayer);

scene.background = textureLoarder.load(skyImg);
camera.position.z = 17;

const earthChanging = {
  rotationSpeed: 0.002,
  clouds: true
};

const moonChanging ={
  rotationSpeed: 0.002,
  revolutionSpeed: 0.004,
  show_moon: false
}

const gui = new dat.GUI();
const planet = gui.addFolder('Earth');
planet.add(earthChanging,"rotationSpeed",0,0.01);
planet.add(earthChanging, "clouds").onChange(
  function(){
    if(!earthChanging.clouds){
      scene.remove(cloudLayer);
    }
    else
      scene.add(cloudLayer);
  });

const satellite = gui.addFolder('Moon');
satellite.add(moonChanging,"rotationSpeed",0,0.01);
satellite.add(moonChanging,"revolutionSpeed",0,0.01);
satellite.add(moonChanging,"show_moon").onChange(
  function(){
    if(!moonChanging.show_moon)
      scene.remove(moonObject);
    else
      scene.add(moonObject);
  }
)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  earth.rotation.y += earthChanging.rotationSpeed;
 
  moonObject.rotateY(moonChanging.revolutionSpeed);
  moon.rotation.y += moonChanging.rotationSpeed;

  cloudLayer.rotation.y += earthChanging.rotationSpeed*1.1;
  cloudLayer.rotation.x += 0.00025;
   cloudLayer.rotation.z += 0.0003;
}

animate();

renderer.render(scene, camera);
