import * as THREE from 'three';
import typeface from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui'
// import { EffectComposer } 'three/examples/jsm/postprocessing/EffectComposer';

window.addEventListener('load', function() {
  init();
});

async function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias:true
  });

  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );

  camera.position.set(0,1,5);
  
  /** controls */
  new OrbitControls(camera, renderer.domElement);

  /** Font */
  const fontLoader = new FontLoader();

  fontLoader.load('./assets/fonts/Roboto_Regular.json',
  font => {
    const textGeometry = new TextGeometry('Three.js Interactive Web', {
      font,
      size:0.5,
      height:0.1,
      bevelEnabled:true,
      bevelSegments:5,
      bevelSize:0.02,
      bevelThickness:0.02,

    });
    const textMaterial = new THREE.MeshPhongMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);

    text.castShadow = true;

    textGeometry.center();

    /** Texture  */
    const textureLoader = new THREE.TextureLoader().setPath('./assets/textures/');

    const textTexture = textureLoader.load('holographic.jpeg');

    textMaterial.map = textTexture;


  const spotLightTexture = textureLoader.load('gradient.jpg');
  spotLight.map = spotLightTexture;

  spotLightTexture.encoding = THREE.sRGBEncoding;
  THREE.LinearEncoding;

    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
    //   -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
    //   -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5,
    // );
    console.log('textGeometry.boundingBox', textGeometry.boundingBox);
    

    scene.add(text);
  },
  );

  /** Plane */
  const planeGeometry = new THREE.PlaneGeometry(2000,2000);
  const planeMaterial = new THREE.MeshPhongMaterial({color: 0x000000});

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.position.z = -10;
  plane.receiveShadow = true;

  scene.add(plane);

  /** Ambientlight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

  scene.add(ambientLight);

  /** spotlight */
  const spotLight = new THREE.SpotLight(0xffffff, 1.5, 15, Math.PI * 0.15, 0.2, 0.5);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.position.set(0,0,3);
  spotLight.shadow.radius= 10;
  // spotLight.target.position(0,0,-3);
    /** Texture  */



  scene.add(spotLight, spotLight.target);

  window.addEventListener('mousemove', event => {
   const x = ((event.clientX / window.innerWidth) - 0.5) * 5;
   const y = -((event.clientY / window.innerHeight) - 0.5) * 5;

   spotLight.target.position.set(x,y,-3);
  });

  const spotLightFolder = gui.addFolder('SpotLight');
  spotLightFolder
    .add(spotLight.shadow, 'radius')
    .min(1)
    .max(20)
    .step(0.01)
    .name('shadow.radius')


  // /** Pointlight */

  // const pointLight = new THREE.PointLight(0xffffff, 0.5);
  // // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);

  // pointLight.position.set(3, 0, 2);

  // scene.add(pointLight);

  // gui
  //   .add(pointLight.position, 'x')
  //   .min(-3)
  //   .max(3)
  //   .step(0.1);

  render();



  function render() {
    
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