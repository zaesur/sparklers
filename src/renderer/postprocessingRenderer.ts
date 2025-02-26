import * as THREE from "three";
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  AfterimagePass,
  UnrealBloomPass,
  SMAAPass,
} from "three/examples/jsm/Addons.js";

const defaultSettings = {
  afterImage: {
    enabled: true,
    damp: 0.45,
  },
  bloom: {
    enabled: true,
    strength: 2,
    radius: 0.5,
    threshold: 0.85,
  },
};

class Renderer {
  private composer: EffectComposer;
  private folder = window.gui.addFolder("Post Processing");

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.composer = new EffectComposer(renderer);
    this.setupRenderPass(scene, camera);
    this.setupAfterImagePass();
    this.setupBloomPass();
    this.setupAAPass();
    this.setupOutputPass();
  }

  setupRenderPass(scene: THREE.Scene, camera: THREE.Camera) {
    this.composer.addPass(new RenderPass(scene, camera));
  }

  setupOutputPass() {
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  setupAAPass() {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    this.composer.addPass(smaaPass);
  }

  setupBloomPass() {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      defaultSettings.bloom.strength,
      defaultSettings.bloom.radius,
      defaultSettings.bloom.threshold
    );
    this.composer.addPass(bloomPass);

    this.folder.add(bloomPass, "enabled").name("Bloom enabled");
    this.folder
      .add(bloomPass, "strength")
      .name("Bloom strength")
      .min(0)
      .max(3)
      .step(0.01);
    this.folder
      .add(bloomPass, "radius")
      .name("Bloom radius")
      .min(0)
      .max(5)
      .step(0.1);
    this.folder
      .add(bloomPass, "threshold")
      .name("Bloom threshold")
      .min(0)
      .max(1)
      .step(0.01);
  }

  setupAfterImagePass() {
    const afterImagePass = new AfterimagePass(defaultSettings.afterImage.damp);
    this.composer.addPass(afterImagePass);

    this.folder.add(afterImagePass, "enabled").name("After Image enabled");
    this.folder
      .add(afterImagePass.uniforms["damp"], "value")
      .name("After Image damp")
      .min(0)
      .max(1)
      .step(0.01);
  }

  setResolution(width: number, height: number, devicePixelRatio: number) {
    this.composer.setSize(width, height);
    this.composer.setPixelRatio(devicePixelRatio);
    this.composer.renderer.setSize(width, height);
    this.composer.renderer.setPixelRatio(devicePixelRatio);

    for (const pass of this.composer.passes) {
      pass.setSize(width, height);

      if (pass instanceof UnrealBloomPass) {
        pass.resolution.set(width, height);
      }
    }
  }

  render(deltaTime?: number) {
    this.composer.render(deltaTime);
  }
}

export default Renderer;
