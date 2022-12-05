import * as THREE from 'three'
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { BufferGeometry, BufferGeometryUtils } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

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

  scene.add(light)

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
  camera.position.set(10, 10, -10)
  camera.updateProjectionMatrix();


  new OrbitControls( camera, renderer.domElement );

  const stats = new Stats()
  el.appendChild(stats.dom)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, false)

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
    const model = res.scene
    model.scale.setScalar(0.05) // 缩放一下，模型有点大

    // 添加一些光源

    const pointLight = new THREE.PointLight(0x00ffff, 1, 8)
		// pointLight.distance = 7;
    pointLight.position.set(-100, -40, 100)
    model.add( pointLight )

    const porchLight = new THREE.PointLight(0xffdd66, 5, 15)
    porchLight.position.set(80, 90, 150)
    porchLight.shadow.normalBias = 1e-2;
		porchLight.shadow.bias = - 1e-3;
		porchLight.shadow.mapSize.setScalar( 1024 );
		porchLight.castShadow = true; // 对象是否被渲染到阴影贴图中

    model.add(porchLight)

    const geometries:THREE.BufferGeometry[]  = []; 
		model.updateMatrixWorld( true );
    model.traverse( (c) => {
      if (c.geometry) { // 找到model中的集合体
        const cloned = c.geometry.clone() // copy
				cloned.applyMatrix4( c.matrixWorld ); // 复制位置、旋转、缩放
				// 剔除除坐标外的所有属性

				for ( const key in cloned.attributes ) {
					if ( key !== 'position' ) {
						cloned.deleteAttribute( key );
					}
				}
        
				geometries.push(cloned)
      }

      if (c.material) { // GLTFMeshStandardSGMaterial
        c.castShadow = true; // 对象是否被渲染到阴影贴图中
				c.receiveShadow = true; // 材质是否接收阴影
				c.material.shadowSide = 2;
        // console.log(c)
      }
    })

		// const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)

		// const collider = new THREE.Mesh( mergedGeometry );
		// collider.material.wireframe = true;
		// collider.material.opacity = 0.5;
		// collider.material.transparent = true;

		// scene.add( collider );
    scene.add( model )
  })
}


function createSphere() {
  /**
   * .lerp ( color : Color, alpha : Float ) : this
color - 用于收敛的颜色。
alpha - 介于0到1的数字。

将该颜色的RGB值线性插值到传入参数的RGB值。alpha参数可以被认为是两种颜色之间的比例值，其中0是当前颜色和1.0是第一个参数的颜色。
   */
  const color = new THREE.Color(0x263238 / 2).lerp(new THREE.Color(0xffffff), Math.random() * 0.5 + 0.5);
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(), // 球几何体
    new THREE.MeshStandardMaterial({color}) // 网络材质
  )
  
  return sphere

}

function addEvent(scene: THREE.Scene, element: HTMLCanvasElement) {
	let x = 0, y = 0;

  element.addEventListener('pointerdown', e => {
		x = e.clientX
		y = e.clientY
	})

	element.addEventListener('pointerup', e => {
		const totalDelta = Math.abs( e.clientX - x) + Math.abs( e.clientY - y)
		if (totalDelta > 2) return

		const sphere = createSphere();

		
		scene.add( sphere )
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

  addEvent(scene, renderer.domElement)

  function render() {
    stats.update()
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }

  render()
}

