import * as THREE from 'three'
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * 创建场景、灯光、相机等初始工具
 * @param width 
 * @param height
 * @param el 
 */
function createWork(width: number, height: number, el: HTMLElement) {
  const bgColor = 0x263238 / 2;

  const renderer = new THREE.WebGLRenderer({ antialias: true})
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize(width, height)
  renderer.setClearColor( bgColor, 1 );
  renderer.shadowMap.enabled = true // 开启阴影贴图
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding; // 输出为RGB

  el.appendChild( renderer.domElement )

  const scene = new THREE.Scene()
	scene.fog = new THREE.Fog( bgColor, 30, 70 ); // 场景中的雾

  const light = new THREE.DirectionalLight(0xaaccff, 0.25) // 平行光， 颜色， 强度
  light.position.set( 1, 1.5, 1 ).multiplyScalar( 50 );

  const shadowCam = light.shadow.camera // 平行光的内部计算阴影
  shadowCam.bottom = shadowCam.left = - 10;
	shadowCam.top = shadowCam.right = 10;

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
  camera.position.set(10, 10, -10)
  camera.updateProjectionMatrix();

  scene.add(light)

  new OrbitControls( camera, renderer.domElement );

  const stats = new Stats()
  el.appendChild(stats.dom)

  return {
    renderer,
    scene,
    camera,
    stats
  }
}

/**
 * 加载模型
 * @param scene 
 */
function loadCollider(scene: THREE.Scene) {
  new GLTFLoader().load('/assets/physics/scene.gltf', res => {
    console.log(res)
  })
}



export function init(width: number, height: number, el: HTMLElement) {
  const {
    renderer,
    scene,
    camera,
    stats
  } = createWork(width, height, el)

  loadCollider(scene)

  function render() {
    stats.update()
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }

  render()
}

