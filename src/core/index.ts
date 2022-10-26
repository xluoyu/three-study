import * as THREE from 'three' // https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene
import { OrbitControls } from 'three-orbitcontrols-ts';

let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer

export function init (width:number, height:number, root:HTMLElement) {
  // 场景
  scene = new THREE.Scene();

  // 相机
  /**
   * 视角FOV, 在场景内可以看到的范围(角度)
   * 长宽比, 宽度除以高
   * near，能看多近
   * far， 能看多远
   */
  camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 100)
  // 设置相机位置， x、y、z
  camera.position.set(0, 0, 1)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  root.appendChild(renderer.domElement)

  new OrbitControls(camera, renderer.domElement)

  const geometry = new THREE.BoxGeometry(1,1,1)
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  loop()
}

function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}
  