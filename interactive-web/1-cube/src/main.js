import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';


window.addEventListener('load', function() {
  init();
});

function init() {
  const options = {
    color:0x00ffff,
  };
  const renderer = new THREE.WebGLRenderer({
    // alpha:true,
    antialias:true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.autoRotate = true;
  // controls.autoRotateSpeed = 10;
  controls.enableDamping = true;
  // controls.dampingFactor = 0.01;
  // controls.enableZoom=true;
  // controls.enablePan=true;
  // controls.maxDistance=50;
  // controls.minDistance=10;
  // controls.maxPolarAngle=Math.PI/2;
  // controls.minPolarAngle=Math.PI/2;


  const axesHelper = new THREE.AxesHelper(5);

  scene.add(axesHelper);

  const cubeGeometry = new THREE.IcosahedronGeometry(1);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    emissive:0x111111,

    // transparent:true,
    // opacity:0.5,    
    // visible: false,
    // // wireframe:true,
    // side:THREE.DoubleSide,


  });

  // material.color = new THREE.Color(0x00cB96);

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  const skeletonMateirlal = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color:0xaaaaaa,
  });

  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMateirlal);

  scene.add(cube, skeleton);

  camera.position.z=5;
  // camera.position.set(2,2,5);

  // camera.lookAt(cube.position);

  const directionalLight = new THREE.DirectionalLight(0xffffff,1);
  // directionalLight.position.set(-1,2,3);

  scene.add(directionalLight);

  // const ambientLight = new THREE.AmbientLight(0xfffff, 0.1);

  // scene.add(ambientLight);

  const clock = new THREE.Clock();

  render();



  function render() {
    const elapsedTime = clock.getElapsedTime();
    // cube.rotation.x = elapsedTime;
    // cube.rotation.y = elapsedTime;

    // skeleton.rotation.x = elapsedTime *1.5;
    // skeleton.rotation.y = elapsedTime * 1.5;
    // cube.rotation.x = THREE.MathUtils.degToRad(45);
    cube.rotation.x += clock.getDelta(); 
    // cube.rotation.y = Math.sin(cube.rotation.x);
    // cube.scale.x = Math.cos(cube.rotation.x);
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    controls.update();
  }
  window.addEventListener('resize', handleResize);
  const gui=new GUI();

  gui
    .add(cube.position, 'y')
    .min(-3)
    .max(3)
    .step(0.1);

  gui.add(cube, 'visible');

  gui
    .addColor(options, 'color')
    .onChange((value) => {
      cube.material.color.set(value);
    })
}