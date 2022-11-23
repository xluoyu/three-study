import * as THREE from 'three' // https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer
export function init (width:number, height:number, root:HTMLElement) {
  // 场景
  scene = new THREE.Scene();
  // scene.background = new THREE.Color("rgb(30, 30, 30)")
  // 相机
  /**
   * 视角FOV, 在场景内可以看到的范围(角度)
   * 长宽比, 宽度除以高
   * near，能看多近
   * far， 能看多远
   */
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
  // 设置相机位置， x、y、z
  camera.position.set(30,30,20)
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机
  camera.updateProjectionMatrix()

  const loader = new THREE.TextureLoader()
  const bg = loader.load("/assets/car/sky_linekotsi_19.JPG")
  bg.mapping = THREE.EquirectangularRefractionMapping

  scene.background = bg
  scene.environment = bg

  renderer = new THREE.WebGLRenderer({ antialias: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新相机
    camera.updateProjectionMatrix()
  })

  root.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  // 控制器阻尼
  controls.enableDamping = true
  // controls.autoRotate = true
  // controls.enableRotate = false

  // const geometry = new THREE.SphereGeometry(2) // 生成一个几何体
  // const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

  // const cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );

  const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light

  // light.position.set(50,50,0)
  scene.add( light );

  const wheels = []

  const gltfLoader = new GLTFLoader()
  gltfLoader.load("/assets/car/tesla/scene.gltf", (gltf) => {
  // gltfLoader.load("/assets/rx8/scene.gltf", (gltf) => {
    const model = gltf.scene.children[0]

    model.position.y = 4
    model.scale.set(0.05,0.05,0.05)
    // model.material = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   envMap: bg,
    //   refractionRatio: 0.78,
    //   reflectivity: 0.99,
    //   // opacity: 0.5
    // })
    scene.add(model)

    const Testwheels = [...model.getObjectByName('wheels').children, ...model.getObjectByName('wheels001').children]
    // const Testwheels2 = 
    // // Testwheels.material = new THREE.MeshToonMaterial()
    // Testwheels.material.color = new THREE.Color(0xff7904)
    Testwheels.forEach(item => {
      item.material.color = new THREE.Color(0xff7904)
      wheels.push(item)
    })

  const dragControls = new DragControls(model, camera, renderer.domElement );
  dragControls.addEventListener( 'dragstart', function ( event ) {

    event.object.material.emissive.set( 0xaaaaaa );
  
  } );
  
  dragControls.addEventListener( 'dragend', function ( event ) {
  
    event.object.material.emissive.set( 0x000000 );
  
  } );


    scene.traverse(child => {
      if (child.isMesh) {
          /**
           * wheels 轮毂
           * 
           * door
           */
          if (child.name.includes('primary')) {
              // child.material.color.set(0x1d7dfa)
              // child.material.envMap= bg;
              // child.material.envMap.mapping = THREE.EquirectangularReflectionMapping;
              // child.material.envMapIntensity=1;
              // child.material = new THREE.MeshStandardMaterial();
              child.material.color=new THREE.Color(0x4dc4ff);
              child.material.metalness = 0.5;
              child.material.roughness = 0.2;
          }
        //   if (child.name.includes('wheels')) {
        //     child.material.color.set(0xff7904)
        //     // if (child.material.rotation) {
        //     // }
        //     wheels.push(child.material);
        // }
          if (child.name.includes('glass')) {
            child.material.envMap= bg;
            //环境反射贴图envMap的映射方式，这里用的是一个叫等量矩形投影的映射方法
            child.material.envMap.mapping = THREE.EquirectangularReflectionMapping;
            //环境反射贴图的强度
            child.material.envMapIntensity=5;
          }
      }
    })


  })

  const axesHelper = new THREE.AxesHelper( 40 );
  scene.add( axesHelper );

  const grid = new THREE.GridHelper(2000, 80);
    grid.material.opacity = 0.5;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add( grid );
  
  loop()


  function loop() {
    const time = - performance.now() / 1000;

    wheels.forEach(child => {
      child.rotation.x = time * 1.5 * Math.PI
    })
    grid.position.z += 0.6
    if (grid.position.z > 500) {
      grid.position.z = 0
    }

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
  }
}


  