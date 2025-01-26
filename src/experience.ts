import * as THREE from "three";
import Sparkler from "./sparkler/sparkler";
import Renderer from "./renderer";

const constants = {
  interpolationSpeed: 0.3,
  trackMouse: false,
  animate: true,
};

let t = 0;

class Experience {
  private renderer!: Renderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sparkler!: Sparkler;
  private mouse: THREE.Vector2 = new THREE.Vector2;

  constructor(domElement: HTMLElement) {
    this.setupCamera();
    this.setupRenderer(domElement);
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

  private setupRenderer(domElement: HTMLElement) {
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(
      new THREE.WebGLRenderer({
        canvas: domElement,
        antialias: true
      }),
      this.scene,
      this.camera
    );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private setupSparkler() {
    this.sparkler = new Sparkler(0.04, 3, 32);
    this.sparkler.position.set(0, -1, 0);
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

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  private setupGUI() {
    const trackMouse = window.gui
      .add(constants, "trackMouse")
      .name("Track Mouse");

    const interpolationSpeed = window.gui
      .add(constants, "interpolationSpeed")
      .min(0)
      .max(1)
      .step(0.01)
      .enable(constants.trackMouse)
      .name("Interpolation Speed");

    trackMouse.onChange((value: boolean) => {
      interpolationSpeed.enable(value);
    });

    window.gui
      .add({ t: 0 }, "t")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((t: number) => this.sparkler.update(t));
  }

  private rotateTowardsMouse = () => {
    const sourceQuaternion = new THREE.Quaternion().setFromEuler(
      this.sparkler.rotation
    );
    const targetQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        (Math.PI / 2) * (this.mouse.y - 0.5),
        0,
        (Math.PI / 2) * -this.mouse.x
      )
    );
    sourceQuaternion.slerp(targetQuaternion, constants.interpolationSpeed);
    this.sparkler.rotation.setFromQuaternion(sourceQuaternion);
  };

  private update = () => {
    if (constants.trackMouse) {
      this.sparkler.position.x = this.mouse.x * 3;
      this.sparkler.position.y = -1 + this.mouse.y;
      this.rotateTowardsMouse();
    }

    if (constants.animate) {
      this.sparkler.update((t++ / 500) % 1);
    }
  };

  private render = () => {
    requestAnimationFrame(this.render);
    this.update();
    this.renderer.render();
  };
}

export default Experience;
