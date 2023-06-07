import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


window.addEventListener('load', function() {
  init();
});

async function init() {
  gsap.registerPlugin(ScrollTrigger);

  const params = {
    waveColor:'#00ffff',
    backgroundColor:'#ffffff',
    fogColor:'#f0f0f0',
  };

  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha:true,
    canvas,
  }); 

  renderer.shadowMap.enabled=true;
  // renderer.setClearColor('#00ccff', 0.5);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);
  // scene.fog = new THREE.FogExp2(0xf0f0f0, 0.005);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );

  

  // const axesHelper = new THREE.AxesHelper(5);

  // scene.add(axesHelper);

  
  camera.position.set(0, 25, 150);

  const waveGeometry = new THREE.PlaneGeometry(1500,1500,150,150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    // wireframe:true,
    color:params.waveColor,
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  wave.rotation.x = -Math.PI/2;
  wave.receiveShadow=true;

  const waveHeight = 3;


  const initialZPositions = [];
  for (let i = 0; i <waveGeometry.attributes.position.count; i++) {
    // waveGeometry.attributes.position.array[i+2] += (Math.random() - 0.5) * 5;
    const z = waveGeometry.attributes.position.getZ(i) + (Math.random() - 0.5) * 5;
    waveGeometry.attributes.position.setZ(i,z);
    initialZPositions.push(z);
  }

  wave.update = function() {
    const elapsedTime = clock.getElapsedTime();
    for (let i=0; i< waveGeometry.attributes.position.count; i++) {

     const z =  initialZPositions[i]+Math.sin(elapsedTime * 3 + i**2) * waveHeight; 

     waveGeometry.attributes.position.setZ(i,z);
      // waveGeometry.attributes.position.array[i+2] = Math.sin(elapsedTime *3) * waveHeight;
    }

    waveGeometry.attributes.position.needsUpdate = true;
  }

  scene.add(wave);



  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.castShadow =true;
  pointLight.shadow.mapSize.width=1024;
  pointLight.shadow.mapSize.height=1024;
  pointLight.shadow.radius=10;
  
  pointLight.position.set(15,15,15);

  scene.add(pointLight);

  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.loadAsync('./model/scene.gltf');
  // console.log(gltf);
  const ship = gltf.scene;

  ship.castShadow = true;
  ship.traverse(object => {
    if(object.isMesh) {
      object.castShadow=true;
    }
  });

  ship.rotation.y = Math.PI;
  ship.scale.set(5,5,5);

  ship.update=function() {
    const elapsedTime = clock.getElapsedTime();
    ship.position.y = Math.sin(elapsedTime*3);
  };

  scene.add(ship);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-15, 15, 15);
  directionalLight.castShadow =true;
  directionalLight.shadow.mapSize.width=1024;
  directionalLight.shadow.mapSize.height=1024;
  directionalLight.shadow.radius=10;
  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();



  function render() {

    wave.update();
    ship.update();

    camera.lookAt(ship.position);
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

  // gsap.to(params, {
  //   waveColor: '#2468ff',
  //   onUpdate:() => {
  //     waveMaterial.color = new THREE.Color(params.waveColor);
  //   },
  //   scrollTrigger: {
  //     trigger:'.wrapper',
  //     start:'top top',
  //     markers:true,
  //     scrub:true,
  //   },
  // });

  // gsap.to(params, {
  //   backgroundColor: '#2a2a2a',
  //   onUpdate:() => {
  //     scene.background = new THREE.Color(params.backgroundColor);
  //   },
  //   scrollTrigger: {
  //     trigger:'.wrapper',
  //     start:'top top',
  //     markers:true,
  //     scrub:true,
  //   },
  // });

  const tl = gsap.timeline ({
    scrollTrigger: {
      trigger:'.wrapper',
      start:'top top',
      end:'bottom bottom',
      markers:true,
      scrub:true,
    },
  });

  tl
    .to(params, {
      waveColor: '#4268ff',
      onUpdate:() => {
        waveMaterial.color = new THREE.Color(params.waveColor);
      },
      duration:1.5,
  })
    .to(params, {
      backgroundColor: '#2a2a2a',
      onUpdate:() => {
        scene.background = new THREE.Color(params.backgroundColor);
      },
      duration:1.5,
    }, '<')
    .to(params, {
      fogColor:'#2f2f2f',
      onUpdate:() => {
        scene.fog.color = new THREE.Color(params.fogColor);
      },
      duration:1.5,
    }, '<')
    .to(camera.position, {
      x:100,
      z:-50,
      duration:2.5,
    })
    .to(ship.position, {
      z:150,
      duration:2,
    })
    .to(camera.position, {
      z:-50,
      y:25,
      z:100,
      duration:2,
    })
    .to(camera.position, {
      x:0,
      y:50,
      z:300,
      duration:2,
    });

    gsap.to('.title', {
      opacity:0,
      scrollTrigger: {
        trigger:'.wrapper',
        scrub:true,
        pin:true,
        end:'+=1000',
      },
    });
}

