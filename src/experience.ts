import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Sparkler from "./sparkler/sparkler";
import { GUI } from "dat.gui";

class Experience {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sparkler!: Sparkler;
  private controls!: OrbitControls;

  constructor(domElement: HTMLElement) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: domElement, antialias: true });

    this.setupCamera();
    this.setupControls();
    this.setupRenderer();
    this.setupSparkler();
    this.setupEventListeners();
    this.setupGUI();
    this.render();
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

  private setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private setupSparkler() {
    this.sparkler = new Sparkler(0.1, 3, 32);
    this.scene.add(this.sparkler);
  }

  private setupEventListeners() {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    });
  }

  private setupGUI() {
    const gui = new GUI();
    gui.add({ t: 0 }, "t").min(0).max(1).step(0.01).name("t").onChange((t: number) => this.sparkler.update(t));
  }

  private update = () => {};

  private render = () => {
    requestAnimationFrame(this.render);
    this.update();
    this.renderer.render(this.scene, this.camera);
  };
}

export default Experience;
