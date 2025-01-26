import * as THREE from "three";
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

class Renderer {
  private composer: EffectComposer;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    this.setupBloomPass();
    this.composer.addPass(new OutputPass());
  }

  setupBloomPass() {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.composer.addPass(bloomPass);
  }

  setSize(width: number, height: number) {
    this.composer.setSize(width, height);

    for (const pass of this.composer.passes) {
      if ("setSize" in pass) {
        pass.setSize(width, height);
      }
    }
  }

  render(deltaTime?: number) {
    this.composer.render(deltaTime);
  }
}

export default Renderer;
