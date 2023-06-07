import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


window.addEventListener('load', function() {
  init();
});

function init() {
  
  const renderer = new THREE.WebGLRenderer({
    antialias:true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );

  

  // const axesHelper = new THREE.AxesHelper(5);

  // scene.add(axesHelper);

  
  camera.position.z=100;

  /** 큐브맵 공간표현 1 */
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance=5;
  // controls.maxDistance=1000;

  // const textureLoader = new THREE.TextureLoader().setPath('./SanFrancisco/');

  // const image = [
  //   'posx.jpg', 'negx.jpg',
  //   'posy.jpg', 'negy.jpg',
  //   'posz.jpg', 'negz.jpg',
  // ];

  // // THREE.CubeTexture;

  // const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
  // // const material = new THREE.MeshPhongMaterial({
  // //   color: 0xaaccee,
  // //   side: THREE.BackSide,
  // // });
  // const materials = image.map(image => new THREE.MeshBasicMaterial({
  //   map: textureLoader.load(image),
  //   side: THREE.BackSide,
  // }));

  // const skybox = new THREE.Mesh(geometry, materials);

  // scene.add(skybox);

  // const pointLight = new THREE.PointLight(0xffffff, 0.8);

  // scene.add(pointLight);


   /** 큐브맵 공간표현 2 */
  //   new OrbitControls(camera, renderer.domElement);
  //  const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('./SanFrancisco/');
  // const images = [
  //   'posx.jpg', 'negx.jpg',
  //   'posy.jpg', 'negy.jpg',
  //   'posz.jpg', 'negz.jpg',
  // ];

  // const cubeTexture = cubeTextureLoader.load(images);

  // scene.background=cubeTexture;


     /** 큐브맵 공간표현 3 - panorama */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableDamping=true;
    controls.autoRotate=true;
    controls.autoRotateSpeed=0.5;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./SanFrancisco/seaside.jpg');

    texture.mapping= THREE.EquirectangularRefractionMapping;
    
    scene.background = texture;

    const sphereGeometry = new THREE.SphereGeometry(30,50,50);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      envMap: texture,
      refractionRatio:0.05,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    scene.add(sphere);

  render();



  function render() {
    controls.update();
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