import { AmbientLight, BackSide, DoubleSide, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, Scene, SphereGeometry, TextureLoader, Vector3, VideoTexture, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function init(root:HTMLElement) {
  /**
   * 创建一个场景
   */
  const scene = new Scene();

  /**
   * 透视相机，模拟人眼
   * 
   * aspect： 长宽比
   * updateProjectionMatrix： 相机参数修改之后的更新
   */
  const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0,0,20)
  camera.aspect = window.innerWidth / window.innerHeight

  camera.updateProjectionMatrix()

  /**
   * 渲染器
   * 
   * antialias: 抗锯齿
   */
  const renderer = new WebGLRenderer({ antialias: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio);

  root.appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  /**
   * 控制器
   * 
   * enableDamping: 惯性
   */
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false // 关闭缩进
  const v = new Vector3( 50, 0, 0 ) // 定义一个方向
  /**
   * 修改摄像头的方向
   */
  camera.lookAt(v)
  controls.target = v


  /**
   * 灯光
   */
  const light = new AmbientLight( 0xffffff, 1 ); // soft white light
  scene.add( light );


  const video = document.getElementById( 'video' ) as HTMLVideoElement;
  video.play()
  const texture = new VideoTexture( video )

  const geometry = new SphereGeometry(1000) // 生成一个几何体
  const material = new MeshBasicMaterial( {color: 0xffffff, map: texture, side: BackSide, precision: 'highp'} );

  const cube = new Mesh( geometry, material );
  scene.add( cube );

  run()

  function run() {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(run)
  }
}