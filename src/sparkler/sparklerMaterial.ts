import * as THREE from "three";
import vertexShader from "../shaders/sparkler/vertex.glsl";
import fragmentShader from "../shaders/sparkler/fragment.glsl";

type Params = {
  baseColor?: THREE.ColorRepresentation;
  burnColor?: THREE.ColorRepresentation;
  trailColor?: THREE.ColorRepresentation;
  burntColor?: THREE.ColorRepresentation;
  burnIntensity?: number;
  trailWidth?: number;
  burnWidth?: number;
};

class SparklerMaterial extends THREE.ShaderMaterial {
  constructor({
    baseColor = "lightgrey",
    burnColor = "yellow",
    trailColor = "red",
    burntColor = "grey",
    burnIntensity = 1.5,
    trailWidth = 0.3,
    burnWidth = 0.05,
  }: Params = {}) {
    super({
      uniforms: {
        uBaseColor: new THREE.Uniform(new THREE.Color(baseColor)),
        uBurnColor: new THREE.Uniform(new THREE.Color(burnColor)),
        uTrailColor: new THREE.Uniform(new THREE.Color(trailColor)),
        uBurntColor: new THREE.Uniform(new THREE.Color(burntColor)),
        uBurnIntensity: new THREE.Uniform(burnIntensity),
        uProgress: new THREE.Uniform(0),
        uTrailWidth: new THREE.Uniform(trailWidth),
        uBurnWidth: new THREE.Uniform(burnWidth),
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

  get burnIntensity() {
    return this.uniforms.uBurnIntensity.value;
  }
  set burnIntensity(value: number) {
    this.uniforms.uBurnIntensity.value = value;
  }
}

export default SparklerMaterial;
