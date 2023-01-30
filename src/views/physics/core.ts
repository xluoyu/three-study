import * as THREE from 'three'
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import { BufferGeometryUtils } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const params = {
  sphereSize: 1, // 小球大小
  simulationSpeed: 1, // 运动速度
  displayCollider: false
}

let renderer:THREE.WebGLRenderer,
scene:THREE.Scene,
camera:THREE.PerspectiveCamera,
stats:Stats,
collider:THREE.Mesh

const spheres: THREE.Mesh[] = []


/**
 * 创建场景、灯光、相机等初始工具
 * @param width 
 * @param height
 * @param el 
 */
function createWork(width: number, height: number, el: HTMLElement) {
  const bgColor = 0x263238 / 2;

  renderer = new THREE.WebGLRenderer({ antialias: true})
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize(width, height)
  renderer.setClearColor( bgColor, 1 );
  renderer.shadowMap.enabled = true // 开启阴影贴图
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding; // 输出为RGB

  el.appendChild( renderer.domElement )

  scene = new THREE.Scene()
	scene.fog = new THREE.Fog( bgColor, 30, 70 ); // 场景中的雾

  const light = new THREE.DirectionalLight(0xaaccff, 0.25) // 平行光， 颜色， 强度
  light.position.set( 1, 1.5, 1 ).multiplyScalar( 50 );

  const shadowCam = light.shadow.camera // 平行光的内部计算阴影
  shadowCam.bottom = shadowCam.left = - 10;
	shadowCam.top = shadowCam.right = 10;

  scene.add(light)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 300)
  camera.position.set(10, 10, -10)
  camera.updateProjectionMatrix();


  new OrbitControls( camera, renderer.domElement );

  stats = new Stats()
  el.appendChild(stats.dom)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, false)


  const gui = new GUI()
  gui.add( params, 'sphereSize', 1, 5, 1 );
  gui.add( params, 'displayCollider');


  gui.open()


  return {
    
  }
}

/**
 * 加载模型
 * @param scene 
 */
function loadCollider() {
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

		const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)

		collider = new THREE.Mesh( mergedGeometry );
		collider.material.wireframe = true;
		collider.material.opacity = 0.5;
		collider.material.transparent = true;

    console.log(collider)

		scene.add( collider );
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

  const radius = 0.5 * params.sphereSize * ( Math.random() * .2 + 0.6 );
	sphere.scale.setScalar( radius );

  sphere.collider = new THREE.Sphere( sphere.position, radius );
  sphere.velocity = new THREE.Vector3( 0, 0, 0 );

  spheres.push(sphere)
  scene.add( sphere )

  
  return sphere

}

function addEvent() {
  const element = renderer.domElement

	let x = 0, y = 0;

  const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
  /**
   * 不直接使用click事件是因为，在拖动模型时也会触发click
   * 
   * 通过down && up 进行移动坐标判断，区分拖动与click
   */
  element.addEventListener('pointerdown', e => {
		x = e.clientX
		y = e.clientY
	})

	element.addEventListener('pointerup', e => {
		const totalDelta = Math.abs( e.clientX - x) + Math.abs( e.clientY - y)
		if (totalDelta > 2) return // 说明鼠标有移动，不是点击

		const sphere = createSphere();

		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
    
    /**
     * 1. 将小球的坐标改为与相机一致
     * 2. 将鼠标事件发出的坐标与相机坐标相加: addScaledVector(Vector3: 三维向量, Float：偏移量-类似于z轴 )
     */
		sphere.position.copy( camera.position ).addScaledVector( raycaster.ray.direction, 6 );

    sphere
			.velocity
			.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 )
			// .addScaledVector( raycaster.ray.direction, 10 * Math.random() + 15 )
		// 	.multiplyScalar( 0.5 );

	})

}

function updateSphereCollisions(deltaTime: number) {
  const bvh = collider.geometry.boundsTree;
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i]
    const sphereCollider = sphere.collider;

    sphere.velocity.y += -5 * deltaTime;

    sphereCollider.center.addScaledVector( sphere.velocity, deltaTime );

		// remove the spheres if they've left the world
		if ( sphereCollider.center.y < - 80 ) {

			spheres.splice( i, 1 );
			i --;

			sphere.material.dispose();
			sphere.geometry.dispose();
			scene.remove( sphere );
			continue;
		}
  }
}

function update(delta:number) {
  const steps = 5;
  for ( let i = 0; i < steps; i ++ ) {

    updateSphereCollisions( delta / steps );

  }
}


export function init(width: number, height: number, el: HTMLElement) {
  createWork(width, height, el)

  loadCollider()

  addEvent()

  const clock = new THREE.Clock();

  function render() {
    stats.update()
    requestAnimationFrame( render );

    const delta = Math.min( clock.getDelta(), 0.1 );

    if (collider) {
      collider.visible = params.displayCollider;
      update( params.simulationSpeed * delta );
    }


    renderer.render( scene, camera );
  }

  render()
}
