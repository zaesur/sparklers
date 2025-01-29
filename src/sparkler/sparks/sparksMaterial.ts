import * as THREE from "three";
import vertexShader from "../../shaders/sparks/vertex.glsl";
import fragmentShader from "../../shaders/sparks/fragment.glsl";

type Params = {
  size?: number;
  color?: THREE.ColorRepresentation;
  radius?: number;
  duration?: number;
};

class SparksMaterial extends THREE.ShaderMaterial {
  constructor(
    resolution: THREE.Vector2,
    texture: THREE.Texture,
    { size = 1, radius = 1, color = "cornsilk", duration = 0.003 }: Params
  ) {
    super({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: new THREE.Uniform(size),
        uRadius: new THREE.Uniform(radius),
        uResolution: new THREE.Uniform(resolution),
        uDuration: new THREE.Uniform(duration),
        uTexture: new THREE.Uniform(texture),
        uColor: new THREE.Uniform(new THREE.Color(color)),
        uProgress: new THREE.Uniform(0),
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

  get radius() {
    return this.uniforms.uRadius.value;
  }
  set radius(value: number) {
    this.uniforms.uRadius.value = value;
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
}

export default SparksMaterial;
