import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('load', function() {
  init();
});

async function init() {
  
  const renderer = new THREE.WebGLRenderer({
    antialias:true
  });

  // renderer.outputColorSpace = THREE.outputColorSpace;
  renderer.shadowMap.enabled=true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );

  

  // const axesHelper = new THREE.AxesHelper(5);

  // scene.add(axesHelper);

  
  camera.position.set(0,5,20);

  const controls = new OrbitControls(camera, renderer.domElement);


  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 3;

  const progressBar = document.querySelector('#progress-bar');
  const progressBarContainer = document.querySelector('#progress-bar-container');


  const loadingManager = new THREE.LoadingManager();


  loadingManager.onProgress=(url, loaded, total) => {
    // console.log({loaded, total});
    progressBar.value = (loaded/total)*100;
  };

  loadingManager.onLoad = () => {
    progressBarContainer.style.display = 'none';
  };


  // const gltfLoader = new GLTFLoader(loadingManager);
  const gltfLoader = new GLTFLoader(loadingManager);

  const gltf = await gltfLoader.loadAsync('./models/character.gltf');

  console.log('gltf', gltf);

  const model = gltf.scene;

  model.scale.set(0.1, 0.1, 0.1);

  model.traverse(object => {
    if(object.isMesh) {
      object.castShadow = true;
    }
  });
  scene.add(model);

  camera.lookAt(model.position);

  const planeGeometry = new THREE.PlaneGeometry(10000,10000,10000);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color:0x000000,

  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI/2;
  plane.position.y=-7.5;
  plane.receiveShadow =true;

  scene.add(plane);

 

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);

  hemisphereLight.position.set(0, 20, 10);

  scene.add(hemisphereLight);

  const spotLight = new THREE.SpotLight(0xffffff, 2, 30, Math.PI*0.15, 0.5, 0.5);
  spotLight.position.set(0,20,0);
  spotLight.castShadow=true;
  spotLight.shadow.mapSize.width=1024;
  spotLight.shadow.mapSize.height=1024;
  spotLight.shadow.radius = 8;

  scene.add(spotLight);

  const mixer = new THREE.AnimationMixer(model);
  
  const buttons = document.querySelector('.actions');

  let currentAction;

  const combatAnimations = gltf.animations.slice(0, 7);

  combatAnimations.forEach(animation => {
    const button = document.createElement('button');

    button.innerText = animation.name;
    buttons.appendChild(button);
    button.addEventListener('click', () => {

      const previousAction = currentAction;
      currentAction = mixer.clipAction(animation);

      if (previousAction !== currentAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
      // currentAction.fadeOut(.5);
    });
  });

  const hasAnimation = gltf.animations.length !== 0;
  if (hasAnimation) {
    currentAction = mixer.clipAction(gltf.animations[0]);
    currentAction.play();
  }

  const clock = new THREE.Clock();
  // }
  // mixer.clipAction(gltf.animations[0]);

  render();



  function render() {
    const delta = clock.getDelta();
    mixer.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  
  window.addEventListener('resize', handleResize);
}