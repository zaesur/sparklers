import * as THREE from "three";

export default class DefaultRenderer implements Renderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  public constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setResolution(width: number, height: number, pixelRatio: number) {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  }
}
