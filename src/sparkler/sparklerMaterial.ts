import * as THREE from "three";
import vertexShader from "../shaders/sparkler/vertex.glsl";
import fragmentShader from "../shaders/sparkler/fragment.glsl";

class SparklerMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uBaseColor: new THREE.Uniform(new THREE.Color("lightgrey")),
        uBurnColor: new THREE.Uniform(new THREE.Color("yellow")),
        uTrailColor: new THREE.Uniform(new THREE.Color("red")),
        uBurntColor: new THREE.Uniform(new THREE.Color("grey")),
        uProgress: new THREE.Uniform(0),
        uTrailWidth: new THREE.Uniform(0.3),
        uBurnWidth: new THREE.Uniform(0.05),
      },
      vertexShader,
      fragmentShader,
    });
  }

  get progress() {
    return this.uniforms.uProgress.value;
  }
  set progress(value: number) {
    this.uniforms.uProgress.value = value;
  }

  get trailWidth() {
    return this.uniforms.uTrailWidth.value;
  }
  set trailWidth(value: number) {
    this.uniforms.uTrailWidth.value = value;
  }

  get burnWidth() {
    return this.uniforms.uBurnWidth.value;
  }
  set burnWidth(value: number) {
    this.uniforms.uBurnWidth.value = value;
  }

  get baseColor() {
    return this.uniforms.uBaseColor.value;
  }
  set baseColor(value: THREE.Color) {
    this.uniforms.uBaseColor.value = value;
  }

  get burnColor() {
    return this.uniforms.uBurnColor.value;
  }
  set burnColor(value: THREE.Color) {
    this.uniforms.uBurnColor.value = value;
  }

  get trailColor() {
    return this.uniforms.uTrailColor.value;
  }
  set trailColor(value: THREE.Color) {
    this.uniforms.uTrailColor.value = value;
  }

  get burntColor() {
    return this.uniforms.uBurntColor.value;
  }
  set burntColor(value: THREE.Color) {
    this.uniforms.uBurntColor.value = value;
  }
}

export default SparklerMaterial;
