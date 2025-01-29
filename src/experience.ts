import * as THREE from "three";
import Sparkler from "./sparkler/sparkler";
import { PostprocessingRenderer as Renderer } from "./renderer";
import { lerpRotation } from "./utils";
import { EXRLoader } from "three/examples/jsm/Addons.js";

const constants = {
  interpolationSpeed: 5,
  trackMouse: true,
  animate: true,
};

class Experience {
  private renderer!: Renderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sparkler!: Sparkler;
  private clock = new THREE.Clock();
  private mouse = new THREE.Vector2();

  constructor(domElement: HTMLElement) {
    this.setupCamera();
    this.setupRenderer(domElement);
    this.setupSparkler();
    this.setupLights();
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
    const webGL = new THREE.WebGLRenderer({
      canvas: domElement,
      antialias: true,
    });

    webGL.outputColorSpace = THREE.SRGBColorSpace;
    webGL.toneMapping = THREE.ACESFilmicToneMapping;
    webGL.toneMappingExposure = 1;

    this.scene = new THREE.Scene();
    this.renderer = new Renderer(webGL, this.scene, this.camera);
    this.renderer.setResolution(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );
  }

  private setupSparkler() {
    this.sparkler = new Sparkler(0.025, 3);
    this.sparkler.position.set(0, -1, 0);
    this.scene.add(this.sparkler);
  }

  private setupLights() {
    const folder = window.gui.addFolder("Lights");

    new EXRLoader().load("hansaplatz_2k.exr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = texture;
      this.scene.backgroundIntensity = 0.1;
      this.scene.backgroundBlurriness = 0.6;
      this.scene.environment = texture;
      this.scene.environmentIntensity = 0.6;

      folder.add(this.scene, "backgroundIntensity", 0, 1, 0.01).name("Background Intensity");
      folder.add(this.scene, "environmentIntensity", 0, 1, 0.01).name("Environment Intensity");
      folder.add(this.scene, "backgroundBlurriness", 0, 1, 0.01).name("Background Blurriness");
    });
  }

  private setupEventListeners() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setResolution(width, height, window.devicePixelRatio);
      this.sparkler.setResolution(width, height);
    });

    canvas.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    canvas.addEventListener("mousedown", () => {
      if (this.sparkler.isSparkling) {
        this.sparkler.stop();
      } else {
        this.sparkler.play();
      }
    });
  }

  private setupGUI() {
    const folder = window.gui.addFolder("Controls");
    folder.add(this.sparkler.audioPlayer, "enabled").name("Enable Sound");
    const trackMouse = folder.add(constants, "trackMouse").name("Track Mouse");

    const interpolationSpeed = folder
      .add(constants, "interpolationSpeed")
      .min(1)
      .max(10)
      .step(0.1)
      .enable(constants.trackMouse)
      .name("Interpolation Speed");

    trackMouse.onChange((value: boolean) => {
      interpolationSpeed.enable(value);
    });
  }

  private followMouse = (delta: number) => {
    const alpha = delta * constants.interpolationSpeed;

    // Rotation
    const rotationX = (Math.PI / 4) * (this.mouse.y - 0.5);
    const rotationZ = (Math.PI / 2) * -this.mouse.x;
    this.sparkler.rotation.setFromQuaternion(
      lerpRotation(
        this.sparkler.rotation,
        new THREE.Euler(rotationX, 0, rotationZ),
        alpha
      )
    );

    // Position
    const positionX = this.mouse.x * 3;
    const positionY = -1 + this.mouse.y;
    this.sparkler.position.lerp({ x: positionX, y: positionY, z: 0 }, alpha);
  };

  private update = (delta: number) => {
    if (constants.trackMouse) {
      this.followMouse(delta);
    }

    if (constants.animate) {
      this.sparkler.update(delta);
    }
  };

  private render = () => {
    const delta = this.clock.getDelta();
    this.update(delta);
    this.renderer.render(delta);
    requestAnimationFrame(this.render);
  };
}

export default Experience;
