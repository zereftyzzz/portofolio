import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/assets/monochrome_studio_02_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
})


// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 0, 5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: "high-performance"
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio))

renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1  
renderer.setClearColor(0x000000, 1)



// // Subtle base light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
// scene.add(ambientLight)

// // Key light (front high)
// const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
// keyLight.position.set(3, 5, 5)
// scene.add(keyLight)

// // Rim light (back)
// const rimLight = new THREE.DirectionalLight(0xffffff, 3)
// rimLight.position.set(0, 4, -5)
// scene.add(rimLight)

// Very low ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

// Strong side key light
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
keyLight.position.set(5, 2, 5)
scene.add(keyLight)

// Strong rim from back
const rimLight = new THREE.DirectionalLight(0xffffff, 3)
rimLight.position.set(0, 3, -5)
scene.add(rimLight)




// Loader
const loader = new GLTFLoader()

let model

loader.load(
  '/models/greek_sculpture_2k.glb', 
  (gltf) => {
    model = gltf.scene
    scene.add(model)

    // Center model
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)

    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals()
        child.material = new THREE.MeshStandardMaterial({
          color: 0x050505,     // not pure black, slightly lifted
          metalness: 1,
          roughness: 0.2
        })
      }
    })




  }
)

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animation loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()

  if (model) {
    model.rotation.y = elapsedTime * 0.2
  }

  renderer.render(scene, camera)
}

animate()
