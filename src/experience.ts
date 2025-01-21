import * as THREE from 'three';

class Experience {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  constructor() {
    this.scene = new THREE.Scene();
    this.setupCamera();
    this.renderer = new THREE.WebGLRenderer();
    this.setupRenderer();
    this.setupCube();
    this.setupEventListeners();
    this.animate();
  }

  private setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  private setupCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private setupEventListeners() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(width, height);
    });
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    
    this.renderer.render(this.scene, this.camera);
  }
}

export default Experience;