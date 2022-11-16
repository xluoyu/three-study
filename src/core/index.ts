import * as THREE from 'three' // https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置相机位置， x、y、z
  camera.position.set(100,100,100)
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机
  camera.updateProjectionMatrix()

  const loader = new THREE.TextureLoader()
  const bg = loader.load("/assets/sky_linekotsi_19.JPG")
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
  controls.autoRotate = true
  // controls.enableRotate = false

  // const geometry = new THREE.SphereGeometry(2) // 生成一个几何体
  // const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

  // const cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );

  const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light

  // light.position.set(50,50,0)
  scene.add( light );


  const gltfLoader = new GLTFLoader()
  gltfLoader.load("/assets/tesla/scene.gltf", (gltf) => {
    const model = gltf.scene
    model.scale.set(0.2,0.2,0.2)
    // model.material = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   envMap: bg,
    //   refractionRatio: 0.78,
    //   reflectivity: 0.99,
    //   // opacity: 0.5
    // })
    // console.log(model)
    scene.add(model)

    scene.traverse(child => {
      if (child.isMesh) {
          console.log(child.name)
          if (child.name.includes('door_') && child.name.includes('door_')) {
              child.material.color.set(0x00aeec)
              // child.material.envMap= bg;
              // child.material.envMap.mapping = THREE.EquirectangularReflectionMapping;
              // child.material.envMapIntensity=1;
          }
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

  // const gridHelper = new THREE.GridHelper();
  // scene.add( gridHelper );

  const clock = new THREE.Clock();

  loop()

  function loop() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
    
  }
}


  