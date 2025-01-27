import * as THREE from "three";
import vertexShader from "../../shaders/sparks/vertex.glsl";
import fragmentShader from "../../shaders/sparks/fragment.glsl";

class SparksMaterial extends THREE.ShaderMaterial {
  constructor(size: number, resolution: THREE.Vector2, texture: THREE.Texture, color = new THREE.Color("white")) {
    super({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: new THREE.Uniform(size),
        uResolution: new THREE.Uniform(resolution),
        uDuration: new THREE.Uniform(0.007),
        uTexture: new THREE.Uniform(texture),
        uColor: new THREE.Uniform(color),
        uProgress: new THREE.Uniform(0)
      },
    });
  }

  get resolution() {
    return this.uniforms.uResolution.value;
  }

  get progress() {
    return this.uniforms.uProgress.value;
  }
  set progress(value: number) {
    this.uniforms.uProgress.value = value;
  }

  get size() {
    return this.uniforms.uSize.value;
  }
  set size(value: number) {
    this.uniforms.uSize.value = value;
  }

  get duration() {
    return this.uniforms.uDuration.value;
  }
  set duration(value: number) {
    this.uniforms.uDuration.value = value;
  }

  get color() {
    return this.uniforms.uColor.value;
  }
  set color(value: THREE.Color) {
    this.uniforms.uColor.value = value;
  }
}

export default SparksMaterial;
