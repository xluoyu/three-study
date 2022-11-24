import { AmbientLight, BackSide, Color, DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, RGBFormat, Scene, SphereGeometry, TextureLoader, Vector3, VideoTexture, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function init(root:HTMLElement, width?: number, height?:number) {
  width = width || window.innerWidth
  height = height || window.innerHeight
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
  const camera = new PerspectiveCamera(90, width / height, 1, 2000)
  camera.position.set(1,0,0)
  camera.aspect = width / height

  camera.updateProjectionMatrix()

  /**
   * 渲染器
   * 
   * antialias: 抗锯齿
   */
  const renderer = new WebGLRenderer({ antialias: true})
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio);

  root.appendChild(renderer.domElement)

  // window.addEventListener('resize', () => {
  //   renderer.setSize(window.innerWidth, window.innerHeight)
  //   camera.aspect = window.innerWidth / window.innerHeight
  //   camera.updateProjectionMatrix()
  // })

  

  /**
   * 控制器
   * 
   * enableDamping: 惯性
   */
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false // 关闭缩进
  controls.rotateSpeed = 0.5;
  controls.dampingFactor = 0.05;

  /**
   * 灯光
   */
  const light = new AmbientLight( 0xffffff, 1 ); // soft white light
  scene.add( light );


  const video = document.getElementById( 'video' ) as HTMLVideoElement;
  video.play()
  const texture = new VideoTexture( video )
  texture.minFilter = LinearFilter;
  texture.format = RGBFormat;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

  const geometry = new SphereGeometry(300, 90, 90) // 生成一个几何体
  geometry.scale(-1, 1, 1);
  const material = new MeshBasicMaterial( {map: texture } );
  
  const cube = new Mesh( geometry, material );
  // cube.position.set(0,0,0)
  scene.add( cube );

  scene.background = new Color(0xffffff)
  run()

  function run() {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(run)
  }


  return function(width, height) {
    renderer.setSize(width,height)
    camera.aspect = width /height
    camera.updateProjectionMatrix()
  }
}